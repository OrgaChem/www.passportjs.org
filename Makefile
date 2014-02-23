site:
	node site

publish:
	git checkout gh-pages
	git pull origin gh-pages
	rm -rf content layouts public Makefile README.md package.json server.js site.js
	cp -r output/www.passportjs.org/* ./
	rm -rf output
	git commit -a -m "Regenerate"
	git push origin gh-pages
	git checkout master

.PHONY: site publish
