from django.shortcuts import render, redirect, get_object_or_404
from quiz.models import UserQuizAttempt, Quiz, Question
from response.models import UserResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from .models import User
from .forms import UserForm, LoginForm
from django.db.models import Avg
import json



def custom_session_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if 'user_id' not in request.session:
            messages.error(request, 'You must be logged in to view this page.')
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper


def register(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])  # Hash the password
            user.save()
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = UserForm()

    return render(request, 'frontend/auth/register/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                request.session['user_id'] = user.id
                return redirect('quizes')
            else:
                messages.error(request, 'Invalid username or password')
    else:
        form = LoginForm()

    return render(request, 'frontend/auth/login/login.html', {'form': form})

@login_required
def logout_view(request):
    if 'user_id' in request.session:
        del request.session['user_id']
    logout(request)
    return redirect('login')

@login_required
def profile(request):
    if 'user_id' not in request.session:
        return redirect('login')
    
    user = request.user
    

    quiz_attempts = UserQuizAttempt.objects.filter(user=user)
    
    # Convert quiz attempts to a list of dictionaries for JSON serialization
    history_data = [
        {
            'id': attempt.id,
            'quiz': {
                'id': attempt.quiz.id,
                'title': attempt.quiz.title
            },
            'score': attempt.score,
            'start_time': attempt.start_time.strftime('%Y-%m-%d %H:%M:%S')
        } for attempt in quiz_attempts.select_related('quiz').order_by('-start_time')
    ]
    
    context = {
        'user': user,
        'quiz_count': quiz_attempts.count(),
        'average_score': quiz_attempts.aggregate(Avg('score'))['score__avg'] if quiz_attempts.exists() else None,
        'history': history_data  # Use the serializable list instead of QuerySet
    }
    
    return render(request, 'frontend/results/history/profile.html', context)


@login_required
def start_quiz(request, quiz_id):
    if not request.user.is_authenticated:
        return redirect('login')
        
    user = request.user
    quiz = get_object_or_404(Quiz, id=quiz_id)
    
    # Check if user is a player
    if not user.can_create_quiz():
        questions = Question.objects.filter(quiz=quiz)
        questions_data = [{
            'id': question.id,
            'text': question.text,
            'choices': [{
                'id': choice.id,
                'text': choice.text
            } for choice in question.choices.all()]
        } for question in questions]

        attempt, created = UserQuizAttempt.objects.get_or_create(user=user, quiz=quiz)
        
        if created:
            print("Quiz started at", attempt.start_time)
        else:
            print("Resuming quiz")

        return render(request, 'frontend/quiz/take_quiz/take_quiz.html', {
            'quiz': quiz,
            'attempt': attempt,
            'questions': json.dumps(questions_data),
            'user': user,
        })
    else:
        messages.error(request, 'Only players can take quizzes')
        return redirect('quizes')


@login_required
def submit_response(request, response):
    if request.method == 'POST':
        question = get_object_or_404(Question, id=question.id)
        selected_choice = request.POST.get('selected_option')
        
        UserResponse.objects.create(
            user=request.user,
            question=question,
            selected_choice=selected_choice
        )

        return redirect('next_question_or_results')


import random

@login_required
def start_random_quiz(request):
    quizzes = Quiz.objects.all()
    if not quizzes.exists():
        messages.warning(request, "No quizzes available.")
        return redirect('quizes')  # Or wherever you want to redirect in case of no quiz

    quiz = random.choice(quizzes)
    return redirect('get-quiz', quiz_id=quiz.id)

