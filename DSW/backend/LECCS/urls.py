from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/laboratorios/', include('laboratorios.urls')),
    path('api/problemas/', include('problemas.urls')),
    path('api/auth/', include('loginauth.urls')),
    
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
