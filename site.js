var kerouac = require('kerouac');
var site = kerouac();

site.set('base url', 'http://knimon-software.github.io/www.passportjs.org/');
site.set('output', 'output/www.passportjs.org');

site.engine('ejs', require('ejs-locals'));

site.content('content');
site.static('public');

site.plug(require('kerouac-sitemap')());
site.plug(require('kerouac-robotstxt')());

site.use(kerouac.url());

site.generate(function(err) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return;
  }
});
