#!/bin/bash
# Quick Start Script for Agency OS
# Sets up everything for development

set -e

echo "🚀 Agency OS Quick Start"
echo "========================"
echo ""

# Check prerequisites
check_prereq() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is required but not installed."
        exit 1
    fi
    echo "✅ $1 found"
}

echo "Checking prerequisites..."
check_prereq docker
check_prereq docker-compose
check_prereq python3

# Create .env if needed
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "   Edit .env to configure your settings"
fi

# Create Python virtual environment
if [ ! -d "venv" ]; then
    echo ""
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate and install dependencies
echo ""
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -q -r extensions/requirements.txt

# Start Docker services
echo ""
echo "🐳 Starting Docker services..."
docker-compose -f docker-compose.agency.yml up -d

# Wait for services
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Run migrations
echo ""
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.agency.yml exec -T plane-db psql -U plane -d plane -f /docker-entrypoint-initdb.d/99-extensions.sql 2>/dev/null || echo "   (migrations may have already been applied)"

# Health check
echo ""
echo "🔍 Checking service health..."
echo ""

# Check Plane Web
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Plane Web:      http://localhost:3000"
else
    echo "⏳ Plane Web:      Starting... (http://localhost:3000)"
fi

# Check Plane API
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/ | grep -q "200\|401"; then
    echo "✅ Plane API:      http://localhost:8000"
else
    echo "⏳ Plane API:      Starting... (http://localhost:8000)"
fi

# Start extension API locally
echo ""
echo "🔧 Starting Extension API locally..."
cd extensions
nohup uvicorn api.main:app --host 0.0.0.0 --port 8080 --reload > /tmp/agency-os-api.log 2>&1 &
cd ..

sleep 3

if curl -s http://localhost:8080/health | grep -q "healthy\|degraded"; then
    echo "✅ Extension API:  http://localhost:8080"
    echo "✅ API Docs:       http://localhost:8080/docs"
else
    echo "⏳ Extension API:  Starting... (http://localhost:8080)"
fi

echo ""
echo "========================================"
echo "🎉 Agency OS is ready!"
echo "========================================"
echo ""
echo "Quick commands:"
echo "  make logs      - View Docker logs"
echo "  make stop      - Stop all services"
echo "  make test      - Run tests"
echo ""
echo "API Documentation: http://localhost:8080/docs"
echo ""
