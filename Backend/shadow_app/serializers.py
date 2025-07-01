from rest_framework import serializers
from .models import Equity, ShadowPrice, Emotion

class EquitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Equity
        fields = ['id', 'symbol', 'exchange']

class ShadowPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShadowPrice
        fields = ['id', 'equity', 'date', 'price', 'constraint']

class EmotionSerializer(serializers.ModelSerializer):
    equity = serializers.SerializerMethodField()

    class Meta:
        model = Emotion
        fields = ['id', 'equity', 'timestamp', 'emotion', 'confidence', 'text', 'source']

    def get_equity(self, obj):
        return obj.equity.symbol if obj.equity else None
