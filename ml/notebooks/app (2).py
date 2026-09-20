
from typing import Any

from fastapi import FastAPI, HTTPException

from inference import predict_job


app = FastAPI(
    title="NaukriShield ML API",
    description="Fake Job Posting Detection API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "NaukriShield ML API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Hybrid Linear SVM"
    }


@app.post("/predict")
def predict_job_posting(
    job_data: dict[str, Any]
):
    try:

        result = predict_job(
            job_data
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
