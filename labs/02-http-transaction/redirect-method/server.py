from http.server import BaseHTTPRequestHandler, HTTPServer
import sys
class H(BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def handle_any(self):
        n=int(self.headers.get('Content-Length') or 0); body=self.rfile.read(n) if n else b''
        if self.path.startswith('/r/'):
            code=int(self.path.split('/')[2])
            self.send_response(code); self.send_header('Location','/new'); self.send_header('Content-Length','0'); self.end_headers(); return
        msg=f'{self.command} {self.path} body={body.decode()!r}\n'.encode()
        self.send_response(200); self.send_header('Content-Length',str(len(msg))); self.end_headers(); self.wfile.write(msg)
    do_GET=do_POST=do_PUT=handle_any
HTTPServer(('127.0.0.1',8765),H).serve_forever()
