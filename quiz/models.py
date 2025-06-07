from django.db import models
from user.models import User


class Quiz(models.Model):
    QUIZ_DIFFICULTY = [('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),]
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='quiz_images/', blank=True)
    difficulty = models.CharField(max_length=10,
        choices=QUIZ_DIFFICULTY,
        default='easy',)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_quizzes')
    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)
    def __str__(self):
        return self.text

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)  # Add this line
