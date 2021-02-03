from django.db import models


class Coverage(models.Model):
    country_name = models.CharField(max_length=20, null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    issuer = models.CharField(max_length=200, null=True)
    currency = models.CharField(max_length=5, null=True)
    ticker = models.CharField(max_length=10, null=True)
    security_type = models.CharField(
        max_length=10, null=False, blank=False
    )


class RealReturns(models.Model):
    year = models.IntegerField(null=False, blank=False)
    country = models.CharField(max_length=20, null=False, blank=False)
    eq_tr = models.FloatField()
    bond_tr = models.FloatField()
    bill_rate = models.FloatField()
    inf = models.FloatField()
    eq_tr_local = models.FloatField()
    currency = models.FloatField()
    bond_tr_local = models.FloatField()
    eq_tr_usd = models.FloatField()
    bond_tr_usd = models.FloatField()
