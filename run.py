"""Chạy bản Three.js tại máy của bạn bằng Python 3, không cần cài thư viện."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


def main():
    folder = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(folder))
    server = None
    for port in range(8000, 8011):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), handler)
            break
        except OSError:
            continue
    if server is None:
        raise SystemExit("Khong mo duoc cong 8000-8010. Hay dong may chu cu va thu lai.")
    url = f"http://127.0.0.1:{server.server_port}"
    print(f"MECH LAB: {url}")
    print("Giu cua so nay mo khi su dung. Nhan Ctrl+C de dung.")
    threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung may chu.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
