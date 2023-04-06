from rest_framework import serializers

from price.models import Upbit


class UpbitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upbit
        fields = ["name_kr", "name_en", "symbol_id", "ticker"]
