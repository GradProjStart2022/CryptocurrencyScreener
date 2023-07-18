from django.db import models

# Create your models here.
class Widget(models.Model):
    name_kr = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    tradingview_market_code = models.CharField(max_length=100)
    tradingview_upbit_code = models.CharField(max_length=100)
    upbit_stock_code = models.CharField(max_length=100)
    unable_marketwidget = models.BooleanField()

    class Meta:
        db_table = "Widget"
