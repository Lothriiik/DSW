from rest_framework import serializers
from ..models import Laboratorio, Dispositivos, Software
from .dispositivos_serializer import DispositivosSerializer

class LaboratorioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Laboratorio
        fields = ['id_sala', 'nome', 'sala_ou_bloco']

class DispositivosLabSerializer(serializers.ModelSerializer):
    dispositivos = DispositivosSerializer(many=True)
    
    class Meta:
        model = Laboratorio
        fields = ['id_sala', 'nome', 'sala_ou_bloco','dispositivos']