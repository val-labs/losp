L=console.log
     var ws = new WebSocket('ws' + location.href.substr(4))
     ws.onopen    = function(e){ ws.send('Hello bongo!') }
     ws.onmessage = function(e){ alert(e.data) }
L('xxxx')
