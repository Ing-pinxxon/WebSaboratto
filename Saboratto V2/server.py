import http.server
import socketserver
import os
import urllib.parse

class ViteHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = urllib.parse.unquote(path)
        # Try to resolve against public directory first
        pub_path = os.path.join(os.getcwd(), 'public', path.lstrip('/\\'))
        if os.path.exists(pub_path) and not os.path.isdir(pub_path):
            return pub_path
        # Otherwise fallback to default behavior (e.g., serve index.html, src/, etc.)
        return super().translate_path(path)

if __name__ == '__main__':
    PORT = 8080
    with socketserver.TCPServer(("", PORT), ViteHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
