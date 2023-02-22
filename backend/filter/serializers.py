from rest_framework import serializers
from filter.models import Filter, Setting


class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ["id", "name"]


class SettingSerializer(serializers.ModelSerializer):
    filter = FilterSerializer(read_only=True)

    class Meta:
        model = Setting
        fields = ["id", "filter", "name", "sign", "value1", "value2"]
