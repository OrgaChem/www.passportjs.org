var origins = $('.original');
origins.each(function(idx, elem) {
  var origin = $(elem);
  var button = $(document.createElement('button'));
  button.addClass('btn btn-mini btn-info');
  var buttonContent = $(document.createElement('span'));
  buttonContent.addClass('show-origin');
  buttonContent.html('&raquo; 原文');

  button.append(buttonContent);
  button.on('click', function() {
    origin.show();
  });
  var translation = origin.prev();
  translation.append(button);
});
