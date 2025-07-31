# python_services/ai_handler/api/urls.py

from django.urls import path
from .views import BackgroundRemovalView, DocumentSummarizerView, GrammarCheckerView

urlpatterns = [
    path('remove-background/', BackgroundRemovalView.as_view(), name='remove-background'),
    path('summarize-document/', DocumentSummarizerView.as_view(), name='summarize-document'),
    path('check-grammar/', GrammarCheckerView.as_view(), name='check-grammar'),
    path('transcribe-audio/', AudioTranscriptionView.as_view(), name='transcribe-audio'),
]