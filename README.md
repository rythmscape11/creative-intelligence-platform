# Creative Intelligence Platform

A production-grade SaaS for CMOs and agencies to analyze, score, and optimize creative assets.

## Architecture

```
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── core/      # Config & database
│   │   ├── models/    # SQLAlchemy & Pydantic models
│   │   ├── services/  # Analysis services
│   │   │   ├── vision/    # OpenCV deterministic analysis
│   │   │   ├── ocr/       # Text extraction
│   │   │   ├── llm/       # OpenAI Vision & Copy analysis
│   │   │   └── scoring/   # Scoring & recommendations
│   │   └── main.py    # FastAPI app
│   └── requirements.txt
│
└── frontend/          # Next.js React frontend
    └── src/
        ├── app/       # Pages
        └── components/# UI components
```

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your OPENAI_API_KEY
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Key Features

- **100+ Signals**: Deterministic (OpenCV) + AI (GPT-4V) analysis
- **6 Pillars**: Attention, Brand, Message, Emotion, Culture, Action
- **Explainable Scoring**: Every score traces to specific signals
- **Recommendations**: Specific fixes with impact estimates
- **India-First**: Cultural relevance for Indian markets

## API Endpoints

- `POST /api/v1/analyze` - Analyze uploaded creative
- `POST /api/v1/analyze/url` - Analyze creative from URL
- `POST /api/v1/compare` - Compare two creatives

## Cost Control

- Deterministic analysis runs first (no AI cost)
- Resolution capped at 1024x1024 for Vision API
- Token budgets per user tier
- Fallback to deterministic-only if quota exceeded
