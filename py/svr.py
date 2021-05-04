import bottle, geventwebsocket as WS

@bottle.get('/')
@bottle.get('/<path:path>')
def handle_files(path=''):
    wsock = bottle.request.environ.get('wsgi.websocket')
    if not wsock:
        if path:
            return bottle.static_file(path, 'www')
        return f'<script>{open("www/iapp.js").read()}</script>'
    while True:
        try:
            message = wsock.receive()
            wsock.send("Your message was: %r" % message)
        except WS.WebSocketError:
            break

WS.WebSocketServer(("", 8080), bottle.app()).serve_forever()
