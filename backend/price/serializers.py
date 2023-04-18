from rest_framework import serializers
from price.models import Upbit, Symbol, ScreeningTest, SymbolTest

# TODO model명 변경
class PriceSerializer30m(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTest
        fields = ["symbol_id", "timestamp" "OPEN", "CLOSE", "HIGH", "LOW", "VOLUME"]


class SymbolSerializer(serializers.ModelSerializer):
    price = PriceSerializer30m(read_only=True)

    class Meta:
        model = SymbolTest
        fields = ["name_kr", "name_en", "symbol_id", "ticker", "price"]


class PriceSerializer60m(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTest
        fields = "__all__"


class PriceSerializer240m(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTest
        fields = "__all__"


class PriceSerializer1d(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTest
        fields = "__all__"


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTest
        fields = "__all__"
