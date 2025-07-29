import re
import json
from typing import List, Dict, Set
from collections import Counter


def clean_text(text: str) -> str:
    """
    Clean and normalize text
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', '', text)
    
    return text


def extract_keywords(text: str, max_keywords: int = 10) -> List[str]:
    """
    Extract keywords from text using simple frequency analysis
    """
    if not text:
        return []
    
    # Clean text
    text = clean_text(text.lower())
    
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
        'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
    }
    
    # Split into words and filter
    words = re.findall(r'\b\w+\b', text)
    words = [word for word in words if word not in stop_words and len(word) > 2]
    
    # Count frequencies
    word_counts = Counter(words)
    
    # Return top keywords
    return [word for word, count in word_counts.most_common(max_keywords)]


def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Extract named entities from text (simple rule-based approach)
    """
    entities = {
        "organizations": [],
        "locations": [],
        "technologies": [],
        "methods": []
    }
    
    if not text:
        return entities
    
    text_lower = text.lower()
    
    # Organization patterns
    org_patterns = [
        r'\b[A-Z][a-z]+ (University|Institute|College|Center|Lab|Laboratory)\b',
        r'\b[A-Z][a-z]+ (Corporation|Corp|Inc|LLC|Ltd|Company)\b',
        r'\b[A-Z][a-z]+ (Foundation|Fund|Organization|Society)\b'
    ]
    
    for pattern in org_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        entities["organizations"].extend(matches)
    
    # Technology patterns
    tech_keywords = [
        "python", "java", "javascript", "c++", "c#", "ruby", "go", "rust",
        "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
        "docker", "kubernetes", "aws", "azure", "gcp",
        "machine learning", "deep learning", "artificial intelligence",
        "blockchain", "cloud computing", "big data"
    ]
    
    for tech in tech_keywords:
        if tech in text_lower:
            entities["technologies"].append(tech)
    
    # Method patterns
    method_keywords = [
        "random forest", "neural network", "support vector machine",
        "k-means", "linear regression", "logistic regression",
        "gradient boosting", "decision tree", "naive bayes"
    ]
    
    for method in method_keywords:
        if method in text_lower:
            entities["methods"].append(method)
    
    return entities


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts using Jaccard similarity
    """
    if not text1 or not text2:
        return 0.0
    
    # Clean and tokenize
    words1 = set(clean_text(text1.lower()).split())
    words2 = set(clean_text(text2.lower()).split())
    
    if not words1 or not words2:
        return 0.0
    
    # Calculate Jaccard similarity
    intersection = len(words1.intersection(words2))
    union = len(words1.union(words2))
    
    return intersection / union if union > 0 else 0.0


def extract_citations(text: str) -> List[str]:
    """
    Extract citation patterns from text
    """
    if not text:
        return []
    
    # Common citation patterns
    patterns = [
        r'\[([^\]]+)\]',  # [Author et al., 2023]
        r'\(([^)]+)\)',   # (Author et al., 2023)
        r'Author et al\.',  # Author et al.
        r'\d{4}',         # Year patterns
    ]
    
    citations = []
    for pattern in patterns:
        matches = re.findall(pattern, text)
        citations.extend(matches)
    
    return list(set(citations))


def normalize_json_string(json_str: str) -> str:
    """
    Normalize JSON string for storage
    """
    if not json_str:
        return "[]"
    
    try:
        # Try to parse and re-serialize
        data = json.loads(json_str)
        return json.dumps(data, ensure_ascii=False)
    except (json.JSONDecodeError, TypeError):
        # If it's not valid JSON, try to convert from list/string
        if isinstance(json_str, str):
            # Try to extract list-like content
            if json_str.startswith('[') and json_str.endswith(']'):
                try:
                    # Remove brackets and split
                    content = json_str[1:-1].strip()
                    if content:
                        items = [item.strip().strip('"\'') for item in content.split(',')]
                        return json.dumps(items, ensure_ascii=False)
                except:
                    pass
            # Return as single item list
            return json.dumps([json_str], ensure_ascii=False)
        else:
            return json.dumps([str(json_str)], ensure_ascii=False)


def extract_funding_mentions(text: str) -> List[str]:
    """
    Extract funding-related mentions from text
    """
    if not text:
        return []
    
    text_lower = text.lower()
    funding_patterns = [
        r'funding',
        r'grant',
        r'financial support',
        r'budget',
        r'cost',
        r'expensive',
        r'funded by',
        r'sponsored by',
        r'supported by'
    ]
    
    mentions = []
    for pattern in funding_patterns:
        if re.search(pattern, text_lower):
            mentions.append(pattern)
    
    return list(set(mentions))


def extract_collaboration_mentions(text: str) -> List[str]:
    """
    Extract collaboration-related mentions from text
    """
    if not text:
        return []
    
    text_lower = text.lower()
    collaboration_patterns = [
        r'collaboration',
        r'partnership',
        r'team',
        r'network',
        r'consortium',
        r'joint',
        r'together',
        r'cooperation'
    ]
    
    mentions = []
    for pattern in collaboration_patterns:
        if re.search(pattern, text_lower):
            mentions.append(pattern)
    
    return list(set(mentions)) 