# shadow_app/management/commands/fetch_twelve_data.py
from datetime import timezone
from django.core.management.base import BaseCommand
import requests
from shadow_app.models import Asset, Price, AssetClass

class Command(BaseCommand):
    help = 'Fetches asset data from Twelve Data'

    def handle(self, *args, **options):
        api_key = 'YOUR_TWELVE_DATA_API_KEY'
        symbols = ['AAPL', 'TSLA', 'MSFT']  # Add more as needed

        public_asset_class, _ = AssetClass.objects.get_or_create(name='Public Equity')

        for symbol in symbols:
            asset, _ = Asset.objects.get_or_create(
                symbol=symbol,
                defaults={'name': symbol, 'asset_class': public_asset_class, 'is_public': True}
            )

            url = f'https://api.twelvedata.com/price?symbol={symbol}&apikey={api_key}'
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                price = data.get('price')
                if price:
                    Price.objects.create(
                        asset=asset,
                        date=timezone.now(),
                        price=float(price),
                        source='Twelve Data'
                    )
