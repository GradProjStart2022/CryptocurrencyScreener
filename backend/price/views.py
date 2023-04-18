import csv
import json

from django.db.models import Max, OuterRef, Subquery
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view

from price.QueryDict import create_query
from price.models import ScreeningTest, Symbol, SymbolTest
from price.serializers import PriceSerializer, SymbolSerializer, PriceSerializer30m
from rest_framework.response import Response


@api_view(["GET"])
def screening(request):
    filter_pk = request.GET("id")
    # filter_pk = "3"
    try:
        # TODO 테이블 클래스 변경
        filtered_symbol = create_query(filter_pk, "30m")
        symbols = SymbolTest.objects.filter(symbol_id__in=filtered_symbol)
        serializer = SymbolSerializer(symbols, many=True)
    except:
        return JsonResponse({"error": "Doesnt"})

    # return JsonResponse({})
    return Response(serializer.data)


@api_view(["GET"])
def prices(request):
    json_data = json.loads(request.body)
    symbol_ids = json_data["ids"]
    # symbol_ids = ["4004", "5000"]

    q = (
        ScreeningTest.objects.filter(symbol_id__in=symbol_ids)
        .order_by("symbol_id", "-timestamp")
        .distinct("symbol_id")
    )

    serializer = PriceSerializer30m(q, many=True)
    return Response(serializer.data)


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
