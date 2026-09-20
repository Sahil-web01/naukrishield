import os
import json
import sys
import joblib
import pandas as pd
import numpy as np

from feature_engineering import add_engineered_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "naukrishield_hybrid_svm.joblib")
METADATA_PATH = os.path.join(BASE_DIR, "model_metadata.json")

model = joblib.load(MODEL_PATH)

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)

THRESHOLD = float(metadata.get("decision_threshold", 0.0663))


def normalize_api_input(job_data: dict) -> dict:
    normalized = {}
    raw_cols = metadata.get("raw_input_columns", [])
    main_text = job_data.get("text") or job_data.get("description") or ""

    for col in raw_cols:
        val = job_data.get(col)
        if val is None or (isinstance(val, float) and np.isnan(val)):
            if col in ["telecommuting", "has_company_logo", "has_questions"]:
                normalized[col] = 0
            elif col in ["text", "description", "description_clean"]:
                normalized[col] = main_text
            elif col in ["title", "title_clean"]:
                normalized[col] = job_data.get("title") or "Job Post"
            elif col in [
                "company_profile",
                "company_profile_clean",
                "requirements",
                "requirements_clean",
                "benefits",
                "benefits_clean",
            ]:
                normalized[col] = ""
            else:
                normalized[col] = np.nan
        else:
            if col in ["telecommuting", "has_company_logo", "has_questions"]:
                try:
                    normalized[col] = int(val)
                except (ValueError, TypeError):
                    normalized[col] = 0
            else:
                normalized[col] = val

    if not normalized.get("text"):
        normalized["text"] = main_text

    return normalized


def predict_job(job_data: dict) -> dict:
    job_data = normalize_api_input(job_data)
    raw_df = pd.DataFrame([job_data])
    engineered_df = add_engineered_features(raw_df)

    decision_score = float(model.decision_function(engineered_df)[0])
    prediction = int(decision_score >= THRESHOLD)
    margin = decision_score - THRESHOLD
    probability = float(1 / (1 + np.exp(-2.5 * margin)))

    label = "Fraudulent" if prediction == 1 else "Legitimate"

    return {
        "prediction": prediction,
        "label": label,
        "decision_score": round(decision_score, 4),
        "probability": round(probability, 4),
        "threshold": round(THRESHOLD, 4),
        "model_name": metadata.get("model_name", "Hybrid TF-IDF + Linear SVM")
    }


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw_input = sys.argv[1]
        try:
            payload = json.loads(raw_input)
        except Exception:
            payload = {"text": raw_input}
    else:
        payload = json.loads(sys.stdin.read())

    result = predict_job(payload)
    print(json.dumps(result))
