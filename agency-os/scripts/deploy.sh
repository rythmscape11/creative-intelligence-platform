#!/bin/bash
# Agency OS Deployment Script

set -e

echo "🚀 Deploying Agency OS..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your configuration before running again."
    exit 1
fi

# Pull latest images
echo "📦 Pulling latest images..."
docker-compose -f docker-compose.agency.yml pull

# Run database migrations (extension tables)
echo "🗄️  Running extension migrations..."
docker-compose -f docker-compose.agency.yml run --rm agency-extensions \
    psql -h plane-db -U plane -d plane -f /app/migrations/init.sql || true

# Start all services
echo "🔄 Starting services..."
docker-compose -f docker-compose.agency.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
echo "🔍 Checking service health..."

# Check Plane API
if curl -s http://localhost:8000/api/v1/health/ > /dev/null 2>&1; then
    echo "✅ Plane API: Healthy"
else
    echo "⚠️  Plane API: Not responding (may still be starting)"
fi

# Check Extension API
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Extension API: Healthy"
else
    echo "⚠️  Extension API: Not responding (may still be starting)"
fi

# Check Plane Web
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Plane Web: Healthy"
else
    echo "⚠️  Plane Web: Not responding (may still be starting)"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "   Plane Web:      http://localhost:3000"
echo "   Plane API:      http://localhost:8000"
echo "   Extension API:  http://localhost:8080"
echo "   API Docs:       http://localhost:8080/docs"
echo ""
echo "Run 'docker-compose -f docker-compose.agency.yml logs -f' to view logs"
