import os
import sys
from flask import Flask, render_template, request, jsonify
from google.cloud import firestore
from static.src.api.tarot_gemini_api import get_interpretation
from static.src.api.get_new_card import get_new_card
from static.src.api.firestore_signup import signup_user
from datetime import datetime
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_request_data(data, endpoint):
    """Log request data while masking sensitive information"""
    masked_data = {**data}
    if 'email' in masked_data:
        masked_data['email'] = '***@***.***'
    logger.info(f"{endpoint} received data: {masked_data}")

# Debug information
print("Python version:", sys.version)
print("Environment variables:", os.environ)

is_gae = os.getenv('GAE_ENV', '').startswith('standard')
print("Running on GAE:", is_gae)

if is_gae:
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
else:
    load_dotenv()
    project_id = os.getenv('PROJECT_ID')

print("Project ID:", project_id)

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize Firestore
try:
    db = firestore.Client(project=project_id)
    print("Firestore client initialized successfully")
except Exception as e:
    print("Error initializing Firestore client:", str(e))

def get_zodiac_sign(date_of_birth):
    date_formats = ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']
    
    for date_format in date_formats:
        try:
            date = datetime.strptime(date_of_birth, date_format)
            break
        except ValueError:
            continue
    else:
        raise ValueError(f"Unable to parse date: {date_of_birth}")

    month = date.month
    day = date.day
    
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittarius"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorn"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Aquarius"
    else:
        return "Pisces"

# Route definitions start here
@app.route('/api/get_tarot_reading', methods=['GET'])
def get_tarot_reading():
    try:
        # Get all request parameters
        request_data = {
            'name': request.args.get('name'),
            'date_of_birth': request.args.get('dateOfBirth'),
            'gender': request.args.get('gender', ''),
            'interests': request.args.get('interests', '').split(',') if request.args.get('interests') else [],
            'color_name': request.args.get('colorName', ''),
            'color_value': request.args.get('colorValue', '')
        }
        
        # Log the request data
        log_request_data(request_data, 'get_tarot_reading')
        
        # Validate required fields
        if not request_data['name'] or not request_data['date_of_birth']:
            logger.error("Missing required fields in request")
            return jsonify({"error": "Name and date of birth are required"}), 400
        
        zodiac_sign = get_zodiac_sign(request_data['date_of_birth'])
        
        try:
            # Get card data with all user information
            card_data = get_new_card(
                name=request_data['name'],
                zodiac_sign=zodiac_sign,
                gender=request_data['gender'],
                interests=request_data['interests'],
                color_name=request_data['color_name'],
                color_value=request_data['color_value']
            )
            
            return jsonify({
                "cardName": card_data["cardName"],
                "cardImage": card_data["cardImage"],
                "interpretation": card_data["interpretation"],
                "affirmations": card_data["affirmations"],
                "zodiacSign": zodiac_sign
            })
            
        except Exception as e:
            logger.error(f"Error in card generation/interpretation: {str(e)}")
            raise
            
    except Exception as e:
        logger.error(f"Error in get_tarot_reading: {str(e)}")
        return jsonify({
            "error": f"An error occurred while generating your reading: {str(e)}. Please try again."
        }), 500

@app.route('/api/submit_user', methods=['POST'])
def submit_user():
    try:
        data = request.json
        name = data.get('name')
        date_of_birth = data.get('dateOfBirth')
        email = data.get('email')
        gender = data.get('gender')
        interests = data.get('interests', [])
        color_name = data.get('colorName')
        color_value = data.get('colorValue')
        
        birth_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
        today = datetime.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        
        if not all([name, date_of_birth, email, gender]):
            return jsonify({"error": "Name, date of birth, email, and gender are required"}), 400

        zodiac_sign = get_zodiac_sign(date_of_birth)
        
        doc_ref = db.collection('users').document(email)
        doc_ref.set({
            'name': name,
            'date_of_birth': date_of_birth,
            'email': email,
            'gender': gender,
            'age': age,
            'interests': interests,
            'zodiac_sign': zodiac_sign,
            'color_name': color_name,
            'color_value': color_value,
            'created_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)

        return jsonify({
            "message": "User data received and stored",
            "zodiac_sign": zodiac_sign
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error in submit_user: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        result, status_code = signup_user(email)
        return jsonify(result), status_code
    except Exception as e:
        app.logger.error(f"Error in signup: {str(e)}")
        return jsonify({
            "error": f"An error occurred during signup: {str(e)}. Please try again."
        }), 500

@app.route('/api/save_email', methods=['POST'])
def save_email():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400

        doc_ref = db.collection('emails').document(email)
        doc_ref.set({
            'email': email,
            'created_at': firestore.SERVER_TIMESTAMP
        }, merge=True)

        return jsonify({"message": "Email saved successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error saving email: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    
@app.route('/')
def index():
    try:
        doc_ref = db.collection('test').document('test')
        doc_ref.set({'test': 'test'})
        print("Firestore write operation successful")
    except Exception as e:
        print("Firestore write operation failed:", str(e))
    return render_template("react.html")

if __name__ == '__main__':
    app.run(debug=not is_gae)