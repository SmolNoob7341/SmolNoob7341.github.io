const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const gameTitle = document.getElementById('gameTitle');
const backButton = document.getElementById('backButton');
const levelButtonArea = document.getElementById("level-select");
const settingsButton = document.getElementById('gameSettingsButton');
const resetButton = document.getElementById('resetButton');
let gameSettingsArea = document.getElementById('gameSettingsScreen');
const encourageMessage = document.getElementById('encouragement-message');
const backToMenus = document.getElementById("backToMenuButton");
let intervalSpeed; 
let currentLevel;
let isFirstTime = true;

const USED_POSITIONS = new Set();

let score = 0;
scoreDisplay.textContent = `Score: 0`;
let speed = 2;
let correctAnswer;
let interval;
let balloons = [];
let currentAnswerIndex = 0;
let currentQuestionType;

screenSettings("home");

backButton.addEventListener('click', function () {
    screenSettings("home");
    isFirstTime = true;
});

settingsButton.addEventListener('click', function() {
    screenSettings("settings");
});

resetButton.addEventListener('click', function() {
    settingsConfig = {
        easy: { speed: 2, intervalSpeed: 2 },
        medium: { speed: 4, intervalSpeed: 1.5 },
        hard: { speed: 6, intervalSpeed: 0.5 }
    }
    resetSliders();
});

document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', updateSlider);
});

const words = [
    "CAT",
    "DOG",
    "BEAR",
    "CAR",
    "DAD",
    "MOM",
    "SUN",
    "MOON",
    "STAR"
];

let settingsConfig = {
    easy: { speed: 2, intervalSpeed: 2 },
    medium: { speed: 4, intervalSpeed: 1.5 },
    hard: { speed: 6, intervalSpeed: 0.5 }
};

function generateQuestion() {
    //const questionType = ["number", "spelling"];
    const questionType = ["number"];
    const randomIndex = Math.floor(Math.random() * questionType.length);
    const question = questionType[randomIndex];
    if (question === "number") {
        return numberQuestion();
    } else {
        return spellingQuestion();
    }
}

function numberQuestion() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
    if(num1 < num2){
        const temp = num2;
        num2 = num1;
        num1 = temp;
    }
    const question = `What is ${num1} ${operator} ${num2}?`;
    const answer = eval(`${num1} ${operator} ${num2}`).toString();
    return { question, answer, type: 'number' };
}

function spellingQuestion() {
    const word = words[Math.floor(Math.random() * words.length)];
    const question = `Spell '${word}'`;
    const answer = word;
    return { question, answer, type: 'spelling' };
}

function startGame(level) {
    currentLevel = level;
    if(isFirstTime){
        voiceSpeak(level);
        isFirstTime = false;
    }
    settings(level);
    screenSettings("game")
    const question = generateQuestion();
    questionDisplay.textContent = question.question;
    voiceSpeak('Question');
    correctAnswer = question.answer;
    currentQuestionType = question.type;
    currentAnswerIndex = 0;
    clearInterval(interval);
    interval = setInterval(createBalloon, intervalSpeed);
}

function settings(level){
    const config = settingsConfig[level];
    speed = config.speed;
    intervalSpeed = config.intervalSpeed * 1000;
}

