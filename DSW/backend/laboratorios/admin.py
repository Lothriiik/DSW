from django.contrib import admin
from .models import Dispositivos, Software, Laboratorio

# Register your models here.

@admin.register(Dispositivos)
class DispositivosAdmin(admin.ModelAdmin):
    list_display = ('id_dispositivo', 'tipo', 'modelo', 'patrimonio', 'is_computador', 'status', 'data_verificacao')
    list_filter = ('status', 'is_computador', 'id_sala')
    search_fields = ('marca', 'modelo', 'patrimonio', 'descricao')
    ordering = ('-data_verificacao',)
    date_hierarchy = 'data_verificacao'

    # Para exibir softwares relacionados no detalhe do dispositivo
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('softwares')

@admin.register(Software)
class SoftwareAdmin(admin.ModelAdmin):
    list_display = ('id_software', 'nome', 'versao', 'id_dispositivo')
    list_filter = ('id_dispositivo',)
    search_fields = ('nome', 'versao')
    ordering = ('nome',)

@admin.register(Laboratorio)
class LaboratorioAdmin(admin.ModelAdmin):
    list_display = ('id_sala', 'nome', 'sala_ou_bloco')
    search_fields = ('nome', 'sala_ou_bloco')
    ordering = ('nome',)