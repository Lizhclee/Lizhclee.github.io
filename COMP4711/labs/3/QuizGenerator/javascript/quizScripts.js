function clearLocalStorage() {
	localStorage.removeItem(JSONQuestions);
	localStorage.removeItem(JSONAnswers);
}

// Driver for generating the admin.html page
function generateAdmin() {
	clearLocalStorage();
	let questions = retrieveQuiz();
	let nextNumber = getNextQuestionNumber();

	if (questions === null) {
		// draw one empty question
		addAdminQuestion(nextNumber);
	} else {
		// draw the existing questions
		let numQuestions = Object.keys(questions).length;
		let answers = retrieveAnswers();
		
		for (let i = 1; i <= numQuestions; ++i) {
			let inputSet = addAdminQuestion(i);
			let q = questions[i];

			populateInput(inputSet, q, answers[i-1]);
		}
	}

	// draw the buttons at the bottom of the page
	drawAdminButtons();
}

// Gets the next available question number
function getNextQuestionNumber() {
	let questions = document.getElementsByClassName(classQuestion);
	
	if (questions.length === 0) {
		return 1;
	} else {
		// read the name of the last question; if middle questions were deleted, determining
		// the next number based on number of keys may produce duplicate names
		let last = questions[questions.length-1].getAttribute("name");
		return parseInt(last.charAt(1)) + 1;
	}
}

// Draws all the elements for one question on admin.html
function addAdminQuestion(qNumber) {
	const page = document.getElementById(questionWrapper);
	const noQuestionMsg = document.getElementById(noQuestionPrompt);

	if (noQuestionMsg !== null) {
		page.removeChild(noQuestionMsg);
	}
	let inputSet = [];

	const div = document.createElement("div");
	div.classList.add(classQuestion);
	div.setAttribute("name", namePrefix + qNumber);

	// Question prompt
	let qPrompt = document.createElement("p");
	qPrompt.appendChild(document.createTextNode(questionHeader));
	qPrompt.classList.add(classAdminTextPrompt);
	div.appendChild(qPrompt);

	// Delete button
	let del = document.createElement("button");
	del.appendChild(document.createTextNode(deleteButtonText));
	del.setAttribute("name", namePrefix + qNumber + deleteButtonName);
	del.classList.add(classButton);
	del.onclick = function() {
		deleteQuestion(this);
	};
	qPrompt.appendChild(del);

	// Text area for question
	let qText = document.createElement("textarea");
	qText.setAttribute("placeholder", questionPrompt);
	qText.classList.add(namePrefix + qNumber + quizQuestion, classAdminInput);
	div.appendChild(qText);
	div.appendChild(document.createElement("br"));
	inputSet.push(qText);

	// Code snippet prompt
	let cPrompt = document.createElement("p");
	cPrompt.appendChild(document.createTextNode(codeHeader));
	cPrompt.classList.add(classAdminTextPrompt);
	div.appendChild(cPrompt);

	// Text area for code snippet
	let cText = document.createElement("textarea");
	cText.setAttribute("placeholder", codePrompt);
	cText.classList.add(namePrefix + qNumber + classCode, classAdminInput);
	div.appendChild(cText);
	div.appendChild(document.createElement("br"));
	inputSet.push(cText);

	// Answer prompt
	let aPrompt = document.createElement("p");
	aPrompt.appendChild(document.createTextNode(answersHeader));
	aPrompt.classList.add(classAdminTextPrompt);
	div.appendChild(aPrompt);

	// 4 answers exactly
	let radios = [];
	let choices = [];
	for (let i = 0; i < 4; ++i) {
		let input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("name", namePrefix + qNumber + classRadio);
		input.setAttribute("value", String.fromCharCode("a".charCodeAt(0) + i));

		let aText = document.createElement("input");
		aText.setAttribute("type", "text");
		aText.setAttribute("placeholder", answerPrompt);
		aText.classList.add(namePrefix + qNumber + classAdminInputAnswer, classAnswer);

		div.appendChild(input);
		div.appendChild(aText);
		div.appendChild(document.createElement("br"));
		radios.push(input);
		choices.push(aText);
	}

	page.appendChild(div);
	inputSet.push(radios);
	inputSet.push(choices);
	return inputSet;
}

