"""Diet plan generator ML stub model."""
from typing import Dict, List, Any
from ml.models.food_scanner import FOOD_NUTRITION_DB


def generate(profile: Dict[str, Any], food_items: List[Dict[str, Any]], 
             constraints: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a diet plan based on profile and constraints.
    
    Args:
        profile: User profile with age, weight, height, activity level
        food_items: List of detected food items
        constraints: Dict with goals, allergies, calories_per_day, cuisines
    
    Returns:
        Dict with summary and daily meals.
    """
    # Extract constraints
    goal = constraints.get("goal", "maintenance")
    calories_per_day = constraints.get("calories_per_day", 2000)
    allergies = constraints.get("allergies", [])
    preferred_cuisines = constraints.get("preferred_cuisines", ["indian"])
    
    # Filter out allergenic items
    available_items = [
        item for item in food_items 
        if item.get("label", "").lower() not in [a.lower() for a in allergies]
    ]
    
    if not available_items:
        available_items = food_items
    
    # Build meals (3 meals per day)
    # Breakfast: 25%, Lunch: 40%, Dinner: 35% of daily calories
    breakfast_cal = calories_per_day * 0.25
    lunch_cal = calories_per_day * 0.40
    dinner_cal = calories_per_day * 0.35
    
    meals = [
        _generate_meal("Breakfast", available_items, breakfast_cal),
        _generate_meal("Lunch", available_items, lunch_cal),
        _generate_meal("Dinner", available_items, dinner_cal),
    ]
    
    # Calculate totals
    total_cal = sum(m["cal_total"] for m in meals)
    total_protein = sum(
        sum(item.get("protein", 0) for item in m["items"]) 
        for m in meals
    )
    total_carbs = sum(
        sum(item.get("carbs", 0) for item in m["items"]) 
        for m in meals
    )
    total_fat = sum(
        sum(item.get("fat", 0) for item in m["items"]) 
        for m in meals
    )
    
    return {
        "summary": f"{calories_per_day:.0f} kcal, {len(meals)} meals per day. Goal: {goal}",
        "meals": meals,
        "daily_calories": total_cal,
        "daily_protein": total_protein,
        "daily_carbs": total_carbs,
        "daily_fat": total_fat,
    }


def _generate_meal(meal_name: str, available_items: List[Dict[str, Any]], 
                   target_cal: float) -> Dict[str, Any]:
    """Generate a single meal with items to match target calories."""
    meal_items = []
    current_cal = 0
    
    for item in available_items:
        if current_cal >= target_cal:
            break
        
        label = item.get("label", "unknown")
        nutrition = FOOD_NUTRITION_DB.get(label, {
            "cal": 50, "protein": 1.0, "carbs": 10.0, "fat": 0.5
        })
        
        # Determine quantity to reach target
        cal_per_unit = nutrition.get("cal", 50)
        if cal_per_unit > 0:
            qty = min(200, (target_cal - current_cal) / cal_per_unit)  # Max 200g per item
        else:
            qty = 100
        
        if qty > 10:  # Only add if reasonable quantity
            meal_items.append({
                "name": label.capitalize(),
                "qty": f"{qty:.0f}g",
                "cal": qty * (cal_per_unit / 100),
                "protein": qty * (nutrition.get("protein", 0) / 100),
                "carbs": qty * (nutrition.get("carbs", 0) / 100),
                "fat": qty * (nutrition.get("fat", 0) / 100),
            })
            current_cal += meal_items[-1]["cal"]
    
    # If no items, add a default
    if not meal_items:
        meal_items = [{
            "name": "Default meal",
            "qty": "100g",
            "cal": 100,
            "protein": 5,
            "carbs": 20,
            "fat": 2,
        }]
        current_cal = 100
    
    return {
        "name": meal_name,
        "items": meal_items,
        "cal_total": current_cal,
    }
