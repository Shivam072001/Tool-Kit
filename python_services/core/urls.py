from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/files/', include('file_handler.api.urls')),
    path('api/v1/ai/', include('ai_handler.urls')),
    path('api/v1/metadata/', include('metadata_handler.urls')),
    path('api/v1/fake-data/', include('fake_data_handler.urls')),
]

# This is crucial for serving uploaded files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)