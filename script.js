const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
let BALLOONS_PER_INTERVAL; // Number of balloons to create at each interval
let BALLOON_INTERVAL; // Interval between balloon creation (in milliseconds)
//const MAX_BALLOONS = 20; // Maximum number of balloons on screen at once

const USED_POSITIONS = new Set(); // Track used positions to avoid overlap

let score = 0;
scoreDisplay.textContent = `Score: 0`;
let speed = 2;
let correctAnswer;
let interval;
let balloons = [];
let currentAnswerIndex = 0;
let currentQuestionType;

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

function generateQuestion() {
    const questionType = ["number", "spelling"];
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
    if(level == null){
        level = 'medium';
    }
    settings(level);
    const question = generateQuestion();
    questionDisplay.textContent = question.question;
    correctAnswer = question.answer;
    currentQuestionType = question.type;
    currentAnswerIndex = 0;
    clearInterval(interval);
    interval = setInterval(createBalloon, BALLOON_INTERVAL);
}

function settings(level){
    let ans = (level == 'easy' ? 2 : (level == 'medium' ? 3 : 4));
    speed = ans;
    BALLOONS_PER_INTERVAL = ans;
    BALLOON_INTERVAL = (level == 'easy' ? 2 : (level == 'medium' ? 1.5 : 1)) * 1000;
    //MAX_BALLOONS = 10 * ans;
}

function createBalloon() {
    //if (balloons.length >= MAX_BALLOONS) return;
    
    for(let i = 0; i < BALLOONS_PER_INTERVAL; i++){
        //if (balloons.length >= MAX_BALLOONS) break;
        
        let position = getRandomPosition();
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
        balloon.style.top = `${gameArea.clientHeight}px`;
        balloon.style.backgroundColor = getRandomColor();
    
        let char;
        if (currentQuestionType === 'number') {
            char = getRandomChar('number');
        } else {
            char = getRandomChar('spelling');
        }
    
        balloon.textContent = char;

        balloon.style.left = `${position.left}px`;
        balloon.style.top = `${gameArea.clientHeight}px`;
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
                            startGame(); 
                        }, 1000);
                    }
                } else {
                    popBalloon(balloon, false);
                }
            }else{
                if(balloon.textContent === correctAnswer){
                    score++;
                    popBalloon(balloon, true);
                    startGame();
                }else{
                    popBalloon(balloon, false);
                }
            }
        });
    
        gameArea.appendChild(balloon);
        balloons.push(balloon);
    
        moveBalloon(balloon);
    }
}

function moveBalloon(balloon) {
    const balloonInterval = setInterval(() => {
        let top = parseFloat(balloon.style.top);
        if (top <= -80) {
            clearInterval(balloonInterval);
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
    } else {
        balloon.style.backgroundColor = 'red';
    }
    setTimeout(() => {
        removeBalloon(balloon);
    }, 500);
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
    for (let left = 0; left < gameArea.clientWidth; left += step) {
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