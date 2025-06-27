import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error
import joblib
import os

def load_data(filepath):
    df = pd.read_csv(filepath)
    # Example: Assume columns are ['date', 'symbol', 'feature1', ..., 'shadow_price']
    X = df.drop(['date', 'symbol', 'shadow_price'], axis=1)
    y = df['shadow_price']
    return X, y

def train_gbm(X, y):
    tscv = TimeSeriesSplit(n_splits=5)
    model = lgb.LGBMRegressor()
    param_grid = {
        'n_estimators': [100, 200],
        'learning_rate': [0.01, 0.1],
        'max_depth': [3, 5]
    }
    grid = GridSearchCV(model, param_grid, cv=tscv, scoring='neg_mean_absolute_error')
    grid.fit(X, y)
    print(f"Best MAE: {-grid.best_score_:.4f}")
    return grid.best_estimator_

def save_model(model, path='models/gbm_shadow.pkl'):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True)
    args = parser.parse_args()
    X, y = load_data(args.data)
    model = train_gbm(X, y)
    save_model(model)
