from django.db.models import Q
from filter.models import Filter
from price.models import Upbit, ScreeningTest


def create_query(filter_pk, time):
    q = Filter.objects.prefetch_related("settings").get(pk=filter_pk)
    query_dict = dict()
    for setting in q.settings.all():
        query_dict[setting.name] = create_Q(setting)

    logic = create_logic(q.expression)
    q_obj = parse_expression(logic, query_dict)
    filtered_data = (
        ScreeningTest.objects.filter(q_obj)
        .values_list("symbol__symbol_id", flat=True)
        .distinct()
    )
    filtered_data = list(filtered_data)

    # TODO 시간 설정
    # if time == "30m":
    #     filtered_data = Upbit.objects.filter(filter_expression).distinct("symbol_id")
    # elif time == "60m":
    #     filtered_data = Upbit.objects.filter(filter_expression).distinct("symbol_id")
    # elif time == "240m":
    #     filtered_data = Upbit.objects.filter(filter_expression).distinct("symbol_id")
    # elif time == "1d":
    #     filtered_data = Upbit.objects.filter(filter_expression).distinct("symbol_id")
    # else:
    #     filtered_data = Upbit.objects.filter(filter_expression).distinct("symbol_id")

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
    # TODO upper 붙여야함
    str = setting.indicator + switcher[setting.sign]
    if setting.sign == "between":
        return Q(**{f"{str}": (setting.value1, setting.value2)})
    else:
        return Q(**{str: setting.value1})


def create_logic(expression):
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


def parse_expression(expression, query_dict):
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
