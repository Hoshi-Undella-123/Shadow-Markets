import json
import re
from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
import openai
from datetime import datetime

from app.models.research import ResearchPaper
from app.models.researchers import Researcher
from app.config import settings


async def score_research_paper(paper: ResearchPaper) -> Dict:
    """
    Score a research paper for impact, novelty, and societal benefit
    """
    score = {
        "impact_score": 0.0,
        "novelty_score": 0.0,
        "societal_impact_score": 0.0,
        "barrier_score": 0.0,
        "funding_limitations": [],
        "infrastructure_needs": [],
        "collaboration_needs": [],
        "is_flagged_for_review": False
    }
    
    try:
        # Basic scoring based on citations
        score["impact_score"] = min(paper.citation_count / 100.0, 10.0)  # Normalize to 0-10
        
        # AI-powered analysis if OpenAI is available
        if settings.OPENAI_API_KEY:
            ai_scores = await _analyze_paper_with_ai(paper)
            score.update(ai_scores)
        else:
            # Fallback to rule-based scoring
            score.update(await _rule_based_paper_scoring(paper))
        
        # Flag for review if scores are high but barriers exist
        if (score["impact_score"] > 7.0 and score["barrier_score"] > 5.0):
            score["is_flagged_for_review"] = True
        
        return score
        
    except Exception as e:
        # Return basic scores on error
        return {
            "impact_score": min(paper.citation_count / 100.0, 10.0),
            "novelty_score": 5.0,
            "societal_impact_score": 5.0,
            "barrier_score": 5.0,
            "funding_limitations": [],
            "infrastructure_needs": [],
            "collaboration_needs": [],
            "is_flagged_for_review": False
        }


async def score_researcher(researcher: Researcher) -> Dict:
    """
    Score a researcher for impact and barriers
    """
    score = {
        "impact_score": 0.0,
        "barrier_score": 0.0,
        "matchability_score": 0.0
    }
    
    try:
        # Impact score based on h-index and citations
        impact_score = (researcher.h_index * 0.5) + (researcher.total_citations / 1000.0)
        score["impact_score"] = min(impact_score, 10.0)
        
        # Barrier score based on needs
        barrier_factors = []
        if researcher.current_funding_needs:
            barrier_factors.append("funding")
        if researcher.infrastructure_needs:
            barrier_factors.append("infrastructure")
        if researcher.collaboration_needs:
            barrier_factors.append("collaboration")
        if researcher.mentorship_needs:
            barrier_factors.append("mentorship")
        
        score["barrier_score"] = len(barrier_factors) * 2.5  # 0-10 scale
        
        # Matchability score (combination of impact and barriers)
        score["matchability_score"] = (score["impact_score"] * 0.6) + (score["barrier_score"] * 0.4)
        
        return score
        
    except Exception as e:
        return {
            "impact_score": 5.0,
            "barrier_score": 5.0,
            "matchability_score": 5.0
        }


