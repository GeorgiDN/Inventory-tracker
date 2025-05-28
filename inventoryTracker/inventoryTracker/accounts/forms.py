from django import forms
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from inventoryTracker.accounts.models import CustomUser, Profile
from django.contrib.auth import get_user_model
User = get_user_model()


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email')


class ChangePasswordForm(PasswordChangeForm):
    class Meta:
        model = User


class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('username', 'email')


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name',)
