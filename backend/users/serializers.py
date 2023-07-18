from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User, Attention, Telegram


class CustomTokenRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate(self, attrs):
        refresh = RefreshToken(attrs["refresh_token"])
        data = {"access_token": str(refresh.access_token)}

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]


class AttentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attention
        fields = ["id", "user", "cryptoname", "symbol"]

    # attentions = serializers.StringRelatedField(many=True)
    #
    # class Meta:
    #     model = User
    #     fields = ["id", "attentions"]


class TelegramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telegram
        fields = "__all__"
