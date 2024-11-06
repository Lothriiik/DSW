from django.urls import path
from laboratorios.views.laboratorio_view import  (LaboratorioUpdateView, LaboratorioDeleteView, LaboratorioByIDView,
                                                  LaboratorioCreateView, LaboratorioListView)

from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    
    path('lab-view/', LaboratorioListView.as_view(), name='lab-view'),
    path('lab-create/', LaboratorioCreateView.as_view(), name='lab-create'),
    
  
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
