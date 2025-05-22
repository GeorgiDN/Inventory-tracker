from django.db import models
from django.contrib.auth.models import AbstractUser

from inventoryTracker import settings

class CustomUser(AbstractUser):
    pass

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_profile'
    )

    first_name = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )
    last_name = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"
