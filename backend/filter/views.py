import json

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from filter.models import Filter, Setting
from filter.serializers import FilterSerializer, SettingSerializer, RecommendSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.db.models import Count

from users.models import User


class FilterViewSet(ModelViewSet):
    """
    Filter DB CRUD API
    """

    queryset = Filter.objects.all()
    serializer_class = FilterSerializer

    def list(self, request, *args, **kwargs):
        """
        이메일로 사용자의 필터들을 조회하는 API
        @param request:
        @param args:
        @param kwargs:
        @return: FilterSerializer 참고
        """
        email = request.GET.get("email")

        try:
            qs = Filter.objects.filter(user__email=email)
        except Filter.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist Email"})
        serializer = FilterSerializer(qs, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        user pk로 필터를 저장하는 API
        @param serializer:
        @return:
        """
        user_id = self.request.POST.get("user_id")
        serializer.save(user_id=user_id)
        # name = self.request.POST.get("name")
        # serializer.save(user=User.objects.get(user_id=user_id), name=name)
        return super().perform_create(serializer)


class SettingViewSet(ModelViewSet):
    """
    단위필터 API
    """

    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

    def list(self, request, *args, **kwargs):
        """
        다수의 단위필터를 반환하는 API
        filter pk를 필요
        @param request: filter pk
        @param args:
        @param kwargs:
        @return: SettingSerializer 참고
        """
        try:
            qs = Setting.objects.filter(filter_id=self.kwargs["filter_pk"])
        except Setting.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist filter"})
        serializer = SettingSerializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        단위필터를 저장하는 API
        @param request:
        @param args:
        @param kwargs:
        @return:
        """
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
        """
        다수의 단위필터를 저장하는 API
        @param request:
        @param args:
        @param kwargs:
        @return:
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(
            instance=queryset, data=request.data, many=True, partial=True
        )  # add "partial=True"
        valid = serializer.is_valid(raise_exception=True)
        # logger.error(serializer.validated_data)
        self.perform_update(serializer)
        return Response(serializer.data)


@api_view(["GET"])
def top5(request):
    """
    모든 유저가 가장 많이 사용하는 기술지표 5가지를 반환하는 API
    @param request:
    @return:
    """
    # top_five = Setting.objects.annotate(num_indicator=Count("indicator")).order_by(
    #     "-num_indicator"
    # )[:5]
    #
    # for setting in top_five:
    #     print(setting.indicator, setting.num_indicator)

    top_five = (
        Setting.objects.values("indicator")
        .annotate(count=Count("indicator"))
        .order_by("-count")[:5]
    )

    data = {"top_five": list(top_five)}

    return JsonResponse(data)

    # for setting in top_five:
    #     print(setting["indicator"], setting["count"])
    #
    # serializer = RecommendSerializer(top_five, many=True)
    #
    # return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def recommend(request):
    """
    함께 사용된 기술지표를 추천하는 API
    @param request: ex {"indicators": ["RSI", "BB"]}
    @return:
    """
    # data = {"indicators": ["RSI", "BB"]}
    # indicators = data["indicators"]
    json_data = json.loads(request.body)
    indicators = json_data["indicators"]

    q = (
        Filter.objects.prefetch_related("settings")
        .all()
        .filter(settings__indicator__in=indicators)
        .distinct()
    )

    # q = Filter.objects.prefetch_related("settings").get(pk=1)

    # return JsonResponse({})

    count = dict()

    # print("filter name : ", q.expression)
    # for setting in q.settings.all():
    #     print("indicator : ", setting.indicator)

    # for obj in q:
    #     print("filter name : ", obj.name)
    #     for setting in obj.settings.all():
    #         print("indicator : ", setting.indicator)

    for obj in q:
        for setting in obj.settings.all():
            if setting.indicator not in indicators:
                count[setting.indicator] = count.get(setting.indicator, 0) + 1

    if not count:
        return JsonResponse(
            {"message": "Error! No matching indicators found."}, status=404
        )
    else:
        return JsonResponse(count)
