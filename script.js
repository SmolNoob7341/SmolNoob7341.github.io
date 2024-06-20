const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
let score = 0;
let speed = 2;
let correctAnswer;
let interval;
let balloons = [];
let currentAnswerIndex = 0;
let currentQuestionType;

const words = [
    "CAT",
    "DOG",
    "BALLOON",
    "CAR"
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
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
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
    switch(level) {
        case 'easy':
            speed = 2;
            break;
        case 'medium':
            speed = 4;
            break;
        case 'hard':
            speed = 6;
            break;
    }
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameArea.innerHTML = '';
    balloons = [];
    const question = generateQuestion();
    questionDisplay.textContent = question.question;
    correctAnswer = question.answer;
    currentQuestionType = question.type;
    currentAnswerIndex = 0;
    clearInterval(interval);
    interval = setInterval(createBalloon, 1000);
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    balloon.style.top = `${gameArea.clientHeight}px`;
    balloon.style.backgroundColor = getRandomColor();

    let char;
    if (currentQuestionType === 'number') {
        char = getRandomChar('number');
    } else {
        char = getRandomChar('letter');
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
                        startGame(level);  // Restart the game with the same level after answering correctly
                    }, 1000);
                }
            } else {
                popBalloon(balloon, false);
            }
        }else{
            if(balloon.textContent === correctAnswer){
                popBalloon(balloon, true);
                startGame(level);
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
    const balloonInterval = setInterval(() => {
        let top = parseFloat(balloon.style.top);
        if (top <= -80) {
            clearInterval(balloonInterval);
            gameArea.removeChild(balloon);
        } else {
            balloon.style.top = `${top - speed}px`;
        }
    }, 20);
}

function popBalloon(balloon, isCorrect) {
    if (isCorrect) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        balloon.style.backgroundColor = 'green';
    } else {
        balloon.style.backgroundColor = 'red';
    }
    setTimeout(() => {
        gameArea.removeChild(balloon);
    }, 500);
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
    const chars = type === 'number' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}


