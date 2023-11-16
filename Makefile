github-pages:
	yarn build
	mkdir -p docs
	cp -a dist/spa/* docs/
	cd docs && sed -i '' 's/="\//="\/phone-ex\//g' ./index.html
