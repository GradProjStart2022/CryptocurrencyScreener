from django.db import models

# Create your models here.
from users.models import User


class Filter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filters")
    name = models.CharField(max_length=100)

    # 최대 10개 저장
    def save(self, *args, **kwargs):
        if Filter.objects.filter(user=self.user).count() == 10:
            return
        else:
            super(Filter, self).save(*args, **kwargs)


class Setting(models.Model):
    filter = models.ForeignKey(
        Filter, on_delete=models.CASCADE, related_name="settings"
    )
    name = models.CharField(max_length=100)
    sign = models.CharField(max_length=100)
    value1 = models.BigIntegerField(null=True)
    value2 = models.BigIntegerField(null=True)
