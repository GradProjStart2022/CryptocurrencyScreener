from filter.models import Filter, Setting
from rest_framework import serializers


class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ["id", "name", "expression", "alarm", "time"]


class SettingListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # instance is the queryset of objects to update
        # validated_data is the data to update with
        # You can loop through the data to update each object individually
        # for i, obj in enumerate(instance):
        #     serializer = self.child(instance=obj, data=validated_data[i], partial=True)
        #     if serializer.is_valid():
        #         serializer.save()
        # return instance

        instance_hash = {index: i for index, i in enumerate(instance)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        return result


class SettingSerializer(serializers.ModelSerializer):
    filter = FilterSerializer(read_only=True)

    class Meta:
        model = Setting
        fields = ["id", "filter", "name", "sign", "indicator", "value1", "value2"]
        list_serializer_class = SettingListSerializer


# [
#   {
#         "name": "B",
#         "sign": "low",
#         "indicator": "BB",
#         "value1": 64326,
#         "value2": null
#     },
#     {
#         "name": "A",
#         "sign": "equal",
#         "indicator": "RSI",
#         "value1": 12354,
#         "value2": null
#     }
# ]


class RecommendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ["indicator"]
