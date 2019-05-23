function postReply() {
	var row1 = document.createElement("tr");
	var row2 = document.createElement("tr");
	var th = document.createElement("th");
	var td = document.createElement("td");
	var img = document.createElement("img");
	var username = document.createElement("span");
	var timestamp = document.createElement("span");
	var message;
	var text = document.getElementById("reply").value;
	var date = new Date();
	
	img.setAttribute("src", "./assets/user.png");
	username.setAttribute("class", "username");
	timestamp.setAttribute("class", "date");
	
	username.appendChild(document.createTextNode("Anonymous"));
	timestamp.appendChild(document.createTextNode("Posted on " + (date.getMonth()+1) + "-" + date.getDate() + "-" +
			date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()));
	th.appendChild(img);
	th.appendChild(username);
	th.appendChild(document.createElement("br"));
	th.appendChild(timestamp);
	row1.appendChild(th);
	
	text = filterText(text).split("\n");
	
	for (var i = 0; i < text.length; i++) {
		message = document.createElement("p");
		message.appendChild(document.createTextNode(text[i]));
		td.appendChild(message);
	}
	row2.appendChild(td);
	
	document.getElementById("forum").appendChild(row1);
	document.getElementById("forum").appendChild(row2);
	
	document.getElementById("reply").value = "";
}

function filterText(text) {
	var disallowed = [
		[/star ?wars/ig, "Danganronpa"],
		[/luke ?skywalker+/ig, "Makoto Naegi"],
		[/(princess+ ?)?leia+/ig, "Kyoko Kirigiri"],
		[/han ?solo+/ig, "Mondo Owada"],
		[/darth ?vader+/ig, "Junko Enoshima"],
		[/1138+/ig, "11037"]
	];
	
	for (var i = 0; i < disallowed.length; i++) {
		text = text.replace(disallowed[i][0], disallowed[i][1]);
	}
	
	return text;
}