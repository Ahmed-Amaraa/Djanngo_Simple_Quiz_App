# Generated by Django 5.1.6 on 2025-05-03 00:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0004_quiz_diffuculty'),
    ]

    operations = [
        migrations.RenameField(
            model_name='quiz',
            old_name='diffuculty',
            new_name='difficulty',
        ),
    ]
