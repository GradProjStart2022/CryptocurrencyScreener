from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.


class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    User DB Table
    """

    username = None
    # nickname = models.CharField(max_length=128, null=True, verbose_name="닉네임")
    email = models.EmailField(max_length=255, unique=True, verbose_name="사용자 이메일")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        db_table = "User"


class Attention(models.Model):
    """
    관심종목 DB Table
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attentions")
    cryptoname = models.CharField(max_length=100)
    symbol = models.CharField(max_length=100)

    def __str__(self):
        field_values = []
        for field in self._meta.get_fields():
            field_values.append(str(getattr(self, field.name, "")))
        return " ".join(field_values)

    def save(self, *args, **kwargs):
        """
        DB에 저장될 떄 최대 3개인지 체크하여 가장 먼저 저장된 것 부터 삭제
        @param args:
        @param kwargs:
        @return:
        """
        if Attention.objects.filter(user=self.user).count() == 3:
            objects_filter = Attention.objects.filter(user=self.user)
            objects_filter[0].delete()

        super(Attention, self).save(*args, **kwargs)

    class Meta:
        db_table = "Attention"


class Telegram(models.Model):
    """
    텔레그램 API에 사용되는 정보들을 저장하는 Table
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    Token = models.CharField(max_length=255, unique=True)
    Chat_Id = models.CharField(max_length=255)

    class Meta:
        db_table = "Telegram"
