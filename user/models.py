from django.db import models

class User(models.Model):
    user_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    totalScore = models.IntegerField()
    is_admin = models.BooleanField()

    def __str__(self):
        return self.name