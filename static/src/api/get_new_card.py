import random
from .tarot_gemini_api import get_interpretation
from .tarot_cards import cards

def get_new_card(name, zodiac_sign, gender=None, interests=None, color_name=None, color_value=None):
    card_name = random.choice(list(cards.keys()))
    card_data = cards[card_name]
    
    # Get interpretation with all available user data
    interpretation = get_interpretation(
        card_name=card_name,
        name=name,
        zodiac_sign=zodiac_sign,
        gender=gender or "",  # Provide defaults for optional parameters
        interests=interests or [],
        color_name=color_name or "",
        color_value=color_value or ""
    )
    
    return {
        "cardName": card_name,
        "cardImage": card_data["image"],
        "interpretation": interpretation["interpretation"],
        "affirmations": interpretation["affirmations"]
    }