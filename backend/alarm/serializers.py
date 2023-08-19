from rest_framework import serializers

from alarm.models import Alarm


class AlarmSerializer(serializers.ModelSerializer):
    """
    Alarm DB To JSON
    """

    class Meta:
        model = Alarm
        fields = "__all__"
