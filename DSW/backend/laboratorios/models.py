from django.db import models

class Laboratorio(models.Model):
    id_sala = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    sala_ou_bloco = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Dispositivos(models.Model):
    id_dispositivo = models.AutoField(primary_key=True)
    id_sala = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='dispositivos')
    marca = models.CharField(max_length=255)
    modelo = models.CharField(max_length=255)
    patrimonio = models.CharField(max_length=255)
    is_computador = models.BooleanField(default=False)
    configuracao = models.TextField()
    descricao = models.TextField()
    status = models.CharField(max_length=50)
    data_verificacao = models.DateField()

    def __str__(self):
        return f"{self.marca} {self.modelo}"


class Software(models.Model):
    id_software = models.AutoField(primary_key=True)
    id_dispositivo = models.ForeignKey(Dispositivos, on_delete=models.CASCADE, related_name='softwares')
    nome = models.CharField(max_length=255)
    versao = models.CharField(max_length=50)
    link = models.URLField()

    def __str__(self):
        return self.nome
