# Generated by Django 3.0.8 on 2021-11-12 21:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0023_auto_20211112_2056"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="thirteenfposition",
            unique_together={("issuer_id", "filing_date", "cusip")},
        ),
    ]
