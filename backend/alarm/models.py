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


class Previous(models.Model):
    filter = models.ForeignKey(
        Filter, on_delete=models.CASCADE, related_name="previouses"
    )
    old_data = models.CharField(max_length=1000)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        Previous.objects.get(filter_id=self.filter_id).delete()
        super().save(force_insert, force_update, using, update_fields)
