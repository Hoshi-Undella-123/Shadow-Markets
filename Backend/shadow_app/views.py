from rest_framework import viewsets
from .models import Equity, ShadowPrice
from .serializers import EquitySerializer, ShadowPriceSerializer

class EquityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Equity.objects.all()
    serializer_class = EquitySerializer

class ShadowPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShadowPrice.objects.all()
    serializer_class = ShadowPriceSerializer
