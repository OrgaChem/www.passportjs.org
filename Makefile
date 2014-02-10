site:
	node site

publish:
	git checkout gh-pages
	rm -rf content layouts public Makefile README.md package.json server.js site.js
	cp passportjs.org/* ./
	git commit -a -m "Regenerate"
	git push origin gh-pages
	git checkout master

.PHONY: site publish
