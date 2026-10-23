const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const timeLimit = document.getElementById("timeLimit");

const typingInput = document.getElementById("typingInput");
const textToType = document.getElementById("textToType");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

const result = document.getElementById("result");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");


/* ================================
   Typing Passages
================================ */

const passages = [

    `Learning to code takes patience and practice. Every small project helps you understand programming concepts better. The more you practice writing code, the more confident you become.`,

    `JavaScript is a powerful programming language used to create interactive websites. It allows developers to respond to user actions, manipulate web pages, work with data, and communicate with APIs.`,

    `The best way to improve your typing speed is to practice regularly. Focus on accuracy first and speed will gradually improve. Keep your fingers relaxed and maintain a steady rhythm.`,

    `Web development combines creativity and logic. HTML provides the structure, CSS controls the appearance, and JavaScript adds behavior and interaction to modern web applications.`,

    `Successful developers solve problems one step at a time. When something does not work, they investigate the problem, understand the cause, and make a careful change before testing again.`

];


/* ================================
   Test Variables
================================ */

let currentText = "";

let selectedTime = 60;
let timeLeft = 60;

let timer;

let testStarted = false;

let typedCharacters = 0;
let correctCharacters = 0;


/* ================================
   Add New Passage
================================ */

function addNewPassage() {

    const randomIndex =
        Math.floor(Math.random() * passages.length);

    const newPassage = passages[randomIndex];


    /*
        Add a space between passages.
    */

    if (currentText.length > 0) {

        currentText += " ";

        const spaceSpan =
            document.createElement("span");

        spaceSpan.textContent = " ";

        textToType.appendChild(spaceSpan);
    }


    /*
        Add passage to current text.
    */

    currentText += newPassage;


    /*
        Create a span for every character.
    */

    newPassage.split("").forEach(function (character) {

        const span =
            document.createElement("span");

        span.textContent = character;

        textToType.appendChild(span);

    });

}


/* ================================
   Update Current Character
================================ */

function updateCurrentCharacter() {

    const spans =
        textToType.querySelectorAll("span");


    spans.forEach(function (span) {

        span.classList.remove("current");

    });


    const currentIndex =
        typingInput.value.length;


    if (currentIndex < spans.length) {

        spans[currentIndex].classList.add("current");

    }

}


/* ================================
   Format Timer
================================ */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    if (minutes > 0) {

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    }


    return String(seconds).padStart(2, "0");

}


/* ================================
   Start Test
================================ */

function startTest() {

    if (testStarted) {
        return;
    }


    clearInterval(timer);


    /*
        Get selected duration.
    */

    selectedTime =
        Number(timeLimit.value);

    timeLeft =
        selectedTime;


    /*
        Reset typing data.
    */

    currentText = "";

    typedCharacters = 0;

    correctCharacters = 0;


    /*
        Clear previous text.
    */

    textToType.innerHTML = "";


    /*
        Add first passage.
    */

    addNewPassage();


    /*
        Reset displays.
    */

    timerDisplay.textContent =
        formatTime(timeLeft);

    wpmDisplay.textContent = "0";

    accuracyDisplay.textContent = "0%";

    finalWpm.textContent = "0";

    finalAccuracy.textContent = "0%";


    /*
        Enable typing.
    */

    typingInput.value = "";

    typingInput.disabled = false;

    typingInput.focus();


    /*
        Hide previous result.
    */

    result.style.display = "none";


    /*
        Disable controls during test.
    */

    startButton.disabled = true;

    timeLimit.disabled = true;


    testStarted = true;


    /*
        Highlight first character.
    */

    updateCurrentCharacter();


    /*
        Start timer.
    */

    timer = setInterval(function () {

        timeLeft--;

        timerDisplay.textContent =
            formatTime(timeLeft);

        updateStatistics();


        if (timeLeft <= 0) {

            endTest();

        }

    }, 1000);

}


/* ================================
   Typing Input
================================ */

