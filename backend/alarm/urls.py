from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from alarm import views

router = DefaultRouter()
router.register("alarm", views.AlarmView)

urlpatterns = [
    path("/", include(router.urls)),
]