// Populates a question from local storage to the text boxes on admin.html
function populateInput(inputSet, question, answer) {
	// the inputset has format [question, codesnippet, array of radio buttons, array of choices]
	inputSet[0].appendChild(document.createTextNode(question[quizQuestion]));
	
	if (question[quizCode]) {
		inputSet[1].appendChild(document.createTextNode(question[quizCode]));
	}

	let radios = inputSet[2];
	radios[answer].checked = true;

	let choices = inputSet[3];
	for (let i = 0; i < choices.length; ++i) {
		let letter = String.fromCharCode("a".charCodeAt(0) + i);
		choices[i].value = question[quizAnswers][letter];
	}
}

// Draws the buttons at the bottom of admin.html
function drawAdminButtons() {
	let div = document.getElementById(submitDivId);
	
	let add = document.createElement("button");
	add.appendChild(document.createTextNode(addButtonText));
	add.onclick = function() {
		addAdminQuestion(getNextQuestionNumber());
	};
	div.appendChild(add);

	let save = document.createElement("button");
	save.appendChild(document.createTextNode(saveButtonText));
	save.classList.add(classButton);
	save.onclick = function() {
		saveQuestions();
	};
	div.appendChild(save);

	let span = document.createElement("span");
	span.setAttribute("id", adminSubmitMessage);
	div.appendChild(span);
}

// Validates that there is at least one question and all questions have an answer, and
// saves the question(s) and answer(s) to local storage
function saveQuestions() {
	clearLocalStorage();
	
	let questions = getOnscreenQuestions();
	let answers = getOnscreenAnswers();

	let message = document.getElementById(adminSubmitMessage);
	message.innerHTML = "";

	if (Object.keys(questions).length === 0) {
		message.innerHTML = noQuestionsCreatedMessage;
		return;
	}

	if (answers === null) {
		message.innerHTML = answersNotProvidedMessage;
		return;
	}
	
	storeQuiz(questions, answers);
	message.innerHTML = quizSavedMessage;
}

// Gets the data for all questions shown on screen
function getOnscreenQuestions() {
	let allQuestions = document.getElementsByClassName(classQuestion);
	let result = {};

	for (let i = 0; i < allQuestions.length; ++i) {
		let name = allQuestions[i].getAttribute("name");
		let tmp = {};

		tmp["name"] = namePrefix + (i+1);
		tmp[quizQuestion] = document.getElementsByClassName(name + quizQuestion)[0].value;

		let code = document.getElementsByClassName(name + classCode)[0].value;
		if (code != "") {
			tmp[quizCode] = code.replace(/\n/gi, "<br>"); // convert newline to <br> element
		}

		let choices = document.getElementsByClassName(name + classAdminInputAnswer);
		let letter = "a";
		let tmpChoices = {};
		for (let j = 0; j < choices.length; ++j) {
			letter = String.fromCharCode("a".charCodeAt(0) + j);
			tmpChoices[letter] = choices[j].value;
		}
		tmp[quizAnswers] = tmpChoices;

		result[i+1] = tmp;
	}

	return result;
}

// Gets the answers to the questions on the screen
function getOnscreenAnswers() {
	let allQuestions = document.getElementsByClassName(classQuestion);
	let answerList = [];

	for (let i = 0; i < allQuestions.length; ++i) {
		let name = allQuestions[i].getAttribute("name");
		let answer = document.querySelector("input[name=" + name + classRadio + "]:checked");
		if (answer === null) {
			return null;
		} else {
			answer = answer.value.charCodeAt(0) - "a".charCodeAt(0); // convert to a number where a = 0, etc
			answerList.push(answer);
		}
	}

	return answerList;
}

