from rest_framework.permissions import BasePermission

class IsAdminOrModerador(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        perfil = getattr(request.user, 'extensaousuario', None)
        return perfil and perfil.nivel_acesso in ['moderador', 'admin']
