import requests
from django.db import models
from users.models import User, Telegram
from django.shortcuts import get_object_or_404


# Create your models here.
class Alarm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="alarms")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
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
