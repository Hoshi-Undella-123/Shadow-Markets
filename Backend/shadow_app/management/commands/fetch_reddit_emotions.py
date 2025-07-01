from django.core.management.base import BaseCommand
import re
import datetime
from typing import List
import praw  # Reddit API
from transformers.pipelines import pipeline  # For GoEmotions
from shadow_app.models import Equity, Emotion, Exchange

REDDIT_CLIENT_ID = 'SB5_-eXM2YTt37eFTFaySQ'
REDDIT_CLIENT_SECRET = '0qo8MIscoV9gcToC4Yn6ETDlelULFA'
REDDIT_USER_AGENT = 'emotion-mvp-script'
SUBREDDITS = ['wallstreetbets', 'investing', 'stocks', 'CryptoCurrency']
LIMIT = 100

TICKER_PATTERN = re.compile(r'\$[A-Z]{1,5}')

def extract_tickers(text: str) -> List[str]:
    return list(set([t[1:] for t in TICKER_PATTERN.findall(text)]))

def clean_text(text: str) -> str:
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_emotion_classifier():
    try:
        import torch
    except ImportError:
        print("PyTorch is required for the emotion classifier. Please install it with 'pip install torch'.")
        exit(1)
    return pipeline('text-classification', model='SamLowe/roberta-base-go_emotions', top_k=None)

def fetch_reddit_posts():
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT
    )
    posts = []
    for sub in SUBREDDITS:
        for submission in reddit.subreddit(sub).new(limit=LIMIT):
            posts.append({
                'text': submission.title + ' ' + (submission.selftext or ''),
                'timestamp': datetime.datetime.utcfromtimestamp(submission.created_utc),
                'source': sub
            })
    print(f"Fetched {len(posts)} posts from Reddit.")
    return posts

class Command(BaseCommand):
    help = 'Fetch Reddit posts, classify emotions, and store in Emotion model.'

    def handle(self, *args, **options):
        classifier = get_emotion_classifier()
        tokenizer = classifier.tokenizer
        max_length = 510  # leave room for special tokens
        posts = fetch_reddit_posts()
        emotion_count = 0
        # Ensure a default exchange exists
        exchange, _ = Exchange.objects.get_or_create(name="Reddit")
        for post in posts:
            text = clean_text(post['text'])
            # Truncate using tokenizer to avoid model sequence length errors
            tokens = tokenizer.encode(text, truncation=True, max_length=max_length)
            text = tokenizer.decode(tokens, skip_special_tokens=True)
            tickers = extract_tickers(text)
            if not tickers:
                continue
            results = classifier(text)
            # Flatten if results is a list of lists
            if results and isinstance(results[0], list):
                results = results[0]
            for r in results:
                # Defensive: ensure r is a dict with 'label' and 'score'
                if not isinstance(r, dict) or 'label' not in r or 'score' not in r:
                    continue
                emotion = r['label']
                confidence = float(r['score'])
                for ticker in tickers:
                    equity, _ = Equity.objects.get_or_create(symbol=ticker, defaults={'exchange': exchange})
                    Emotion.objects.create(
                        equity=equity,
                        timestamp=post['timestamp'],
                        emotion=emotion,
                        confidence=confidence,
                        text=text,
                        source=post['source']
                    )
                    emotion_count += 1
        print(f"Created {emotion_count} emotions.")
        self.stdout.write('Done!') 


