from datetime import datetime

from django.db import models

from users.models import User

# Create your models here.
class Alarm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alarms")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    create_at = models.DateTimeField(default=datetime.now())
