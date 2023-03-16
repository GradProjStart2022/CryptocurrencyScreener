from django.urls import path, re_path, include

from widget import views

urlpatterns = [
    path("import-csv/", views.import_csv, name="import_csv"),
    path("search/", views.list),
]
