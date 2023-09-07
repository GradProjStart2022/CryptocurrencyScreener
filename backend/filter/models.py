from datetime import datetime, timedelta
from typing import List

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import Q
import re

from django.shortcuts import get_object_or_404

from price.models import Price30m, Price60m, Price240m, Price1d
from users.models import User


class Filter(models.Model):
    """
    합성필터
    Filter DB Table
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filters")
    name = models.CharField(max_length=100)
    alarm = models.BooleanField(default=False)
    expression = models.CharField(max_length=100, null=True)
    time = models.BigIntegerField(null=True)

    def save(self, *args, **kwargs):
        """
        필터가 저장될 떄 알람이 활성화 되어있으면 스크리닝 결과 저장 및 필터가 최대 10개인지 체크하고 저장
        @param args:
        @param kwargs:
        @return:
        """
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

    class Meta:
        db_table = "Filter"


class Setting(models.Model):
    """
    단위필터
    Setting DB Table
    """

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

    class Meta:
        db_table = "Setting"


class Previous(models.Model):
    """
    이전 스크리닝 결과를 저장하는 테이블
    새로 최신화 할때마다 이전에 있었던 결과를 삭제
    Previous DB 테이블
    """

    filter = models.OneToOneField(
        Filter, on_delete=models.CASCADE, related_name="previous"
    )
    old_data = models.CharField(max_length=1000)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        try:
            Previous.objects.get(filter_id=self.filter_id).delete()
        except ObjectDoesNotExist:
            pass
        super().save(force_insert, force_update, using, update_fields)

    class Meta:
        db_table = "Previous"


def create_query(filter_pk: int, table: str, range: int) -> List[str]:
    """
    @param filter_pk: 필터 기본키
    @param table: 분봉 테이블
    @param range: 스크리닝 날짜 단위 (현재 날짜부터 뺀 날자 까지)
    @return: 조건을 만족하는 symbol 기본키 리스트
    """

    q = Filter.objects.prefetch_related("settings").get(
        pk=filter_pk
    )  # 스크리닝에 필요한 정보를 가져옴
    query_dict = dict()  # 조건식 알파벳에 해당하는 설정 값을 저장하는 딕셔너리
    for setting in q.settings.all():
        query_dict[setting.name] = create_Q(setting)  # 알파벳 이름에 맞게 장고 Q모델을 저장

    logic = create_logic(
        q.expression
    )  # 표현식을 검사하면서 문자열을 분해하여  ['A', '&', 'B', '&', 'C'] 같은 형태로 저장
    q_obj = parse_expression(logic, query_dict)  # 장고 Q 모델 조합
    print(q_obj)

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
    try:
        """
        조합된 장고 Q모델을 사용하여 해당 분봉 테이블에 맞게 스크리닝
        """
        if table == "30m":
            filtered_data = (
                Price30m.objects.filter(DATE__gte=date_range)
                .filter(q_obj)
                .values_list("symbol__id", flat=True)
                .distinct()
            )
        elif table == "60m":
            filtered_data = (
                Price60m.objects.filter(DATE__gte=date_range)
                .filter(q_obj)
                .values_list("symbol__id", flat=True)
                .distinct()
            )
        elif table == "240m":
            filtered_data = (
                Price240m.objects.filter(DATE__gte=date_range)
                .filter(q_obj)
                .values_list("symbol__id", flat=True)
                .distinct()
            )
        elif table == "1d":
            filtered_data = (
                Price1d.objects.filter(DATE__gte=date_range)
                .filter(q_obj)
                .values_list("symbol__id", flat=True)
                .distinct()
            )
        else:
            filtered_data = (
                Price240m.objects.filter(DATE__gte=date_range)
                .filter(q_obj)
                .values_list("symbol__id", flat=True)
                .distinct()
            )
    except Exception as e:
        print(e)

    filtered_data = list(filtered_data)

    return filtered_data


def create_Q(setting) -> Q:
    """
    장고 Q모델로 전환하는 함수
    해당하는 기호에 맞게 장고 Q 모델을 반환
    @param setting: 해당 DB 데이터
    @return: 장고 Q모델
    """

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
    """
    표현식을 검사하는 동시에 문자열을 분해하여  ['A', '&', 'B', '&', 'C']같은 형태로 만드는 함수
    @param expression: 표현식 문자열 ex) A&B&C, (A&B)|(C&D)
    @return: ['A', '&', 'B', '&', 'C']같은 형태의 리스트
    """

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
    """
    분해되어 있는 표현식을 이용하여 하나의 장고 Q모델로 반환하는함수
    재귀함수로 처리하여 괄호 안쪽부터 먼저 조합
    표현식의 길이에 따라서 처리하는 것이 서로 다름
    @param expression: ['A', '&', 'B', '&', 'C']같은 형태의 리스트
    @param query_dict: A,B,C,D... 등의 알파벳에 장고 Q모델이 저장된 딕셔너리
    @return: 장고 Q모델이 조합된 결과물
    """
    if isinstance(expression, str):
        return query_dict[expression]
    if isinstance(expression, list):
        print(expression)
        print(len(expression))
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
        if len(expression) > 3:  # 'A&B&C&D&E&F' 'A|B|C|D|E' 'A&B&C&D' 'A&B&C' 처리
            print(1)
            result = query_dict[expression[0]]

            for i in range(1, len(expression), 2):
                if expression[i] == "&":
                    result &= query_dict[expression[i + 1]]
                elif expression[i] == "|":
                    result |= query_dict[expression[i + 1]]

            return result

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
