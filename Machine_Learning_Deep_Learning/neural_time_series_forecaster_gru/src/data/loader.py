import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
from pathlib import Path

class EnergyDataLoader:
    def __init__(self, data_path, seq_length=24):
        self.data_path = data_path
        self.seq_length = seq_length
        self.scaler = MinMaxScaler()
        self.feature_columns = []
        
    def load_and_process(self, building_name=None, existing_df=None):
        if existing_df is not None:
            df = existing_df.copy()
        else:
            df = pd.read_csv(self.data_path)
        
        if building_name:
            df['building_name'] = df['building_name'].str.strip()
            building_name = building_name.strip()
            df = df[df['building_name'] == building_name].copy()
            
        # Convert timestamp
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.sort_values('timestamp', inplace=True)
        
        # Feature Engineering
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['month'] = df['timestamp'].dt.month
        
        # Cyclic features
        df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['sin_day'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['cos_day'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12)
        df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12)
        
        # Select features
        self.feature_columns = ['consumption_kWh', 'sin_hour', 'cos_hour', 
                                'sin_day', 'cos_day', 'sin_month', 'cos_month', 
                                'is_weekend', 'is_holiday', 'is_semester', 'is_exam']
        
        data = df[self.feature_columns].values
        return data, df['timestamp'].values
        
    def split_train_test(self, data, train_ratio=0.8):
        train_size = int(len(data) * train_ratio)
        train_data = data[:train_size]
        test_data = data[train_size:]
        return train_data, test_data
        
    def scale_data(self, train_data, test_data):
        # Fit on train, transform both
        train_scaled = self.scaler.fit_transform(train_data)
        test_scaled = self.scaler.transform(test_data)
        return train_scaled, test_scaled
        
    def create_sequences(self, data):
        X, y = [], []
        for i in range(len(data) - self.seq_length):
            X.append(data[i:i+self.seq_length])
            y.append(data[i+self.seq_length, 0]) # Target: consumption_kWh (index 0)
        return np.array(X), np.array(y)
    
    def save_scaler(self, path):
        joblib.dump(self.scaler, path)
        
    def load_scaler(self, path):
        self.scaler = joblib.load(path)
