from django.urls import path
from laboratorios.views.laboratorio_view import  (LaboratorioUpdateView, LaboratorioDeleteView, LaboratorioByIDView,
                                                  LaboratorioCreateView, LaboratorioListView)
from laboratorios.views.dispositivos_view import (DispositivosByLeccView, DispositivosCreateView, DispositivosDeleteView,
                                                  DispositivosListView,  DispositivosUpdateView, DispositivosByIDView,
                                                  SoftwareDeleteView, SoftwaresByDispositivosView, SoftwareCreateView)


from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    
    path('lab-list/', LaboratorioListView.as_view(), name='lab-list'),
    path('lab-create/', LaboratorioCreateView.as_view(), name='lab-create'),
    path('lab-by-id/', LaboratorioByIDView.as_view(), name='lab-by-id'),
    path('lab-delete/', LaboratorioDeleteView.as_view(), name='lab-delete'),
    path('lab-update/<int:pk>/', LaboratorioUpdateView.as_view(), name='lab-update'),

    path('disp-list/', DispositivosListView.as_view(), name='disp-list'),
    path('disp-by-lecc/', DispositivosByLeccView.as_view(), name='disp-by-lecc'),
    path('disp-by-id/', DispositivosByIDView.as_view(), name='disp-by-id'),
    path('disp-delete/', DispositivosDeleteView.as_view(), name='disp-delete'),
    path('disp-update/<int:pk>/', DispositivosUpdateView.as_view(), name='disp-update'),
    path('disp-create/', DispositivosCreateView.as_view(), name='disp-create'),
    
    path('soft-delete/<int:id_software>/', SoftwareDeleteView.as_view(), name='soft-delete'),
    path('soft-by-disp/', SoftwaresByDispositivosView.as_view(), name='soft-by-disp'),
    path('soft-create/', SoftwareCreateView.as_view(), name='soft-create'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
