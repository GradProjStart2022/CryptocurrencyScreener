from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from filter.models import Filter, Setting
from filter.serializers import FilterSerializer, SettingSerializer
from rest_framework.response import Response
from rest_framework import status


class FilterViewSet(ModelViewSet):
    queryset = Filter.objects.all()
    serializer_class = FilterSerializer

    def list(self, request, *args, **kwargs):
        email = request.GET.get("email")

        try:
            qs = Filter.objects.filter(user__email=email)
        except Filter.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist Email"})
        serializer = FilterSerializer(qs, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = self.request.user
        name = self.request.POST.get("name")
        serializer.save(user=user, name=name)
        return super().perform_create(serializer)


class SettingViewSet(ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

    def list(self, request, *args, **kwargs):
        try:
            qs = Setting.objects.filter(filter_id=self.kwargs["filter_pk"])
        except Setting.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist filter"})
        serializer = SettingSerializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
        # serializer = self.get_serializer(
        #     data=request.data, many=isinstance(request.data, list)
        # )
        # serializer.is_vaild(raise_exception=True)
        # self.perform_create(serializer)
        # headers = self.get_success_headers(serializer.data)
        # return Response(
        #     serializer.data, status=status.HTTP_201_CREATED, headers=headers
        # )

    def perform_create(self, serializer):
        filter = get_object_or_404(Filter, pk=self.kwargs["filter_pk"])
        serializer.save(filter=filter)
        return super().perform_create(serializer)

    @action(methods=["patch"], detail=False)
    def multi_update(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(
            instance=queryset, data=request.data, many=True, partial=True
        )  # add "partial=True"
        valid = serializer.is_valid(raise_exception=True)
        # logger.error(serializer.validated_data)
        self.perform_update(serializer)
        return Response(serializer.data)
