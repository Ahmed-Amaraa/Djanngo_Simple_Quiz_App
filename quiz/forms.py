from django import forms
from .models import Quiz, Question, Choice

class Quiz(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = ['title', 'description', 'difficulty', 'image']

class Question(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['quiz', 'text']


class Choice(forms.ModelForm):
    class Meta:
        model = Choice
        fields = ['question', 'text', 'is_correct']