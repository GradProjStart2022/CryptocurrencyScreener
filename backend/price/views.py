import csv
import json
from datetime import datetime

from django.db.models import Max, OuterRef, Subquery, F
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from tqdm import tqdm

from filter.models import create_query
from price.models import Symbol, Price240m, Price30m


@api_view(["GET"])
def screening(request):
    """
    @param request:  filter_pk 필터기본키 table 분봉 테이블 date_range 스크리닝할 날짜단위
    @return: 아래 data 형태의 json 반환
    """
    filter_pk = request.GET.get("id")
    table = request.GET.get("table")  # 30m, 60m, 240m, 1d
    date_range = int(request.GET.get("date_range"))  # 일 수 기준

    try:
        """
        create_query는 스크리닝하는 함수
        결과로 조건을 만족하는 symbol list를 반환
        filtered_symbol을 이용하여 가장 최근 가격 데이터를 가져옴
        """
        filtered_symbol = create_query(filter_pk, table, date_range)
        print(filtered_symbol)

        # prices = Price30m.objects.filter(symbol_id__in=filtered_symbol).filter(
        #     DATE=Subquery(
        #         Price30m.objects.filter(symbol_id=OuterRef("symbol_id"))
        #         .order_by("-DATE")
        #         .values("DATE")[:1]
        #     )
        # )

        result = []

        for pk in filtered_symbol:
            symbol = Symbol.objects.get(id=pk)
            data = {
                "name_kr": symbol.NAME_KR.encode("utf-8").decode("utf-8"),
                "name_en": symbol.NAME_EN,
                "ticker": symbol.TICKER,
                "symbol_id": pk,
                "timestamp": 0,
                "LOW": 0,
                "HIGH": 0,
                "VOLUME": 0,
            }
            result.append(data)

        json_data = json.dumps(result, ensure_ascii=False).encode("utf-8")
    except:
        return JsonResponse({"error": "screening Error"})
    print(json_data)
    return HttpResponse(json_data, content_type="application/json; charset=utf-8")


# def import_symbol(request):
#     if request.method == "POST":
#         csv_file = request.FILES["csv_file"]
#         decoded_file = csv_file.read().decode("utf-8").splitlines()
#         reader = csv.DictReader(decoded_file)
#         # print(reader[0])
#         for row in reader:
#             symbol = Symbol(
#                 symbol_id=row["id"],
#                 NAME_EN=row["name_en"],
#                 NAME_KR=row["name_kr"],
#                 TICKER=row["ticker"],
#             )
#             symbol.save()
#
#         return render(request, "import_symbol.html")
#     return render(request, "import_symbol.html")


