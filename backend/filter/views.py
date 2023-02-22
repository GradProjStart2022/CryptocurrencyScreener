from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from filter.models import Filter, Setting
from filter.serializers import FilterSerializer, SettingSerializer
from rest_framework.response import Response


class FilterViewSet(ModelViewSet):
    queryset = Filter.objects.all()
    serializer_class = FilterSerializer

    def list(self, request, *args, **kwargs):
        email = request.Get.get("email")

        try:
            qs = Filter.objects.filter(user__email=email)
        except Filter.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist Email"})
        serializer = FilterSerializer(qs, many=True)
        return Response(serializer.data)


class SettingViewSet(ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

    def list(self, request, *args, **kwargs):
        id = request.Get.get("id")
        try:
            qs = Setting.objects.filter(filter_id=id)
        except Setting.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist filter"})
        serializer = SettingSerializer(qs, many=True)
        return Response(serializer.data)
