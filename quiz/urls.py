from django.urls import path
from . import views

urlpatterns = [
    path('detail', views.detail, name='detail'),
    path('create-quiz/', views.createQuiz, name='create-quiz'),
    path('', views.dashboard, name='quizes'),
    path('take-quiz/', views.takeQuiz, name='take-quiz'),
    path('api/create-quiz/', views.create_quiz_view, name='api-create-quiz'),
    path('delete-quiz/<int:quiz_id>/', views.delete_quiz, name='delete-quiz'),
    path('take-quiz/<int:quiz_id>/', views.takeQuiz, name='take-quiz'),
]