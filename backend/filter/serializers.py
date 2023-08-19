from filter.models import Filter, Setting
from rest_framework import serializers

from users.models import User


class FilterSerializer(serializers.ModelSerializer):
    """
    Filter DB to JSON
    """

    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Filter
        fields = ["id", "user_id", "name", "expression", "alarm", "time"]

    def create(self, validated_data):
        user_id = validated_data.pop("user_id")
        user = User.objects.get(id=user_id)
        filter_obj = Filter.objects.create(user=user, **validated_data)
        return filter_obj


class SettingListSerializer(serializers.ListSerializer):
    """
    다수의 단위필터를 저장하는 Serializer
    """

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
    """
    Setting DB to JSON
    """

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
    """
    추천하는 기술지표를 JSON으로 반환
    """

    class Meta:
        model = Setting
        fields = ["indicator"]
