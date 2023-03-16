from rest_framework import serializers

from widget.models import Widget


class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = [
            "name_kr",
            "name_en",
            "tradingview_market_code",
            "tradingview_upbit_code",
            "upbit_stock_code",
            "unable_marketwidget",
        ]

    # attentions = serializers.StringRelatedField(many=True)
    #
    # class Meta:
    #     model = User
    #     fields = ["id", "attentions"]
