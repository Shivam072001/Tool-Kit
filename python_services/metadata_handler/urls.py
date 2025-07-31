# python_services/metadata_handler/urls.py

from django.urls import path
from .views import MetadataExtractorView

urlpatterns = [
    path('extract/', MetadataExtractorView.as_view(), name='extract-metadata'),
]