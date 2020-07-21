from django.db import models

# Create your models here.

class Returns(models.Model):
    year = models.IntegerField(null=False, blank=False)
    country_name = models.CharField(max_length=20, null=False, blank=False)
    inflation = models.FloatField(default=-1.0)
    cpi = models.FloatField(default=-1.0)
    stir = models.FloatField(default=-1.0)
    ltrate = models.FloatField(default=-1.0)
    eq_tr = models.FloatField(default=-1.0)
    bond_tr = models.FloatField(default=-1.0)
    real_eq_tr = models.FloatField(default=-1.0)
    real_bond_tr = models.FloatField(default=-1.0)
