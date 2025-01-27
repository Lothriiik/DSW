from rest_framework import serializers
from ..models import  Dispositivos
from .software_serializer import SoftwareSerializer

class DispositivosSoftwaresSerializer(serializers.ModelSerializer):
    softwares = SoftwareSerializer(many=True, read_only=True)  

    class Meta:
        model = Dispositivos
        fields = [
            'id_dispositivo', 'id_sala', 'tipo', 'modelo', 'patrimonio',
            'is_computador', 'configuracao', 'descricao', 'status',
            'data_verificacao', 'softwares'  
        ]

class DispositivosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dispositivos
        fields = [
            'id_dispositivo', 'id_sala', 'tipo', 'modelo', 'patrimonio',
            'is_computador', 'configuracao', 'descricao', 'status',
            'data_verificacao'
        ]