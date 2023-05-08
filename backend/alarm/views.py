from django.shortcuts import render
from rest_framework import mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response

from alarm.models import Alarm
from alarm.serializers import AlarmSerializer


class AlarmView(mixins.ListModelMixin, mixins.UpdateModelMixin):
    serializer_class = AlarmSerializer

    def list(self, request, *args, **kwargs):
        user = request.GET.get("id")
        alarms = Alarm.objects.filter(user_id=user).filter(is_read=False)
        serializer = self.serializer_class(alarms, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        id = request.GET.get("id")
        alarm = Alarm.objects.get(id=id)
        alarm.is_read = True
        alarm.save()
        return super().partial_update(request, *args, **kwargs)
