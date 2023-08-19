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
    """
    User Table 중 일부를 JSON으로 변환
    """

    class Meta:
        model = User
        fields = ["id", "email"]


class AttentionSerializer(serializers.ModelSerializer):
    """
    관심종목 Table 중 일부를 JSON으로 변환
    """

    class Meta:
        model = Attention
        fields = ["id", "user", "cryptoname", "symbol"]

    # attentions = serializers.StringRelatedField(many=True)
    #
    # class Meta:
    #     model = User
    #     fields = ["id", "attentions"]


class TelegramSerializer(serializers.ModelSerializer):
    """
    텔레그램 Table을 JSON으로 변환
    """

    class Meta:
        model = Telegram
        fields = "__all__"
