from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import ExtensaoUsuario

# Register your models here.
class ExtensaoUsuarioInline(admin.StackedInline):
    model = ExtensaoUsuario
    can_delete = False
    verbose_name_plural = 'Perfil'

# Novo UserAdmin com inline
class UserAdmin(BaseUserAdmin):
    inlines = (ExtensaoUsuarioInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)