from django.urls import path, re_path, include


from alarm import views


urlpatterns = [
    path("", views.AlarmView.as_view()),
]
