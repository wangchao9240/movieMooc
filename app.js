var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost:27017/imooc';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/imooc');


app.use(require('connect-livereload')());
app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use(session({
  secret: 'imooc',
  resave: false,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
  saveUninitialized: true
}));
app.use(require('connect-multiparty')());

if('development' == app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: false}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.listen(port);

console.log('movieMooc start on port ' + port);

require('./config/routes')(app);
