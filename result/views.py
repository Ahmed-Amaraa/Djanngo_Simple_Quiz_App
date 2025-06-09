from django.shortcuts import render, redirect
from quiz.models import Quiz, Question, Choice
import json
from .models import Result
from response.models import UserResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from quiz.utils import calculate_score
from quiz.models import UserQuizAttempt

# Create your views here.

def result(request):
    if request.method == 'POST':
        quiz_id = request.POST.get('quiz_id')
        quiz = Quiz.objects.get(id=quiz_id)
        questions = Question.objects.filter(quiz=quiz)
        correct = 0
        number_of_questions = len(questions)
        questions_data = []

        for question in questions:
            selected_choice_id = request.POST.get(f'question_{question.id}')
            question_data = {
                'text': question.text,
                'is_correct': False,
                'selected_choice': None
            }
            
            if selected_choice_id:
                try:
                    selected_choice = Choice.objects.get(id=selected_choice_id)
                    question_data['selected_choice'] = selected_choice
                    if selected_choice.is_correct:
                        correct += 1
                        question_data['is_correct'] = True
                except Choice.DoesNotExist:
                    pass
            
            questions_data.append(question_data)
        
        score = calculate_score(correct, number_of_questions)
        time_taken = request.POST.get('time_taken', '0:00')  # Get time from form

        # Replace the quiz attempt saving code with this
        if request.user.is_authenticated:
            quiz_attempt, created = UserQuizAttempt.objects.get_or_create(
                user=request.user,
                quiz=quiz,
                completed=False,
                defaults={'score': 0}
            )
            quiz_attempt.score = score
            quiz_attempt.completed = True
            quiz_attempt.save()

        return render(request, 'frontend/results/summary/summary.html', {
            'score': score,
            'total_questions': number_of_questions,
            'questions_data': questions_data,
            'quiz': quiz,
            'correct': correct,
            'time_taken': time_taken
        })
    
