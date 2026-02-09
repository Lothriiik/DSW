from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
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
                            TrocarSenhaSerializer, RegistrarUsuarioSerializer,
                            PasswordResetRequestSerializer, PasswordResetConfirmSerializer)
from .permissions import IsAdminOrModerador
import secrets
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

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
    summary="Renovar Token (Refresh)",
    tags=['Autenticação e Token'],
    description="Recebe um token de refresh válido e retorna um novo par de tokens (access e refresh).",
    responses={
        200: TokenOutputSerializer,
        401: {'description': 'Token inválido ou expirado.'}
    }
)
class CustomTokenRefreshView(TokenRefreshView):
    pass

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
            nivel_acesso = 'comum'

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "is_staff": user.is_staff,
            "precisa_trocar_senha": precisa_trocar_senha,
            "nivel_acesso": nivel_acesso,
        })

class UserListCreateView(generics.ListCreateAPIView):

    queryset = User.objects.all().select_related('extensaousuario')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminOrModerador()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RegistrarUsuarioSerializer
        return ListarUsuarioSerializer

    @extend_schema(
        summary="Lista todos os usuários (Admin/Moderador)",
        tags=['Gerenciamento de Usuários'],
        description="Lista todos os usuários. Requer permissão de Admin ou Moderador.",
        responses={200: ListarUsuarioSerializer(many=True), 401: {'description': 'Não Autorizado.'}}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Registro de Novo Usuário",
        tags=['Autenticação e Token'],
        description="Cria um novo usuário no sistema (Sign-up).",
        request=RegistrarUsuarioSerializer,
        responses={201: RegistrarUsuarioSerializer, 400: {'description': 'Dados inválidos.'}}
    )   
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

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
    
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = User.objects.all()
    serializer_class = UsuarioCompletoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModerador]
    lookup_field = 'pk'

    @extend_schema(
        summary="Detalhes de um usuário por ID (Admin/Moderador)",
        tags=['Gerenciamento de Usuários'],
        description="Retorna detalhes de um usuário específico.",
        responses={200: UsuarioCompletoSerializer, 404: {'description': 'Usuário não encontrado.'}}
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Deletar usuário por ID (Admin/Moderador)",
        tags=['Gerenciamento de Usuários'],
        description="Deleta um usuário permanentemente.",
        responses={204: {'description': 'Usuário deletado.'}, 404: {'description': 'Usuário não encontrado.'}}
    )
    def delete(self, request, *args, **kwargs):
        user_to_delete = self.get_object()
        if user_to_delete == request.user:
            return Response(
                {"erro": "Você não pode deletar a própria conta."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return self.destroy(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Usuário (Completo)",
        tags=['Gerenciamento de Usuários'],
        description="Atualiza dados do usuário.",
    )
    def put(self, request, *args, **kwargs):
         return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Usuário (Parcial)",
        tags=['Gerenciamento de Usuários'],
        description="Atualiza parcialmente dados do usuário.",
    )
    def patch(self, request, *args, **kwargs):
         return self.partial_update(request, *args, **kwargs)

@extend_schema(
    summary="Troca a senha (pós-reset ou primeiro acesso)",
    tags=['Gerenciamento de Usuários'],
    description="Permite a troca da senha de um usuário **sem exigir a senha atual**, utilizando apenas o username e a nova senha. Deve ser usado para fluxos de *reset* ou primeiro acesso. **Atenção**: O endpoint não exige autenticação.",
    
    request=inline_serializer(
        name='TrocarSenhaInput',
        fields={
            'username': serializers.CharField(required=True, help_text="Nome de usuário do qual a senha será trocada."),
            'nova_senha': serializers.CharField(required=True, write_only=True, help_text="A nova senha a ser definida.")
        }
    ),
    
    responses={
        200: {'description': 'Senha alterada com sucesso.', 
              'content': {'application/json': {'example': {'mensagem': 'Senha alterada com sucesso.'}}}},
        400: {'description': 'Campos obrigatórios faltando (username, nova_senha) ou usuário não encontrado.',
              'content': {'application/json': {'example': {'erro': 'Campos obrigatórios faltando: username e nova_senha.'}}}}
    }
)
class TrocarSenhaView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        nova_senha = request.data.get('nova_senha')

        if not username or not nova_senha:
            return Response(
                {'erro': 'Campos obrigatórios faltando: username e nova_senha.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = User.objects.filter(username=username).first()
        if not user:
            return Response(
                {'erro': 'Credenciais inválidas.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(nova_senha)
        user.save()

        extensao, _ = ExtensaoUsuario.objects.get_or_create(user=user)
        extensao.precisa_trocar_senha = False
        extensao.save()

        return Response(
            {'mensagem': 'Senha alterada com sucesso.'}, 
            status=status.HTTP_200_OK
        )

@extend_schema(
    summary="Solicitar Redefinição de Senha (API JSON)",
    tags=['Autenticação e Token'],
    description="Envia um e-mail com link para redefinição de senha. O link aponta para o Front-end.",
    request=PasswordResetRequestSerializer,
    responses={
        200: {'description': 'E-mail de redefinição enviado.'},
        400: {'description': 'E-mail não encontrado.'}
    }
)
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Link para o FRONTEND
                reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"
                
                print(f"\n\n--- LINK DE RESET ---\n{reset_link}\n---------------------\n\n")

                send_mail(
                    'Redefinição de Senha - LECCS',
                    f'Clique no link para redefinir sua senha: {reset_link}',
                    settings.EMAIL_HOST_USER if hasattr(settings, 'EMAIL_HOST_USER') else 'noreply@leccs.com',
                    [email],
                    fail_silently=False,
                )
            return Response({'mensagem': 'Se o e-mail existir, um link foi enviado.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    summary="Confirmar Redefinição de Senha (API JSON)",
    tags=['Autenticação e Token'],
    description="Recebe o token e a nova senha para efetivar a troca.",
    request=PasswordResetConfirmSerializer,
    responses={
        200: {'description': 'Senha redefinida com sucesso.'},
        400: {'description': 'Token inválido ou expirado.'}
    }
)
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uidb64']
            token = serializer.validated_data['token']
            password = serializer.validated_data['new_password']

            try:
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({'erro': 'Link inválido.'}, status=status.HTTP_400_BAD_REQUEST)

            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                
                extensao, _ = ExtensaoUsuario.objects.get_or_create(user=user)
                extensao.precisa_trocar_senha = False
                extensao.save()

                return Response({'mensagem': 'Senha redefinida com sucesso.'}, status=status.HTTP_200_OK)
            
            return Response({'erro': 'Token inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
