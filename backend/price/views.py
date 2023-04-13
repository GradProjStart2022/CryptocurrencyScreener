import csv

from django.shortcuts import render
from price.models import ScreeningTest, Symbol, SymbolTest


def import_symbol(request):
    if request.method == "POST":
        csv_file = request.FILES["csv_file"]
        decoded_file = csv_file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            symbol = SymbolTest(
                symbol_id=row["id"],
                name_en=row["name_en"],
                name_kr=row["name_kr"],
                ticker=row["ticker"],
            )
            symbol.save()

        return render(request, "import_symbol.html")
    return render(request, "import_symbol.html")


# Create your views here.
def import_data(request):
    if request.method == "POST":
        csv_file = request.FILES["csv_file"]
        decoded_file = csv_file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            data = ScreeningTest(
                symbol_id=4004,
                timestamp=None,
                OPEN=float(row["open"]),
                CLOSE=float(row["close"]),
                HIGH=float(row["high"]),
                LOW=float(row["low"]),
                VOLUME=float(row["volume"]),
                ma=row["ma"] if row.get("ma") else 0,
                rsi=row["rsi"] if row.get("rsi") else 0,
                macd=row["macd"] if row.get("macd") else 0,
                macdsignal=row["macdsignal"] if row.get("macdsignal") else 0,
                BB_upper=row["BB_upper"] if row.get("BB_upper") else 0,
                BB_lower=row["BB_lower"] if row.get("BB_lower") else 0,
            )

            data.save()

        return render(request, "import_data.html")
    return render(request, "import_data.html")
