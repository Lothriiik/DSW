from django.contrib import admin
from .models import Observacao
from django import forms
from laboratorios.models import Dispositivos


class ObservacaoForm(forms.ModelForm):
    class Meta:
        model = Observacao
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance and self.instance.tipo == "Laboratorio":
            self.fields.pop("id_dispositivo", None)

class ObservacaoAdmin(admin.ModelAdmin):
    form = ObservacaoForm

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "id_dispositivo":
            obj_id = request.resolver_match.kwargs.get("object_id")
            if obj_id:
                obj = Observacao.objects.filter(pk=obj_id).first()
                if obj and obj.tipo == "Laboratorio":
                    return None
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Observacao, ObservacaoAdmin)


