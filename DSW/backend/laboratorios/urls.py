from django.urls import path
from laboratorios.views.laboratorio_view import  (LaboratorioListCreateView, LaboratorioDetailView)
from laboratorios.views.dispositivos_view import (DispositivosByLeccView, DispositivosListCreateView,
                                                  DispositivosDetailView,
                                                  SoftwareDeleteView, SoftwaresByDispositivosView, SoftwareCreateView)


from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('laboratorios/', LaboratorioListCreateView.as_view(), name='lab-list-create'), 
    path('laboratorios/<int:pk>/', LaboratorioDetailView.as_view(), name='lab-detail'), 
    
    path('dispositivos/', DispositivosListCreateView.as_view(), name='disp-list-create'),       
    path('dispositivos/<int:pk>/', DispositivosDetailView.as_view(), name='disp-detail'), 
    path('laboratorios/<int:id_sala>/dispositivos/', DispositivosByLeccView.as_view(), name='disp-by-lecc'), 

    path('softwares/create/', SoftwareCreateView.as_view(), name='soft-create'),   
    path('softwares/<int:pk>/', SoftwareDeleteView.as_view(), name='soft-delete'), 
    path('dispositivos/<int:id_dispositivo>/softwares/', SoftwaresByDispositivosView.as_view(), name='soft-by-disp'), 

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
