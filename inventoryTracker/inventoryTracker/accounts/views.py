from django.contrib import messages
from django.shortcuts import render, get_object_or_404
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.views.generic import  View
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, ChangePasswordForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin

from .models import Profile


@login_required
def profile(request):
    return render(request, 'accounts/profile.html', {'user': request.user})


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})


@login_required
def profile(request):
    return render(request, 'accounts/profile.html')

class ProfileView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.user_profile)

        context = {
            'u_form': u_form,
            'p_form': p_form,
        }

        return render(request, 'accounts/profile.html', context)

    def post(self, request, *args, **kwargs):
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.user_profile)

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(self.request, 'Your profile has been updated!')
            return redirect('profile')

        context = {
            'u_form': u_form,
            'p_form': p_form
        }

        return render(request, 'accounts/profile.html', context)


class ProfileDeleteView(LoginRequiredMixin, UserPassesTestMixin, View):
    template_name = 'accounts/profile-delete-page.html'
    success_url = reverse_lazy('login')

    def test_func(self):
        profile = get_object_or_404(Profile, pk=self.kwargs["pk"])
        return self.request.user == profile.user

    def get(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, pk=self.kwargs["pk"])
        return render(request, self.template_name, {'profile': profile})

    def post(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, pk=self.kwargs["pk"])
        user = profile.user

        user.delete()
        profile.delete()

        return redirect(self.success_url)


def update_password(request):
    if request.user.is_authenticated:
        current_user = request.user
        if request.method == 'POST':
            form = ChangePasswordForm(current_user, request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Your password has been changed!')
                return redirect('login')
            else:
                for error in list(form.errors.values()):
                    messages.error(request, error)
                    return redirect('update-password')
        else:
            form = ChangePasswordForm(current_user)

    else:
        messages.error(request, 'You are not logged in!')
        return redirect('login')

    context = {
        'form': form,
    }

    return render(request, 'accounts/change_password.html', context)


