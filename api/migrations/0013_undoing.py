from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0012_auto_20200903_2232"),
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
                ("country_name", models.CharField(max_length=20)),
                ("real_eq_tr", models.FloatField()),
                ("real_bond_tr", models.FloatField()),
            ],
            options={
                "db_table": "real_returns",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Returns",
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
            ],
            options={
                "db_table": "api_returns",
                "managed": False,
            },
        ),
    ]
