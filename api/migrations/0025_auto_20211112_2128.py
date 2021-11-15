# Generated by Django 3.0.8 on 2021-11-12 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0024_auto_20211112_2121"),
    ]

    operations = [
        migrations.CreateModel(
            name="SecThirteenFFiling",
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
            ],
            options={
                "unique_together": {("issuer_id", "filing_date")},
            },
        ),
        migrations.CreateModel(
            name="SecThirteenFPosition",
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
                ("thirteenf_id", models.IntegerField()),
                ("shares", models.IntegerField()),
                ("value", models.IntegerField()),
                ("cusip", models.CharField(max_length=10)),
            ],
            options={
                "unique_together": {("thirteenf_id", "cusip")},
            },
        ),
        migrations.DeleteModel(
            name="ThirteenFPosition",
        ),
    ]