# Create your views here.
# def import_data(request):
#     if request.method == "POST":
#         csv_file = request.FILES["csv_file"]
#         decoded_file = csv_file.read().decode("utf-8").splitlines()
#         reader = csv.DictReader(decoded_file)
#         for row in tqdm(reader):
#
#             # symbol = Symbol.objects.get(id=int(row["ID"]))
#             # print(symbol.symbol_id)
#             try:
#                 date_str = row["DATE"]
#                 date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
#                 data = Price240m(
#                     symbol_id=row["ID"],
#                     DATE=date,
#                     OPEN=float(row["OPEN"] or 0),
#                     HIGH=float(row["HIGH"] or 0),
#                     LOW=float(row["LOW"] or 0),
#                     CLOSE=float(row["CLOSE"] or 0),
#                     VOLUME=float(row["VOLUME"] or 0),
#                     MA=float(row["MA"] or 0),
#                     EMA=float(row["EMA"] or 0),
#                     SMA=float(row["SMA"] or 0),
#                     WMA=float(row["WMA"] or 0),
#                     VMA=float(row["VMA"] or 0),
#                     EMAD=float(row["EMAD"] or 0),
#                     WMAD=float(row["WMAD"] or 0),
#                     CMA=float(row["CMA"] or 0),
#                     BB_UPPER=float(row["BB_UPPER"] or 0),
#                     BB_LOWER=float(row["BB_LOWER"] or 0),
#                     MD=float(row["MD"] or 0),
#                     WAVG=float(row["WAVG"] or 0),
#                     EWAVG=float(row["EWAVG"] or 0),
#                     TRIMA=float(row["TRIMA"] or 0),
#                     EWMA=float(row["EWMA"] or 0),
#                     HMA=float(row["HMA"] or 0),
#                     MAA=float(row["MAA"] or 0),
#                     MAG=float(row["MAG"] or 0),
#                     MAR=float(row["MAR"] or 0),
#                     MACD=float(row["MACD"] or 0),
#                     MACD_SIGNAL=float(row["MACD_SIGNAL"] or 0),
#                     ATR=float(row["ATR"] or 0),
#                     RSI=float(row["RSI"] or 0),
#                     SLOWK=float(row["SLOWK"] or 0),
#                     SLOWD=float(row["SLOWD"] or 0),
#                     FASTK=float(row["FASTK"] or 0),
#                     FASTD=float(row["FASTD"] or 0),
#                     WILLIAMS=float(row["WILLIAMS %R"] or 0),
#                     CCI=float(row["CCI"] or 0),
#                     AD=float(row["AD"] or 0),
#                     ADOSC=float(row["ADOSC"] or 0),
#                     EP=float(row["EP"] or 0),
#                     DMI=float(row["DMI"] or 0),
#                     AA=float(row["AA"] or 0),
#                     LR=float(row["LR"] or 0),
#                     MOTM=float(row["MOTM"] or 0),
#                     EM=float(row["EM"] or 0),
#                     WM=float(row["WM"] or 0),
#                     MOM=float(row["MOM"] or 0),
#                     ROC=float(row["ROC"] or 0),
#                     ROCR=float(row["ROCR"] or 0),
#                     ROCP=float(row["ROCP"] or 0),
#                     TEMA=float(row["TEMA"] or 0),
#                     ROCA=float(row["ROCA"] or 0),
#                     PIVOT=float(row["PIVOT"] or 0),
#                     R2=float(row["R2"] or 0),
#                     R1=float(row["R1"] or 0),
#                     S1=float(row["S1"] or 0),
#                     S2=float(row["S2"] or 0),
#                     PDCUP=float(row["PDCUP"] or 0),
#                     PDCDN=float(row["PDCDN"] or 0),
#                     EMAC=float(row["EMAC"] or 0),
#                     WMAC=float(row["WMAC"] or 0),
#                     KAMA=float(row["KAMA"] or 0),
#                     CMO=float(row["CMO"] or 0),
#                     OBV=float(row["OBV"] or 0),
#                     KVO=float(row["KVO"] or 0),
#                     ECI=float(row["ECI"] or 0),
#                     EMVA=float(row["EMVA"] or 0),
#                     QSTICK=float(row["QSTICK"] or 0),
#                     STC=float(row["STC"] or 0),
#                     ULTOSC=float(row["ULTOSC"] or 0),
#                     DCUP=float(row["DCUP"] or 0),
#                     DCDN=float(row["DCDN"] or 0),
#                     DCMI=float(row["DCMI"] or 0),
#                     MCDHST=float(row["MCDHST"] or 0),
#                     CMF=float(row["CMF"] or 0),
#                     AP=float(row["AP"] or 0),
#                     ES=float(row["ES"] or 0),
#                     EMAROC=float(row["EMAROC"] or 0),
#                     KSTO=float(row["KSTO"] or 0),
#                     KER=float(row["KER"] or 0),
#                     LRI=float(row["LRI"] or 0),
#                     LRS=float(row["LRS"] or 0),
#                     SD=float(row["SD"] or 0),
#                     SND=float(row["SND"] or 0),
#                     VAR=float(row["VAR"] or 0),
#                     COV=float(row["COV"] or 0),
#                     KURTS=float(row["KURTS"] or 0),
#                     SKNS=float(row["SKNS"] or 0),
#                     STEM=float(row["STEM"] or 0),
#                     VR=float(row["VR"] or 0),
#                 )
#
#                 data.save()
#             except Exception as e:
#                 print()
#                 print(e)
#                 print(row)
#                 print("에러발생")
#
#         return render(request, "import_data.html")
#     return render(request, "import_data.html")
