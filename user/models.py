from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class UserCategory(models.Model):
    CATEGORY_CHOICES = [
        ('player', 'Player'),
        ('creator', 'Creator'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='player')
    can_create_quiz = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Automatically set can_create_quiz based on category type
        if self.name == 'creator':
            self.can_create_quiz = True
        else:
            self.can_create_quiz = False
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'User Categories'


class User(AbstractUser):
    category = models.ForeignKey(UserCategory, on_delete=models.SET_NULL, null=True, related_name='users')

    def __str__(self):
        return self.username

    def can_create_quiz(self):
        return self.category and self.category.can_create_quiz