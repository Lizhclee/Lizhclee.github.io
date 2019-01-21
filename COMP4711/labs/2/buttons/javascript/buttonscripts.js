window.onload = function generateButtons() {
	let letter = "A";
	let btn;
	let txt;
	
	for (let i = 0; i < 26; i++) {
		btn = document.createElement("button");
		txt = document.createTextNode(letter);
		btn.appendChild(txt);
		btn.setAttribute("name", letter);
		btn.onclick = function() {
			alert(this.name);
		}
		
		document.getElementById("buttonWrapper").appendChild(btn);
		
		letter = String.fromCharCode(letter.charCodeAt(0) + 1);
	}
}