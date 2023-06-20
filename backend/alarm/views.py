from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from alarm.scheduler import create_alarm
from alarm.serializers import AlarmSerializer


class AlarmView(APIView):
    serializer_class = AlarmSerializer

    def get(self, request, *args, **kwargs):
        user = request.GET.get("id")
        alarms = Alarm.objects.filter(user_id=user).filter(is_read=False)
        serializer = self.serializer_class(alarms, many=True)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        id = request.GET.get("a")
        alarm = Alarm.objects.get(id=id)
        alarm.is_read = True
        alarm.save()
        serializer = self.serializer_class(alarm)
        return Response(serializer.data)


@api_view(["GET"])
def test(request):
    create_alarm(30)
    data = {
        "name": "John Doe",
        "age": 30,
    }
    return JsonResponse(data)
