from django.db import models
from django.contrib.auth.models import User
from laboratorios.models import Laboratorio, Dispositivos  

DEFAULT_USER_ID = 1

class Observacao(models.Model):
    id_observacao = models.AutoField(primary_key=True)
    id_sala = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='observacoes')
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='observacoes', default=DEFAULT_USER_ID)
    id_dispositivo = models.ForeignKey(Dispositivos, on_delete=models.CASCADE, related_name='observacoes')
    observacao = models.TextField()
    data = models.DateField()

    def __str__(self):
        return f"Observação de {self.id_usuario.nome} na sala {self.id_sala.nome}"
