from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from alarm.models import Previous
from price.QueryDict import create_query
from users.models import User


class Filter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filters")
    name = models.CharField(max_length=100)
    alarm = models.BooleanField(default=False)
    expression = models.CharField(max_length=100, null=True)
    time = models.BigIntegerField(null=True)

    # 최대 10개 저장
    def save(self, *args, **kwargs):
        if Filter.objects.filter(user=self.user).count() == 10:
            return
        else:
            super(Filter, self).save(*args, **kwargs)


# Filter save메소드 트리거
@receiver(post_save, sender=Filter)
def Filter_post_save(sender, instance, created, **kwargs):
    if created:
        if instance.alarm:
            previous = Previous(
                filter_id=instance.id,
                old_data=str(create_query(instance.id, "30m", 30)),
            )
            previous.save()


class Setting(models.Model):
    filter = models.ForeignKey(
        Filter, on_delete=models.CASCADE, related_name="settings"
    )
    name = models.CharField(max_length=100)  # 이름 A,B,C,D
    sign = models.CharField(max_length=100)  # 부등호
    # TODO default 삭제
    indicator = models.CharField(max_length=100)  # RSI지표 ...
    # TODO null 버그 고쳐야함
    value1 = models.BigIntegerField(null=True)
    value2 = models.BigIntegerField(null=True)
