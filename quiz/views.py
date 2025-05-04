from django.shortcuts import render
from . import models
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
import json
from .models import Quiz, Question, Choice

def createQuiz(request):
    return render(request, 'frontend/quiz/create_quiz/create.html')

@csrf_exempt
def create_quiz_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Create Quiz
            quiz = Quiz.objects.create(
                title=data['title'],
                description=data.get('description', ''),
                difficulty=data['difficulty'],
                created_at=timezone.now()
            )

            # Add Questions and Choices
            for q in data['questions']:
                question = Question.objects.create(
                    quiz=quiz,
                    text=q['text']
                )

                for c in q['choices']:
                    Choice.objects.create(
                        question=question,
                        text=c['text'],
                        is_correct=c['isCorrect']
                    )

            return JsonResponse({'message': 'Quiz created successfully'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Create your views here.

def dashboard(request):
    quizes = models.Quiz.objects.all()
    return render(request, 'frontend/quiz/dashboard/dashboard.html', {'quizes':quizes})

def detail(request):
    return render(request, 'frontend/quiz/detail/detail.html', {})



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