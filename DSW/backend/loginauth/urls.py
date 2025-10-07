from django.urls import path
from .views import (LoginView, RegistrarUsuarioView, EditarUsuarioCompletoView,
                    ListaUsuariosComNivelView, UserInfo,
                    DeletarUsuarioView, AdminRedefinirSenhaView,
                    AdminRedefinirSenhaView, ListarUsuarioPorIdView)
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/listar/', ListaUsuariosComNivelView.as_view(), name='listar_usuario'),
    path('registrar/', RegistrarUsuarioView.as_view(), name='register'),
    path('usuarios/<int:pk>/', ListarUsuarioPorIdView.as_view(), name='listar-usuario-por-id'),
    path('usuarios/<int:pk>/editar/', EditarUsuarioCompletoView.as_view(), name='editar-usuario'),
    path('usuarios/<int:pk>/redefinir-senha/', AdminRedefinirSenhaView.as_view(), name='admin-redefinir-senha'),
    path('usuarios/<int:pk>/excluir/', DeletarUsuarioView.as_view(), name='excluir-usuario'),
    path('user-info/', UserInfo.as_view(), name='user_info'),
    path('resetar-senha/<int:pk>/', AdminRedefinirSenhaView.as_view(), name='resetar_senha'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)