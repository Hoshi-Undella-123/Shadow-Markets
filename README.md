# Research Matching Backend

A system that identifies high-impact but under-supported research projects, profiles researchers, and matches them with funders, collaborators, and advisors who can help remove barriers.

## Features

### Data Aggregation Layer
- Aggregate research data from multiple sources (arXiv, Semantic Scholar, etc.)
- Constant ingestion with periodic refresh
- Scalable PostgreSQL database storage

### Profiling and Scoring Engine
- Analyze and score papers/researchers based on:
  - Impact (citations, novelty, potential societal benefit)
  - Limitations (lack of funding, early stage, infrastructure bottlenecks)
- LLM-powered paper analysis and metadata extraction
- Auto-scoring and flagging for deeper review

### Recommendation System
- Dynamic filtering by impact score, limitation type, research domain, recency, geography
- Ranked list of researchers making a difference but blocked
- Recommendation of helpers who can solve roadblocks

### Funders Portal
- User authentication and profile creation for funders/supporters
- Profile management with areas of interest and support types
- Past involvement tracking

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens
- **Task Queue**: Celery with Redis
- **ML/AI**: OpenAI API, Transformers, spaCy
- **Data Sources**: arXiv API, Semantic Scholar API

## Project Structure

```
research_matching/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection and session
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── research.py         # Research papers and metadata
│   │   ├── researchers.py      # Researcher profiles
│   │   ├── funders.py          # Funder profiles and preferences
│   │   └── matches.py          # Matching and recommendations
│   ├── schemas/                # Pydantic schemas for API
│   │   ├── __init__.py
│   │   ├── research.py
│   │   ├── researchers.py
│   │   ├── funders.py
│   │   └── matches.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── research.py
│   │   │   ├── researchers.py
│   │   │   ├── funders.py
│   │   │   ├── matches.py
│   │   │   └── auth.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── ingestion.py        # Data ingestion from sources
│   │   ├── scoring.py          # Research scoring algorithms
│   │   ├── matching.py         # Matching algorithms
│   │   └── auth.py             # Authentication logic
│   ├── utils/                  # Utility functions
│   │   ├── __init__.py
│   │   ├── text_processing.py
│   │   └── ml_utils.py
│   └── tasks/                  # Celery background tasks
│       ├── __init__.py
│       ├── ingestion_tasks.py
│       └── scoring_tasks.py
├── alembic/                    # Database migrations
├── tests/                      # Test suite
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker setup
└── requirements.txt           # Python dependencies
```

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd research-matching-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

3. **Database setup**:
   ```bash
   # Start PostgreSQL (via Docker or local installation)
   docker-compose up -d postgres redis
   
   # Run migrations
   alembic upgrade head
   ```

4. **Run the application**:
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Research Data
- `GET /api/v1/research/` - List research papers with filtering
- `GET /api/v1/research/{paper_id}` - Get specific paper details
- `POST /api/v1/research/ingest` - Trigger manual ingestion

### Researchers
- `GET /api/v1/researchers/` - List researchers with filtering
- `GET /api/v1/researchers/{researcher_id}` - Get researcher profile
- `PUT /api/v1/researchers/{researcher_id}` - Update researcher profile

### Funders
- `POST /api/v1/funders/register` - Register new funder
- `POST /api/v1/funders/login` - Funder login
- `GET /api/v1/funders/profile` - Get funder profile
- `PUT /api/v1/funders/profile` - Update funder profile

### Matching
- `GET /api/v1/matches/` - Get recommendations for funders
- `POST /api/v1/matches/` - Create new match
- `GET /api/v1/matches/{match_id}` - Get match details

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

### Background Tasks
```bash
# Start Celery worker
celery -A app.tasks worker --loglevel=info

# Start Celery beat (for scheduled tasks)
celery -A app.tasks beat --loglevel=info
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Run the test suite
5. Submit a pull request

## License

[Add your license here] 