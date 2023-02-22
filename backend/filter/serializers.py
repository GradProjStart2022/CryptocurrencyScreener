from rest_framework import serializers
from filter.models import Filter, Setting


class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ["id", "name"]


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ["name", "sign", "value1", "value2"]
