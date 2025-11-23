# Bengaluru House Price Prediction Model

This project is a model trained to predict real estate prices for the Bengaluru dataset. The frontend is built using React and the backend is built using Flask Python.

## Dependencies

The model is built using the following Python dependencies, which are listed in the `shell.nix` file:

- python313  
- python313Packages.pandas  
- python313Packages.matplotlib  
- python313Packages.scikit-learn-extra  
- python313Packages.seaborn  

## Frontend (Under Development)

The frontend is built using React and is located in the `frontend` directory.

## Backend (Under Development)

The backend is built using Flask Python and is located in the `backend` directory.

## Model

The model is trained using the Bengaluru house prices dataset, which is located in the `Model` directory. The model is trained using the `train.py` file.

### Model Directory Details

The `Model` folder contains all data, scripts, and artifacts used for training. Here is what each file does:

- **bengaluru_house_prices.csv** — The raw dataset used for training.
- **bengaluru_cleaned.csv** — The cleaned version of the dataset after preprocessing and outlier removal.
- **preprocessing.py** — Handles data cleaning, feature engineering, encoding, and all preprocessing steps.
- **train.py** — Runs the full training pipeline, including splitting, training, and exporting the model.
- **banglore_home_price_model.pickle** — The final trained model saved using pickle. Loaded by the backend for prediction.
- **columns.json** — Stores the list of feature columns used during training to ensure consistent input during prediction.

## Running the Application

To run the application, navigate to the `frontend` directory and run `npm start`. To run the backend, navigate to the `backend` directory and run `python app.py`.
