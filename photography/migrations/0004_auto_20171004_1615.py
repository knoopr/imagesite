# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-04 16:15
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('photography', '0003_auto_20170914_1501'),
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('album_name', models.CharField(max_length=126)),
            ],
        ),
        migrations.AlterField(
            model_name='photograph',
            name='date_taken',
            field=models.DateField(default=datetime.datetime(2017, 10, 4, 16, 15, 38, 598655, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='photograph',
            name='date_uploaded',
            field=models.DateField(default=datetime.datetime(2017, 10, 4, 16, 15, 38, 598704, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='photograph',
            name='image_album',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='album_photographs', to='photography.Album'),
        ),
    ]