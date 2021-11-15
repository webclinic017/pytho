# Generated by Django 3.0.8 on 2021-11-12 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0020_auto_20210723_0231"),
    ]

    operations = [
        migrations.CreateModel(
            name="ThirteenFPosition",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("issuer_id", models.IntegerField()),
                ("filing_date", models.IntegerField()),
                ("period_date", models.IntegerField()),
                ("shares", models.IntegerField()),
                ("value", models.IntegerField()),
            ],
        ),
    ]