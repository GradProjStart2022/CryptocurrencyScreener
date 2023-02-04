from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from users import views

router = DefaultRouter()
router.register("attention", views.AttentionViewSet)
# router.register("user", views.UserViewSet)


urlpatterns = [
    path("example", views.example, name="example"),
    path("kakao/login/", views.kakao_login, name="kakao_login"),
    path("kakao/callback/", views.kakao_callback, name="kakao_callback"),
    path(
        "kakao/login/finish/", views.KakaoLogin.as_view(), name="kakao_login_todjango"
    ),
    path("api/", include(router.urls)),
    path("api/list/", views.list),
]
