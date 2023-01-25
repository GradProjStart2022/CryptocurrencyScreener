from django.urls import path, re_path, include
from users import views

urlpatterns = [path("example", views.example, name="example")]
