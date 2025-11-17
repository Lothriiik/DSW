from django.db import models

class Laboratorio(models.Model):
    id_sala = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    sala_ou_bloco = models.CharField(max_length=255)

    def __str__(self):
        return self.nome
    @property
    def observacoes(self):
        return self.observacoes.count()


class Dispositivos(models.Model):
    STATUS_CHOICES = (
        ('Funcionando', 'Funcionando'),
        ('Com Defeito', 'Com Defeito'),
    )

    id_dispositivo = models.AutoField(primary_key=True)
    id_sala = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='dispositivos')
    tipo = models.CharField(max_length=255, null=True, blank=True)
    modelo = models.CharField(max_length=255, null=True, blank=True)
    patrimonio = models.CharField(max_length=255, unique=True)
    is_computador = models.BooleanField(default=False)
    configuracao = models.TextField(null=True, blank=True)
    descricao = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Funcionando')
    data_verificacao = models.DateField()

    def __str__(self):
        return f" {self.modelo}"
    
    def nome_sala(self):
        return self.id_sala.nome


class Software(models.Model):
    id_software = models.AutoField(primary_key=True)
    id_dispositivo = models.ForeignKey(Dispositivos, on_delete=models.CASCADE, related_name='softwares')
    nome = models.CharField(max_length=255)
    versao = models.CharField(max_length=50)
    link = models.URLField()

    def __str__(self):
        return self.nome
