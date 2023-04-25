from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from price import views


urlpatterns = [
    path("import_data/", views.import_data, name="import_data"),
    path("import_symbol/", views.import_symbol, name="import_symbol"),
    path("screening/", views.screening, name="screening"),
    path("prices/", views.prices, name="prices"),
]
