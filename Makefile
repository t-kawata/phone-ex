github-pages:
	yarn build
	mkdir -p docs
	cp -a dist/spa/* docs/
run-web:
	yarn dev

