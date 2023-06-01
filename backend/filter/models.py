from datetime import datetime, timedelta
from typing import List

from django.db import models
from django.db.models import Q

from price.models import Price30m, Price60m, Price240m, Price1d
from users.models import User


class Filter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filters")
    name = models.CharField(max_length=100)
    alarm = models.BooleanField(default=False)
    expression = models.CharField(max_length=100, null=True)
    time = models.BigIntegerField(null=True)

    # 최대 10개 저장
    def save(self, *args, **kwargs):
        # TODO 순환오류 해결 필요 create_query
        if self.alarm:
            previous = Previous(
                filter_id=self.id,
                old_data=str(create_query(self.id, "30m", 30)),
            )
            previous.save()
        if Filter.objects.filter(user=self.user).count() == 10:
            return
        else:
            super(Filter, self).save(*args, **kwargs)


class Setting(models.Model):
    filter = models.ForeignKey(
        Filter, on_delete=models.CASCADE, related_name="settings"
    )
    name = models.CharField(max_length=100)  # 이름 A,B,C,D
    sign = models.CharField(max_length=100)  # 부등호
    # TODO default 삭제
    indicator = models.CharField(max_length=100)  # RSI지표 ...
    # TODO null 버그 고쳐야함
    value1 = models.BigIntegerField(null=True)
    value2 = models.BigIntegerField(null=True)


class Previous(models.Model):
    filter = models.OneToOneField(
        Filter, on_delete=models.CASCADE, related_name="previous"
    )
    old_data = models.CharField(max_length=1000)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        Previous.objects.get(filter_id=self.filter_id).delete()
        super().save(force_insert, force_update, using, update_fields)


def create_query(filter_pk: int, table: str, range: int) -> List[str]:
    q = Filter.objects.prefetch_related("settings").get(pk=filter_pk)
    query_dict = dict()
    for setting in q.settings.all():
        query_dict[setting.name] = create_Q(setting)

    logic = create_logic(q.expression)
    q_obj = parse_expression(logic, query_dict)
    date_range = (
        datetime.now() - timedelta(days=range)
        if range
        else datetime.now() - timedelta(days=90)
    )

    # filtered_data = (
    #     ScreeningTest.objects.filter(q_obj)
    #     .values_list("symbol__symbol_id", flat=True)
    #     .distinct()
    # )

    if table == "30m":
        filtered_data = (
            Price30m.objects.filter(timestamp__gte=date_range)
            .filter(q_obj)
            .values_list("symbol__symbol_id", flat=True)
            .distinct()
        )
    elif table == "60m":
        filtered_data = (
            Price60m.objects.filter(timestamp__gte=date_range)
            .filter(q_obj)
            .values_list("symbol__symbol_id", flat=True)
            .distinct()
        )
    elif table == "240m":
        filtered_data = (
            Price240m.objects.filter(timestamp__gte=date_range)
            .filter(q_obj)
            .values_list("symbol__symbol_id", flat=True)
            .distinct()
        )
    elif table == "1d":
        filtered_data = (
            Price1d.objects.filter(timestamp__gte=date_range)
            .filter(q_obj)
            .values_list("symbol__symbol_id", flat=True)
            .distinct()
        )
    else:
        filtered_data = (
            Price240m.objects.filter(timestamp__gte=date_range)
            .filter(q_obj)
            .values_list("symbol__symbol_id", flat=True)
            .distinct()
        )

    filtered_data = list(filtered_data)

    return filtered_data


def create_Q(setting) -> Q:
    switcher = {
        "above": "__gt",
        "above_equal": "__gte",
        "below": "__lt",
        "below_equal": "__lte",
        "equal": "__exact",
        "between": "__range",
        "not_equal": "__ne",
    }
    str = setting.indicator.upper() + switcher[setting.sign]
    if setting.sign == "between":
        return Q(**{f"{str}": (setting.value1, setting.value2)})
    elif setting.sign == "outside":
        q_obj = Q(**{f"{setting.indicator}__lt": setting.value1}) | Q(
            **{f"{setting.indicator}__gt": setting.value2}
        )
        return q_obj
    else:
        return Q(**{str: setting.value1})


def create_logic(expression: str):
    stack = []
    current = []
    for char in expression:
        if char.isalpha():
            current.append(char)
        elif char in ["&", "|"]:
            current.append(char)
        elif char == "(":
            stack.append(current)
            current = []
        elif char == ")":
            if len(stack) > 0:
                stack[-1].append(current)
                current = stack.pop()
        else:
            raise ValueError("Invalid character in expression: {}".format(char))
    if len(stack) > 0:
        raise ValueError("Unmatched parenthesis in expression")
    return current


def parse_expression(expression: str, query_dict):
    if isinstance(expression, str):
        return query_dict[expression]
    if isinstance(expression, list):
        if len(expression) == 1:
            return parse_expression(expression[0], query_dict)
        if len(expression) == 3:
            op1, op, op2 = expression
            if op == "&":
                return parse_expression(op1, query_dict) & parse_expression(
                    op2, query_dict
                )
            if op == "|":
                return parse_expression(op1, query_dict) | parse_expression(
                    op2, query_dict
                )
        if len(expression) == 2:
            return parse_expression(expression[1], query_dict)
        raise ValueError("Invalid expression")
    if isinstance(expression, tuple):
        q_list = [parse_expression(subexp, query_dict) for subexp in expression]
        return q_list[0] & q_list[1]

    # @receiver(post_save, sender=Filter)
    # def Filter_post_save(sender, instance, created, **kwargs):
    #     if created:
    #         if instance.alarm:
    #             previous = Previous(
    #                 filter_id=instance.id,
    #                 old_data=str(create_query(instance.id, "30m", 30)),
    #             )
    #             previous.save()