typingInput.addEventListener("input", function () {

    if (!testStarted) {
        return;
    }


    const typedText =
        typingInput.value;


    /*
        Add another passage when
        the user gets close to the end.
    */

    if (
        typedText.length >=
        currentText.length - 100
    ) {

        addNewPassage();

    }


    const spans =
        textToType.querySelectorAll("span");


    typedCharacters =
        typedText.length;

    correctCharacters = 0;


    /*
        Compare typed text
        with original text.
    */

    spans.forEach(function (span, index) {

        span.classList.remove("correct");

        span.classList.remove("incorrect");

        span.classList.remove("current");


        if (index < typedText.length) {

            if (
                typedText[index] ===
                currentText[index]
            ) {

                span.classList.add("correct");

                correctCharacters++;

            } else {

                span.classList.add("incorrect");

            }

        }

    });


    updateCurrentCharacter();

    updateStatistics();

});


/* ================================
   Update Statistics
================================ */

function updateStatistics() {

    if (typedCharacters === 0) {

        wpmDisplay.textContent = "0";

        accuracyDisplay.textContent = "0%";

        return;

    }


    /*
        Accuracy calculation.
    */

    const accuracy =
        (correctCharacters /
            typedCharacters) * 100;


    /*
        Calculate elapsed time.
    */

    const elapsedTime =
        selectedTime - timeLeft;


    if (elapsedTime <= 0) {
        return;
    }


    /*
        Convert seconds to minutes.
    */

    const minutes =
        elapsedTime / 60;


    /*
        Standard WPM calculation.
    */

    const wordsTyped =
        correctCharacters / 5;


    const wpm =
        Math.round(wordsTyped / minutes);


    /*
        Update displays.
    */

    wpmDisplay.textContent =
        wpm;

    accuracyDisplay.textContent =
        `${Math.round(accuracy)}%`;

}


/* ================================
   End Test
================================ */

function endTest() {

    clearInterval(timer);


    testStarted = false;


    /*
        Disable typing.
    */

    typingInput.disabled = true;


    /*
        Enable controls.
    */

    startButton.disabled = false;

    timeLimit.disabled = false;


    /*
        Final calculation.
    */

    updateStatistics();


    /*
        Display result.
    */

    finalWpm.textContent =
        wpmDisplay.textContent;

    finalAccuracy.textContent =
        accuracyDisplay.textContent;


    result.style.display = "block";

}


/* ================================
   Reset Test
================================ */

function resetTest() {

    clearInterval(timer);


    /*
        Stop test.
    */

    testStarted = false;


    /*
        Get selected duration.
    */

    selectedTime =
        Number(timeLimit.value);

    timeLeft =
        selectedTime;


    /*
        Reset variables.
    */

    currentText = "";

    typedCharacters = 0;

    correctCharacters = 0;


    /*
        Clear typing text.
    */

    textToType.innerHTML = "";


    /*
        Reset displays.
    */

    timerDisplay.textContent =
        formatTime(timeLeft);

    wpmDisplay.textContent = "0";

    accuracyDisplay.textContent = "0%";

    finalWpm.textContent = "0";

    finalAccuracy.textContent = "0%";


    /*
        Reset textarea.
    */

    typingInput.value = "";

    typingInput.disabled = true;


    /*
        Hide result.
    */

    result.style.display = "none";


    /*
        Enable controls.
    */

    startButton.disabled = false;

    timeLimit.disabled = false;


    /*
        Add fresh passage.
    */

    addNewPassage();

    updateCurrentCharacter();

}


/* ================================
   Start Button
================================ */

startButton.addEventListener("click", function () {

    startTest();

});


/* ================================
   Reset Button
================================ */

resetButton.addEventListener("click", function () {

    resetTest();

});


/* ================================
   Keyboard Controls
================================ */

document.addEventListener("keydown", function (event) {

    /*
        ENTER = Start Test
    */

    if (
        event.key === "Enter" &&
        !testStarted &&
        document.activeElement !== typingInput
    ) {

        event.preventDefault();

        startTest();

        return;

    }


    /*
        TAB = Reset Test

        Prevent normal Tab navigation.
    */

    if (event.key === "Tab") {

        event.preventDefault();

        resetTest();

    }

});


/* ================================
   Initial Setup
================================ */

selectedTime =
    Number(timeLimit.value);

timeLeft =
    selectedTime;

timerDisplay.textContent =
    formatTime(timeLeft);

typingInput.disabled = true;

addNewPassage();

updateCurrentCharacter();