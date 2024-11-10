import os
import json
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import aiplatform

is_gae = os.getenv('GAE_ENV', '').startswith('standard')

if not is_gae:
    # Only load dotenv if not on App Engine
    from dotenv import load_dotenv
    load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")
MODEL_ENDPOINT = os.getenv("MODEL_ENDPOINT")


required_vars = ["PROJECT_ID", "LOCATION", "MODEL_ENDPOINT"]
missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

aiplatform.init(project=PROJECT_ID, location=LOCATION)
vertexai.init(project=PROJECT_ID, location=LOCATION)

def get_interpretation(card_name, name, zodiac_sign, gender, interests, color_name, color_value):
    try:
        model = GenerativeModel(MODEL_ENDPOINT)
        chat = model.start_chat()

        # Create a readable list of interests
        interests_list = ', '.join(interests) if interests else 'general spiritual topics'
        
        # Build a more personalized prompt
        prompt = (
            f"You are a wise and intuitive tarot reader with deep knowledge of astrology, "
            f"color symbolism, and spiritual practices. Create a personalized reading for: \n"
            f"Name: {name}\n"
            f"Zodiac Sign: {zodiac_sign}\n"
            f"Gender: {gender}\n"
            f"Chosen Color: {color_name}\n"
            f"Interests: {interests_list}\n"
            f"Card Drawn: {card_name}\n\n"
            f"Structure your response in two parts:\n\n"
            f"1) Craft a deeply personal interpretation that:\n"
            f"- Connects the meaning of {card_name} with {name}'s zodiac sign ({zodiac_sign})\n"
            f"- Incorporates the symbolism of their chosen color ({color_name})\n"
            f"- References their specific interests ({interests_list})\n"
            f"- Uses appropriate gender perspective\n"
            f"2) Create ONE powerful, personalized affirmation that encapsulates the reading's core message.\n\n"
            f"Use {name}'s name throughout the reading. Keep the tone warm and encouraging. "
            f"Separate the interpretation and affirmation with 'AFFIRMATION:'. "
            f"Total response should not exceed 300 words."
        )

        response = chat.send_message(prompt)
        full_text = response.text
        interpretation, affirmation = parse_response(full_text)

        return {
            "interpretation": interpretation,
            "affirmations": [affirmation]  # Returning as list for backwards compatibility
        }

    except Exception as e:
        print(f"An error occurred in get_interpretation: {str(e)}")
        return {
            "error": "An error occurred while generating your reading. Please try again."
        }

def parse_response(full_text):
    parts = full_text.split("AFFIRMATION:")
    interpretation = parts[0].strip()
    affirmation = parts[1].strip() if len(parts) > 1 else "Trust in your journey."
    return interpretation, affirmation

if __name__ == "__main__":
    # Test with sample data
    test_data = {
        "card_name": "The Magician",
        "name": "georgie",
        "zodiac_sign": "Libra",
        "gender": "male",
        "interests": ["Tarot Reading", "Astrology"],
        "color_name": "Cosmic Purple",
        "color_value": "#A59AD1"
    }
    
    result = get_interpretation(**test_data)
    print(json.dumps(result, indent=2))