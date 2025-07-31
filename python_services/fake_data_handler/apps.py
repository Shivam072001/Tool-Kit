from django.apps import AppConfig


class FakeDataHandlerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'fake_data_handler'
