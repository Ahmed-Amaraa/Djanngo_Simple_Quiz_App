document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const editProfileForm = document.getElementById('edit-profile-form');
  const performanceChartCtx = document.getElementById('performance-chart').getContext('2d');
  const historyList = document.getElementById('history-list');
  const recommendationsGrid = document.querySelector('.recommendations-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const chartToggles = document.querySelectorAll('.chart-toggle');
  const categoryFilter = document.getElementById('filter-category');
  const timeFilter = document.getElementById('filter-time');
  
  let userData = {};
  let performanceChart = null;

  // Fetch user data from backend
  async function fetchUserData() {
      try {
          const response = await fetch('/api/user/profile/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCsrfToken()
              },
              credentials: 'include'
          });
          if (!response.ok) {
              throw new Error('Failed to fetch user data');
          }
          userData = await response.json();
          initPage();
      } catch (error) {
          console.error('Error fetching user data:', error);
          document.querySelector('.profile-container').innerHTML = 
              '<div class="error-message">Failed to load profile data. Please refresh the page or try again later.</div>';
      }
  }

  // Get CSRF token from cookies
  function getCsrfToken() {
      const name = 'csrftoken';
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  // Initialize the page
  function initPage() {
      if (!userData || Object.keys(userData).length === 0) {
          console.error('No user data available');
          return;
      }

      // Set user info
      document.getElementById('username').textContent = userData.username || 'N/A';
      document.getElementById('join-date').textContent = userData.joinDate || 'N/A';
      document.getElementById('quiz-count').textContent = userData.quizCount || '0';
      document.getElementById('avg-score').textContent = userData.avgScore ? `${userData.avgScore}%` : 'N/A';
      
      const avatarElement = document.querySelector('.user-avatar');
      if (avatarElement) {
          avatarElement.src = userData.avatar || '/static/image/avatar.png';
          avatarElement.onerror = function() {
              this.src = '/static/image/avatar.png';
          };
      }

      // Initialize chart if performance data exists
      if (userData.performance && Object.keys(userData.performance).length > 0) {
          initChart('monthly');
      }

      // Populate quiz history if exists
      if (userData.history && userData.history.length > 0) {
          renderHistory(userData.history);
      } else {
          historyList.innerHTML = '<div class="no-data">No quiz history available</div>';
      }

      // Populate recommendations if exists
      if (userData.recommendations && userData.recommendations.length > 0) {
          renderRecommendations(userData.recommendations);
      } else {
          recommendationsGrid.innerHTML = '<div class="no-data">No recommendations available</div>';
      }

      // Set up form with current values
      if (editProfileForm) {
          document.getElementById('edit-username').value = userData.username || '';
          document.getElementById('edit-email').value = userData.email || '';
      }
  }

  // Fetch data when page loads
  fetchUserData();

  // Initialize performance chart
  function initChart(type) {
    if (performanceChart) {
      performanceChart.destroy();
    }

    const data = userData.performance[type];
    
    performanceChart = new Chart(performanceChartCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Average Score',
          data: data.data,
          backgroundColor: 'rgba(98, 0, 234, 0.2)',
          borderColor: 'rgba(98, 0, 234, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 50,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + '%';
              }
            }
          }
        }
      }
    });
  }

  // Render quiz history
  function renderHistory(history) {
    historyList.innerHTML = '';
    
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      // Determine score class
      let scoreClass = 'score-medium';
      if (item.score >= 85) scoreClass = 'score-high';
      if (item.score < 70) scoreClass = 'score-low';
      
      historyItem.innerHTML = `
        <div>
          <span class="history-quiz-name">${item.quizName}</span>
          <span class="history-date">${formatDate(item.date)}</span>
        </div>
        <div>
          <span class="history-score ${scoreClass}">${item.score}%</span>
        </div>
      `;
      
      historyItem.addEventListener('click', () => {
        viewQuizResult(item.id);
      });
      
      historyList.appendChild(historyItem);
    });
  }

  // Render recommendations
  function renderRecommendations(recommendations) {
    recommendationsGrid.innerHTML = '';
    
    recommendations.forEach(quiz => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
      
      card.innerHTML = `
        <h3>${quiz.name}</h3>
        <span class="recommendation-difficulty difficulty-${quiz.difficulty}">
          ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
        </span>
        <p>${quiz.reason}</p>
        <button class="start-recommendation-btn" data-id="${quiz.id}">Start Quiz</button>
      `;
      
      card.querySelector('.start-recommendation-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        startQuiz(quiz.id);
      });
      
      recommendationsGrid.appendChild(card);
    });
  }

  // Format date for display
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // View quiz result
  function viewQuizResult(quizId) {
    console.log(`Viewing result for quiz ${quizId}`);
    // window.location.href = `result.html?quiz_id=${quizId}`;
    alert(`Would navigate to result for quiz ${quizId}`);
  }

  // Start quiz
  function startQuiz(quizId) {
    console.log(`Starting quiz ${quizId}`);
    // window.location.href = `quiz.html?id=${quizId}`;
    alert(`Would start quiz ${quizId}`);
  }

  // Filter history
  function filterHistory() {
    const category = categoryFilter.value;
    const time = timeFilter.value;
    
    let filtered = userData.history;
    
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (time !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (time === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (time === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      }
      
      filtered = filtered.filter(item => new Date(item.date) >= cutoffDate);
    }
    
    renderHistory(filtered);
  }

  // Event Listeners
  editProfileBtn.addEventListener('click', function() {
    editProfileModal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', function() {
    editProfileModal.style.display = 'none';
  });

  cancelEditBtn.addEventListener('click', function() {
    editProfileModal.style.display = 'none';
  });

  editProfileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Update user data
    userData.username = document.getElementById('edit-username').value;
    userData.email = document.getElementById('edit-email').value;
    userData.avatar = document.getElementById('edit-avatar').value || "https://via.placeholder.com/150";
    
    // Update UI
    document.getElementById('username').textContent = userData.username;
    document.querySelector('.user-avatar').src = userData.avatar;
    
    // In a real app, you would send this to your backend
    console.log('Profile updated:', userData);
    
    editProfileModal.style.display = 'none';
    alert('Profile updated successfully!');
  });

  chartToggles.forEach(button => {
    button.addEventListener('click', function() {
      chartToggles.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      initChart(this.dataset.chart);
    });
  });

  categoryFilter.addEventListener('change', filterHistory);
  timeFilter.addEventListener('change', filterHistory);

  // Remove the duplicate declarations and keep only one version
  let currentlyShown = 2;
  const itemsPerLoad = 2;
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  // Single event listener for load more button
  if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', handleLoadMore);
  }
  
  // Single implementation of handleLoadMore function
  function handleLoadMore() {
  const historyData = JSON.parse(document.getElementById('quiz-history-data').textContent);
  const nextItems = historyData.slice(currentlyShown, currentlyShown + itemsPerLoad);
  
  nextItems.forEach(attempt => {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  
  // Determine score class
  let scoreClass = 'score-medium';
  if (attempt.score >= 85) scoreClass = 'score-high';
  if (attempt.score < 70) scoreClass = 'score-low';
  
  historyItem.innerHTML = `
  <div class="quiz-info">
  <h3>${attempt.quiz.title}</h3>
  <span class="quiz-date">${new Date(attempt.start_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
  </div>
  <div class="quiz-stats">
  <span class="score ${scoreClass}">Score: ${attempt.score}%</span>
  </div>
  `;
  
  historyItem.addEventListener('click', () => {
  viewQuizResult(attempt.id);
  });
  
  historyList.appendChild(historyItem);
  });
  
  currentlyShown += itemsPerLoad;
  
  // Hide the button if no more items to show
  if (currentlyShown >= historyData.length) {
  loadMoreBtn.style.display = 'none';
  }
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === editProfileModal) {
      editProfileModal.style.display = 'none';
    }
  });

  // Initialize the page
  initPage();
});