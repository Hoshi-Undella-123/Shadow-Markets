from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquityViewSet, ShadowPriceViewSet, EmotionViewSet, home

router = DefaultRouter()
router.register(r'equities', EquityViewSet, basename='equity')
router.register(r'shadow-prices', ShadowPriceViewSet, basename='shadowprice')
router.register(r'emotions', EmotionViewSet, basename='emotion')

urlpatterns = [
    path('', home, name='home'),                # Homepage at /
    path('api/', include(router.urls)),         # API endpoints at /api/
]
