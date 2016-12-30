var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.update({_id: id}, {$inc: {pv:1}}, function(err) {
    if (err) console.log(err);
  })
  Movie.findById(id, function(err, movie) {
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
        res.render('detail', {
          title: movie.title,
          movie: movie,
          comments: comments
        })
      })
  })
}

// admin page
exports.new = function(req, res) {
  Category.fetch(function(err, categories) {
    res.render('admin', {
      title: 'imooc 后台录入页',
      movie: {},
      categories: categories
    })
  })
};

// admin update
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Category.fetch(function(err, categories) {
      Movie.findById(id, function(err, movie) {
        res.render('admin', {
          title: 'imooc电影更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}
// save poster
exports.savePoster = function(req, res, next) {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFileName = posterData.originalFilename;

  if (originalFileName) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(__dirname, '../../', 'public/upload/' + poster)
      fs.writeFile(newPath, data, function(err) {
        if (err) console.log(err);
        req.poster = poster;
        next();
      })
    })
  } else {
    next();
  }
}

// admin post movie
exports.save = function(req, res) {
  var id = req.body._id;
  var movieObj = req.body;
  var _movie;

  if (req.poster) {
    movieObj.poster = req.poster;
  }

  if (id) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.assignIn(movie, movieObj);
      _movie.save(function(err, cbMovie) {
        if (err) console.log(err);
        Category.findById(movie.category, function(err, category) {
          category.movies.push(cbMovie._id)
          category.save(function(err, cbCategory) {
            res.redirect('/movie/' + cbMovie._id);
          })
        })
      })
    })
  } else {
    _movie = new Movie(movieObj);
    var categoryId = _movie.category;
    var categoryName = movieObj.categoryName;
    _movie.save(function(err, cbMovie) {
      if (err) console.log(err);
      if (categoryId) {
        Category.findById(categoryId, function(err, category) {
          category.movies.push(cbMovie._id)
          category.save(function(err, cbCategory) {
            res.redirect('/movie/' + cbMovie._id);
          })
        })
      } else if (categoryName) {
        var category = new Category({
          name: categoryName,
          movies: [cbMovie._id]
        })
        category.save(function(err, cbCategory) {
          cbMovie.category = cbCategory._id;
          cbMovie.save(function(err) {
            res.redirect('/movie/' + cbMovie._id);
          })
        })
      }
    })
  }
};

// list page
exports.list = function(req, res) {
  Movie
    .find({})
    .populate('category', 'name')
    .exec(function(err, movies) {
      if (err) console.log(err);
      res.render('list', {
        title: 'imooc 列表页',
        movies: movies
      })
    })
}

// list delete movie
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({_id: id}, function(err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1})
      }
    })
  }
};