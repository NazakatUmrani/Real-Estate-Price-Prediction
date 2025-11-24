from flask import Flask, jsonify, request
import util

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello World!'

# Return all locations
@app.route('/locations', methods=['GET'])
def get_locations():
    res = jsonify({
        'locations': util.get_location_names()
    })
    res.headers.add('Access-Control-Allow-Origin', '*')
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
        res.headers.add('Access-Control-Allow-Origin', '*')
        return res
    except Exception as e:
        print(e)
        res = jsonify({
            'error': str(e)
        })
        res.headers.add('Access-Control-Allow-Origin', '*')
        return res, 400

if __name__ == '__main__':
    print("Starting Python Flask Server for Real Estate Price Prediction...")
    util.load_saved_artifacts()
    app.run()