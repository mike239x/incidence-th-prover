function clean_log(text) {
	document.getElementById("log").innerHTML='';
}


function log(text, endline = '</br>') {
	document.getElementById("log").innerHTML+=text+endline;
}
