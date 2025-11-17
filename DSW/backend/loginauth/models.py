# models.py
from django.contrib.auth.models import User
from django.db import models


class ExtensaoUsuario(models.Model):
    NIVEL_CHOICES = [
        ('comum', 'Comum'),
        ('moderador', 'Moderador'),
        ('admin', 'Administrador'),
    ]
    precisa_trocar_senha = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nivel_acesso = models.CharField(max_length=20, choices=NIVEL_CHOICES, default='comum')

    def __str__(self):
        return f"{self.user.username} - {self.nivel_acesso} - {self.precisa_trocar_senha}"
