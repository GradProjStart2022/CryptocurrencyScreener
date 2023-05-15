from django.db import models
from users.models import User


# TODO alarm이 True로 생성되거나, 변경될때 Previous 저장해야함
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
