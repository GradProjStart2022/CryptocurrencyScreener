import urllib.parse

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from widget.models import Widget
from rest_framework import generics
import csv

from widget.serializers import WidgetSerializer


# Create your views here
# TODO 위젯코드 자동화.
def import_csv(request):
    """
    위젯 코드를 넣기 위한 API 함수
    CSV 파일을 이용하여 데이터를 넣는다.
    @param request: widget 코드가 담긴 CSV
    @return: 위젯
    """
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
    """
    위젯코드를 조회하는 API
    all 인 경우 모든 위젯 코드의 정보를 JSON으로 return
    한국어로 조회할 때 영어로 조회할 때를 따로 처리 후 해당 종목만 반환
    @param request:
    @return: Widget 테이블에서 해당되는 컬럼들을 반환
    """
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
