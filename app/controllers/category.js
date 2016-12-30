var Category = require('../models/category');
var _ = require('lodash');

// admin page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
};

// admin post movie
exports.save = function(req, res) {
  var _category = req.body;
  if(_category.id) {
    var updateCate;
    Category.findById(_category.id, function(err, category) {
      updateCate = _.assignIn(category, _category);
      updateCate.save(function(err, cbCate) {
        if (err) console.log(err);
        res.redirect('/admin/category/list')
      })
    })
  } else {
    var category = new Category(_category);

    category.save(function(err, cbCate) {
      if (err) console.log(err);
      res.redirect('/admin/category/list');
    })
  }
};

// categorylist page
exports.list = function(req, res) {
  Category.fetch(function(err, categories) {
    if (err) console.log(err);
    res.render('categorylist', {
      title: 'imooc 分类列表页',
      categories: categories
    })
  })
}

// categoryupadte page
exports.update = function(req, res) {
  var id = req.params.id;
  if (id) {
    Category.findById(id, function(err, category) {
      res.render('category_admin', {
        title: 'imooc 分类更新页',
        category: category
      })
    })
  }
}

// category delete movie
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Category.remove({_id: id}, function(err, category) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1})
      }
    })
  }
};