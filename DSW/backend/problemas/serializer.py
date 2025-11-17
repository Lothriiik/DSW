from rest_framework import serializers
from .models import  Observacao, Dispositivos, Laboratorio
from django.contrib.auth.models import User

class ObservacaoSerializer(serializers.ModelSerializer):
    nome_sala = serializers.SerializerMethodField()
    patrimonio_dispositivo = serializers.SerializerMethodField()
    nome_usuario = serializers.SerializerMethodField()
    tipo_dispositivo = serializers.SerializerMethodField()
    descricao_dispositivo = serializers.SerializerMethodField()

    class Meta:
        model = Observacao
        fields = '__all__'  

    def get_nome_sala(self, obj):
        return obj.id_sala.nome if obj.id_sala else None

    def get_patrimonio_dispositivo(self, obj):
        return obj.id_dispositivo.patrimonio if obj.id_dispositivo else None
    
    def get_tipo_dispositivo(self, obj):
        return obj.id_dispositivo.tipo if obj.id_dispositivo else None
    
    def get_descricao_dispositivo(self, obj):
        return obj.id_dispositivo.descricao if obj.id_dispositivo else None
    
    def get_nome_usuario(self, obj):
        return obj.id_usuario.username if obj.id_usuario else None
    

    def validate(self, data):
        id_sala = data.get('id_sala')
        id_dispositivo = data.get('id_dispositivo')

        if id_dispositivo and id_sala and id_dispositivo.id_sala != id_sala:
            raise serializers.ValidationError("O dispositivo selecionado não pertence à sala escolhida.")

        return data

class ObservacaoCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Observacao
        fields = '__all__'  

    def validate(self, data):
        id_sala = data.get('id_sala')
        id_dispositivo = data.get('id_dispositivo')

        if id_dispositivo and id_sala and id_dispositivo.id_sala != id_sala:
            raise serializers.ValidationError("O dispositivo selecionado não pertence à sala escolhida.")

        return data
