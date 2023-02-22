from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from filter import views

router = DefaultRouter()
router.register("filter", views.FilterViewSet)
router.register(r"filter/(?P<filter_pk>\d+)/settings", views.SettingViewSet)
# router.register("user", views.UserViewSet)


urlpatterns = [
    path("api/", include(router.urls)),
]
