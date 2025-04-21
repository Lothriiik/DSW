from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nivel = models.CharField(max_length=20, choices=[
        ('admin', 'Administrador'),
        ('comum', 'Comum'),
    ], default='comum')

    def __str__(self):
        return f"{self.user.username} - {self.nivel}"
