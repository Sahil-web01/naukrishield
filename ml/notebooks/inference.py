
import os
import json
import joblib
import pandas as pd
import numpy as np

from feature_engineering import (
    add_engineered_features
)


import numpy as np
import pandas as pd


def normalize_api_input(job_data: dict) -> dict:
    """
    Convert JSON-compatible missing values (None)
    back to np.nan so inference matches training.
    """
    return {
        key: np.nan if value is None else value
        for key, value in job_data.items()
    }

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "naukrishield_hybrid_svm.joblib"
)

METADATA_PATH = os.path.join(
    BASE_DIR,
    "model_metadata.json"
)


model = joblib.load(
    MODEL_PATH
)

with open(
    METADATA_PATH,
    "r"
) as f:
    metadata = json.load(f)


THRESHOLD = float(
    metadata["decision_threshold"]
)


def predict_job(job_data):
    """
    job_data:
        Python dictionary containing
        one raw job posting.

    Returns:
        prediction,
        label,
        decision score,
        threshold
    """
    
    job_data = normalize_api_input(job_data)
    
    raw_df = pd.DataFrame(
        [job_data]
    )

    engineered_df = (
        add_engineered_features(
            raw_df
        )
    )

    decision_score = float(
        model.decision_function(
            engineered_df
        )[0]
    )

    prediction = int(
        decision_score >= THRESHOLD
    )

    label = (
        "Fraudulent"
        if prediction == 1
        else "Legitimate"
    )

    return {
        "prediction": prediction,
        "label": label,
        "decision_score": decision_score,
        "threshold": THRESHOLD
    }
