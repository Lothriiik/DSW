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

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "id_dispositivo" and 'id_sala' in request.GET:
            sala_id = request.GET.get('id_sala')
            kwargs["queryset"] = Dispositivos.objects.filter(laboratorio_id=sala_id)
        elif db_field.name == "id_dispositivo":
            kwargs["queryset"] = Dispositivos.objects.none() 
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