// Deletes the selected question from the admin.html page
function deleteQuestion(element) {
	let page = document.getElementById(questionWrapper);
	element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
	//let name = element.name.replace("delete", "");
	//page.removeChild(document.getElementsByName(name)[0]);

	if (!page.hasChildNodes()) {
		let p = document.createElement("p");
		let txt = document.createTextNode(noQuestionPrompt);
		p.setAttribute("id", noQuestionId);
		p.appendChild(txt);
		page.appendChild(p);
	}
}

// Stores quiz questions and answers in local storage
function storeQuiz(questions, answers) {
	localStorage.setItem(JSONQuestions, JSON.stringify(questions));
	localStorage.setItem(JSONAnswers, JSON.stringify(answers));
}

// Retrieves quiz questions from local storage
function retrieveQuiz() {
	return JSON.parse(localStorage.getItem(JSONQuestions));
}

// Retrieves quiz answers from local storage
function retrieveAnswers() {
	return JSON.parse(localStorage.getItem(JSONAnswers));
}

// Driver for generating user.html
function generateQuestions() {
	const questions = retrieveQuiz();	
	const page = document.getElementById(questionWrapper);
	
	if (questions === null) {
		let p = document.createElement("p");
		p.appendChild(document.createTextNode(noQuizAvailable));
		page.appendChild(p);
	} else {
		const numQuestions = Object.keys(questions).length;
	
		// draw questions
		for (let i = 1; i <= numQuestions; i++) {
			let div = addUserQuestion(questions[i], i);
			page.appendChild(div);
		}

		// draw submit button
		drawUserButtons();
	}
}

// Populates a question on user.html given the question text and question number
function addUserQuestion(question, qNumber) {
	let div = document.createElement("div");
	div.setAttribute("name", question.name);
	div.classList.add(classQuestion);

	let p = document.createElement("p");
	p.insertAdjacentHTML("beforeend", qNumber + ") " + question.quest);
	div.appendChild(p);
	
	if (question[quizCode]) {
		let code = document.createElement("div");
		code.setAttribute("class", quizCode);
		code.insertAdjacentHTML("beforeend", question[quizCode]);
		div.appendChild(code);
	}
	
	for (choice in question.choices) {
		let label = document.createElement("label");
		label.classList.add(question.name + classChoice);
		let input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("name", question.name + classRadio);
		input.setAttribute("value", choice);
		label.appendChild(input);
		label.insertAdjacentHTML("beforeend", choice + ") " + question.choices[choice]);
		div.appendChild(label);
		div.appendChild(document.createElement("br"));
	}
	return div;
}

// Draws the buttons at the bottom of user.html
function drawUserButtons() {
	let div = document.getElementById(submitDivId);
	let button = document.createElement("button");
	button.appendChild(document.createTextNode(submitButtonText));
	button.onclick = function() {
		markAnswers();
	}
	let span = document.createElement("span");
	span.setAttribute("id", userSubmitMessage);
	div.appendChild(button);
	div.appendChild(span);
}

// Upon clicking submit, marks the user's answers by highlighting correct and incorrect responses
function markAnswers() {
	let answers = retrieveAnswers();
	let message = document.getElementById(userSubmitMessage);

	if (answers === null) {
		message.innerHTML = answersNotAvailableMessage;
	} else {
		let userAnswers = getOnscreenAnswers();
		
		if (userAnswers === null) {
			message.innerHTML = questionsNotAnsweredMessage;
		} else {
			let score = answers.length;

			for (let i = 0; i < answers.length; ++i) {
				let choices = document.getElementsByClassName(namePrefix + (i+1) + classChoice);
				
				// clear existing highlighting, if any exists
				for (let j = 0; j < choices.length; ++j) {
					choices[j].style.backgroundColor = "";
				}

				choices[answers[i]].style.backgroundColor = correctAnswerColor;

				if (userAnswers[i] != answers[i]) {
					choices[userAnswers[i]].style.backgroundColor = wrongAnswerColor;
					score--;
				}
			}

			message.innerHTML = userScoreMessage.replace("{0}", score).replace("{1}", answers.length);
		}
	}
}