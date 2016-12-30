$(function() {
  $('.del').on('click', function(e) {
    var target = $(e.target);
    var id = target.data('id');
    console.log(id);
    var tr = $('.item-id' + id);
    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/list?id=' + id,
    })
    .done(function(res) {
      if (res.success == 1) {
        if (tr.length > 0) {
          tr.remove();
        }
      }
    })
  })
});