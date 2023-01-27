from django.urls import path, re_path, include
from users import views

urlpatterns = [
    path("example", views.example, name="example"),
    path("kakao/login/", views.kakao_login, name="kakao_login"),
    path("kakao/callback/", views.kakao_callback, name="kakao_callback"),
    path(
        "kakao/login/finish/", views.KakaoLogin.as_view(), name="kakao_login_todjango"
    ),
]
