import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None

# Function to load saved artifacts
def load_saved_artifacts():
    print("Loading saved artifacts...")
    
    global __data_columns
    global __locations
    global __model
    
    with open("./artifacts/columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # first 3 columns are sqft, bath, bhk

    with open("./artifacts/banglore_home_price_model.pickle", "rb") as f:
        __model = pickle.load(f)

# Function to get location names
def get_location_names():
    return __locations

# Predict price function
def get_estimated_price(location, sqft, bath, bhk):
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

if __name__ == "__main__":
    load_saved_artifacts()
    print(get_location_names())