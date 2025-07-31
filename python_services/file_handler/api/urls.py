# backend-compute/file_handler/urls.py

from django.urls import path
from .views import CompressFileView, TaskStatusView, ConvertFileView

urlpatterns = [
    # Image Compression
    path('compress/', CompressFileView.as_view(), name='file-compress'),

    # File Conversion
    path('convert/', ConvertFileView.as_view(), name='file-convert'),

    # Generic Task Status
    path('status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
]