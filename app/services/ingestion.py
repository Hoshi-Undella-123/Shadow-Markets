import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
import arxiv
import requests
from bs4 import BeautifulSoup

from app.models.research import ResearchPaper, ResearchField, DataSource
from app.schemas.research import IngestionRequest
from app.config import settings


async def ingest_research_data(db: Session, request: IngestionRequest) -> Dict:
    """
    Ingest research data from external sources
    """
    result = {
        "papers_ingested": 0,
        "papers_updated": 0,
        "errors": []
    }
    
    try:
        if request.source == DataSource.ARXIV:
            result = await _ingest_arxiv_data(db, request)
        elif request.source == DataSource.SEMANTIC_SCHOLAR:
            result = await _ingest_semantic_scholar_data(db, request)
        else:
            result["errors"].append(f"Unsupported data source: {request.source}")
            
    except Exception as e:
        result["errors"].append(f"Error during ingestion: {str(e)}")
    
    return result


async def _ingest_arxiv_data(db: Session, request: IngestionRequest) -> Dict:
    """
    Ingest data from arXiv
    """
    result = {
        "papers_ingested": 0,
        "papers_updated": 0,
        "errors": []
    }
    
    try:
        # Configure arXiv client
        client = arxiv.Client(
            page_size=100,
            delay_seconds=3,
            num_retries=3
        )
        
        # Build search query
        query = request.query or "cs.AI OR cs.LG OR cs.CL OR cs.CV OR cs.NE"
        
        # Search for papers
        search = arxiv.Search(
            query=query,
            max_results=request.max_results,
            sort_by=arxiv.SortCriterion.SubmittedDate
        )
        
        for result_item in client.results(search):
            try:
                # Check if paper already exists
                existing_paper = db.query(ResearchPaper).filter(
                    ResearchPaper.arxiv_id == result_item.entry_id.split('/')[-1]
                ).first()
                
                if existing_paper and not request.force_refresh:
                    continue
                
                # Extract authors
                authors = [author.name for author in result_item.authors]
                authors_json = json.dumps(authors)
                
                # Create or update paper
                paper_data = {
                    "title": result_item.title,
                    "abstract": result_item.summary,
                    "authors": authors_json,
                    "arxiv_id": result_item.entry_id.split('/')[-1],
                    "publication_date": result_item.published,
                    "status": "preprint",
                    "data_source": "arxiv",
                    "last_ingested": datetime.utcnow()
                }
                
                if existing_paper:
                    # Update existing paper
                    for key, value in paper_data.items():
                        setattr(existing_paper, key, value)
                    result["papers_updated"] += 1
                else:
                    # Create new paper
                    new_paper = ResearchPaper(**paper_data)
                    db.add(new_paper)
                    result["papers_ingested"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error processing arXiv paper {result_item.entry_id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error ingesting arXiv data: {str(e)}")
    
    return result


async def _ingest_semantic_scholar_data(db: Session, request: IngestionRequest) -> Dict:
    """
    Ingest data from Semantic Scholar
    """
    result = {
        "papers_ingested": 0,
        "papers_updated": 0,
        "errors": []
    }
    
    try:
        # Semantic Scholar API endpoint
        base_url = "https://api.semanticscholar.org/graph/v1"
        
        # Build search query
        query = request.query or "artificial intelligence"
        
        # Search for papers
        search_url = f"{base_url}/paper/search"
        params = {
            "query": query,
            "limit": min(request.max_results, 100),  # API limit
            "fields": "title,abstract,authors,doi,year,venue,citationCount"
        }
        
        headers = {}
        if settings.SEMANTIC_SCHOLAR_API_KEY:
            headers["x-api-key"] = settings.SEMANTIC_SCHOLAR_API_KEY
        
        response = requests.get(search_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        for paper_data in data.get("data", []):
            try:
                # Check if paper already exists
                existing_paper = None
                if paper_data.get("doi"):
                    existing_paper = db.query(ResearchPaper).filter(
                        ResearchPaper.doi == paper_data["doi"]
                    ).first()
                elif paper_data.get("paperId"):
                    existing_paper = db.query(ResearchPaper).filter(
                        ResearchPaper.semantic_scholar_id == paper_data["paperId"]
                    ).first()
                
                if existing_paper and not request.force_refresh:
                    continue
                
                # Extract authors
                authors = [author.get("name", "") for author in paper_data.get("authors", [])]
                authors_json = json.dumps(authors)
                
                # Create or update paper
                paper_info = {
                    "title": paper_data.get("title", ""),
                    "abstract": paper_data.get("abstract", ""),
                    "authors": authors_json,
                    "doi": paper_data.get("doi"),
                    "semantic_scholar_id": paper_data.get("paperId"),
                    "journal": paper_data.get("venue"),
                    "publication_date": datetime(paper_data.get("year", 2024), 1, 1) if paper_data.get("year") else None,
                    "citation_count": paper_data.get("citationCount", 0),
                    "status": "published" if paper_data.get("venue") else "preprint",
                    "data_source": "semantic_scholar",
                    "last_ingested": datetime.utcnow()
                }
                
                if existing_paper:
                    # Update existing paper
                    for key, value in paper_info.items():
                        if value is not None:
                            setattr(existing_paper, key, value)
                    result["papers_updated"] += 1
                else:
                    # Create new paper
                    new_paper = ResearchPaper(**paper_info)
                    db.add(new_paper)
                    result["papers_ingested"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error processing Semantic Scholar paper: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error ingesting Semantic Scholar data: {str(e)}")
    
    return result


async def _ingest_pubmed_data(db: Session, request: IngestionRequest) -> Dict:
    """
    Ingest data from PubMed (placeholder for future implementation)
    """
    result = {
        "papers_ingested": 0,
        "papers_updated": 0,
        "errors": ["PubMed ingestion not yet implemented"]
    }
    return result


async def process_ingested_papers(db: Session) -> Dict:
    """
    Process newly ingested papers (extract fields, score, etc.)
    """
    result = {
        "papers_processed": 0,
        "errors": []
    }
    
    try:
        # Get unprocessed papers
        unprocessed_papers = db.query(ResearchPaper).filter(
            ResearchPaper.is_processed == False
        ).limit(100).all()
        
        for paper in unprocessed_papers:
            try:
                # Extract research fields from title and abstract
                fields = await _extract_research_fields(paper.title, paper.abstract)
                
                # Add fields to paper
                for field_name in fields:
                    field = db.query(ResearchField).filter(ResearchField.name == field_name).first()
                    if not field:
                        field = ResearchField(name=field_name)
                        db.add(field)
                        db.flush()  # Get the ID
                    
                    if field not in paper.fields:
                        paper.fields.append(field)
                
                # Mark as processed
                paper.is_processed = True
                result["papers_processed"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error processing paper {paper.id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error in batch processing: {str(e)}")
    
    return result


async def _extract_research_fields(title: str, abstract: str) -> List[str]:
    """
    Extract research fields from title and abstract
    Simple keyword-based extraction (can be enhanced with ML)
    """
    text = f"{title} {abstract}".lower()
    fields = []
    
    # Define field keywords
    field_keywords = {
        "Artificial Intelligence": ["artificial intelligence", "ai", "machine learning", "ml"],
        "Computer Vision": ["computer vision", "image processing", "object detection", "cv"],
        "Natural Language Processing": ["natural language", "nlp", "text processing", "language model"],
        "Robotics": ["robotics", "robot", "autonomous", "control systems"],
        "Data Science": ["data science", "big data", "analytics", "data mining"],
        "Cybersecurity": ["cybersecurity", "security", "privacy", "encryption"],
        "Bioinformatics": ["bioinformatics", "genomics", "protein", "dna"],
        "Climate Science": ["climate", "environmental", "sustainability", "carbon"],
        "Healthcare": ["healthcare", "medical", "clinical", "health"],
        "Economics": ["economics", "financial", "market", "economy"]
    }
    
    for field_name, keywords in field_keywords.items():
        if any(keyword in text for keyword in keywords):
            fields.append(field_name)
    
    return fields 