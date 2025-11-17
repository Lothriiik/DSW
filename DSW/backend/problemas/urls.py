from django.urls import path
from .views import  (ObservacaoListView, ObservacaoCreateView, ObservacaoByIDView,
                     ObservacaoByDispView, ObservacaoDeleteView, ObservacaoUpdateView)

from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    
    path('obs-list/', ObservacaoListView.as_view(), name='obs-list'),
    path('obs-create/', ObservacaoCreateView.as_view(), name='obs-create'),
    path('obs-by-id/', ObservacaoByIDView.as_view(), name='obs-by-id'),
    path('obs-by-disp/', ObservacaoByDispView.as_view(), name='obs-by-disp'),
    path('obs-delete/', ObservacaoDeleteView.as_view(), name='obs-delete'),
    path('obs-update/<int:pk>/', ObservacaoUpdateView.as_view(), name='obs-update'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
