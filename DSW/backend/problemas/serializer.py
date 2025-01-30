from rest_framework import serializers
from .models import  Observacao, Dispositivos


class ObservacaoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Observacao
        fields = '__all__'

    def validate(self, data):
        id_sala = data.get('id_sala')
        id_dispositivo = data.get('id_dispositivo')

        if id_dispositivo and id_sala and id_dispositivo.id_sala != id_sala:
            raise serializers.ValidationError("O dispositivo selecionado não pertence à sala escolhida.")

        return data

