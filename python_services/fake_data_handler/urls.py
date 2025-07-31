# python_services/fake_data_handler/urls.py

from django.urls import path
from .views import FakeDataGeneratorView

urlpatterns = [
    path('generate/', FakeDataGeneratorView.as_view(), name='generate-fake-data'),
]