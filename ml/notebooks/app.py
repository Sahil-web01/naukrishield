from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from inference import predict_job

app = FastAPI(
    title="NaukriShield ML API",
    description="Hybrid TF-IDF + Linear SVM Inference API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NaukriShield ML API is running"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Hybrid TF-IDF + Linear SVM"
    }

@app.post("/predict")
def predict_job_posting(job_data: dict[str, Any]):
    try:
        return predict_job(job_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
