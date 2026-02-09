from django.urls import path
from .views import (LoginView, UserListCreateView, UserDetailView,
                    UserInfo, AdminRedefinirSenhaView,
                    TrocarSenhaView, PasswordResetRequestView, PasswordResetConfirmView, CustomTokenRefreshView)
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),

    path('trocar-senha/', TrocarSenhaView.as_view(), name='recover-password'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    path('usuarios/', UserListCreateView.as_view(), name='users-list-create'),    
    path('usuarios/<int:pk>/', UserDetailView.as_view(), name='user-detail'),    
    

    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)