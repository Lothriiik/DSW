from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
