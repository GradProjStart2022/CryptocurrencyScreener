# Generated by Django 4.1.2 on 2023-05-31 02:43

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("alarm", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="alarm",
            name="created_at",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2023, 5, 31, 2, 43, 48, 787993, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]
