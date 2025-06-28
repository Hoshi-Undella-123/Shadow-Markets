from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.response import Response

def home(request):
    return HttpResponse("Welcome to Shadow Markets!")

class EquityViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({'message': 'Equity endpoint working'})

class ShadowPriceViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({'message': 'Shadow price endpoint working'})
