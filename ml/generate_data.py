from pathlib import Path
import json
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
FEATURES = ["days_to_event", "demand_index", "available_listings", "seat_quality"]

def generate():
    rng = np.random.default_rng(42)
    n = 1800
    days = rng.integers(2, 46, n)
    demand = rng.uniform(0.1, 1, n)
    supply = rng.integers(4, 101, n)
    quality = rng.integers(1, 4, n)
    face = rng.choice([200, 250, 300, 400, 600, 800], n)
    ratio = (1.04 + .34*demand + .055*(quality-1)
             - .0016*supply + .0015*days
             - .06*(days < 5)*(demand < .5) + rng.normal(0, .035, n))
    ratio = np.clip(ratio, .85, 1.65)
    df = pd.DataFrame(dict(transaction_id=[f"SYN-{i:04d}" for i in range(n)],
        days_to_event=days, demand_index=np.round(demand, 3),
        available_listings=supply, seat_quality=quality, face_value=face,
        sold_price=np.round(face*ratio, 2)))
    (ROOT / "data").mkdir(exist_ok=True)
    df.to_csv(ROOT / "data/synthetic_sales.csv", index=False)
    (ROOT / "data/comparables.json").write_text(df.to_json(orient="records"))
    profiles = {
        "REV-KT-7119": dict(days_to_event=10, demand_index=.86, available_listings=18, seat_quality=2),
        "REV-KT-3341": dict(days_to_event=7, demand_index=.59, available_listings=42, seat_quality=3)
    }
    (ROOT / "data/listings.json").write_text(json.dumps({"synthetic": True,
        "snapshot_label": "Fixed fictional market snapshot; not live event dates",
        "profiles": profiles, "default_profile": dict(days_to_event=14,
        demand_index=.55, available_listings=40, seat_quality=2)}, indent=2))
    print(f"Generated {len(df)} synthetic sales")

if __name__ == "__main__":
    generate()
