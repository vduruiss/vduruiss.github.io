.PHONY: preview capture check

preview:
	python3 scripts/preview_server.py

capture:
	./scripts/capture-preview.sh

check:
	python3 scripts/check_site.py