async def _analyze_paper_with_ai(paper: ResearchPaper) -> Dict:
    """
    Analyze paper using OpenAI API
    """
    if not settings.OPENAI_API_KEY:
        return {}
    
    try:
        openai.api_key = settings.OPENAI_API_KEY
        
        # Prepare text for analysis
        text = f"Title: {paper.title}\n\nAbstract: {paper.abstract or 'No abstract available'}"
        
        # Analyze for novelty and societal impact
        prompt = f"""
        Analyze this research paper and provide scores (0-10) and analysis for:
        
        Paper: {text}
        
        Please provide a JSON response with:
        {{
            "novelty_score": <score>,
            "societal_impact_score": <score>,
            "barrier_analysis": {{
                "funding_limitations": ["list of funding issues"],
                "infrastructure_needs": ["list of infrastructure needs"],
                "collaboration_needs": ["list of collaboration needs"]
            }},
            "reasoning": "brief explanation of scores"
        }}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a research analyst evaluating papers for impact and barriers."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.3
        )
        
        # Parse response
        content = response.choices[0].message.content
        try:
            analysis = json.loads(content)
            return {
                "novelty_score": float(analysis.get("novelty_score", 5.0)),
                "societal_impact_score": float(analysis.get("societal_impact_score", 5.0)),
                "funding_limitations": analysis.get("barrier_analysis", {}).get("funding_limitations", []),
                "infrastructure_needs": analysis.get("barrier_analysis", {}).get("infrastructure_needs", []),
                "collaboration_needs": analysis.get("barrier_analysis", {}).get("collaboration_needs", []),
                "barrier_score": len(analysis.get("barrier_analysis", {}).get("funding_limitations", [])) * 2.0
            }
        except json.JSONDecodeError:
            return await _rule_based_paper_scoring(paper)
            
    except Exception as e:
        # Fallback to rule-based scoring
        return await _rule_based_paper_scoring(paper)


async def _rule_based_paper_scoring(paper: ResearchPaper) -> Dict:
    """
    Rule-based scoring when AI is not available
    """
    score = {
        "novelty_score": 5.0,
        "societal_impact_score": 5.0,
        "funding_limitations": [],
        "infrastructure_needs": [],
        "collaboration_needs": [],
        "barrier_score": 5.0
    }
    
    text = f"{paper.title} {paper.abstract or ''}".lower()
    
    # Novelty scoring based on keywords
    novelty_keywords = [
        "novel", "new", "innovative", "breakthrough", "first", "pioneering",
        "revolutionary", "groundbreaking", "state-of-the-art", "cutting-edge"
    ]
    novelty_count = sum(1 for keyword in novelty_keywords if keyword in text)
    score["novelty_score"] = min(5.0 + (novelty_count * 1.0), 10.0)
    
    # Societal impact scoring
    societal_keywords = [
        "society", "social", "human", "health", "environment", "climate",
        "sustainability", "equity", "justice", "poverty", "education",
        "disaster", "crisis", "global", "world", "community"
    ]
    societal_count = sum(1 for keyword in societal_keywords if keyword in text)
    score["societal_impact_score"] = min(5.0 + (societal_count * 0.5), 10.0)
    
    # Barrier detection
    funding_keywords = ["funding", "grant", "financial", "budget", "cost", "expensive"]
    infrastructure_keywords = ["infrastructure", "equipment", "facility", "computing", "server"]
    collaboration_keywords = ["collaboration", "partnership", "team", "network", "consortium"]
    
    if any(keyword in text for keyword in funding_keywords):
        score["funding_limitations"].append("Funding needs mentioned")
    if any(keyword in text for keyword in infrastructure_keywords):
        score["infrastructure_needs"].append("Infrastructure needs mentioned")
    if any(keyword in text for keyword in collaboration_keywords):
        score["collaboration_needs"].append("Collaboration needs mentioned")
    
    # Calculate barrier score
    barrier_count = len(score["funding_limitations"]) + len(score["infrastructure_needs"]) + len(score["collaboration_needs"])
    score["barrier_score"] = min(barrier_count * 2.0, 10.0)
    
    return score


async def batch_score_papers(db: Session, limit: int = 50) -> Dict:
    """
    Batch score unprocessed papers
    """
    result = {
        "papers_scored": 0,
        "errors": []
    }
    
    try:
        # Get unprocessed papers
        papers = db.query(ResearchPaper).filter(
            ResearchPaper.is_scored == False
        ).limit(limit).all()
        
        for paper in papers:
            try:
                # Score the paper
                scores = await score_research_paper(paper)
                
                # Update paper with scores
                paper.impact_score = scores["impact_score"]
                paper.novelty_score = scores["novelty_score"]
                paper.societal_impact_score = scores["societal_impact_score"]
                paper.barrier_score = scores["barrier_score"]
                paper.funding_limitations = json.dumps(scores["funding_limitations"])
                paper.infrastructure_needs = json.dumps(scores["infrastructure_needs"])
                paper.collaboration_needs = json.dumps(scores["collaboration_needs"])
                paper.is_flagged_for_review = scores["is_flagged_for_review"]
                paper.is_scored = True
                paper.updated_at = datetime.utcnow()
                
                result["papers_scored"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error scoring paper {paper.id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error in batch scoring: {str(e)}")
    
    return result


async def batch_score_researchers(db: Session, limit: int = 50) -> Dict:
    """
    Batch score researchers
    """
    result = {
        "researchers_scored": 0,
        "errors": []
    }
    
    try:
        # Get researchers without scores
        researchers = db.query(Researcher).filter(
            Researcher.impact_score == 0.0
        ).limit(limit).all()
        
        for researcher in researchers:
            try:
                # Score the researcher
                scores = await score_researcher(researcher)
                
                # Update researcher with scores
                researcher.impact_score = scores["impact_score"]
                researcher.barrier_score = scores["barrier_score"]
                researcher.matchability_score = scores["matchability_score"]
                researcher.updated_at = datetime.utcnow()
                
                result["researchers_scored"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error scoring researcher {researcher.id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error in batch researcher scoring: {str(e)}")
    
    return result


async def extract_research_fields(text: str) -> List[str]:
    """
    Extract research fields from text
    """
    fields = []
    text_lower = text.lower()
    
    # Define field keywords
    field_keywords = {
        "Artificial Intelligence": ["artificial intelligence", "ai", "machine learning", "ml", "deep learning"],
        "Computer Vision": ["computer vision", "image processing", "object detection", "cv", "visual"],
        "Natural Language Processing": ["natural language", "nlp", "text processing", "language model", "transformer"],
        "Robotics": ["robotics", "robot", "autonomous", "control systems", "automation"],
        "Data Science": ["data science", "big data", "analytics", "data mining", "statistics"],
        "Cybersecurity": ["cybersecurity", "security", "privacy", "encryption", "malware"],
        "Bioinformatics": ["bioinformatics", "genomics", "protein", "dna", "biological"],
        "Climate Science": ["climate", "environmental", "sustainability", "carbon", "green"],
        "Healthcare": ["healthcare", "medical", "clinical", "health", "medicine"],
        "Economics": ["economics", "financial", "market", "economy", "finance"]
    }
    
    for field_name, keywords in field_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            fields.append(field_name)
    
    return fields 