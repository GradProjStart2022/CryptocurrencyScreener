from rest_framework import serializers
from price.models import Symbol, Price60m, Price30m, Price240m, Price1d


class PriceSerializer30m(serializers.ModelSerializer):
    class Meta:
        model = Price30m
        fields = ["symbol_id", "timestamp", "OPEN", "CLOSE", "HIGH", "LOW", "VOLUME"]


class SymbolSerializer(serializers.ModelSerializer):
    price = PriceSerializer30m(read_only=True)

    class Meta:
        model = Symbol
        fields = ["name_kr", "name_en", "symbol_id", "ticker", "price"]


class PriceSerializer60m(serializers.ModelSerializer):
    class Meta:
        model = Price60m
        fields = "__all__"


class PriceSerializer240m(serializers.ModelSerializer):
    class Meta:
        model = Price240m
        fields = "__all__"


class PriceSerializer1d(serializers.ModelSerializer):
    class Meta:
        model = Price1d
        fields = "__all__"
