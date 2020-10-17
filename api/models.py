from django.db import models

class Coverage(models.Model):
    country_name = models.CharField(max_length=20, null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    issuer = models.CharField(max_length=200, null=True)
    currency = models.CharField(max_length=5, null=True)
    ticker = models.CharField(max_length=10, null=True)
    security_type = models.CharField(max_length=10, null=False, blank=False)

class Returns(models.Model):
    year = models.IntegerField(null=False, blank=False)
    country_name = models.CharField(max_length=20, null=False, blank=False)
    cpi = models.FloatField()
    bill_rate = models.FloatField()
    eq_tr = models.FloatField()
    bond_tr = models.FloatField()
    xrusd = models.FloatField()

class RealReturns(models.Model):
    year = models.IntegerField(null=False, blank=False)
    country_name = models.CharField(max_length=20, null=False, blank=False)
    real_eq_tr = models.FloatField()
    real_bond_tr = models.FloatField()

    class Meta:
        managed = False
        db_table = "real_returns"
