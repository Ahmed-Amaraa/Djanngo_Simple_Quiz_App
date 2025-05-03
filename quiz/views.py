from django.shortcuts import render
from . import models

# Create your views here.

def dashboard(request):
    quizes = models.Quiz.objects.all()
    return render(request, 'frontend/quiz/dashboard/dashboard.html', {'quizes':quizes})

def detail(request):
    return render(request, 'frontend/quiz/detail/detail.html', {})

def createQuiz(request):
    pass

def takeQuiz(request):
    pass

# Quiz
def add_question(self, question):
    pass

def remove_question(self, question):
    pass

def calculate_result(self):
    pass

# Question
def add_choice(self, choice):
    pass

def remove_choice(self, choice):
    pass