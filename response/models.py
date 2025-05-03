
from django.db import models
from user.models import User
from quiz.models import Question, Choice

class UserResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    def is_correct(self):
        return self.selected_choice.is_correct
    

