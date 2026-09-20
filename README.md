# NaukriShield 🛡️

> **Understand the risk. Before you trust the offer.**  
> An explainable job and internship scam risk checker for students and early-career job seekers.  
> *Developed for Hackday 1.0 — Logic Legion*

---

## 📌 Features

- **Hybrid Scam Detection**:
  - **TF-IDF Statistical Scoring Engine**: Trained n-gram log-odds model identifying suspicious recruitment patterns and vocabulary.
  - **Contextual Red-Flag Rule Engine**: Regex & contextual pattern detectors for advance-fee requests, UPI/GPay transfers, unofficial Telegram/WhatsApp recruiter handles, and urgent pressure tactics.
  - **Contextual Negation Safeguards**: Strict negation-awareness ensuring authentic anti-fraud disclaimers (e.g. *"Our company will never ask for registration fees"*) are **not** falsely flagged.
  - **Honest Uncertainty**: Returns `INSUFFICIENT_INFO` for short text (< 15 characters) and displays transparent limitations regarding employer identity verification.
- **Explainable Results**:
  - Exact evidence spans with character offsets (`start`, `end`).
  - Interactive Text Highlighter that marks and connects suspicious phrases in the message to plain-language explanations.
  - Actionable Verification Checklist tailored to candidate safety.
- **MERN Stack Integration**:
  - Built with **MongoDB**, **Express.js**, **React.js**, and **Node.js**.
  - Persists scan history and community statistics in MongoDB.
  - Responsive desktop side-by-side and mobile single-column layout with Tailwind CSS.

---

## 🏗️ Architecture & Shared API Contract

### `POST /api/analyze`
**Request**:
```json
{
  "text": "Congratulations! Selected for Data Entry. Salary Rs 35,000. No interview required. Pay Rs 1,999 registration fee via GPay within 2 hours."
}
```

**Response**:
```json
{
  "risk_category": "HIGH",
  "risk_score": 1.0,
  "model_assessment": {
    "label": "Suspicious / High Risk",
    "probability": 1.0,
    "confidence": 0.99,
    "method": "TF-IDF + N-gram Scoring Engine (Optuna tuned)",
    "top_indicators": ["rs", "registration fee", "pay rs", "no interview", "gpay"]
  },
  "evidence_spans": [
    {
      "phrase": "Pay Rs 1,999",
      "category": "Advance Fee Demand",
      "reason": "Legitimate employers never require candidates to pay registration, processing, uniform, or laptop security fees.",
      "severity": "CRITICAL",
      "start": 83,
      "end": 95
    }
  ],
  "next_steps": [
    "⛔ DO NOT transfer any money, registration fees, or security deposits.",
    "🌐 Independently verify the job requisition on the employer's official careers portal."
  ],
  "limitations": [
    "Employer identity has NOT been independently verified.",
    "A LOW risk score is not an absolute guarantee of authenticity."
  ],
  "analysis_version": "1.0.0-hackday",
  "char_count": 137,
  "word_count": 21
}
```

### Additional Endpoints
- `GET /api/history`: Recent scan reports from MongoDB.
- `GET /api/stats`: Aggregate scan counts (total, high risk, moderate risk, safe).
- `GET /api/health`: Health status & database connectivity probe.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v22)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev   # or npm start
```
The backend server runs on `http://localhost:5000`.

To run backend tests:
```bash
npm test
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## 🧪 Demo Scenarios

The web interface comes with 4 pre-configured test scenarios:
1. **🚨 High Risk Fee Scam**: Direct selection without interview demanding Rs 1,999 registration via GPay/WhatsApp.
2. **⚠️ Ambiguous Telegram Recruiter**: Candidate redirected to a Telegram channel with premature Aadhaar/PAN collection.
3. **🛡️ Legitimate (Negated Fee Disclaimer)**: TCS recruitment notice stating that TCS never charges any registration fees.
4. **✅ Authentic Offer Invitation**: Standard corporate interview invitation with Google Meet link and no fees.

---

## 👥 Team: Logic Legion
- **Lakshay Gauniyal**: AI / ML & Scam Detection Logic
- **MERN Teammate**: Frontend, Full-stack integration, and deployment
