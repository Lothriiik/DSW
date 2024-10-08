from rest_framework import serializers
from ..models import  Dispositivos
from .software_serializer import SoftwareSerializer

class DispositivosSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Dispositivos
        fields = '__all__'

class DispSoftwareSerializer(serializers.ModelSerializer):
    software = SoftwareSerializer(many=True)
    
    class Meta:
        model = Dispositivos
        fields = ['id_sala', 'nome', 'sala_ou_bloco','software']