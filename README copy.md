# Shadow Markets MVP

A revolutionary fintech platform for calculating and trading shadow prices.

## Quick Start

1. Clone this repository.
2. Copy `.env.example` to `.env` and fill in your API keys.
3. Run `docker compose up --build`
4. Access the frontend at `http://localhost:3000`

## Features

- **LightGBM-based shadow price prediction**
- **Transformer model R&D scaffold**
- **Redis caching for low-latency API**
- **Kafka/Pulsar streaming bridge**
- **Compliant risk management**
- **Virtualized data grid for the frontend**
- **Horizontal scaling with TimescaleDB**

## Next Steps 

- Train your GBM model with `python algorithms_gbm.py --data data/feature_matrix.csv`
- Launch the streaming bridge with `python kafka_bridge.py`
- Integrate the React data grid into your dashboard
