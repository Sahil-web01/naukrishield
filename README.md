# NaukriShield 🛡️

> **Understand the risk. Before you trust the offer.**  
> An explainable job and internship scam risk checker for students and early-career job seekers.  
> *Built for Hackday 1.0 by Team Logic Legion*

---

## 📌 Overview

Students and fresh graduates frequently receive fraudulent job and internship offers through WhatsApp, Telegram, email, and unverified job portals. Scammers pressure candidates into paying upfront registration charges, laptop deposits, or gate pass fees while masquerading as reputable companies.

**NaukriShield** solves this by providing **explainable fraud detection**. Instead of a black-box percentage, it highlights the exact suspicious phrases in the message, explains the plain-language reason why each phrase is a red flag, and suggests concrete verification steps before the student sends money or documents.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide React Icons |
| **Backend** | Node.js, Express.js, Mongoose, REST API |
| **Machine Learning** | Python, Scikit-learn (Linear SVM + Sparse TF-IDF Pipeline), Pandas, NumPy, Joblib |
| **ML Microservice** | FastAPI, Uvicorn, Pydantic |
| **Database** | MongoDB (MongoDB Atlas Cloud Cluster with automatic local fallback) |
| **Architecture** | Hybrid: Express REST API + Direct Python ML Bridge + FastAPI Service |

---

## 🌟 Key Features & Innovations

1. **Hybrid Detection Engine**:
   - **Trained Linear SVM Classifier**: Trained on the EMSCAD (Fake Job Postings) dataset with sparse TF-IDF and structured metadata features selected using Optuna hyperparameter tuning.
   - **Contextual Red-Flag Rule Engine**: Regex heuristics specifically tuned for Indian recruitment scams (UPI/QR demands, GPay/PhonePe, WhatsApp/Telegram recruiters, urgency pressure, direct selection without interview).
2. **Context-Sensitive Negation Safeguard**:
   - Intelligently recognizes anti-fraud disclaimers (e.g. *"TCS will never ask for registration fees or security deposits"*). Clauses containing negation terms are **never** falsely flagged as fee demands.
3. **Interactive Evidence Highlighter**:
   - Quotes and visually marks the exact character spans (`start`, `end`) in the message with severity color badges (Critical, High, Medium).
4. **Actionable Verification Checklist**:
   - Step-by-step guidance tailored to the candidate (e.g. checking company career portals, searching phone numbers with "scam", verifying corporate email domains).
5. **Honest Uncertainty & Transparency**:
   - If input text is shorter than 15 characters, the system reports `INSUFFICIENT_INFO` rather than misleading confidence. Clearly states that employer identity is not verified.
6. **MongoDB Scan Persistence**:
   - Scans are automatically saved to MongoDB Atlas, enabling candidates to review recent scans and view aggregate scam statistics.

---

## 📁 Project Structure

```text
naukrishield/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & local fallback
│   ├── controllers/
│   │   └── analyzeController.js   # Analysis, history, and stats controllers
│   ├── models/
│   │   └── ScanReport.js          # Mongoose schema for scan persistence
│   ├── routes/
│   │   └── analyzeRoutes.js       # Express routes (/analyze, /history, /stats, /health)
│   ├── services/
│   │   ├── analyzerService.js     # Hybrid arbitrator (combines ML + Rules)
│   │   ├── mlBridge.js            # Node-to-Python execution bridge
│   │   ├── ruleEngine.js          # Contextual red-flag rules & negation logic
│   │   └── tfidfScorer.js         # Fast statistical n-gram scorer
│   ├── tests/
│   │   └── analyze.test.js        # Automated test suite (6/6 passing)
│   ├── package.json
│   └── server.js                  # Express server entry point (Port 5000)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Live connection pill & scan history button
│   │   │   ├── InputPanel.jsx     # Message textarea & analysis CTA
│   │   │   ├── PresetScenarios.jsx# 4 one-click test samples
│   │   │   ├── ResultPanel.jsx    # Risk gauge scorecard & model diagnostics
│   │   │   ├── TextHighlighter.jsx# Interactive inline evidence highlighter
│   │   │   ├── EvidenceList.jsx   # Detailed cards with quotes and reasons
│   │   │   ├── NextSteps.jsx      # Actionable verification checklist
│   │   │   ├── LimitationsBox.jsx # Honest uncertainty disclaimer
│   │   │   └── HistoryModal.jsx   # Recent scans drawer from MongoDB
│   │   ├── services/
│   │   │   └── api.js             # API client connecting to backend
│   │   ├── utils/
│   │   │   └── presets.js          # Curated test scenarios
│   │   ├── App.jsx                # Main workstation dashboard
│   │   ├── index.css              # Glassmorphic styles & design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js             # Vite configuration & proxy
│
└── ml/
    └── notebooks/
        ├── app.py                 # FastAPI ML inference microservice (Port 8000)
        ├── feature_engineering.py # Text & missingness feature transformers
        ├── inference.py           # Model loading & decision_function logic
        ├── model_metadata.json    # Optimal threshold (0.0663) & test metrics
        ├── naukrishield_hybrid_svm.joblib # Serialized Linear SVM pipeline
        └── training.ipynb         # Model training & Optuna evaluation notebook
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** (v18 or newer)
- **Python** (v3.10 or newer)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

---

### Step 1: Start the Backend Server

Open a terminal and navigate to `backend/`:

```bash
cd backend
npm install
npm run dev
```

> **Backend runs on:** `http://localhost:5000`  
> *(Connects to MongoDB and automatically integrates the Python ML model)*

---

### Step 2: Start the Frontend Application

Open a second terminal and navigate to `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

> **Frontend runs on:** `http://localhost:5173` (or `http://localhost:5174`)  
> Open the URL in your browser to start scanning recruitment messages.

---

### Step 3 (Optional): Start the Standalone ML Microservice

The Node.js backend invokes the ML pipeline automatically via Python. If you wish to run the ML model as an independent FastAPI REST API:

Open a third terminal:

```bash
cd ml/notebooks
uvicorn app:app --reload --port 8000
```

> **ML API runs on:** `http://127.0.0.1:8000`  
> **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

---

## 🧪 Quick Demo Scenarios

The web application includes **4 pre-loaded demonstration scenarios**:

1. **🚨 Fee Scam**: High-risk advance fee demand (salary Rs 35,000, no interview, pay Rs 1,999 registration fee on WhatsApp within 2 hours).
2. **⚠️ Telegram Job**: Ambiguous offer redirecting to an informal Telegram group with premature Aadhaar/PAN collection.
3. **🛡️ Legitimate Warning**: Official corporate notice stating that the company *never* asks for registration fees (demonstrating false-positive resistance).
4. **✅ Standard Offer**: Verified technical interview invitation via Google Meet with clear onboarding guidelines.

---

## 🧪 Running Automated Tests

Run the test suite inside `backend/`:

```bash
cd backend
npm test
```

All 6 test cases verify:
- Advance fee detection with character offsets
- Negation handling for anti-fraud warnings
- Statistical TF-IDF keyword weights
- Short-text safeguard (`INSUFFICIENT_INFO`)
- Hybrid SVM model classification

---

## 👥 Team Logic Legion
- **Lakshay Gauniyal**: AI / Machine Learning & Model Optimization
- **MERN Teammate**: Full-stack architecture, frontend UX, and backend API integration
