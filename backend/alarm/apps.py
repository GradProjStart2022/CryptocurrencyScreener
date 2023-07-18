from django.apps import AppConfig


class AlarmConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "alarm"

    def ready(self):
        from .scheduler import start_scheduler

        start_scheduler()
