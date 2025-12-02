from flask import Flask, jsonify, request
from flask_cors import CORS
import util
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello World!'

# Return all locations
@app.route('/locations', methods=['GET'])
def get_locations():
    res = jsonify({
        'locations': util.get_location_names()
    })
    return res

# Predict price route
@app.route('/predict_price', methods=['POST'])
def predict_price():
    try:
        print(request)
        data = request.get_json()
        location = data['location']
        sqft = float(data['sqft'])
        bath = int(data['bath'])
        bhk = int(data['bhk'])
        
        estimated_price = util.get_estimated_price(location, sqft, bath, bhk)
        
        res = jsonify({
            'estimated_price': estimated_price
        })
        return res
    except Exception as e:
        print(e)
        res = jsonify({
            'error': str(e)
        })
        return res, 400

if __name__ == '__main__':
    print("Starting Python Flask Server for Real Estate Price Prediction...")
    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
