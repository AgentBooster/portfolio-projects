import pandas as pd
import numpy as np

def generate_calendar(year=2022):
    # Full year hourly frequency
    idx = pd.date_range(start=f'{year}-01-01', end=f'{year}-12-31 23:00:00', freq='h')
    df = pd.DataFrame(index=idx)
    
    # Features
    df['hour'] = idx.hour
    df['day_of_week'] = idx.dayofweek
    df['month'] = idx.month
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Academic Periods (Mock based on UCU typical)
    # Semester 1: March 1 - June 30
    # Exams 1: July 1 - July 31
    # Semester 2: August 1 - November 30
    # Exams 2: December 1 - December 20
    # Summer Recess: Jan, Feb
    
    df['is_semester'] = 0
    df.loc[(idx.month >= 3) & (idx.month <= 6), 'is_semester'] = 1
    df.loc[(idx.month >= 8) & (idx.month <= 11), 'is_semester'] = 1
    
    df['is_exam'] = 0
    df.loc[idx.month == 7, 'is_exam'] = 1
    df.loc[(idx.month == 12) & (idx.day <= 20), 'is_exam'] = 1
    
    # Holidays (Simplified key dates)
    holidays = [
        f'{year}-01-01', f'{year}-05-01', f'{year}-07-18', f'{year}-08-25', f'{year}-12-25'
    ]
    df['is_holiday'] = 0
    for h in holidays:
        df.loc[idx.strftime('%Y-%m-%d') == h, 'is_holiday'] = 1
        
    return df

if __name__ == "__main__":
    df = generate_calendar()
    print(df.head())
    print(df.describe())
