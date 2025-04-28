# index.py
from firebase_functions import https_fn
from firebase_admin import initialize_app
import pickle
import numpy as np
import json
import os

# Initialize Firebase app
initialize_app()

# Load the trained model (ensure the model file is deployed with your function)
model_path = os.path.join(os.path.dirname(__file__), 'models/hormoniq.pkl')

# Define the prediction function using Firebase Functions v2 syntax
@https_fn.on_request()
def predict(req: https_fn.Request) -> https_fn.Response:
    """HTTP Cloud Function that predicts cycle length using ML model."""
    # Set CORS headers for preflight requests
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return https_fn.Response(status=204, headers=headers)
    
    # Set CORS headers for main request
    headers = {'Access-Control-Allow-Origin': '*'}
    
    # Check if request method is POST
    if req.method != 'POST':
        return https_fn.Response(
            json.dumps({'error': 'Only POST requests are accepted'}),
            status=405,
            headers=headers
        )
    
    try:
        # Load model - we do this inside the function to ensure it's loaded fresh for each request
        # This can be moved outside for efficiency if cold starts aren't an issue
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Parse request data
        request_json = req.get_json(silent=True)
        
        if not request_json:
            return https_fn.Response(
                json.dumps({'error': 'No JSON data provided'}),
                status=400,
                headers=headers
            )
        
        # Extract features
        try:
            features = np.array([
                [
                    float(request_json['ovulation_day']),
                    float(request_json['menses_length'])
                    # Add any other features your model requires
                ]
            ])
        except (KeyError, ValueError) as e:
            return https_fn.Response(
                json.dumps({
                    'error': f'Invalid feature data: {str(e)}',
                    'required_features': ['ovulation_day', 'menses_length']
                }),
                status=400,
                headers=headers
            )
        
        # Make prediction
        prediction = model.predict(features)
        
        # Return prediction as JSON
        return https_fn.Response(
            json.dumps({
                'prediction': float(prediction[0]),  # Convert numpy type to Python float
                'status': 'success'
            }),
            headers=headers
        )
    
    except Exception as e:
        return https_fn.Response(
            json.dumps({'error': f'Prediction failed: {str(e)}'}),
            status=500,
            headers=headers
        )

# If you want to add more functions to improve your prediction system
@https_fn.on_call()
def feedback_loop(data: dict) -> dict:
    """
    Callable function that receives feedback about prediction accuracy.
    This can be used to log data for future model improvements.
    """
    # Placeholder for logging feedback data
    # In a real implementation, you might store this in Firestore
    try:
        user_id = data.get('userId')
        actual_cycle = data.get('actualCycle')
        predicted_cycle = data.get('predictedCycle')
        
        # Here you would typically log this data to Firestore
        # This is just a stub implementation
        
        return {
            'status': 'success',
            'message': 'Feedback received'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }