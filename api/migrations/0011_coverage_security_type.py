# Generated by Django 3.0.2 on 2020-09-03 22:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20200903_2223'),
    ]

    operations = [
        migrations.AddField(
            model_name='coverage',
            name='security_type',
            field=models.CharField(default=-1, max_length=10),
            preserve_default=False,
        ),
    ]
