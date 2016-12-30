$(function() {
  $('.comment').on('click', function() {
    var target = $(this);
    var toId = target.data('tid');
    var commentId = target.data('cid');
    if ($('.cidInput').length == 0) {
      $('<input>').attr({
        class: 'tidInput',
        type: 'hidden',
        name: 'tid',
        value: toId
      }).appendTo('#comments');

      $('<input>').attr({
        class: 'cidInput',
        type: 'hidden',
        name: 'cid',
        value: commentId
      }).appendTo('#comments');
    } else {
      $('.cidInput').val(commentId);
      $('.tidInput').val(toId);
    }
  })
})