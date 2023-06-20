import logging
from datetime import timezone
from typing import Set

from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django_apscheduler import util
from alarm.models import Alarm
from filter.models import Filter, create_query, Previous
from price.models import Symbol

logger = logging.getLogger(__name__)


def start_scheduler():
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)

    # scheduler.add_job(
    #     create_alarm,
    #     trigger=CronTrigger(second="*/30"),
    #     id="my_task_30sec",
    #     max_instances=1,
    #     replace_existing=True,
    #     args=(30,),
    # )
    # logger.info("Added job 'my_task_30sec'.")

    scheduler.add_job(
        create_alarm,
        trigger=CronTrigger(minute="*/30"),
        id="my_task_30min",
        max_instances=1,
        replace_existing=True,
        args=(30,),
    )
    logger.info("Added job 'my_task_30min'.")

    scheduler.add_job(
        create_alarm,
        trigger=CronTrigger(hour="*/1"),
        id="my_task_60min",  # id는 고유해야합니다.
        max_instances=1,
        replace_existing=True,
        args=(60,),
    )
    logger.info("Added job 'my_task_60min'.")

    scheduler.add_job(
        create_alarm,
        trigger=CronTrigger(hour="*/4"),
        id="my_task_240min",  # id는 고유해야합니다.
        max_instances=1,
        replace_existing=True,
        args=(240,),
    )
    logger.info("Added job 'my_task_240min'.")

    scheduler.add_job(
        create_alarm,
        trigger=CronTrigger(day="*/1"),
        id="my_task_1d",
        max_instances=1,
        replace_existing=True,
        args=(1,),
    )
    logger.info("Added job 'my_task_1d'.")

    try:
        logger.info("Starting scheduler...")
        scheduler.start()
    except KeyboardInterrupt:
        logger.info("Stopping scheduler...")
        scheduler.shutdown()
        logger.info("Scheduler shut down successfully!")


def create_alarm(time):
    print("Run create_alarm'.")
    logger.info("Run create_alarm'.")
    filters = Filter.objects.filter(alarm=True).filter(time=time)
    ids = list(filters.values_list("id", flat=True))

    for id in ids:
        result = is_different(id)
        if result == 0:
            pass
        else:
            alarm = Alarm(
                user_id=Filter.objects.get(id=id).user_id,
                message=result,
                is_read=False,
            )
            alarm.save()


def is_different(id: int) -> str:
    switcher = {
        1: "1d",
        30: "30m",
        60: "60m",
        240: "240m",
    }
    filter = Filter.objects.get(id=id)
    table = switcher[filter.time]

    current_lst = create_query(id, table, 30)
    past = Previous.objects.get(filter_id=id)
    past_lst = [int(i) for i in past.old_data[1:-1].split(",")]

    new_symbols = set(current_lst) - set(past_lst)
    missing_symbols = set(past_lst) - set(current_lst)
    changed_num = len(new_symbols) + len(missing_symbols)

    if changed_num == 0:
        return 0
    else:
        Previous(filter_id=id, old_data=current_lst).save()
        msg = create_message(changed_num, filter.name, new_symbols, missing_symbols)
        return msg


def create_message(n: int, name: str, new: Set[int], old: Set[int]) -> str:
    new_symbol = list(
        Symbol.objects.filter(symbol_id__in=new).values_list("name_kr", flat=True)
    )
    old_symbol = list(
        Symbol.objects.filter(symbol_id__in=old).values_list("name_kr", flat=True)
    )

    return f"{name} 필터에서 새로운 종목 {new_symbol[:5]} 등 추가되고 {old_symbol[:5]} 등 종목이 제거 되었습니다. 총 {n}개의 종목이 변경되었습니다."
