from django.urls import path, re_path, include
from widget.views import import_csv

urlpatterns = [
    path("import-csv/", import_csv, name="import_csv"),
]
