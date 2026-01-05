import argparse
import pandas as pd
import os

def normalize_data(input_path, output_path):
    """
    Normalizes numerical features in the dataset.
    """
    print(f"Reading data from {input_path}...")
    # Mock reading (since we don't have real files in this artifact context)
    # In production: df = pd.read_csv(input_path)
    
    # Create dummy data for demonstration
    df = pd.DataFrame({
        'compliance_score': [2.5, 8.1, 5.0, 9.9],
        'risk_score': [100, 20, 50, 10]
    })
    
    print("Normalizing data...")
    # Min-Max Normalization
    for col in df.columns:
        df[col] = (df[col] - df[col].min()) / (df[col].max() - df[col].min())
        
    print(f"Writing normalized data to {output_path}...")
    # In production: df.to_csv(output_path, index=False)
    print(df.head())

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_data', type=str, help='Path to input data')
    parser.add_argument('--output_data', type=str, help='Path to output data')
    args = parser.parse_args()
    
    normalize_data(args.input_data, args.output_data)
