import redis
import pickle
import functools

redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

def cache(ttl=300):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"
            cached = redis_client.get(key)
            if cached:
                return pickle.loads(cached)
            result = func(*args, **kwargs)
            redis_client.set(key, pickle.dumps(result), ex=ttl)
            return result
        return wrapper
    return decorator
