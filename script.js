const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box')

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
}

let questionCount = 0;
let questionNumb = 1;
let score = 0;
let timer;
let timeLeft = 15;

const nextBtn = document.querySelector('.next-btn');

nextBtn.onclick = () => {
    let isOpen = questions[questionCount].options.length === 0;
    if (isOpen) {
        let input = document.querySelector('#openAnswer');
        if (!input) return;

        let userAnswer = input.value.trim().toLowerCase();
        let correct = questions[questionCount].answer.toLowerCase();

        if (userAnswer === correct) {
            score++;
            alert("Goed beantwoord!");
        } else {
            alert(`Fout! Het juiste antwoord is: ${questions[questionCount].answer}`);
        }
    }

    if (questionCount < questions.length - 1) {
        questionCount++;
        questionNumb++;
        showQuestions(questionCount);
        questionCounter(questionNumb);
    } else {
        console.log("Quiz afgerond");
        showResults();
    }
}

const optionList = document.querySelector('.option-list');

function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    if (questions[index].options.length > 0) {
        // Meerkeuzevraag
        let optionTag = questions[index].options.map(opt => `<div class="option"><span>${opt}</span></div>`).join('');
        optionList.innerHTML = optionTag;
        document.querySelectorAll('.option').forEach(opt => {
            opt.setAttribute('onclick', 'optionSelected(this)');
        });

        nextBtn.style.pointerEvents = 'none';
    } else {
        // Open vraag
        optionList.innerHTML = `
            <input type="text" id="openAnswer" placeholder="Typ je antwoord hier..." style="width:100%; padding:12px; font-size:18px; height:60px;">
        `;
        const openInput = document.querySelector('#openAnswer');

        openInput.addEventListener('input', () => {
            if (openInput.value.trim().length > 0) {
                nextBtn.style.pointerEvents = 'auto';
            } else {
                nextBtn.style.pointerEvents = 'none';
            }
        });

        nextBtn.style.pointerEvents = 'none';
    }

    startTimer();
}

function optionSelected(answer) {
    let userAnswer = answer.textContent.trim();
    let correctAnswer = questions[questionCount].answer;

    const allOptions = optionList.children;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        console.log("Correct antwoord");
        score++;
    } else {
        answer.classList.add('incorrect');
        console.log("Fout antwoord");
        for (let i = 0; i < allOptions.length; i++) {
            if (allOptions[i].textContent.trim() === correctAnswer) {
                allOptions[i].classList.add('correct');
            }
        }
    }

    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].classList.add('disabled');
    }

    nextBtn.style.pointerEvents = 'auto';

}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} van de ${questions.length} Vragen`;
}

function showResults() {
    let userName = prompt("Voer je naam in voor het leaderboard:");
    if (!userName) userName = "Anoniem";

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: userName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Top 5

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    let leaderboardHTML = "<h2>Leaderboard</h2><ol>";
    leaderboard.forEach(entry => {
        leaderboardHTML += `<li>${entry.name} - ${entry.score}</li>`;
    });
    leaderboardHTML += "</ol>";

    document.body.innerHTML = leaderboardHTML;
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;

    const timeCount = document.getElementById('time-count');
    timeCount.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timeCount.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextBtn.click();
        }
    }, 1000);
}