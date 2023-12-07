var remainingTime = 80;
var timerID;
var highScoreLink = document.getElementById("highscores-link");
var submitBtn = document.getElementById("submit-btn");
var clearBtn = document.getElementById("clear-btn");
var nameField = document.getElementById("player-name");
var restartBtn = document.getElementById("restart-btn");
var scoreElem = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];
var timerElem = document.getElementById("timer");
var startBtn = document.getElementById("start-btn");
var nextBtn = document.getElementById("next-btn");
var quesCont = document.getElementById("question-container");
var startCont = document.getElementById("start-container");
var quesElem = document.getElementById("question");
var ansBtns = document.getElementById("answer-buttons");
var checkAns = document.getElementById("check-answer");

const questions = [
  {
    question: "How do you create a function in JavaScript?",
    answers: [
      { text: "1. function myFunction()", correct: true },
      { text: "2. function:myFunction()", correct: false },
      { text: "3. function = myFunction()", correct: false },
      { text: "4. function => myFunction()", correct: false },
    ],
  },
  {
    question: "How do you call a function named 'myFunction'?",
    answers: [
      { text: "1. call function myFunction()", correct: false },
      { text: "2. call myFunction()", correct: false },
      { text: "3. myFunction()", correct: true },
      { text: "4. execute myFunction()", correct: false },
    ],
  },
  {
    question: "How to write an IF statement in JavaScript?",
    answers: [
      { text: "1. if i = 5 then", correct: false },
      { text: "2. if i == 5 then", correct: false },
      { text: "3. if (i == 5)", correct: true },
      { text: "4. if i = 5", correct: false },
    ],
  },
  {
    question: "How can you add a comment in JavaScript?",
    answers: [
      { text: "1. !--This is a comment--", correct: false },
      { text: "2. 'This is a comment", correct: false },
      { text: "3. //This is a comment", correct: true },
      { text: "4. **This is a comment**", correct: false },
    ],
  },
  {
    question: "How do you declare a JavaScript array?",
    answers: [
      {
        text: "1. var colors = (1:'red', 2:'green', 3:'blue')",
        correct: false,
      },
      { text: "2. var colors = ['red', 'green', 'blue']", correct: true },
      { text: "3. var colors = 'red', 'green', 'blue'", correct: false },
      {
        text: "4. var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')",
        correct: false,
      },
    ],
  },
];

var shuffledQues, currentQuesIdx;

startBtn.addEventListener("click", () => {
  if (window.confirm("Are you sure you want to start the game?")) {
    startGame();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuesIdx < questions.length - 1) {
    currentQuesIdx++;
    setNextQuestion();
  } else {
    alert("No more questions!");
  }
});

function timeTick() {
  remainingTime--;
  timerElem.textContent = "Time: " + remainingTime;
  if (remainingTime <= 0) {
    saveScore();
  }
}

function startGame() {
  startTimer();
  hideStartContainer();
  shuffleQuestions();
  showQuestionContainer();
  setNextQuestion();
}

function startTimer() {
  timerID = setInterval(timeTick, 1000);
  timeTick();
}

function hideStartContainer() {
  startCont.classList.add("hide");
}

function shuffleQuestions() {
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuesIdx = 0;
}

function showQuestionContainer() {
  quesCont.classList.remove("hide");
}

function setNextQuestion() {
  resetState();
  const currentQuestion = getCurrentQuestion();
  showQuestion(currentQuestion);
}

function getCurrentQuestion() {
  return shuffledQuestions[currentQuesIdx];
}

function showQuestion(question) {
  setQuestionText(question.question);
  createAnswerButtons(question.answers);
}

function setQuestionText(text) {
  quesElem.innerText = text;
}

function createAnswerButtons(answers) {
  answers.forEach((answer) => {
    const button = createButton(answer);
    ansBtns.appendChild(button);
  });
}

function createButton(answer) {
  var button = document.createElement("button");
  button.innerText = answer.text;
  button.classList.add("btn");
  if (answer.correct) {
    button.dataset.correct = answer.correct;
  }
  button.addEventListener("click", selectAnswer);
  return button;
}

function resetState() {
  nextBtn.classList.add("hide");
  checkAns.classList.add("hide");
  while (ansBtns.firstChild) {
    ansBtns.removeChild(ansBtns.firstChild);
  }
}

function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;

  checkAns.classList.remove("hide");

  if (correct) {
    displayCorrectAnswer();
  } else {
    displayIncorrectAnswer();
    deductTime();
  }

  updateButtonStatuses();
  handleNextQuestion();
}

function displayCorrectAnswer() {
  checkAns.innerHTML = "You are correct!";
}

function displayIncorrectAnswer() {
  checkAns.innerHTML = "You are incorrect!";
}

function deductTime() {
  if (remainingTime > 16) {
    remainingTime -= 16;
  } else {
    remainingTime = 0;
  }
}

function updateButtonStatuses() {
  Array.from(ansBtns.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
}

function handleNextQuestion() {
  if (shuffledQuestions.length > currentQuesIdx + 1) {
    nextBtn.classList.remove("hide");
  } else {
    startBtn.classList.remove("hide");
    saveScore();
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);

  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

function saveScore() {
  clearInterval(timerID);
  timerElem.textContent = "Time: " + remainingTime;
  setTimeout(function () {
    quesCont.classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("your-score").textContent =
      "Your score is " + remainingTime;
  }, 2000);
}

var loadScores = function () {
  if (!savedScores) {
    return false;
  }

  savedScores = JSON.parse(savedScores);
  var initials = document.querySelector("#initials-field").value;
  var newScore = {
    score: remainingTime,
    initials: initials,
  };
  savedScores.push(newScore);
  console.log(savedScores);

  savedScores.forEach((score) => {
    nameField.innerText = score.initials;
    scoreElem.innerText = score.score;
  });
};

function showHighScores(initials) {
  setVisibility("highscores", true);
  setVisibility("score-container", false);
  setVisibility(startCont, false);
  setVisibility(quesCont, false);

  if (typeof initials === "string" && initials.trim()) {
    let score = { initials, remainingTime };
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  updateScoreDisplay();
}

function setVisibility(elementId, isVisible) {
  const element =
    typeof elementId === "string"
      ? document.getElementById(elementId)
      : elementId;
  element.classList[isVisible ? "remove" : "add"]("hide");
}

function updateScoreDisplay() {
  const highScoreEl = document.getElementById("highscore");
  highScoreEl.innerHTML = "";

  scores.forEach((score) => {
    const nameDiv = createScoreElement("name-div", score.initials);
    const scoreDiv = createScoreElement("score-div", score.remainingTime);

    highScoreEl.appendChild(nameDiv);
    highScoreEl.appendChild(scoreDiv);
  });
}

function createScoreElement(className, textContent) {
  let div = document.createElement("div");
  div.className = className;
  div.textContent = textContent;
  return div;
}

highScoreLink.addEventListener("click", () => {
  showHighScores();
});

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const initials = document.querySelector("#initials-field").value.trim();
  if (initials) {
    showHighScores(initials);
  } else {
    alert("Please enter your initials.");
  }
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

clearBtn.addEventListener("click", () => {
  localStorage.clear();
  clearHighScoresDisplay();
});

function clearHighScoresDisplay() {
  document.getElementById("highscore").textContent = "";
}
