#!/usr/bin/env python3
"""本地预览 web/ 目录用的小服务：强制不缓存，方便改完立刻看到效果。

    python tools/serve_love.py 8765
    # 然后打开 http://127.0.0.1:8765/love/
"""

from __future__ import annotations

import functools
import http.server
import pathlib
import socketserver
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "game"


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt: str, *args) -> None:  # 安静一点
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    handler = functools.partial(Handler, directory=str(ROOT))
    with Server(("0.0.0.0", port), handler) as httpd:
        print(f"serving {ROOT} at http://127.0.0.1:{port}/ (也监听局域网 IP)", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
