from google.cloud import firestore
import os
from dotenv import load_dotenv

# Load environment variables from .env file for local development
if os.getenv('GAE_ENV', '').startswith('standard'):
    # Running on App Engine, use App Engine's env vars
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
else:
    # Running locally, load from .env file
    load_dotenv()
    project_id = os.getenv('PROJECT_ID')

# Initialize Firestore client
db = firestore.Client(project=project_id)

def signup_user(email):
    users_ref = db.collection('users')
  
    existing_users = users_ref.where('email', '==', email).get()
    if len(list(existing_users)) > 0:
        return {"error": "User already exists"}, 400
    
    new_user = users_ref.document()
    new_user.set({
        'email': email,
        'signup_date': firestore.SERVER_TIMESTAMP
    })

    return {"message": "User signed up successfully"}, 200