from pathlib import Path
import json
import joblib

ROOT = Path(__file__).resolve().parents[1]

def export():
    bundle = joblib.load(ROOT / "ml/model.joblib")
    trees = []
    for estimator in bundle["model"].estimators_:
        t = estimator.tree_
        trees.append(dict(left=t.children_left.tolist(), right=t.children_right.tolist(),
            feature=t.feature.tolist(), threshold=t.threshold.tolist(),
            value=t.value[:, 0, 0].tolist()))
    payload = dict(model_type="RandomForestRegressor", version=1, synthetic=True,
        features=bundle["features"], trees=trees, metrics=bundle["metrics"],
        bounds=dict(days_to_event=[2,45], demand_index=[.1,1],
            available_listings=[4,100], seat_quality=[1,3]))
    (ROOT / "data/model.json").write_text(json.dumps(payload, separators=(",", ":")))
    print(f"Exported {len(trees)} trees")

if __name__ == "__main__":
    export()
