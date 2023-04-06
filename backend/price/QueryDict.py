from django.db.models import Q
from filter.models import Filter
from price.models import Upbit


def create_query(filter_pk):
    q = Filter.objects.prefetch_related("settings").get(pk=1)
    query_dict = dict()
    for setting in q.setting.all():
        query_dict[setting.name] = create_Q(setting)

    # filter = q.expression
    filter_expression = None
    for expr in q.expression.split("|"):
        query_parts = []
        for query_name in expr.split("&"):
            query_parts.append(query_dict[query_name])
        combined_query = query_parts.pop(0)
        for query_part in query_parts:
            combined_query &= query_part
        if not filter_expression:
            filter_expression = combined_query
        else:
            filter_expression |= combined_query

    # Upbit 모델에서 필터링
    filtered_data = Upbit.objects.filter(filter_expression)

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

    str = setting.indicator + switcher[setting.sign]
    if setting.sign == "between":
        return Q(**{f"{str}": (setting.value1, setting.value2)})
    else:
        return Q(**{str: setting.value1})
