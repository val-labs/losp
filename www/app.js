L=console.log
function L1(x){
    console.log.apply(null, arguments)
    return x
}
function L2(x, y){
    console.log.apply(null, arguments)
    return y
}
D=document
GEBI=(s)=>D.getElementById(s)
function replace(k,e,v){
    const p = e[k]
    e[k] = v
    return p}
function read(e){
    L2("READ", e)
    const s = e.value
    e.value = ""
    return s}
function scrollToBottom(elt){
    elt.scrollTop = elt.scrollHeight}
var elt = GEBI("out-out")
function li(msg){
    var e = D.createElement("li")
    e.appendChild(D.createTextNode(msg))
    return e}
function info(msg, elt2){
    var elt1 = elt2 || elt
    elt1.appendChild(li(msg))
    while(elt1.children.length > 10)
	elt1.removeChild(elt1.firstChild)
    scrollToBottom(elt1)}
var ws = new WebSocket("ws" + location.href.substr(4))
ws.ping = ()=>{ws.send("*"),setTimeout(ws.ping, 60000)}
ws.onopen    = e =>{L("ws open"), ws.ping()}
ws.onclose   = e => L("ws close")
ws.onerror   = e => L("ws error")
ws.onmessage = e => function(s){
    L("MSG", s)
}(e.data)
str=JSON.stringify

function isOnFirstLine(pos, text){
    L("FL", pos, str(text))
    for(var n = 0; n < pos; n++)
	if(text[n] === '\n')
	    return false
    return true
}
function isOnLastLine(pos, text){
    L("LL", pos, str(text))
    for(var n = text.length-1; n > pos; n--)
	if(text[n] === '\n')
	    return false
    return true
}
//D.onkeypress = function(e){
D.onkeydown = function(e){
    var target = e.target
    if(e.metaKey && e.key === "r"){
	L("RUN IT")
	return false;
    }
    if(e.metaKey && e.key === "Enter"){
	L("RUN IT2")
	return false;
    }
    if(e.key === "ArrowDown"){
	if(isOnLastLine(
	    window.getSelection().focusOffset,
	    e.target.innerText))
	{
	    e.target.blur()
	    return false
	}
    }
    if(e.key === "ArrowUp"){
	if(isOnFirstLine(
	    window.getSelection().anchorOffset,
	    e.target.innerText))
	{
	    e.target.blur()
	    return false
	}
    }
    L("KP", target, e)
}
info("hm")
