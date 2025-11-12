from django.urls import path
from .views import (LoginView, RegistrarUsuarioView, EditarUsuarioCompletoView,
                    ListaUsuariosComNivelView, UserInfo,
                    DeletarUsuarioView, AdminRedefinirSenhaView,
                    AdminRedefinirSenhaView, ListarUsuarioPorIdView,
                    TrocarSenhaView)
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('registrar/', RegistrarUsuarioView.as_view(), name='register'),
    path('trocar-senha/', TrocarSenhaView.as_view(), name='recover-password'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/listar/', ListaUsuariosComNivelView.as_view(), name='users-list'),
    path('usuarios/<int:pk>/', ListarUsuarioPorIdView.as_view(), name='user-by-id'),
    path('usuarios/<int:pk>/editar/', EditarUsuarioCompletoView.as_view(), name='edit-user'),
    path('usuarios/<int:pk>/excluir/', DeletarUsuarioView.as_view(), name='delete-user'),
    path('usuario-info/', UserInfo.as_view(), name='user_info'),
    path('resetar-senha/<int:pk>/', AdminRedefinirSenhaView.as_view(), name='reset-password'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)