import os
import json
from kafka import KafkaProducer, KafkaConsumer
from pulsar import Client as PulsarClient

def normalize_tick(tick):
    # Example: tick is a CSV string
    fields = tick.split(',')
    return {
        'symbol': fields[0],
        'price': float(fields[1]),
        'volume': int(fields[2]),
        'timestamp': fields[3]
    }

def main():
    broker = os.getenv('STREAM_BROKER', 'kafka')
    if broker == 'kafka':
        producer = KafkaProducer(bootstrap_servers='kafka:9092')
        consumer = KafkaConsumer('ticks.raw', bootstrap_servers='kafka:9092')
        for msg in consumer:
            tick = normalize_tick(msg.value.decode())
            producer.send('ticks.normalised', json.dumps(tick).encode())
    elif broker == 'pulsar':
        client = PulsarClient('pulsar://pulsar:6650')
        producer = client.create_producer('ticks.normalised')
        consumer = client.subscribe('ticks.raw', 'shadow-sub')
        while True:
            msg = consumer.receive()
            tick = normalize_tick(msg.data().decode())
            producer.send(json.dumps(tick).encode())
            consumer.acknowledge(msg)

if __name__ == '__main__':
    main()
