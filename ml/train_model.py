from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[1]
FEATURES = ["days_to_event", "demand_index", "available_listings", "seat_quality"]

def train():
    df = pd.read_csv(ROOT / "data/synthetic_sales.csv")
    train, test = train_test_split(df, test_size=.2, random_state=42)
    y = train.sold_price / train.face_value
    model = RandomForestRegressor(n_estimators=24, max_depth=6,
        min_samples_leaf=8, random_state=42, n_jobs=1)
    model.fit(train[FEATURES], y)
    ratio = model.predict(test[FEATURES])
    predicted = ratio * test.face_value.to_numpy()
    residual = np.abs(test.sold_price.to_numpy() - predicted) / test.face_value.to_numpy()
    baseline_ratio = float(np.median(y))
    metrics = dict(synthetic=True, train_rows=len(train), test_rows=len(test),
        mae_hkd=round(mean_absolute_error(test.sold_price, predicted), 2),
        baseline_mae_hkd=round(mean_absolute_error(test.sold_price,
            test.face_value * baseline_ratio), 2),
        residual_p80_ratio=float(np.quantile(residual, .8)),
        note="Held-out synthetic test set only. Not real-world performance; band is a residual guide, not a calibrated confidence interval.")
    joblib.dump(dict(model=model, features=FEATURES, metrics=metrics), ROOT / "ml/model.joblib")
    (ROOT / "data/metrics.json").write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    train()
