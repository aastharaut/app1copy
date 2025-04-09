# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import pickle
import numpy as np
import logging
from firebase_functions import https_fn
from firebase_admin import initialize_app
from flask import jsonify

# Initialize Firebase
initialize_app()
logger = logging.getLogger(__name__)

# Load model at startup
try:
    with open('models/hormoniq.pkl', 'rb') as f:
        model = pickle.load(f)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Model loading failed: {str(e)}")
    raise

@https_fn.on_request()
def predict_cycle_length(req: https_fn.Request) -> https_fn.Response:
    """Predicts menstrual cycle length from ovulation day and menses length"""
    try:
        # Get and validate input
        data = req.get_json()
        
        if not all(k in data for k in ['ovulation_day', 'menses_length']):
            return https_fn.Response(
                '{"error": "Missing parameters"}',
                status=400,
                headers={'Content-Type': 'application/json'}
            )
            
        # Convert and validate ranges
        try:
            ovulation = float(data['ovulation_day'])
            menses = float(data['menses_length'])
        except ValueError:
            return https_fn.Response(
                '{"error": "Invalid number format"}',
                status=400,
                headers={'Content-Type': 'application/json'}
            )
            
        if not (1 <= ovulation <= 30) or not (1 <= menses <= 15):
            return https_fn.Response(
                '{"error": "Values out of range (1-30 days)"}',
                status=400,
                headers={'Content-Type': 'application/json'}
            )
            
        # Make prediction
        prediction = model.predict(np.array([[ovulation, menses]]))
        
        return https_fn.Response(
            f'{{"prediction": {float(prediction[0])}, "units": "days", "status": "success"}}',
            headers={'Content-Type': 'application/json'}
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return https_fn.Response(
            '{"error": "Server processing error"}',
            status=500,
            headers={'Content-Type': 'application/json'}
        )