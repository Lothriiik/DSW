from .models import ExtensaoUsuario
from rest_framework import serializers
from django.contrib.auth.models import User

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtensaoUsuario
        fields = ['id', 'user', 'nivel_acesso']


class RegistrarUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    
class ListarUsuarioSerializer(serializers.ModelSerializer):
    nivel_acesso = serializers.CharField(source='extensaousuario.nivel_acesso', default='comum')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'nivel_acesso']

class UsuarioCompletoSerializer(serializers.ModelSerializer):
    nivel_acesso = serializers.CharField(source='extensaousuario.nivel_acesso')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'nivel_acesso']

    def get_nivel_acesso(self, obj):

        return getattr(getattr(obj, 'perfil', None), 'nivel_acesso', None)

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfil', {})
        instance = super().update(instance, validated_data)

        perfil = getattr(instance, 'perfil', None)
        if perfil and 'nivel_acesso' in perfil_data:
            perfil.nivel_acesso = perfil_data['nivel_acesso']
            perfil.save()

        return instance

class TrocarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(write_only=True)
    nova_senha = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['senha_atual']):
            raise serializers.ValidationError("Senha atual incorreta.")
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['nova_senha'])
        user.save()

        user.extensaousuario.precisa_trocar_senha = False
        user.extensaousuario.save()
        return user
