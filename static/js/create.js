document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const quizForm = document.getElementById('quiz-form');
  const questionsContainer = document.getElementById('questions-container');
  const addQuestionBtn = document.getElementById('add-question-btn');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const publishQuizBtn = document.getElementById('publish-quiz-btn');
  
  // Templates
  const questionTemplate = document.getElementById('question-template');
  const choiceTemplate = document.getElementById('choice-template');
  
  // State
  let questionCount = 0;
  
  // Add first question by default
  addNewQuestion();
  
  // Event Listeners
  addQuestionBtn.addEventListener('click', addNewQuestion);
  saveDraftBtn.addEventListener('click', saveAsDraft);
  quizForm.addEventListener('submit', publishQuiz);
  
  // Functions
  function addNewQuestion() {
    questionCount++;
    const questionElement = document.importNode(questionTemplate.content, true);
    const questionCard = questionElement.querySelector('.question-card');
    
    // Set question number
    questionCard.querySelector('.question-number').textContent = questionCount;
    questionCard.dataset.questionId = Date.now(); // Unique ID
    
    // Add event listeners
    questionCard.querySelector('.remove-question-btn').addEventListener('click', function() {
      if (confirm('Are you sure you want to remove this question?')) {
        questionCard.remove();
        questionCount--;
        updateQuestionNumbers();
      }
    });
    
    const addChoiceBtn = questionCard.querySelector('.add-choice-btn');
    const choicesContainer = questionCard.querySelector('.choices-container');
    
    addChoiceBtn.addEventListener('click', function() {
      addNewChoice(choicesContainer);
    });
    
    // Add 2 choices by default
    addNewChoice(choicesContainer);
    addNewChoice(choicesContainer);
    
    questionsContainer.appendChild(questionCard);
  }
  
  function addNewChoice(container) {
    const choiceElement = document.importNode(choiceTemplate.content, true);
    const choiceItem = choiceElement.querySelector('.choice-item');
    const questionId = container.closest('.question-card').dataset.questionId;
    
    // Set unique name for radio buttons in this question
    choiceItem.querySelector('.correct-answer-radio').name = `correct-answer-${questionId}`;
    
    choiceItem.querySelector('.remove-choice-btn').addEventListener('click', function() {
      if (container.querySelectorAll('.choice-item').length > 2) {
        choiceItem.remove();
      } else {
        alert('A question must have at least two choices');
      }
    });
    
    container.appendChild(choiceItem);
  }
  
  function updateQuestionNumbers() {
    const questions = questionsContainer.querySelectorAll('.question-card');
    questions.forEach((question, index) => {
      question.querySelector('.question-number').textContent = index + 1;
    });
  }
  
  function saveAsDraft(e) {
    e.preventDefault();
    const quizData = collectQuizData();
    console.log('Draft saved:', quizData);
    alert('Draft saved successfully!');
    // In a real app, send to backend
  }
  
  function publishQuiz(e) {
    e.preventDefault();
    const quizData = collectQuizData();
    
    // Validate form
    if (!validateQuiz(quizData)) {
      return;
    }
    
    // Get CSRF token from cookie
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // Send to backend
    fetch('/quiz/api/create-quiz/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(quizData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to create quiz');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Quiz created successfully') {
            window.location.href = data.redirect_url || '/quiz/';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create quiz: ' + error.message);
    });
  }
  
  function collectQuizData() {
    const quizData = {
      title: document.getElementById('quiz-title').value,
      description: document.getElementById('quiz-description').value,
      difficulty: document.getElementById('quiz-difficulty').value,
      imageUrl: document.getElementById('quiz-image').value,
      questions: []
    };
    
    const questionCards = questionsContainer.querySelectorAll('.question-card');
    
    questionCards.forEach(card => {
      const question = {
        text: card.querySelector('.question-text').value,
        choices: []
      };
      
      const choiceItems = card.querySelectorAll('.choice-item');
      choiceItems.forEach(item => {
        question.choices.push({
          text: item.querySelector('.choice-text').value,
          isCorrect: item.querySelector('.correct-answer-radio').checked
        });
      });
      
      quizData.questions.push(question);
    });
    
    return quizData;
  }
  
  function validateQuiz(quizData) {
    // Validate quiz info
    if (!quizData.title.trim()) {
      alert('Please enter a quiz title');
      return false;
    }
    
    if (!quizData.difficulty) {
      alert('Please select a difficulty level');
      return false;
    }
    
    // Validate questions
    if (quizData.questions.length === 0) {
      alert('Please add at least one question');
      return false;
    }
    
    for (const question of quizData.questions) {
      if (!question.text.trim()) {
        alert('Please enter text for all questions');
        return false;
      }
      
      if (question.choices.length < 2) {
        alert('Each question must have at least 2 choices');
        return false;
      }
      
      let hasCorrectAnswer = false;
      for (const choice of question.choices) {
        if (!choice.text.trim()) {
          alert('Please enter text for all choices');
          return false;
        }
        if (choice.isCorrect) {
          hasCorrectAnswer = true;
        }
      }
      
      if (!hasCorrectAnswer) {
        alert('Each question must have one correct answer');
        return false;
      }
    }
    
    return true;
  }
});