function createBalloon() {
    let position = getRandomPosition();

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${position.left}px`;
    balloon.style.top = `${gameArea.clientHeight}px`;
    balloon.style.backgroundColor = getRandomColor();

    let char;
    if (currentQuestionType === 'number') {
        char = getRandomChar('number');
    } else {
        char = getRandomChar('spelling');
    }

    balloon.textContent = char;

    balloon.addEventListener('click', () => {
        if(currentQuestionType === "spelling"){
            if (balloon.textContent === correctAnswer[currentAnswerIndex]) {
                popBalloon(balloon, true);
                currentAnswerIndex++;
                if (currentAnswerIndex === correctAnswer.length) {
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    currentAnswerIndex = 0;
                    setTimeout(() => {
                        startGame(currentLevel); 
                    }, 1000);
                }
            } else {
                popBalloon(balloon, false);
            } 
        }else{
            if(balloon.textContent === correctAnswer){
                score++;
                popBalloon(balloon, true);
                startGame(currentLevel);
            }else{
                popBalloon(balloon, false);
            }
        }
    });

    gameArea.appendChild(balloon);
    balloons.push(balloon);

    moveBalloon(balloon);
}

function moveBalloon(balloon) {
    const balInterval = setInterval(() => {
        let top = parseFloat(balloon.style.top);
        if (top <= -80) {
            clearInterval(balInterval);
            removeBalloon(balloon);
        } else {
            balloon.style.top = `${top - speed}px`;
        }
    }, 20);
}

function popBalloon(balloon, isCorrect) {
    if (isCorrect) {
        scoreDisplay.textContent = `Score: ${score}`;
        balloon.style.backgroundColor = 'green';
        //playSound("correct");
        showEncouragementMessage();
        animateScore();
        createConfetti(balloon);
    } else {
        playSound("wrong");
        balloon.style.backgroundColor = 'red';
    }
    setTimeout(() => {
        removeBalloon(balloon);
    }, 500);
}

function showEncouragementMessage() {
    const encouragementMessages = ["Great Job!", "Well Done!", "Awesome!", "Keep it up!", "You're doing great!"]
    encourageMessage.textContent = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];;
    encourageMessage.style.display = 'block';
    voiceSpeak('Celebration');
    setTimeout(() => {
        encourageMessage.style.display = 'none';
    }, 1000);
}

function playSound(type) {
    let cheerSound = 0;
    if(type == "correct"){
        cheerSound = new Audio('yay.mp3');
    }else{
        cheerSound = new Audio('error.mp3');
    }
    cheerSound.play();
}

function animateScore() {
    scoreDisplay.classList.add('scaling');
    setTimeout(() => {
        scoreDisplay.classList.remove('scaling');
    }, 500);
}

function createConfetti(balloon) {
    const balloonRect = balloon.getBoundingClientRect();
    const colors = ['#ff0', '#ff6347', '#00ff00', '#00ffff', '#ff00ff'];

    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${balloonRect.left + balloonRect.width / 2}px`;
        confetti.style.top = `${balloonRect.top + balloonRect.height / 2}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        // Set random outward direction
        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 100; // Adjust the range as needed
        confetti.style.setProperty('--translate-x', `${Math.cos(angle) * distance}px`);
        confetti.style.setProperty('--translate-y', `${Math.sin(angle) * distance}px`);

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 2000); // Match duration of the animation
    }
}

function removeBalloon(balloon) {
    if (gameArea.contains(balloon)) {
        gameArea.removeChild(balloon);
    }
    balloons = balloons.filter(b => b !== balloon);
}

function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomChar(type) {
    if (type === 'number') {
        return Math.floor(Math.random() * 21).toString(); // Generates a random number between 0 and 100
    } else {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
}

function getFixedPositions() {
    const positions = [];
    const step = 60; // Distance between positions to avoid overlap
    for (let left = 0; left < gameArea.clientWidth - 50; left += step) {
        positions.push(left);
    }
    return positions;
}

function getRandomPosition() {
    const availablePositions = getFixedPositions().filter(pos => !USED_POSITIONS.has(pos));
    if (availablePositions.length === 0) {
        USED_POSITIONS.clear(); // Clear used positions if none are available
        return getRandomPosition(); // Recalculate positions
    }
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const left = availablePositions[randomIndex];
    USED_POSITIONS.add(left);
    return { left };
}

function isOverlapping(position) {
    const margin = 50; // Margin to avoid overlap
    for (let balloon of balloons) {
        const balloonLeft = parseFloat(balloon.style.left);
        if (Math.abs(balloonLeft - position.left) < margin) {
            return true;
        }
    }
    return false;
}

function screenSettings(screen) {
    let game = "none"; let home = "none"; let settings = "none";
    if(screen == 'game'){
        game = "block";
    }
    else if(screen == 'settings'){
        settings = "block"
        gameTitle.textContent = 'Settings';
    }
    else if(screen == 'home'){ 
        home = "block"; 
        gameTitle.textContent = 'Balloon Popping Game';
        questionDisplay.textContent = 'Please Choose a Difficulty Level';
        gameArea.innerHTML = '';
        clearInterval(interval);
    }

    backToMenus.style.display = home;
    levelButtonArea.style.display = home;
    settingsButton.style.display = home;
    gameArea.style.display = game;
    scoreDisplay.style.display = game;
    gameSettingsArea.style.display = settings;  
    questionDisplay.style.display = (screen == "home" || screen == 'game' ? "block" : "none");
    backButton.style.display = (screen == "home" ? "none" : "block");
    gameTitle.style.display = (screen == 'home' || screen == 'settings' ? 'block' : 'none');
}

function updateSlider(event) {
    const slider = event.target;
    const valueDisplay = document.getElementById(`${slider.id}-value`);
    valueDisplay.textContent = slider.value;

    let [difficulty, setting] = slider.id.split('-');
    if(setting == "interval") setting = "intervalSpeed";

    settingsConfig[difficulty][setting] = parseFloat(slider.value);
}

function resetSliders() {
    const difficulties = ['easy', 'medium', 'hard'];
    const settings =  ['speed', 'intervalSpeed'];

    difficulties.forEach(difficulty => {
        settings.forEach(setting => {
            const slider = document.getElementById(`${difficulty}-${setting}`);
            const valueSpan = document.getElementById(`${difficulty}-${setting}-value`);
            const newValue = settingsConfig[difficulty][setting];

            slider.value = newValue;
            valueSpan.textContent = newValue;
        });
    });
}

function voiceSpeak(type){
    let textInput;
    textInput = (type == 'Question' ? questionDisplay.textContent : type == 'Celebration' ? encourageMessage.textContent : type == 'easy' ? 'Easy' : type == 'medium' ? 'Medium' : 'Hard');
    textInput = textInput.replace(/\+/g, ' plus ').replace(/-/g, ' minus ').replace(/\*/g, ' times ').replace(/\//g, ' divided by ');

    const speech = new SpeechSynthesisUtterance(textInput);

    speech.lang = 'en-US'; // Set the language
    speech.rate = 1; // Speed of speech
    speech.pitch = 1; // Pitch of speech

    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(speech);
    } else {
        alert('Sorry, your browser does not support text-to-speech.');
    }
}
