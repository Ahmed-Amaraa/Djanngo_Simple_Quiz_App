from django import forms
from .models import User, UserCategory

class UserForm(forms.ModelForm):
    category = forms.ModelChoiceField(
        queryset=UserCategory.objects.all(),
        empty_label='Select a category',
        required=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'category']
        
        widgets = {
            'password': forms.PasswordInput(),
        }
    
class LoginForm(forms.Form):  # Change from ModelForm to Form
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput())