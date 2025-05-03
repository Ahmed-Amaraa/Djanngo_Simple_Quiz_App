from django.shortcuts import render, redirect, get_object_or_404
from quiz.models import UserQuizAttempt, Quiz, Question
from response.models import UserResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from .models import User


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
            return redirect('quizes')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return redirect('quizes')

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        login(request, user)
        return redirect('profile')

    return render(request, 'auth/register/register.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('quizes')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('login')

    return render(request, 'user/login.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def profile(request):
    user = request.user
    history = UserQuizAttempt.objects.filter(user=user).select_related('quiz')

    return render(request, 'results/history/history.html', {
        'user': user,
        'history': history
    })


@login_required
def start_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    user = request.user

    attempt, created = UserQuizAttempt.objects.get_or_create(user=user, quiz=quiz)
    
    if created:
        # Quiz started for the first time
        print("Quiz started at", attempt.start_time)
    else:
        # Already started before
        print("Resuming quiz")

    return render(request, 'quiz/take_quiz/take_quiz.html', {'quiz': quiz, 'attempt': attempt})


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