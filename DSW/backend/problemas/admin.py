from django.contrib import admin
from .models import Observacao
from laboratorios.models import Dispositivos


@admin.register(Observacao)
class ObservacaoAdmin(admin.ModelAdmin):
    list_display = ('id_observacao', 'id_sala', 'id_usuario', 'id_dispositivo', 'observacao', 'data')
    list_filter = ('id_sala', 'id_usuario', 'id_dispositivo', 'data')
    search_fields = ('id_observacao', 'id_sala', 'id_usuario', 'id_dispositivo')
    ordering = ('data',)
    date_hierarchy = 'data'


