from rest_framework import serializers

from widget.models import Widget


class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = "__all__"

    # attentions = serializers.StringRelatedField(many=True)
    #
    # class Meta:
    #     model = User
    #     fields = ["id", "attentions"]
