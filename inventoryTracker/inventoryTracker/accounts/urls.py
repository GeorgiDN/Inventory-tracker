from django.urls import path, include
from inventoryTracker.accounts import views as accounts_views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('register/', accounts_views.register, name='register'),
    path('profile/', accounts_views.ProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', include([
        path('delete/', accounts_views.ProfileDeleteView.as_view(), name='profile-delete'),
    ])),
    path('change-password/', accounts_views.update_password, name='password_change'),

    path('logout/', auth_views.LogoutView.as_view(template_name='accounts/logout.html'), name='logout'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),

    path('password-change/', auth_views.PasswordResetView.as_view(template_name='accounts/password_reset_form.html'), name='password_reset'),
    path('password-reset/',
         auth_views.PasswordResetView.as_view(template_name='accounts/password_reset.html'),
         name='password_reset'
         ),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(template_name='accounts/password_reset_done.html'),
         name='password_reset_done'
         ),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(template_name='accounts/password_reset_confirm.html'),
         name='password_reset_confirm'
         ),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(template_name='accounts/password_reset_complete.html'),
         name='password_reset_complete'
         ),
]
