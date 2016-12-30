var User = require('../models/user');

// signup page
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: 'imooc 用户注册页'
  })
}

// signin page
exports.showSignin = function(req, res) {
  res.render('signin', {
    title: 'imooc 用户登录页'
  })
}

// sign up
exports.signup = function(req,res) {
    var _user = req.body;
    User.findOne({name: _user.name}, function(err, hasUser) {
      if (err) console.log(err);
      if (hasUser) res.redirect('/signin');
      else {
        var user = new User(_user);
        user.save(function(err, user) {
          if (err) console.log(err);
          req.session.user = user;
          res.redirect('/');
        })
      }
    })
  
}

// sign in
exports.signin = function(req,res) {
  var _user = req.body;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user) {
    if (err) console.log(err);
    if (!user) res.redirect('/signup')

    if (user) {
      user.comparePassword(password, function(err, isMatch) {
        if (err) console.log(err)
        if (isMatch) {
          req.session.user = user;
          res.redirect('/');
        } else {
          console.log('Password is not matched');
          res.redirect('/signin')
        }
      })
    }
  })
};

// logout
exports.logout = function(req, res) {
  delete req.session.user
  res.redirect('/')
}

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) console.log(err);
    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    })
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/signin')
  } else {
    next();
  }
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role > 10) {
    next();
  } else {
    res.redirect('/');
  }
}