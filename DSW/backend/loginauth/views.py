from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.db import transaction
from django.http import JsonResponse
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (ListarUsuarioSerializer, UsuarioCompletoSerializer, 
                            TrocarSenhaSerializer, RegistrarUsuarioSerializer)
from .permissions import IsAdminOrModerador
import secrets

class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,

        })
    
class RegistrarUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrarUsuarioSerializer
    permission_classes = [AllowAny]
    

class EditarUsuarioCompletoView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioCompletoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'


class ListaUsuariosComNivelView(generics.ListAPIView):
    queryset = User.objects.all().select_related('extensaousuario')
    serializer_class = ListarUsuarioSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]

class AdminRedefinirSenhaView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrModerador]

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse(
                {"erro": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        nova_senha = secrets.token_urlsafe(8)
        user.set_password(nova_senha)
        user.save()

        extensao, created = ExtensaoUsuario.objects.get_or_create(user=user)
        extensao.precisa_trocar_senha = True
        extensao.save()

        return JsonResponse(
            {
                "mensagem": "Senha redefinida com sucesso.",
                "nova_senha": nova_senha,
                "precisa_trocar_senha": extensao.precisa_trocar_senha
            },
            status=status.HTTP_200_OK
        )
class DeletarUsuarioView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'

class ListarUsuarioPorIdView(generics.RetrieveAPIView):

    queryset = User.objects.all()
    serializer_class = UsuarioCompletoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'
    
class TrocarSenhaView(generics.UpdateAPIView):
    serializer_class = TrocarSenhaSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # o usuário que está logado
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensagem": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)