var Movie = require('../models/movie');
var Category = require('../models/category');
// index page
exports.index = function(req, res) {
  Category
    .find({})
    .populate(
      {
        path: 'movies',
        options: {
          limit: 5
        }
      }
    )
    .exec(function(err, categories) {
      if (err) console.log(err);
      res.render('index', {
        title: 'imooc 首页',
        categories: categories
      })
    })
};

// search page
exports.search = function(req, res) {
  var cateId = req.query.cate;
  var q = req.query.q;
  var page = parseInt(req.query.p) || 0;
  var count = 2;
  var index = page * count;

  if (cateId) {
    Category
      .find({_id: cateId})
      .populate(
        {
          path: 'movies',
          select: '_id title  poster'
        }
      )
      .exec(function(err, categories) {
        if (err) console.log(err);
        var category = categories[0] || {};
        var movies = category.movies;
        var results = movies.slice(index, index + count);
        res.render('results', {
          title: 'imooc 结果列表页',
          keyword: category.name,
          currentPage: parseInt(page + 1),
          query: 'cate=' + cateId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  } else if (q) {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) console.log(err);
        var results = movies.slice(index, index + count);
        res.render('results', {
          title: 'imooc 结果列表页',
          keyword: q,
          currentPage: parseInt(page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
};

