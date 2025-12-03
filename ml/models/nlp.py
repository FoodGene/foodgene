"""Natural language processing ML stub model."""
import re
from typing import Dict, List


def summarize(text: str) -> Dict[str, any]:
    """
    Summarize research text using stub NLP.
    
    Args:
        text: Research text to summarize
    
    Returns:
        Dict with summary (first 3 sentences + highlights)
    """
    # Split into sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Take first 3 sentences
    summary_sentences = sentences[:3]
    summary = ". ".join(summary_sentences)
    if summary and not summary.endswith(('.', '!', '?')):
        summary += "."
    
    # Extract highlights (simple: longest noun phrases)
    highlights = _extract_highlights(text)
    
    return {
        "summary": summary,
        "highlights": highlights,
    }


def _extract_highlights(text: str) -> List[str]:
    """Extract key phrases from text (stub implementation)."""
    # Simple stub: find capitalized words and common phrases
    words = text.split()
    
    highlights = []
    for word in words:
        # Look for capitalized words (proper nouns)
        if word and word[0].isupper() and len(word) > 3:
            if word not in highlights and word.lower() not in ["The", "And", "Or", "In"]:
                highlights.append(word.rstrip(".,!?"))
    
    # Take top 5 unique highlights
    return list(set(highlights))[:5]
