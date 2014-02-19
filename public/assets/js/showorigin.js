var origins = $('.origin');
origins.each(function(origin) {
  var button = $(document.createElement('button'));
  button.on('click', function() {

  });
  var translation = elem.prev('p');
  translation.prop('title', origin.text());
});
