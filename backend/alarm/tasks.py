from typing import Set

from celery import Celery
from celery.schedules import crontab
from django.utils import timezone

from alarm.models import Previous, Alarm
from filter.models import Filter
from price.QueryDict import create_query
from price.models import Symbol

app = Celery("screener")


@app.task
def create_alarm(time):
    filters = Filter.objects.filter(alarm=True).filter(time=int(time))
    ids = list(filters.values_list("id", flat=True))

    for id in ids:
        result = is_different(id)
        if not result:
            alarm = Alarm(
                user_id=Filter.objects.get(id=id).user_id,
                message=result,
                is_read=False,
                created_at=timezone.now(),
            )
            alarm.save()


def is_different(id: int) -> str:
    switcher = {
        "1": "1d",
        "30": "30m",
        "60": "60m",
        "240": "240m",
    }
    filter = Filter.objects.get(id=id)
    table = switcher[filter.time]

    current_lst = create_query(id, table, 30)
    past = Previous.objects.get(filter_id=id)
    past_lst = [int(i.strip) for i in past.old_data[1:-1].split(",")]

    new_symbols = set(current_lst) - set(past_lst)
    missing_symbols = set(past_lst) - set(current_lst)

    changed_num = len(new_symbols) + len(missing_symbols)

    if changed_num == 0:
        return ""
    else:
        Previous(filter_id=id, old_data=current_lst).save()
        return create_message(changed_num, filter.name, new_symbols, missing_symbols)


def create_message(n: int, name: str, new: Set[int], old: Set[int]) -> str:
    new_symbol = list(
        Symbol.objects.filter(symbol_id__in=new).values_list("name_kr", flat=True)
    )
    old_symbol = list(
        Symbol.objects.filter(symbol_id__in=old).values_list("name_kr", flat=True)
    )

    return f"{name} 필터에서 새로운 종목 {new_symbol[:5]} 등 추가되고 {old_symbol[:5]} 등 종목이 제거 되었습니다. 총 {n}개의 종목이 변경되었습니다."


app.conf.beat_schedule = {
    "my_task_30min": {
        "task": "alarm.tasks.create_alarm",
        "schedule": crontab(minute="*/30"),
        "args": ("30",),
    },
    "my_task_1hour": {
        "task": "alarm.tasks.create_alarm",
        "schedule": crontab(hour="*/1"),
        "args": ("60",),
    },
    "my_task_4hour": {
        "task": "alarm.tasks.create_alarm",
        "schedule": crontab(hour="*/4"),
        "args": ("240",),
    },
    "my_task_1d": {
        "task": "alarm.tasks.create_alarm",
        "schedule": crontab(hour="0", minute="0"),
        "args": ("1",),
    },
}
