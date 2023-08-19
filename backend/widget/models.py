from django.db import models

# Create your models here.
class Widget(models.Model):
    """
    프론트에서 사용되는 검색창을 위해서 트레이딩뷰에서 사용되는 위젯 코드들을 저장하여 제공하는 DB 테이블
    """

    name_kr = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    tradingview_market_code = models.CharField(max_length=100)
    tradingview_upbit_code = models.CharField(max_length=100)
    upbit_stock_code = models.CharField(max_length=100)
    unable_marketwidget = models.BooleanField()

    class Meta:
        db_table = "Widget"
