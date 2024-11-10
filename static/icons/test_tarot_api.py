import requests
import json

def test_tarot_reading():
    # Test data
    test_data = {
        "name": "Test User",
        "dateOfBirth": "1990-01-01",
        "gender": "non-binary",
        "interests": ["Tarot", "Astrology", "Meditation"],
        "colorName": "Cosmic Purple",
        "colorValue": "#A59AD1"
    }
    
    # Local development URL (adjust as needed)
    base_url = "http://localhost:5000"
    
    # Construct URL with parameters
    url = f"{base_url}/api/get_tarot_reading"
    params = {
        "name": test_data["name"],
        "dateOfBirth": test_data["dateOfBirth"],
        "gender": test_data["gender"],
        "interests": ",".join(test_data["interests"]),
        "colorName": test_data["colorName"],
        "colorValue": test_data["colorValue"]
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        print("\n=== Test Results ===")
        print(f"Status Code: {response.status_code}")
        print("\nResponse Data:")
        print(json.dumps(response.json(), indent=2))
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"\nError during test: {str(e)}")
        return False

if __name__ == "__main__":
    test_tarot_reading()