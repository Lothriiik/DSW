from django.urls import path
from django.urls import path
from .views import  (ObservacaoListCreateView, ObservacaoDetailView,
                     ObservacaoByDispView)

from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    

    path('observacoes/', ObservacaoListCreateView.as_view(), name='obs-list-create'),         
    path('observacoes/<int:pk>/', ObservacaoDetailView.as_view(), name='obs-detail'), 
    path('dispositivos/<int:id_dispositivo>/observacoes/', ObservacaoByDispView.as_view(), name='obs-by-disp'), 

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
