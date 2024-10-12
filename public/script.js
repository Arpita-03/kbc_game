// script.js for QR code and game logic
async function fetchQRCode() {
    const response = await fetch('/qrcode');
    const code = await response.text();
    document.getElementById('qrcode').innerHTML = `<img src="${code}" alt="QR Code">`;
}

async function fetchQuestions() {
    const response = await fetch('/questions');
    const questions = await response.json();
    startGame(questions);
}

function startGame(questions) {
    let currentQuestionIndex = 0;

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const messageElement = document.getElementById('message');
    const submitButton = document.getElementById('submit');

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;
        optionsElement.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            optionsElement.innerHTML += `<button class="btn btn-outline-secondary mt-2 option">${option}</button>`;
        });

        document.querySelectorAll('.option').forEach((button, index) => {
            button.addEventListener('click', () => {
                const playerName = document.getElementById('playerName').value;
                const answer = button.innerText;
                checkAnswer(answer, playerName);
            });
        });
    }

    async function checkAnswer(answer, playerName) {
        const response = await fetch('/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answer, questionIndex: currentQuestionIndex })
        });

        const result = await response.json();
        messageElement.innerText = `${playerName}, ${result.message}`;

        if (result.correct) {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                setTimeout(loadQuestion, 2000);
            } else {
                messageElement.innerText = `${playerName}, you finished the game!`;
            }
        }
    }

    loadQuestion();
}

// Fetch QR code on page load
if (document.getElementById('qrcode')) {
    fetchQRCode();
}

// Fetch questions on game page load
if (document.getElementById('question')) {
    fetchQuestions();
}
