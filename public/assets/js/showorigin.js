var origins = $('.original');
origins.each(function(idx, elem) {
  var origin = $(elem);

  var btn = $(document.createElement('button'));
  btn.addClass('btn btn-mini btn-link');
  btn.html('&raquo; 原文');

  btn.on('click', function() {
    origin.toggle();
  });
  var translation = origin.prev();
  translation.append(btn);
});
