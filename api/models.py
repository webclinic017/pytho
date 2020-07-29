from django.db import models

# Create your models here.

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
