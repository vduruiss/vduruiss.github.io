.PHONY: preview capture check

preview:
	python3 -m http.server 8000 --bind 127.0.0.1

capture:
	./scripts/capture-preview.sh

check:
	python3 scripts/check_site.py
