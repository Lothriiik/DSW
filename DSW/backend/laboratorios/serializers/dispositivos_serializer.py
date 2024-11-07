from rest_framework import serializers
from ..models import  Dispositivos
from .software_serializer import SoftwareSerializer

class DispositivosSerializer(serializers.ModelSerializer):
    softwares = SoftwareSerializer(many=True, read_only=True)  

    class Meta:
        model = Dispositivos
        fields = [
            'id_dispositivo', 'id_sala', 'marca', 'modelo', 'patrimonio',
            'is_computador', 'configuracao', 'descricao', 'status',
            'data_verificacao', 'softwares'  
        ]