from datetime import datetime, timedelta
from typing import List

from django.db.models import Q

from alarm.models import Previous
from filter.models import Filter
from price.models import Price30m, Price60m, Price240m, Price1d


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

    # TODO 시간 설정
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
