import pandas as pd
from opencage.geocoder import OpenCageGeocode

# Load the CSV file
file_path = "DOB_Sustainability_Compliance_Map__Local_Law_33_20250118.csv"
output_path = "geocoded_addresses.csv"

# Replace with your API key
api_key = "03a7c62912c348ecb99f661480e53cf3"
geocoder = OpenCageGeocode(api_key)

# Define a function to geocode addresses
def geocode_address(address, borough):
    query = f"{address}, {borough}, New York, USA"
    result = geocoder.geocode(query, no_annotations='1', limit=1)
    if result:
        return result[0]['geometry']['lat'], result[0]['geometry']['lng']
    return None, None

# Load the dataset
data = pd.read_csv(file_path)

# Geocode the addresses
data['Latitude'], data['Longitude'] = zip(*data.apply(
    lambda row: geocode_address(row['Address'], row['BoroughName']), axis=1
))

# Save the updated dataset
data.to_csv(output_path, index=False)
print(f"Geocoded data saved to {output_path}")