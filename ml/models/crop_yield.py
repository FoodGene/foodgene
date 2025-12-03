"""Crop yield prediction ML stub model."""
from typing import Dict, Any


def predict(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predict crop yield based on location and features.
    
    Args:
        features: Dict with location, crop, soil_type, rainfall, etc.
    
    Returns:
        Dict with yield_estimate, unit, and confidence.
    """
    # Stub implementation: simple rule-based estimation
    location = features.get("location", "unknown").lower()
    crop = features.get("crop", "rice").lower()
    soil_type = features.get("soil_type", "loam").lower()
    rainfall = features.get("rainfall", 1500)  # mm per year
    
    # Base yields for common crops (kg/ha)
    base_yields = {
        "rice": 5000,
        "wheat": 5500,
        "corn": 9000,
        "potato": 20000,
        "tomato": 70000,
    }
    
    base_yield = base_yields.get(crop, 5000)
    
    # Adjust based on location
    location_factors = {
        "karnataka": 0.95,
        "punjab": 1.1,
        "maharashtra": 0.9,
        "tamil_nadu": 0.85,
    }
    location_factor = location_factors.get(location, 1.0)
    
    # Adjust based on rainfall (optimal: 1200-2000 mm for most crops)
    if rainfall < 800:
        rainfall_factor = 0.7
    elif rainfall < 1200:
        rainfall_factor = 0.85
    elif rainfall < 2000:
        rainfall_factor = 1.0
    else:
        rainfall_factor = 0.95
    
    yield_estimate = base_yield * location_factor * rainfall_factor
    
    # Calculate confidence based on data quality
    confidence = 0.75
    if location in location_factors and rainfall > 0:
        confidence = 0.85
    
    return {
        "yield_estimate": round(yield_estimate, 1),
        "unit": "kg/ha",
        "confidence": confidence
    }
