from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquityViewSet, ShadowPriceViewSet

router = DefaultRouter()
router.register(r'equities', EquityViewSet)
router.register(r'shadow-prices', ShadowPriceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
