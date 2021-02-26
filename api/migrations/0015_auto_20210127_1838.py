# Generated by Django 3.0.8 on 2021-01-27 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0014_auto_20210127_1830"),
    ]

    operations = [
        migrations.CreateModel(
            name="RealReturns",
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
                ("year", models.IntegerField()),
                ("country", models.CharField(max_length=20)),
                ("eq_tr", models.FloatField()),
                ("bond_tr", models.FloatField()),
                ("bill_rate", models.FloatField()),
                ("inf", models.FloatField()),
                ("eq_tr_local", models.FloatField()),
                ("currency", models.FloatField()),
                ("bond_tr_local", models.FloatField()),
                ("eq_tr_usd", models.FloatField()),
                ("bond_tr_usd", models.FloatField()),
            ],
        ),
        migrations.DeleteModel(
            name="Returns",
        ),
    ]