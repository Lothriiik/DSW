from django.db import models
from django.contrib.auth.models import User
from laboratorios.models import Laboratorio, Dispositivos  
from django.core.exceptions import ValidationError

DEFAULT_USER_ID = 1

class Observacao(models.Model):

    TIPO_CHOICES = [
        ('Dispositivo','Dispositivo'),
        ('Laboratorio','Laboratorio')
    ]

    id_observacao = models.AutoField(primary_key=True)
    id_sala = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='observacoes')
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='observacoes', default=DEFAULT_USER_ID)
    tipo = models.CharField(max_length=255, choices=TIPO_CHOICES, blank=True, default='Dispositivo')
    id_dispositivo = models.ForeignKey(Dispositivos, on_delete=models.CASCADE, related_name='observacoes', null=True, blank=True)
    observacao = models.TextField()
    data = models.DateField()

    def clean(self):
        if self.id_dispositivo and self.id_dispositivo.id_sala != self.id_sala:
            raise ValidationError("O dispositivo selecionado não pertence à sala escolhida.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)



