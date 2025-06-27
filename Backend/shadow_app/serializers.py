from rest_framework import serializers
from .models import Equity, ShadowPrice

class EquitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Equity
        fields = ['id', 'symbol', 'exchange']

class ShadowPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShadowPrice
        fields = ['id', 'equity', 'date', 'price', 'constraint']
