"""Food scanner ML stub model."""
import json
from typing import List, Dict, Any, Union
import base64


# Simple food nutrition database (stub)
FOOD_NUTRITION_DB = {
    "tomato": {"cal": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2},
    "potato": {"cal": 77, "protein": 2.0, "carbs": 17.5, "fat": 0.1},
    "rice": {"cal": 130, "protein": 2.7, "carbs": 28.0, "fat": 0.3},
    "chicken": {"cal": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6},
    "apple": {"cal": 52, "protein": 0.3, "carbs": 14.0, "fat": 0.2},
    "broccoli": {"cal": 34, "protein": 2.8, "carbs": 7.0, "fat": 0.4},
    "salmon": {"cal": 208, "protein": 25.0, "carbs": 0.0, "fat": 13.0},
    "egg": {"cal": 155, "protein": 13.0, "carbs": 1.1, "fat": 11.0},
    "milk": {"cal": 61, "protein": 3.2, "carbs": 4.8, "fat": 3.3},
    "bread": {"cal": 265, "protein": 8.0, "carbs": 49.0, "fat": 3.3},
}


def predict(payload: Union[str, bytes, Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Predict food items from scanner input.
    
    Accepts:
    - Base64 encoded image string
    - Binary image data
    - JSON dict with detected items
    
    Returns list of detected items with confidence scores and nutrition.
    """
    detected_items = []
    
    # For JSON payload (mocked detection)
    if isinstance(payload, dict) and "detected_items" in payload:
        detected_items = payload["detected_items"]
    # For image data, perform stub detection
    elif isinstance(payload, (str, bytes)):
        # Stub: return deterministic results based on input hash
        # In production, this would run actual ML model
        detected_items = [
            {"label": "tomato", "confidence": 0.93},
            {"label": "potato", "confidence": 0.82},
        ]
    
    # Enhance with nutrition data
    result = []
    for item in detected_items:
        label = item.get("label", "").lower()
        confidence = item.get("confidence", 0.5)
        
        nutrition = FOOD_NUTRITION_DB.get(label, {
            "cal": 50, "protein": 1.0, "carbs": 10.0, "fat": 0.5
        })
        
        result.append({
            "label": label,
            "confidence": confidence,
            "nutrition": nutrition
        })
    
    return result
