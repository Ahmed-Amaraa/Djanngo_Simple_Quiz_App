// Sample Quiz Data (In a real app, this would come from your backend)
const quizData = {
    id: 1,
    title: "Try our Application",
    description: "Test your knowledge. This quiz covers both theoretical and practical concepts challenges.",
    difficulty: "medium",
    questionCount: 10,
    image: "https://via.placeholder.com/800x400?text=Advanced+JavaScript",
    leaderboard: [
      { rank: 1, user: "JohnDoe", score: 95 },
      { rank: 2, user: "JaneSmith", score: 92 },
      { rank: 3, user: "BobJohnson", score: 89 }
    ],
    userAttempts: [
      { date: "2023-05-15", score: 85 },
      { date: "2023-04-28", score: 78 }
    ]
  };
  
  // DOM Elements
  const quizTitle = document.getElementById('quiz-title');
  const quizDescription = document.getElementById('quiz-description-text');
  const difficultyBadge = document.getElementById('difficulty');
  const startButton = document.getElementById('start-quiz-btn');
  
  // Initialize Page
  function initPage() {
    // Set quiz data
    quizTitle.textContent = quizData.title;
    quizDescription.textContent = quizData.description;
    difficultyBadge.textContent = quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1);
    difficultyBadge.classList.add(`difficulty-${quizData.difficulty}`);
    
    // Set question count
    document.querySelector('.questions-count').textContent = `${quizData.questionCount} Questions`;
    
    // Start button event
    startButton.addEventListener('click', () => {
      startQuiz(quizData.id);
    });
  }
  
  // Start Quiz Function
  function startQuiz(quizId) {
    console.log(`Starting quiz with ID: ${quizId}`);
    // In a real app, you would redirect to the quiz page:
    // window.location.href = `/take_quiz.html?quiz_id=${quizId}`;
    
    // For demo purposes, show an alert
  }
  
  // Initialize the page when loaded
  document.addEventListener('DOMContentLoaded', initPage);