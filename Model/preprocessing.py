import pandas as pd
import numpy as np
from matplotlib import pyplot as plt


dataFrame = pd.read_csv('bengaluru_house_prices.csv')

# Display first 5 rows of the dataframe
print(dataFrame.head())

# Display summary statistics of the dataframe
print(dataFrame.describe())

# Drop Columns that doesn't contribute to prediction
dataFrame = dataFrame.drop(['area_type', 'society', 'balcony', 'availability'], axis='columns')

# Find number of null values
null_values = dataFrame.isnull().sum()
print("Null values in each column:\n", null_values)

# Drop rows with null values as they are few
dataFrame = dataFrame.dropna()

# Find uniques values in 'size' column
print("Unique values in 'size' column:\n", dataFrame['size'].unique())

# Fix the 'size' column to extract number of bedrooms
dataFrame['bhk'] = dataFrame['size'].apply(lambda x: int(x.split(' ')[0]))
dataFrame = dataFrame.drop('size', axis='columns')

# Find unique types in 'total_sqft' column
def is_float(x):
    try:
        float(x)
    except:
        return x
    return True
print("Unique types in 'total_sqft' column:\n", dataFrame['total_sqft'].apply(is_float).unique())

# Fix the 'total_sqft' column to extract number of bedrooms
def convert_sqft_to_num(x):
    try:
        float(x)
    except:
        if '-' in x:
            tokens = x.split('-')
            if len(tokens) == 2:
                return (float(tokens[0]) + float(tokens[1])) / 2
        return None
    return float(x)
dataFrame['total_sqft'] = dataFrame['total_sqft'].apply(convert_sqft_to_num)

print("Unique types in 'total_sqft' column:", dataFrame['total_sqft'].unique())
print("Null values in 'total_sqft' column:", dataFrame['total_sqft'].isnull().sum())
dataFrame = dataFrame.dropna()
print("Null values in 'total_sqft' column:", dataFrame['total_sqft'].isnull().sum())

# Price per square feet
dataFrame['price_per_sqft'] = dataFrame['price']*100000 / dataFrame['total_sqft']

# Unique locations
print("Number of unique locations:", len(dataFrame['location'].unique()))
dataFrame['location'] = dataFrame['location'].apply(lambda x: x.strip())
location_stats = dataFrame['location'].value_counts(ascending=False)
print("Location stats:\n", location_stats) 

# Replace locations with less than 10 occurrences with 'other'
location_stats_less_than_10 = location_stats[location_stats <= 10]
dataFrame['location'] = dataFrame['location'].apply(lambda x: 'other' if x in location_stats_less_than_10 else x)
print("Number of unique locations after grouping:", len(dataFrame['location'].unique()))

# minimum threshold for sqft per bedroom 300 sqft
dataFrame = dataFrame[~(dataFrame['total_sqft']/dataFrame['bhk'] < 300)]

# Remove price per sqft outliers
def remove_pps_outliers(df):
    df_out = pd.DataFrame()
    for key, subdf in df.groupby('location'):
        m = np.mean(subdf['price_per_sqft'])
        st = np.std(subdf['price_per_sqft'])
        reduced_df = subdf[(subdf['price_per_sqft'] > (m - st)) & (subdf['price_per_sqft'] <= (m + st))]
        df_out = pd.concat([df_out, reduced_df], ignore_index=True)
    return df_out
dataFrame = remove_pps_outliers(dataFrame)

# Remove bhk outliers
def remove_bhk_outliers(df):
    exclude_indices = np.array([])
    for location, location_df in df.groupby('location'):
        bhk_stats = {}
        for bhk, bhk_df in location_df.groupby('bhk'):
            bhk_stats[bhk] = {
                'mean': np.mean(bhk_df['price_per_sqft']),
                'count': bhk_df.shape[0]
            }
        for bhk, bhk_df in location_df.groupby('bhk'):
            if bhk - 1 in bhk_stats and bhk_stats[bhk - 1]['count'] > 5:
                indices = bhk_df[bhk_df['price_per_sqft'] < bhk_stats[bhk - 1]['mean']].index.values
                exclude_indices = np.append(exclude_indices, indices)
    return df.drop(exclude_indices, axis='index')
dataFrame = remove_bhk_outliers(dataFrame)

# Remove bathroom outliers
dataFrame = dataFrame[dataFrame['bath'] < dataFrame['bhk'] + 2]

# Remove price per sqft column as it's no longer needed
dataFrame = dataFrame.drop('price_per_sqft', axis='columns')

# Dummies for location
dummies = pd.get_dummies(dataFrame['location'])
dataFrame = pd.concat([dataFrame, dummies.drop('other', axis='columns')], axis='columns')
dataFrame = dataFrame.drop('location', axis='columns')

# Display cleaned dataframe
print(dataFrame)

# Export cleaned dataframe
dataFrame.to_csv('bengaluru_cleaned.csv', index=False)