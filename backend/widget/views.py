import urllib.parse

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from widget.models import Widget
from rest_framework import generics
import csv

from widget.serializers import WidgetSerializer


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


@api_view(["GET"])
def list(request):
    search = request.GET.get("s")
    q = Widget.objects.all()
    try:
        if search == "all":
            pass
        elif search.encode().isalpha():
            print(search.isalpha())
            q = Widget.objects.filter(name_en=search)
        else:
            q = Widget.objects.filter(name_kr=search)
        serializer = WidgetSerializer(q, many=True)
        return Response(serializer.data)
    except Widget.DoesNotExist:
        return JsonResponse({"err_msg": "DoesNotExist Widget"})
