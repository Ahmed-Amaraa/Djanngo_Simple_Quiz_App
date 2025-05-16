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
    loadQuestion(currentQuestionIndex);
    startTimer();
    updateProgressBar();
    updateQuestionCounter();
}

// Load Question
function loadQuestion(index) {
    const question = quizData.questions[index];
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
        
        optionElement.appendChild(input);
        optionElement.appendChild(document.createTextNode(choice.text));
        
        // Add this at the beginning with other DOM Elements
        const quizForm = document.getElementById('quiz-form');
        
        // Add this function to handle form submission
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add time taken to the form
            const timeInput = document.createElement('input');
            timeInput.type = 'hidden';
            timeInput.name = 'time_taken';
            timeInput.value = document.getElementById('timer').textContent;
            this.appendChild(timeInput);
            
            // Add all answers to the form
            for (const questionId in userAnswers) {
                const answerInput = document.createElement('input');
                answerInput.type = 'hidden';
                answerInput.name = `question_${questionId}`;
                answerInput.value = userAnswers[questionId];
                this.appendChild(answerInput);
            }
            
            // Submit the form
            this.submit();
        });
        
        // Modify the option click event listener in loadQuestion function
        optionElement.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            userAnswers[question.id] = choice.id;
            
            // Enable next/submit buttons
            if (index < quizData.questions.length - 1) {
                nextBtn.disabled = false;
            } else {
                submitBtn.hidden = false;
                nextBtn.hidden = true;
            }
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update button states
    prevBtn.disabled = index === 0;
    nextBtn.disabled = !userAnswers[question.id];
    nextBtn.hidden = index === quizData.questions.length - 1;
    submitBtn.hidden = index !== quizData.questions.length - 1;
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
    
    // Create form data
    const formData = new FormData();
    formData.append('quiz_id', quizData.id);
    
    // Add all answers
    Object.entries(userAnswers).forEach(([questionId, choiceId]) => {
        formData.append(`question_${questionId}`, choiceId);
    });
    
    // Submit the form
    quizForm.submit();
}

// Event Listeners
prevBtn.addEventListener('click', goToPrevQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
submitBtn.addEventListener('click', submitQuiz);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);