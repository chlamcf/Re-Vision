from pathlib import Path
import json
import subprocess
import tempfile
import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]

def test():
    bundle = joblib.load(ROOT / 'ml/model.joblib')
    df = pd.read_csv(ROOT / 'data/synthetic_sales.csv').sample(100, random_state=8)
    features = bundle['features']
    expected = bundle['model'].predict(df[features])
    cases = [dict(profile=row, expected=float(pred)) for row, pred in
        zip(df[features].to_dict(orient='records'), expected)]
    with tempfile.TemporaryDirectory() as temp:
        file = Path(temp) / 'cases.json'
        file.write_text(json.dumps(cases))
        subprocess.run(['node', str(ROOT / 'tests/check_export.js'), str(file)], check=True)

if __name__ == '__main__':
    test()
