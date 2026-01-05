FROM python:3.9-slim

WORKDIR /app

COPY feature_engineering.py .

RUN pip install pandas

ENTRYPOINT ["python", "feature_engineering.py"]
