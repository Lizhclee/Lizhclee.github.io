window.onload = function generateQuestions() {
	let questions = [
		{
			"name" : "renderblock",
			"quest" : "Which attribute will defer the execution of the javascript in an external file until the entire page's HTML has loaded?",
			"choices" : {
				"a" : "async",
				"b" : "defer",
				"c" : "wait"
			}
		},
		{
			"name" : "addition",
			"quest" : "What is the output of the following script?",
			"codesnippet" : "<span><span class=\"keyword\">var</span> a = <span class=\"number\">6</span>;</span><br><span><span class=\"keyword\">var</span> b = <span class=\"string\">\"3\"</span>;</span><br><span><span class=\"keyword\">console</span>.log(a+b);</span>",
			"choices" : {
				"a" : "9",
				"b" : "63",
				"c" : "18"
			}
		},
		{
			"name" : "array",
			"quest" : "What is the output of the following script?",
			"codesnippet" : "<span><span class=\"keyword\">var</span> pens = [<span class=\"string\">\"red\"</span>, <span class=\"string\">\"green\"</span>, <span class=\"string\">\"blue\"</span>];</span><br><span>pens.unshift(<span class=\"string\">\"orange\"</span>, <span class=\"string\">\"purple\"</span>);</span><br><span>pens.push(<span class=\"string\">\"yellow\"</span>, <span class=\"string\">\"black\"</span>);</span><br><span>pens.reverse();</span><br><span><span class=\"keyword\">console</span>.log(pens.join(<span class=\"string\">\", \"</span>));</span>",
			"choices" : {
				"a" : "red, green, blue, orange, purple, yellow, black",
				"b" : "black, yellow, purple, orange, blue, green, red",
				"c" : "black, yellow, blue, green, red, purple, orange",
				"d" : "black, yellow, red, green, blue, purple, orange"
			}
		},
		{
			"name" : "let",
			"quest" : "What is the difference between var and let?",
			"choices" : {
				"a" : "var is function scoped and let is block scoped",
				"b" : "var is block scoped and let is function scoped",
				"c" : "var is global scoped and let is function scoped",
				"d" : "var is function scoped and let is global scoped"
			}
		},
		{
			"name" : "notation",
			"quest" : "Which is not a correct way to gain access to an object's property?",
			"choices" : {
				"a" : "course:title",
				"b" : "course.title",
				"c" : "course[<span class=\"string\">\"title\"</span>]"
			}
		}
	];
	
	let answers = [1, 1, 2, 0, 0];
	
	let userChoice = getUserChoice(questions.length);
	
	const page = document.getElementById("questionWrapper");
	
	if (userChoice == 0) {
		let p = document.createElement("p");
		p.appendChild(document.createTextNode("You didn't select to see any questions :("));
		page.appendChild(p);
	} else {	
		for (let i = 0; i < userChoice; i++) {
			let p = document.createElement("p");
			p.appendChild(document.createTextNode((i+1) + ") " + questions[i].quest));
			page.appendChild(p);
			
			if (questions[i].codesnippet) {
				let div = document.createElement("div");
				div.setAttribute("class", "codesnippet");
				div.insertAdjacentHTML("beforeend", questions[i].codesnippet);
				page.appendChild(div);
			}
			
			for (choice in questions[i].choices) {
				let label = document.createElement("label");
				let input = document.createElement("input");
				input.setAttribute("type", "radio");
				input.setAttribute("name", questions[i].name);
				input.setAttribute("value", choice);
				label.appendChild(input);
				label.insertAdjacentHTML("beforeend", choice + ") " + questions[i].choices[choice]);
				page.appendChild(label);
				page.appendChild(document.createElement("br"));
			}
		}
	}
}

function getUserChoice(limit) {
	let choice = prompt("How many questions do you want to answer?\nPlease enter a number between 0 and " + limit + ".", "5");
	
	while (isNaN(parseInt(choice)) || choice < 0 || choice > limit) {
		choice = prompt("Invalid choice. Please enter a number between 0 and " + limit);
	}
	
	return choice;
}