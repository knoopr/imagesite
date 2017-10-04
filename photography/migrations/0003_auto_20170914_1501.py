# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-09-14 15:01
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('photography', '0002_auto_20170913_2009'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photograph',
            name='date_taken',
            field=models.DateField(default=datetime.datetime(2017, 9, 14, 15, 1, 52, 953531, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='photograph',
            name='date_uploaded',
            field=models.DateField(default=datetime.datetime(2017, 9, 14, 15, 1, 52, 953582, tzinfo=utc)),
        ),
    ]