from django.shortcuts import render
from widget.models import Widget
import csv


# Create your views here.
def import_csv(request):
    if request.method == "POST":
        csv_file = request.FILES["csv_file"]
        decoded_file = csv_file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            flag = False
            if row["unable_marketwidget"] == "TRUE":
                flag = True
            widget = Widget(
                name_kr=row["\ufeffname_kr"],
                name_en=row["name_en"],
                tradingview_market_code=row["tradingview_market_code"],
                tradingview_upbit_code=row["tradingview_upbit_code"],
                upbit_stock_code=row["upbit_stock_code"],
                unable_marketwidget=flag,
            )
            widget.save()

        return render(request, "import_csv.html")
    return render(request, "import_csv.html")
