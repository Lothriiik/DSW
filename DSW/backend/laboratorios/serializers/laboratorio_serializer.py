from rest_framework import serializers
from ..models import Laboratorio, Dispositivos, Software
from .dispositivos_serializer import DispositivosSerializer

class LaboratorioSerializer(serializers.ModelSerializer):
    numdisp = serializers.SerializerMethodField()
    
    class Meta:
        model = Laboratorio
        fields = ['id_sala', 'nome', 'sala_ou_bloco', 'numdisp']
    
    def get_numdisp(self, obj):
        
        return Dispositivos.objects.filter(id_sala=obj.id_sala).count()

