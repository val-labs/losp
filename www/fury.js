function L(a){
    console.log("L", a, arguments)
    console.log.apply(console.log, arguments)
    return a
}
D=document
GEBI=(s)=>D.getElementById(s)
function add(s, e){
    e = e || D.createElement("div")
    GEBI("out").append(e)
    e.className = "notification"
    e.innerHTML = s
}
D.body = document.createElement("body")
D.body.innerHTML = '\
<link href="s.css" rel="stylesheet">\
<form name="f" class="notification-area">\
  <div id="out"></div>\
  <textarea name="stdin" rows="3" autofocus class="notification"></textarea>\
  <div>\
    <button name="clear"  type="reset"  value="zzz" style="width:49%">clear</button>\
    <button name="submit" type="submit" value="qq"  style="width:49%">submit</button>\
  </div>\
</form>'

function read(elt){
    const e = elt || D.forms.f.stdin
    const s = e.value
    e.value = ""
    return s
}

var url = `ws${location.href.substr(4)}`
var ws = new WebSocket(url)
ws.onopen    = e=>L("ws open")
ws.onclose   = e=>L("ws close")
ws.onmessage = e=>processOutput(e.data)
ws.onerror   = e=>L("ws error")

function processInput(s){
    L("input1", s)
    ws.send(s)
    L("input9", s)
}

function getStacktrace (e){
    var obj = {}
    Error.captureStackTrace(obj)
    return obj.stack
}

function processOutput(s){
    L("output1", s)
    try{
	var r = eval(s)
	L("R", r)
	add(r)
    }catch(e){
	var obj = {}
	Error.captureStackTrace(obj)
	var stack = obj.stack.split('\n')
	stack.shift()
	var msg = e + "\n" + stack.join("\n")
	L("<<<" + msg + ">>>")
	add(`<div style="background:pink">\
${msg}</div>`)
	//alert(msg)
    }
    L("output9", s)
}

const isEnter             = e => (e.altKey && e.code === "Enter")

D.forms.f.stdin.onkeydown = e => (isEnter(e) ? processInput(read()) : 0)

add("\
	<h3>Header 1</h3>\
	<p>Bacon ipsum dolor sit amet t-bone ham hock short loin, turducken shank chuck swine salami corned beef.</p>\
")
add("\
	<h3>Header 2</h3>\
	<p>Turkey doner pastrami, pancetta tenderloin pork belly boudin prosciutto ham turducken tail</p>\
")
add("\
	<h3>Header 3</h3>\
	<p>Doner frankfurter brisket beef. Chicken ball tip salami ham hock pork belly turkey shankle capicola short loin filet mignon pork. </p>\
")
add('<pre class="m0">code &lt; <b style="color:violet">qq</b> \n\
q </pre>')
