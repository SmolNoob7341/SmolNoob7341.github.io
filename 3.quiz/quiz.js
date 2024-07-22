document.addEventListener("DOMContentLoaded", function() {
    const screens = document.querySelectorAll('.screen');
    const materialButtons = document.querySelectorAll(".material-button, .option-material-button");
    const backButton = document.querySelectorAll('.backButton');
    const singleAnswerContainer = document.getElementById("singleOptionsContainer");
    const singleOptionsContainer = document.getElementById("singleOptionsContainer");
    const multipleAnswerContainer = document.getElementById("multipleOptionsContainer"); 
    const multipleOptionsContainer = document.getElementById("multipleOptionsContainer");
    const multipleSubmitButton = document.getElementById("multipleOptionsButton");
    const dragAndDropContainer = document.getElementById("dragAndDropContainer");
    const dragDropButton = document.getElementById("dragDropButton");
    const dropArea = document.getElementById("dropArea");
    const singleQuestion = document.getElementById("singleQuestion");
    const multipleQuestion = document.getElementById("multipleQuestion");
    const multipleQuestion2 = document.getElementById("multipleQuestion2");
    const dragAndDropQuestion = document.getElementById("dragAndDrop");

    const balloonContainer = document.getElementById("balloon-container");
    const backToMenuz = document.getElementById("backToMenusButton");
    let currentMaterial = "";
    let currentQuestion;
    let selectedAnswers = [];
    const sounds = {
        error: new Audio("error.mp3"),
        yay: new Audio("yay.mp3")
      };

    materialButtons.forEach(button => {
        button.addEventListener("click", function() {
            currentMaterial = this.dataset.material;
            showScreen(document.getElementById('gameArea'));
            startGame(currentMaterial);
            backToMenuz.style.display = "none";

        });
    });

    document.getElementById("moreOptionsButton").addEventListener("click", function() {
        showScreen(document.getElementById('moreOptionsScreen'));
        backToMenuz.style.display = 'none';
    });

    backButton.forEach(button => {
        button.addEventListener("click", function() {
            showScreen(document.getElementById('homeScreen'));
            backToMenuz.style.display = "block";
        });
    });

    function showScreen(screen) {
        screens.forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function startGame(material) {     
        let questionType; // single, multiple. material is Letters, Pre-K, etc.

        resetGame();

        function resetGame() {
            selectedAnswers = [];
            singleOptionsContainer.innerHTML = '';
            multipleOptionsContainer.innerHTML = '';
            singleQuestion.textContent = '';
            multipleQuestion.textContent = ''; 
            multipleQuestion2.textContent = '';
            stopCelebration();
            resetBackground();
            clearBalloons();

            questionType = getRandomQuestionType();
            currentQuestion = generateQuestion(material);

            if (questionType === "single") {
                showSingleAnswerQuestion(currentQuestion);
            } else if (questionType === "multiple") {
                showMultipleAnswerQuestion(currentQuestion);
            } else if (questionType === "dragAndDrop") {
                showDragAndDropQuestion(currentQuestion);
            }
        }

        function getRandomQuestionType() {
            //const types = ["single", "multiple", "dragAndDrop"];
            const types = ["single", "multiple"];
            //const types = ["single"];
            //const types = ["multiple"];
            //const types = ["dragAndDrop"];
            return types[Math.floor(Math.random() * types.length)];
        }

        function generateQuestion(material) {
            if (material === "letters") {
                return generateLetterQuestion();
            } else if (material === "pre-k") {
                return generatePreKMathQuestion();
            } else if (material === "kindergarten") {
                return generateKindergartenMathQuestion();
            }
        }

        function generateLetterQuestion() {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const randomIndex = Math.floor(Math.random() * letters.length);
            const correctAnswer = letters[randomIndex];
            const question = `What is the letter '${correctAnswer}'?`;
            if(questionType === "single"){
                return {questionType, question, correctAnswer};
            }else if(questionType === "multiple"){
                let correctAnswer2 = letters[Math.floor(Math.random() * letters.length)];
                while(correctAnswer == correctAnswer2){
                    correctAnswer2 = letters[Math.floor(Math.random() * letters.length)];
                }
                const question2 = `What is the letter '${correctAnswer2}'?`;
                return {questionType, question, question2, correctAnswer, correctAnswer2}
            }else if(questionType === "dragAndDrop"){
                //l to l drag etc
            }
        }

        function generatePreKMathQuestion() {
            const num1 = Math.floor(Math.random() * 5) + 1;
            const num2 = Math.floor(Math.random() * 5) + 1;
            const question = `What is ${num1} + ${num2}?`;
            const correctAnswer = (num1 + num2).toString();
            if(questionType === "single"){
                return {question, correctAnswer};
            }else if(questionType === "multiple"){
                let num3 = Math.floor(Math.random() * 5) + 1;
                let num4 = Math.floor(Math.random() * 5) + 1;
                let correctAnswer2 = (num3 + num4).toString();
                while(correctAnswer === correctAnswer2){
                    num3 = Math.floor(Math.random() * 5) + 1;
                    num4 = Math.floor(Math.random() * 5) + 1;
                    correctAnswer2 = (num3 + num4).toString();
                }
                const question2 = `What is ${num3} + ${num4}?`;
                return {question, question2, correctAnswer, correctAnswer2};
            }else if(questionType === "dragAndDrop"){
                //1+1 drag to 4 etc
            }
        }

        function generateKindergartenMathQuestion() {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const question = `What is ${num1} + ${num2}?`;
            const correctAnswer = (num1 + num2).toString();
            if(questionType === "single"){
                return {question, correctAnswer};
            }else if(questionType === "multiple"){
                let num3 = Math.floor(Math.random() * 10) + 1;
                let num4 = Math.floor(Math.random() * 10) + 1;
                let correctAnswer2 = (num3 + num4).toString();
                while(correctAnswer === correctAnswer2){
                    num3 = Math.floor(Math.random() * 10) + 1;
                    num4 = Math.floor(Math.random() * 10) + 1;
                    correctAnswer2 = (num3 + num4).toString();
                }
                const question2 = `What is ${num3} + ${num4}?`;
                return {question, question2, correctAnswer, correctAnswer2};
            }else if(questionType === "dragAndDrop"){
                 //2+2 drag to 2 etc
            }
        }

        function showSingleAnswerQuestion(info) {
            singleQuestion.textContent = info.question;
            const answers = generateAnswerOptions(info.correctAnswer);
            updateAnswerButtons(singleOptionsContainer, answers);
            getGameGrid();
        }

        function showMultipleAnswerQuestion(info) {
            multipleQuestion.textContent = info.question;
            multipleQuestion2.textContent = info.question2;
            const answers = generateAnswerOptions(info.correctAnswer, info.correctAnswer2);
            updateAnswerButtons(multipleOptionsContainer, answers);
            getGameGrid();
        }

        function showDragAndDropQuestion(info) {
            dragAndDropQuestion.textContent = info.question;
            getGameGrid();
        }

        function getGameGrid() {
            let single = "none"; let multiple = "none"; let dragAndDrop = "none";
            if(questionType === "single") single = "block";
            else if(questionType === "multiple") multiple = "block";
            else if(questionType === "dragAndDrop") dragAndDrop = "block";

            singleAnswerContainer.style.display = single;
            singleQuestion.style.display = single;
            multipleAnswerContainer.style.display = multiple;
            multipleQuestion.style.display = multiple;
            multipleQuestion2.style.display = multiple;
            multipleSubmitButton.style.display = multiple;
            dragAndDropContainer.style.display = dragAndDrop;
            dragAndDropQuestion.style.dislay = dragAndDrop;
            dragDropButton.style.display = dragAndDrop;
            dropArea.style.display = dragAndDrop;
        }

        function generateAnswerOptions(correctAnswer, correctAnswer2) {
            let answers;
            if (correctAnswer2 != null) {
                answers = [correctAnswer, correctAnswer2];
                while (answers.length < 4) {
                    const wrongAnswer = generateRandomAnswer();
                    if (!answers.includes(wrongAnswer) && wrongAnswer != correctAnswer && wrongAnswer != correctAnswer2) {
                        answers.push(wrongAnswer);
                    }
                }
            } else {
                answers = [correctAnswer];
                while (answers.length < 4) {
                    const wrongAnswer = generateRandomAnswer();
                    if (!answers.includes(wrongAnswer) && wrongAnswer != correctAnswer) {
                        answers.push(wrongAnswer);
                    }
                }
            }
            return shuffleArray(answers);
        }

        function generateRandomAnswer() {
            if (material === "letters"){
                const letters = 'abcdefghijklmnopqrstuvwxyz';
                return letters[Math.floor(Math.random() * letters.length)];
            } else if (material === "pre-k"){
                const numbers = '1234567890';
                return numbers[Math.floor(Math.random() * numbers.length)];
            } else if (material === "kindergarten"){
                const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
                return numbers[Math.floor(Math.random() * numbers.length)];
            }
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function updateAnswerButtons(container, answers) {
            container.innerHTML = '';
            answers.forEach(answer => {
                const button = document.createElement("button");
                button.textContent = answer;
                button.className = "answer-button";
                button.dataset.answer = answer; // Assigning the answer to the dataset
                button.addEventListener("click", () => {
                    if (questionType === "single") {
                        handleSingleAnswer(button, answer);
                    } else {
                        handleMultipleAnswer(button, answer);
                    }
                });
                container.appendChild(button);
            });
        }

        function handleSingleAnswer(button, answer) {
            if (answer === currentQuestion.correctAnswer) {
                handleCorrectAnswer(button);
            } else {
                handleIncorrectAnswer(button);
            }
        }

        function handleMultipleAnswer(button, answer) {
            button.classList.toggle("selected");
            if (selectedAnswers.includes(answer)) {
                selectedAnswers = selectedAnswers.filter(ans => ans !== answer);
            } else {
                selectedAnswers.push(answer);
            }
        }

        function handleCorrectAnswer(button) {
            button.classList.add("correct");
            startCelebration();
            setTimeout(() => {
                resetGame();
                stopCelebration();
            }, 3000);
        }

        function handleIncorrectAnswer(button) {
            button.classList.add("incorrect");
            sounds.error.play();
        }

        multipleSubmitButton.addEventListener("click", function() {
            const correctAnswersSelected = selectedAnswers.includes(currentQuestion.correctAnswer) && selectedAnswers.includes(currentQuestion.correctAnswer2);

            if (selectedAnswers.length > 2) {
                alert("Please select no more than 2 answers.");
                return;
            }

            selectedAnswers.forEach(answer => {
                const button = Array.from(multipleOptionsContainer.children).find(btn => btn.textContent === answer);

                if (currentQuestion.correctAnswer && currentQuestion.correctAnswer2) {
                    // Check if the answer is one of the correct answers
                    if (answer == currentQuestion.correctAnswer || answer == currentQuestion.correctAnswer2) {
                        button.classList.add("correct");
                    } else {
                        handleIncorrectAnswer(button);
                        selectedAnswers = selectedAnswers.filter(selected => selected !== answer);
                    }
                }
            });

            // Handle correct and incorrect answers appropriately
            if (correctAnswersSelected) {
                selectedAnswers.forEach(answer => {
                    const button = Array.from(multipleOptionsContainer.children).find(btn => btn.textContent === answer);
                    handleCorrectAnswer(button);
                });
            } else {
                selectedAnswers.forEach(answer => {
                    const button = Array.from(multipleOptionsContainer.children).find(btn => btn.textContent === answer);
                    if (button.classList.contains("incorrect")) {
                        handleIncorrectAnswer(button);
                    }
                });
            }
        });

        document.getElementById("backToHomeButton").addEventListener("click", function() {
            showScreen(document.getElementById('homeScreen'));
            resetGame();
        });

        function startCelebration() {
            sounds.yay.play();
            changeBackground();
            createBalloons();
        }

        function stopCelebration() {
            resetBackground();
            clearBalloons();
        }

        function changeBackground() {
            document.body.style.backgroundColor = getRandomColor();
        }

        function resetBackground() {
            document.body.style.backgroundColor = '#f4f4f4';
        }

        function createBalloons() {
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    const balloon = document.createElement('div');
                    balloon.className = 'balloon';
                    balloon.style.left = `${Math.random() * 100}%`;
                    balloon.style.backgroundColor = getRandomColor();
                    balloonContainer.appendChild(balloon);
                    animateBalloon(balloon);
                }, i * 50);
            }
        }

        function clearBalloons() {
            balloonContainer.innerHTML = '';
        }

        function animateBalloon(balloon) {
            let bottom = -100;
            const interval = setInterval(() => {
                if (bottom > window.innerHeight) {
                    clearInterval(interval);
                    balloon.remove();
                } else {
                    bottom += 9; // Increase the increment value for faster balloons
                    balloon.style.bottom = `${bottom}px`;
                }
            }, 20);
        }

        function getRandomColor() {
            const colors = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6', '#E74C3C', '#1ABC9C'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }
});
