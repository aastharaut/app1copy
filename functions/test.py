from firebase_functions import https_fn
from firebase_admin import initialize_app
import pickle
import numpy as np

# Initialize
initialize_app()

# Load model
with open('models/hormoniq.pkl', 'rb') as f:
    model = pickle.load(f)

# Flask test wrapper
from flask import Flask, request, jsonify
flask_app = Flask(__name__)

@flask_app.route('/predict', methods=['POST'])
def flask_predict():
    data = request.get_json()
    prediction = model.predict(np.array([
        [float(data['ovulation_day']), 
        float(data['menses_length'])]
    ]))
    return jsonify({
        "prediction": float(prediction[0]),
        "status": "success"
    })

if __name__ == '__main__':
    flask_app.run(port=5000)