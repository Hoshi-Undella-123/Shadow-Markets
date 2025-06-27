from django.db import models

class Exchange(models.Model):
    name = models.CharField(max_length=100)

class Equity(models.Model):
    symbol = models.CharField(max_length=10)
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE)

class Constraint(models.Model):
    name = models.CharField(max_length=100)
    weight = models.FloatField(default=1.0)

class ShadowPrice(models.Model):
    equity = models.ForeignKey(Equity, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.FloatField()
    constraint = models.ForeignKey(Constraint, on_delete=models.CASCADE)
