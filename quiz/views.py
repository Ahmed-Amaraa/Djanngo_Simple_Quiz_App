from django.shortcuts import render, redirect
from . import models
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Quiz, Question, Choice
from .utils import calculate_score

def createQuiz(request):
    return render(request, 'frontend/quiz/create_quiz/create.html', {})

@csrf_exempt
def create_quiz_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
    try:
        data = json.loads(request.body)
        
        # Create the quiz
        quiz = Quiz.objects.create(
            title=data['title'],
            description=data['description'],
            difficulty=data['difficulty'],
            image=data.get('imageUrl', '')  # Optional field
        )
        
        # Create questions and choices
        for question_data in data['questions']:
            question = Question.objects.create(
                quiz=quiz,
                text=question_data['text']
            )
            
            # Create choices for each question
            for choice_data in question_data['choices']:
                Choice.objects.create(
                    question=question,
                    text=choice_data['text'],
                    is_correct=choice_data['isCorrect']
                )
        
        return JsonResponse({
            'message': 'Quiz created successfully',
            'quiz_id': quiz.id,
            'redirect_url': '/'
        }, status=201)
        
    except KeyError as e:
        return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Create your views here.

def dashboard(request):
    quizes = models.Quiz.objects.all()
    return render(request, 'frontend/quiz/dashboard/dashboard.html', {'quizes':quizes})

def detail(request):
    return render(request, 'frontend/quiz/detail/detail.html', {})

def delete_quiz(request, quiz_id):
    quiz = Quiz.objects.get(id=quiz_id)
    quiz.delete()
    return redirect('quizes')
    

def takeQuiz(request, quiz_id):
    quiz = Quiz.objects.get(id=quiz_id)
    questions = Question.objects.filter(quiz=quiz)
    questions_data = [{
        'id': question.id,
        'text': question.text,
        'choices': [{
            'id': choice.id,
            'text': choice.text
        } for choice in question.choices.all()]
    } for question in questions]
    
    return render(request, 'frontend/quiz/take_quiz/take_quiz.html', {
        'quiz': quiz,
        'questions': json.dumps(questions_data)  # Serialize the data
    })









    
