#!/usr/bin/env pyhthon
'''
Starts a very basic python-based webserver for debugging.

It's very important that this server be started in the main music21j directory, not in just any
directory, so call

    cd ~/git/music21j
    python server/start_python_server.py

'''
import sys

from http.server import HTTPServer
from http.server import CGIHTTPRequestHandler
from http.server import _url_collapse_path


class MykeCGIHTTPServer(CGIHTTPRequestHandler):
    def guess_type(self, path):
        ctype = super().guess_type(path)
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        return ctype

    def is_cgi(self):
        """
        Test whether self.path corresponds to a CGI script.

        Returns True and updates the cgi_info attribute to the tuple
        (dir, rest) if self.path requires running a CGI script.
        Returns False otherwise.

        If any exception is raised, the caller should assume that
        self.path was rejected as invalid and act accordingly.

        The default implementation tests whether the normalized url
        path begins with one of the strings in self.cgi_directories
        (and the next character is a '/' or the end of the string).
        """
        collapsed_path = _url_collapse_path(self.path)
        for path in self.cgi_directories:
            if path in collapsed_path:
                dir_sep_index = collapsed_path.rfind(path) + len(path)
                head, tail = collapsed_path[:dir_sep_index], collapsed_path[dir_sep_index + 1:]
                self.cgi_info = head, tail
                return True
        return False

def main():
    Server = HTTPServer
    Handler = MykeCGIHTTPServer

    # handler.cgi_directories.append("/server/cgi-bin/")
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = 8000

    server_address = ("", port)
    httpd = Server(server_address, Handler)
    print("Beginning HTTP/CGI server at " + str(port));
    httpd.serve_forever()

if __name__ == '__main__':
    main()
