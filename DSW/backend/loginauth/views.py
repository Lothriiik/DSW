from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.db import transaction
from django.http import JsonResponse
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status, generics, serializers
from .models import ExtensaoUsuario
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (ListarUsuarioSerializer, UsuarioCompletoSerializer, 
                            TrocarSenhaSerializer, RegistrarUsuarioSerializer)
from .permissions import IsAdminOrModerador
import secrets

TokenOutputSerializer = inline_serializer(
    name='TokenOutput',
    fields={
        'refresh': serializers.CharField(
            read_only=True, 
            help_text="Token JWT de refresh." 
        ),
        'access': serializers.CharField(
            read_only=True, 
            help_text="Token JWT de acesso (Bearer)."
        )
    }
)

@extend_schema(
        summary="Login e Geração de Token JWT",
        tags=['Autenticação e Token'],
        description="Autentica o usuário e retorna os tokens JWT (access e refresh).",
        request=inline_serializer(
            name='LoginInput',
            fields={
                'username': serializers.CharField(required=True),
                'password': serializers.CharField(required=True, write_only=True)
            }
        ),
        responses={
            200: TokenOutputSerializer,
            401: {'description': 'Credenciais inválidas.'}
        }
    )
class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            extensao = getattr(user, 'extensaousuario', None)
            if extensao and extensao.precisa_trocar_senha:
                return Response(
                    {'detail': 'TROCA_SENHA_NECESSARIA'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Credenciais Invalidas'}, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(
        summary="Obter dados do usuário logado",
        tags=['Gerenciamento de Usuários'],
        description="Retorna dados básicos e o status 'precisa_trocar_senha' do usuário autenticado (via token).",
        responses={
            200: inline_serializer(
                name='UserInfoOutput',
                fields={
                    "id": serializers.IntegerField(),
                    "first_name": serializers.CharField(),
                    "is_staff": serializers.BooleanField(),
                    "precisa_trocar_senha": serializers.BooleanField(allow_null=True),
                    "nivel_acesso": serializers.CharField(),
                }
            ),
            401: {'description': 'Não Autorizado.'}
        }
    )
class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            extensao = user.extensaousuario
            precisa_trocar_senha = extensao.precisa_trocar_senha
            nivel_acesso = extensao.nivel_acesso
        except ExtensaoUsuario.DoesNotExist:
            precisa_trocar_senha = None  

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "is_staff": user.is_staff,
            "precisa_trocar_senha": precisa_trocar_senha,
            "nivel_acesso": nivel_acesso,
        })

@extend_schema(
    summary="Registro de Novo Usuário",
    tags=['Autenticação e Token'],
    description="Cria um novo usuário no sistema."
)    
class RegistrarUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrarUsuarioSerializer
    permission_classes = [AllowAny]
    
@extend_schema(
    summary="Editar usuário por ID (Admin/Moderador)",
    tags=['Gerenciamento de Usuários'],
    description="Edita campos do usuário. Requer permissão de Admin ou Moderador. Usa UsuarioCompletoSerializer.",
)
class EditarUsuarioCompletoView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioCompletoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'

@extend_schema(
    summary="Lista todos os usuários (Admin/Moderador)",
    tags=['Gerenciamento de Usuários'],
    description="Lista todos os usuários. Requer permissão de Admin ou Moderador.",
)
class ListaUsuariosComNivelView(generics.ListAPIView):
    queryset = User.objects.all().select_related('extensaousuario')
    serializer_class = ListarUsuarioSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]

@extend_schema(
        summary="Redefinição de Senha (Admin/Moderador)",
        tags=['Gerenciamento de Usuários'],
        description="Redefine a senha de um usuário para um valor temporário, marcando a conta para exigir troca de senha no próximo login.",
        responses={
            200: inline_serializer(
                name='AdminRedefinirSenhaOutput',
                fields={
                    'mensagem': serializers.CharField(
                        read_only=True,
                        help_text="Mensagem de sucesso da operação." 
                    ),
                    'nova_senha': serializers.CharField(
                        read_only=True,
                        help_text="A nova senha temporária gerada." 
                    ),
                    'precisa_trocar_senha': serializers.BooleanField(
                        read_only=True,
                        help_text="Indica se o usuário deve ser forçado a trocar a senha no próximo login." 
                    ),
                }
            ),
            404: {'description': 'Usuário não encontrado.'}
        }
    )
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
    
@extend_schema(
    summary="Deletar usuário por ID (Admin/Moderador)",
    tags=['Gerenciamento de Usuários'],
    description="Deleta um usuário permanentemente. Requer permissão de Admin ou Moderador.",
    responses={
        204: {'description': 'Usuário deletado com sucesso.'},
        404: {'description': 'Usuário não encontrado.'}
    }
)
class DeletarUsuarioView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminOrModerador]

    def delete(self, request, *args, **kwargs):
        user_to_delete = self.get_object()

        if user_to_delete == request.user:
            return Response(
                {"erro": "Você não pode deletar a própria conta."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@extend_schema(
    summary="Detalhes de um usuário por ID (Admin/Moderador)",
    tags=['Gerenciamento de Usuários'],
    description="Retorna detalhes de um usuário específico. Requer permissão de Admin ou Moderador.",
)
class ListarUsuarioPorIdView(generics.RetrieveAPIView):

    queryset = User.objects.all()
    serializer_class = UsuarioCompletoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'

@extend_schema(
        summary="Troca a senha do usuário logado",
        tags=['Gerenciamento de Usuários'],
        description="Permite ao usuário alterar sua própria senha. A requisição deve conter o campo 'nova_senha'.",
        request=inline_serializer(
            name='TrocarSenhaInput',
            fields={'nova_senha': serializers.CharField(required=True, write_only=True)}
        ),
        responses={
            200: {'description': 'Senha alterada com sucesso.'},
            400: {'description': 'Nova senha é obrigatória.'}
        }
    ) 
class TrocarSenhaView(generics.UpdateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        nova_senha = request.data.get('nova_senha')

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'erro': 'Usuário não encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(nova_senha)
        user.save()

        extensao, _ = ExtensaoUsuario.objects.get_or_create(user=user)
        extensao.precisa_trocar_senha = False
        extensao.save()

        return Response({'mensagem': 'Senha alterada com sucesso.'}, status=status.HTTP_200_OK)