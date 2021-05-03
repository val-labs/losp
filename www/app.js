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
    L(pos, str(text))
    if(!pos) return true
    const arr = text.split("\n")
    if(!arr) return false
    if (pos < arr[0].length)
	return true
    return false
}
function isOnLastLine(pos, text){
    L(pos-1===text.length)
    if(!text)return true;
    return false
}
//D.onkeypress = function(e){
D.onkeydown = function(e){
    var target = e.target
    if(e.key === "ArrowDown"){
	L("AD", isOnLastLine(
	    //window.getSelection().focusOffset,
	    window.getSelection().anchorOffset,
	    e.target.innerText))}
    if(e.key === "ArrowUp"){
	L("AU", isOnFirstLine(
	    //window.getSelection().focusOffset,
	    window.getSelection().anchorOffset,
	    e.target.innerText))}
    L("KP", target, e)
}
info("hm")
