from django.db import models
from django.utils import timezone

from filter.models import Filter
from users.models import User

# Create your models here.
class Alarm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alarms")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now())
