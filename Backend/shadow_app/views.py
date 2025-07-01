from django.http import HttpResponse
from rest_framework import viewsets, filters
from rest_framework.response import Response
from .models import Emotion, Equity
from .serializers import EmotionSerializer
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta

def home(request):
    return HttpResponse(b"Welcome to Shadow Markets!")

class EquityViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({'message': 'Equity endpoint working'})

class ShadowPriceViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({'message': 'Shadow price endpoint working'})

class EmotionViewSet(viewsets.ModelViewSet):
    queryset = Emotion.objects.all().order_by('-timestamp')
    serializer_class = EmotionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['equity__symbol', 'emotion', 'source']

    @action(detail=False, methods=['get'], url_path='evi')
    def evi(self, request):
        """Return Emotional Volatility Index (EVI) per ticker for the last 24h."""
        since = timezone.now() - timedelta(hours=24)
        emotions = Emotion.objects.filter(timestamp__gte=since).order_by('equity', 'timestamp')
        evi_dict = {}
        last_emotion = {}
        switches = {}
        for e in emotions:
            ticker = e.equity.symbol
            if ticker not in last_emotion:
                last_emotion[ticker] = e.emotion
                switches[ticker] = 0
            else:
                if e.emotion != last_emotion[ticker]:
                    switches[ticker] += 1
                    last_emotion[ticker] = e.emotion
        for ticker in switches:
            evi_dict[ticker] = switches[ticker]
        return Response(evi_dict)

    @action(detail=False, methods=['get'], url_path='flips')
    def flips(self, request):
        """Return tickers that flipped dominant emotion in the last 6 hours."""
        since = timezone.now() - timedelta(hours=6)
        emotions = Emotion.objects.filter(timestamp__gte=since).order_by('equity', 'timestamp')
        flips = []
        by_ticker = {}
        for e in emotions:
            ticker = e.equity.symbol
            if ticker not in by_ticker:
                by_ticker[ticker] = []
            by_ticker[ticker].append(e.emotion)
        for ticker, ems in by_ticker.items():
            if len(ems) > 1 and ems[0] != ems[-1]:
                flips.append({'ticker': ticker, 'from': ems[0], 'to': ems[-1]})
        return Response(flips)

    @action(detail=False, methods=['get'], url_path='top-rising')
    def top_rising(self, request):
        """Return tickers with the largest increase in emotion mentions in the last 24h compared to previous 24h."""
        now = timezone.now()
        last_24h = Emotion.objects.filter(timestamp__gte=now - timedelta(hours=24))
        prev_24h = Emotion.objects.filter(timestamp__gte=now - timedelta(hours=48), timestamp__lt=now - timedelta(hours=24))
        from collections import Counter
        last_counts = Counter([e.equity.symbol for e in last_24h])
        prev_counts = Counter([e.equity.symbol for e in prev_24h])
        rising = []
        for ticker in last_counts:
            diff = last_counts[ticker] - prev_counts.get(ticker, 0)
            rising.append({'ticker': ticker, 'increase': diff})
        rising.sort(key=lambda x: x['increase'], reverse=True)
        return Response(rising[:5])
