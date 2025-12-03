"""OpenAI meal plan generation and personalization."""
import os
import json
import re
import logging

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

logger = logging.getLogger(__name__)


def _extract_json(text: str):
    """Robust JSON extraction from LLM response.
    
    Try to find first {...} block and parse it.
    Fallback to parsing the entire text if extraction fails.
    """
    m = re.search(r'(\{.*\})', text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    # Fallback: try to load the whole text
    try:
        return json.loads(text)
    except Exception:
        raise ValueError("Could not extract valid JSON from LLM response")


def _get_demo_plan(calories: int, macros: dict, profile: dict) -> dict:
    """Return a demo meal plan when API key is not available."""
    diet_pref = profile.get('diet_pref', 'balanced').lower()
    
    # Demo meals based on diet preference
    demo_meals = {
        'vegetarian': {
            'breakfast': [
                {'name': 'Oatmeal with Berries', 'serving': '1 cup', 'cal': 350, 'protein_g': 12, 'carbs_g': 60, 'fat_g': 8},
                {'name': 'Egg Scramble with Toast', 'serving': '2 eggs', 'cal': 320, 'protein_g': 18, 'carbs_g': 40, 'fat_g': 10}
            ],
            'lunch': [
                {'name': 'Chickpea Buddha Bowl', 'serving': '350g', 'cal': 480, 'protein_g': 18, 'carbs_g': 65, 'fat_g': 15},
                {'name': 'Lentil Soup', 'serving': '500ml', 'cal': 320, 'protein_g': 15, 'carbs_g': 50, 'fat_g': 5}
            ],
            'dinner': [
                {'name': 'Tofu Stir Fry', 'serving': '400g', 'cal': 420, 'protein_g': 25, 'carbs_g': 45, 'fat_g': 18},
                {'name': 'Vegetable Risotto', 'serving': '300g', 'cal': 380, 'protein_g': 12, 'carbs_g': 65, 'fat_g': 10}
            ]
        },
        'balanced': {
            'breakfast': [
                {'name': 'Grilled Chicken Eggs', 'serving': '150g', 'cal': 380, 'protein_g': 35, 'carbs_g': 30, 'fat_g': 12},
                {'name': 'Salmon Toast', 'serving': '150g', 'cal': 420, 'protein_g': 30, 'carbs_g': 35, 'fat_g': 15}
            ],
            'lunch': [
                {'name': 'Grilled Chicken Breast', 'serving': '150g', 'cal': 280, 'protein_g': 40, 'carbs_g': 35, 'fat_g': 8},
                {'name': 'Lean Beef Burger', 'serving': '180g', 'cal': 350, 'protein_g': 38, 'carbs_g': 30, 'fat_g': 12}
            ],
            'dinner': [
                {'name': 'Salmon Fillet', 'serving': '180g', 'cal': 400, 'protein_g': 45, 'carbs_g': 25, 'fat_g': 18},
                {'name': 'Turkey Meatballs', 'serving': '200g', 'cal': 350, 'protein_g': 42, 'carbs_g': 20, 'fat_g': 14}
            ]
        },
        'keto': {
            'breakfast': [
                {'name': 'Bacon & Eggs', 'serving': '3 eggs + 4 strips', 'cal': 420, 'protein_g': 30, 'carbs_g': 5, 'fat_g': 32},
                {'name': 'Avocado & Salmon', 'serving': '150g', 'cal': 450, 'protein_g': 28, 'carbs_g': 8, 'fat_g': 35}
            ],
            'lunch': [
                {'name': 'Steak with Butter', 'serving': '200g', 'cal': 480, 'protein_g': 45, 'carbs_g': 0, 'fat_g': 35},
                {'name': 'Cheese & Nuts', 'serving': '200g', 'cal': 420, 'protein_g': 20, 'carbs_g': 10, 'fat_g': 32}
            ],
            'dinner': [
                {'name': 'Ribeye Steak', 'serving': '220g', 'cal': 520, 'protein_g': 50, 'carbs_g': 0, 'fat_g': 38},
                {'name': 'Cod with Olive Oil', 'serving': '180g', 'cal': 380, 'protein_g': 40, 'carbs_g': 5, 'fat_g': 22}
            ]
        }
    }
    
    meals_choice = demo_meals.get(diet_pref, demo_meals['balanced'])
    
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    plan_days = []
    
    for day in days:
        day_meals = [
            meals_choice['breakfast'][0] if day != 'Wed' else meals_choice['breakfast'][1],
            meals_choice['lunch'][0] if day != 'Thu' else meals_choice['lunch'][1],
            meals_choice['dinner'][0] if day != 'Sat' else meals_choice['dinner'][1]
        ]
        plan_days.append({'day': day, 'meals': day_meals})
    
    grocery_list = [
        {'item': 'Chicken Breast', 'quantity': '1.5 kg'},
        {'item': 'Salmon', 'quantity': '1 kg'},
        {'item': 'Eggs', 'quantity': '2 dozen'},
        {'item': 'Broccoli', 'quantity': '1 kg'},
        {'item': 'Rice', 'quantity': '1 kg'},
        {'item': 'Olive Oil', 'quantity': '500ml'},
        {'item': 'Tomatoes', 'quantity': '1 kg'},
        {'item': 'Spinach', 'quantity': '500g'},
    ]
    
    return {
        'days': plan_days,
        'grocery_list': grocery_list
    }


def call_llm_for_plan(calories: int, macros: dict, profile: dict) -> dict:
    """Generate a 7-day meal plan using OpenAI.
    
    Args:
        calories: Daily calorie target (e.g., 2000)
        macros: Dict with 'protein_g', 'fat_g', 'carbs_g' (daily targets)
        profile: Dict with 'diet_pref' (string), 'allergies' (list of strings)
    
    Returns:
        Dict with schema:
        {
          "days":[
            {"day":"Mon","meals":[{"name":"","serving":"","cal":0,"protein_g":0,"carbs_g":0,"fat_g":0}]},
            ...
          ],
          "grocery_list":[{"item":"","quantity":""}]
        }
    
    Raises:
        ValueError: If OpenAI API fails or response is malformed
    """
    if OpenAI is None:
        raise RuntimeError("OpenAI package not installed. Install with: pip install openai")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # DEMO MODE: Return sample plan without API key
        logger.warning("DEMO MODE: No OpenAI API key set. Returning demo meal plan.")
        return _get_demo_plan(calories, macros, profile)
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""You are a professional dietitian. Produce a 7-day meal plan for one adult.
Constraints:
- daily calories target: {calories}
- macros per day: protein {macros.get('protein_g', 150)} g, fat {macros.get('fat_g', 65)} g, carbs {macros.get('carbs_g', 250)} g
- preference: {profile.get('diet_pref', 'balanced')}
- allergies: {', '.join(profile.get('allergies', [])) if profile.get('allergies') else 'none'}

Output ONLY valid JSON matching this structure, no other text:
{{
  "days": [
    {{"day": "Mon", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Tue", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Wed", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Thu", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Fri", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Sat", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}},
    {{"day": "Sun", "meals": [{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}]}}
  ],
  "grocery_list": [{{"item": "", "quantity": ""}}]
}}
Be concise. Return JSON only."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.25,
            max_tokens=2000
        )
        text = response.choices[0].message.content.strip()
    except Exception as e:
        logger.exception(f"OpenAI API call failed: {e}")
        raise ValueError(f"OpenAI API error: {str(e)}")
    
    try:
        plan = _extract_json(text)
    except Exception as e:
        logger.exception(f"Failed to parse LLM plan JSON: {e}")
        raise ValueError("LLM produced invalid JSON for meal plan")
    
    # Validate structure
    if "days" not in plan or "grocery_list" not in plan:
        raise ValueError("LLM JSON missing required keys: 'days' and 'grocery_list'")
    
    if not isinstance(plan["days"], list) or len(plan["days"]) == 0:
        raise ValueError("'days' must be a non-empty list")
    
    return plan


def call_llm_for_single_meal(plan_json: dict, day: str, meal_index: int, calories: int, macros: dict, profile: dict) -> dict:
    """Generate a single replacement meal using OpenAI.
    
    Args:
        plan_json: The full current meal plan dict
        day: Day name (e.g., "Mon")
        meal_index: Index of the meal to replace within that day
        calories: Daily calorie target
        macros: Dict with 'protein_g', 'fat_g', 'carbs_g'
        profile: Dict with 'diet_pref' and 'allergies'
    
    Returns:
        Dict: {"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
    
    Raises:
        ValueError: If OpenAI API fails or response is malformed
    """
    if OpenAI is None:
        raise RuntimeError("OpenAI package not installed. Install with: pip install openai")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # DEMO MODE: Return alternative meal without API key
        logger.warning("DEMO MODE: No OpenAI API key set. Returning demo alternative meal.")
        alternative_meals = [
            {'name': 'Baked Tilapia', 'serving': '180g', 'cal': 280, 'protein_g': 38, 'carbs_g': 15, 'fat_g': 8},
            {'name': 'Turkey Meatballs', 'serving': '200g', 'cal': 350, 'protein_g': 42, 'carbs_g': 20, 'fat_g': 14},
            {'name': 'Grilled Vegetables & Tofu', 'serving': '350g', 'cal': 320, 'protein_g': 22, 'carbs_g': 45, 'fat_g': 12},
            {'name': 'Mushroom Pasta', 'serving': '300g', 'cal': 380, 'protein_g': 15, 'carbs_g': 60, 'fat_g': 10},
            {'name': 'Quinoa Buddha Bowl', 'serving': '350g', 'cal': 420, 'protein_g': 18, 'carbs_g': 65, 'fat_g': 12},
            {'name': 'Shrimp Stir Fry', 'serving': '280g', 'cal': 310, 'protein_g': 35, 'carbs_g': 25, 'fat_g': 10},
        ]
        return alternative_meals[meal_index % len(alternative_meals)]
    
    client = OpenAI(api_key=api_key)
    
    # Truncate plan summary to avoid token limits
    plan_summary = json.dumps(plan_json)[:1500]
    
    prompt = f"""You are a professional dietitian. Given the following meal plan, replace the meal at day '{day}', meal index {meal_index} with a single alternative meal.

Plan (truncated): {plan_summary}

Constraints:
- daily calories: {calories}
- macros: protein {macros.get('protein_g', 150)}g, fat {macros.get('fat_g', 65)}g, carbs {macros.get('carbs_g', 250)}g
- diet preference: {profile.get('diet_pref', 'balanced')}
- allergies: {', '.join(profile.get('allergies', [])) if profile.get('allergies') else 'none'}

Return ONLY valid JSON of the single meal, no other text:
{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.25,
            max_tokens=500
        )
        text = response.choices[0].message.content.strip()
    except Exception as e:
        logger.exception(f"OpenAI API call for meal swap failed: {e}")
        raise ValueError(f"OpenAI API error: {str(e)}")
    
    try:
        meal = _extract_json(text)
    except Exception as e:
        logger.exception(f"Failed to parse LLM meal JSON: {e}")
        raise ValueError("LLM produced invalid meal JSON")
    
    # Validate required keys
    required = {"name", "serving", "cal", "protein_g", "carbs_g", "fat_g"}
    if not required.issubset(set(meal.keys())):
        missing = required - set(meal.keys())
        raise ValueError(f"Returned meal missing keys: {missing}")
    
    # Truncate plan summary to avoid token limits
    plan_summary = json.dumps(plan_json)[:1500]
    
    prompt = f"""You are a professional dietitian. Given the following meal plan, replace the meal at day '{day}', meal index {meal_index} with a single alternative meal.

Plan (truncated): {plan_summary}

Constraints:
- daily calories: {calories}
- macros: protein {macros.get('protein_g', 150)}g, fat {macros.get('fat_g', 65)}g, carbs {macros.get('carbs_g', 250)}g
- diet preference: {profile.get('diet_pref', 'balanced')}
- allergies: {', '.join(profile.get('allergies', [])) if profile.get('allergies') else 'none'}

Return ONLY valid JSON of the single meal, no other text:
{{"name": "", "serving": "", "cal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.25,
            max_tokens=500
        )
        text = response.choices[0].message.content.strip()
    except Exception as e:
        logger.exception(f"OpenAI API call for meal swap failed: {e}")
        raise ValueError(f"OpenAI API error: {str(e)}")
    
    try:
        meal = _extract_json(text)
    except Exception as e:
        logger.exception(f"Failed to parse LLM meal JSON: {e}")
        raise ValueError("LLM produced invalid meal JSON")
    
    # Validate required keys
    required = {"name", "serving", "cal", "protein_g", "carbs_g", "fat_g"}
    if not required.issubset(set(meal.keys())):
        missing = required - set(meal.keys())
        raise ValueError(f"Returned meal missing keys: {missing}")
    
    return meal
