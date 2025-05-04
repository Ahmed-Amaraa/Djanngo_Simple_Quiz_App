// DOM Elements
const quizCards = document.querySelectorAll('.quiz-card');
const searchInput = document.getElementById('search');
const filterDropdown = document.getElementById('filter');

// Filter and Search Functionality
function filterQuizzes() {
  const searchTerm = searchInput.value.toLowerCase();
  const difficultyFilter = filterDropdown.value;

  quizCards.forEach(card => {
    const title = card.querySelector('.quiz-title').textContent.toLowerCase();
    const description = card.querySelector('.quiz-description').textContent.toLowerCase();
    const difficulty = card.getAttribute('data-difficulty');

    const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
    const matchesDifficulty = difficultyFilter === 'all' || difficulty === difficultyFilter;

    if (matchesSearch && matchesDifficulty) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Start Quiz Function
function startQuiz(quizId) {
  alert(`Starting quiz with ID: ${quizId}`);
  // window.location.href = `/quiz.html?id=${quizId}`; // Uncomment to navigate
}

// Add Event Listeners
searchInput.addEventListener('input', filterQuizzes);
filterDropdown.addEventListener('change', filterQuizzes);

document.querySelectorAll('.start-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const quizId = e.target.getAttribute('data-id');
    startQuiz(quizId);
  });
});
