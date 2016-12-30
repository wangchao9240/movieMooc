$(function() {
  $('#douban').on('blur', function(e) {
    var target = $(e.target);
    if (target.val()) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/' + target.val(),
        type: 'GET',
        dataType: 'jsonp',
        cache: true,
        crossDomain: true,
        jsonp: 'callback'
      })
      .done(function(data) {
        console.log(data.image.replace('ipst', 'lpst'))
        $('#inputTitle').val(data.title)
        $('#inputDirector').val(data.attrs.director[0])
        $('#inputCountry').val(data.attrs.country[0])
        $('#inputLanguage').val(data.attrs.language[0])
        $('#inputPoster').val(data.image.replace('ipst', 'lpst'))
        $('#inputYear').val(data.attrs.year)
        $('#inputSummary').val(data.summary)
      })
    }
  })
})