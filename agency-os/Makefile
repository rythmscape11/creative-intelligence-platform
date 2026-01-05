# Agency OS Makefile
# Convenience commands for development and deployment

.PHONY: help install dev start stop logs test migrate clean

# Default target
help:
	@echo "Agency OS Commands"
	@echo "=================="
	@echo ""
	@echo "Development:"
	@echo "  make install    - Install Python dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make test       - Run tests"
	@echo ""
	@echo "Docker:"
	@echo "  make start      - Start all services"
	@echo "  make stop       - Stop all services"
	@echo "  make logs       - View service logs"
	@echo "  make restart    - Restart all services"
	@echo ""
	@echo "Database:"
	@echo "  make migrate    - Run extension migrations"
	@echo "  make db-shell   - Open PostgreSQL shell"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make lint       - Run linter"

# =============================================================================
# Development
# =============================================================================

install:
	cd extensions && pip install -r requirements.txt

dev:
	cd extensions && uvicorn api.main:app --reload --host 0.0.0.0 --port 8080

test:
	cd extensions && pytest tests/ -v

lint:
	cd extensions && python -m flake8 . --exclude=__pycache__

# =============================================================================
# Docker Commands
# =============================================================================

start:
	docker-compose -f docker-compose.agency.yml up -d

stop:
	docker-compose -f docker-compose.agency.yml down

restart:
	docker-compose -f docker-compose.agency.yml restart

logs:
	docker-compose -f docker-compose.agency.yml logs -f

logs-api:
	docker-compose -f docker-compose.agency.yml logs -f agency-extensions

logs-plane:
	docker-compose -f docker-compose.agency.yml logs -f api web

build:
	docker-compose -f docker-compose.agency.yml build

# =============================================================================
# Database
# =============================================================================

migrate:
	docker-compose -f docker-compose.agency.yml exec plane-db \
		psql -U plane -d plane -f /docker-entrypoint-initdb.d/99-extensions.sql

db-shell:
	docker-compose -f docker-compose.agency.yml exec plane-db psql -U plane -d plane

db-backup:
	docker-compose -f docker-compose.agency.yml exec plane-db \
		pg_dump -U plane plane > backup-$(shell date +%Y%m%d-%H%M%S).sql

# =============================================================================
# Cleanup
# =============================================================================

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name ".DS_Store" -delete 2>/dev/null || true

clean-docker:
	docker-compose -f docker-compose.agency.yml down -v --remove-orphans

# =============================================================================
# Quick Commands
# =============================================================================

# One-command setup for new developers
setup: 
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@make start
	@sleep 10
	@make migrate
	@echo "Setup complete! Visit http://localhost:3000"

# Health check
health:
	@echo "Checking services..."
	@curl -s http://localhost:8080/health | python -m json.tool || echo "Extension API: Not responding"
	@curl -s http://localhost:8000/api/v1/ | head -c 100 || echo "Plane API: Not responding"
	@echo ""

# Quick start with venv
quickstart:
	./scripts/quickstart.sh

# Seed sample data
seed:
	./scripts/seed-data.sh

# Full reset
reset: clean-docker setup seed
	@echo "Full reset complete!"
