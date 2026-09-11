#!/usr/bin/env python3
"""Serve the static site locally without browser caching."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    address = ("127.0.0.1", 8000)
    print("Previewing website at http://127.0.0.1:8000", flush=True)
    ThreadingHTTPServer(address, NoCacheRequestHandler).serve_forever()
