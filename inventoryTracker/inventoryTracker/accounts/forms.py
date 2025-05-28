from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from inventoryTracker.accounts.models import CustomUser
from django.contrib.auth import get_user_model
User = get_user_model()


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email')


class ChangePasswordForm(PasswordChangeForm):
    class Meta:
        model = User
