// DOM Elements
const quizForm = document.getElementById('quiz-form');
const quizTitle = document.getElementById('quiz-title');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress-bar');
const questionCount = document.getElementById('question-count');
const timerElement = document.getElementById('timer');


// Quiz State
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
const TIME_PER_QUESTION = 30; // seconds

// Initialize Quiz
function initQuiz() {
    console.log('Quiz Data:', quizData); // Debug log
    if (!quizData || !quizData.questions) {
        console.error('Invalid quiz data');
        return;
    }
    loadQuestion(currentQuestionIndex);
    startTimer();
    updateProgressBar();
    updateQuestionCounter();
}

// Load Question
function loadQuestion(index) {
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        console.error('No quiz data available');
        return;
    }

    const question = quizData.questions[index];
    if (!question) {
        console.error('Question not found at index:', index);
        return;
    }

    questionText.textContent = question.text;
    
    optionsContainer.innerHTML = '';
    question.choices.forEach(choice => {
        const optionElement = document.createElement('label');
        optionElement.className = 'option';
        if (userAnswers[question.id] === choice.id) {
            optionElement.classList.add('selected');
        }
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question_${question.id}`;
        input.value = choice.id;
        input.checked = userAnswers[question.id] === choice.id;
        
        // Add event listener to radio button
        input.addEventListener('change', () => {
            userAnswers[question.id] = choice.id;
            updateButtonVisibility();
        });
        
        const choiceText = document.createElement('span');
        choiceText.textContent = choice.text;
        
        optionElement.appendChild(input);
        optionElement.appendChild(choiceText);
        optionsContainer.appendChild(optionElement);
    });
    
    updateButtonVisibility();
}

// Add this new function to update button visibility
function updateButtonVisibility() {
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === quizData.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Navigation Functions
function goToNextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
        currentQuestionIndex++;
        resetTimer();
        loadQuestion(currentQuestionIndex);
        updateProgressBar();
        updateQuestionCounter();
    }
}

function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        resetTimer();
        loadQuestion(currentQuestionIndex);
        updateProgressBar();
        updateQuestionCounter();
    }
}

// Timer Functions
function startTimer() {
    let timeLeft = TIME_PER_QUESTION;
    updateTimerDisplay(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerElement.textContent = `${mins}:${secs}`;
}

function handleTimeOut() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
        goToNextQuestion();
    } else {
        submitQuiz();
    }
}

// Progress Functions
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateQuestionCounter() {
    questionCount.textContent = `${currentQuestionIndex + 1}/${quizData.questions.length}`;
}

// Submit Quiz
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Get the form
    const form = document.getElementById('quiz-form');
    
    // Add all answers as hidden inputs to the form
    Object.entries(userAnswers).forEach(([questionId, choiceId]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `question_${questionId}`;
        input.value = choiceId;
        form.appendChild(input);
    });
    
    // Submit the form
    form.submit();
}

// Event Listeners
prevBtn.addEventListener('click', goToPrevQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
submitBtn.addEventListener('click', submitQuiz);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);