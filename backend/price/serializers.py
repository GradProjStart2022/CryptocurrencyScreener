from rest_framework import serializers
from price.models import Symbol, Price60m, Price30m, Price240m, Price1d


class PriceSerializer(serializers.Serializer):
    """
    Symbol과 Price 테이블의 내용을 JSON으로 변환하는 클래스
    """

    name_kr = serializers.CharField()
    name_en = serializers.CharField()
    ticker = serializers.CharField()
    symbol_id = serializers.IntegerField()
    timestamp = serializers.DateTimeField()
    LOW = serializers.FloatField()
    HIGH = serializers.FloatField()
    VOLUME = serializers.FloatField()


class PriceSerializer30m(serializers.ModelSerializer):
    """
    Price30m Table 중 일부를 JSON으로 변환
    """

    class Meta:
        model = Price30m
        fields = ["symbol_id", "DATE", "OPEN", "CLOSE", "HIGH", "LOW", "VOLUME"]


class SymbolSerializer(serializers.ModelSerializer):
    price = PriceSerializer30m(read_only=True)

    class Meta:
        model = Symbol
        fields = ["NAME_KR", "NAME_EN", "id", "TICKER", "price"]


class PriceSerializer60m(serializers.ModelSerializer):
    """
    Price60m Table의 내용을 JSON으로 변환
    """

    class Meta:
        model = Price60m
        fields = "__all__"


class PriceSerializer240m(serializers.ModelSerializer):
    """
    Price240m Table의 내용을 JSON으로 변환
    """

    class Meta:
        model = Price240m
        fields = "__all__"


class PriceSerializer1d(serializers.ModelSerializer):
    """
    Price1d Table의 내용을 JSON으로 변환
    """

    class Meta:
        model = Price1d
        fields = "__all__"
