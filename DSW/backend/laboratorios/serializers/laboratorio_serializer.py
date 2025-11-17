from rest_framework import serializers
from ..models import Laboratorio, Dispositivos, Software
from .dispositivos_serializer import DispositivosSerializer

class LaboratorioSerializer(serializers.ModelSerializer):
    numdisp = serializers.SerializerMethodField()
    observacoes = serializers.IntegerField(source="observacoes.count", read_only=True)
    
    class Meta:
        model = Laboratorio
        fields = ['id_sala', 'nome', 'sala_ou_bloco', 'numdisp', 'observacoes']
    
    def get_numdisp(self, obj):
        
        return Dispositivos.objects.filter(id_sala=obj.id_sala).count()

