import requests
from django.db import models
from users.models import User, Telegram
from django.shortcuts import get_object_or_404


# Create your models here.
class Alarm(models.Model):
    """
    Alarm DB 테이블
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alarms")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        """
        알람이 저장될 때 만약에 텔레그램 알람이 활성화 되어있으면 DB에 저장하면서 텔레그램으로 알람 전달
        @param force_insert: override
        @param force_update: override
        @param using: override
        @param update_fields: override
        @return: None
        """
        try:
            telegram = Telegram.objects.get(user=self.user)
            token = telegram.Token
            chat_id = telegram.Chat_Id
            message = self.message
            url = f"https://api.telegram.org/bot{token}/sendMessage?chat_id={chat_id}&text={message}"
            requests.get(url=url)
        except Exception as e:
            pass

        super().save(force_insert, force_update, using, update_fields)

    class Meta:
        db_table = "Alarm"
