import sqlite3
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand

from api.models import SecFilingPaths
from helpers.sec.thirteenf import ThirteenFFetcher, ThirteenFParser

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('lookback', nargs='?', type=int)

    def handle(self, *args, **options):
        self.conn = sqlite3.connect("pytho.sqlite")
        self.future_date = (datetime.now() - timedelta(days = options['lookback'])).timestamp()
        paths = SecFilingPaths.objects.filter(date__gte=int(self.future_date)).filter(form_id=167)
        fetcher = ThirteenFFetcher(paths[3])
        parser = ThirteenFParser(fetcher.data)
        pos = parser.get_positions()
        print(pos)
        return
