#!/bin/bash

# MediaPlanPro - Comprehensive Test Suite Runner
# This script runs all tests and generates coverage reports

set -e

echo "🧪 MediaPlanPro - Running Comprehensive Test Suite"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Running npm install..."
    npm install
fi

# Create test results directory
mkdir -p test-results

# Run unit tests
print_status "Running unit tests..."
npm test -- --testPathPattern="__tests__/(lib|services)" --coverage --coverageDirectory=test-results/unit-coverage || {
    print_error "Unit tests failed"
    exit 1
}
print_success "Unit tests completed"
echo ""

# Run integration tests
print_status "Running integration tests..."
npm test -- --testPathPattern="__tests__/integration" --coverage --coverageDirectory=test-results/integration-coverage || {
    print_error "Integration tests failed"
    exit 1
}
print_success "Integration tests completed"
echo ""

# Run API tests
print_status "Running API tests..."
npm test -- --testPathPattern="__tests__/api" --coverage --coverageDirectory=test-results/api-coverage || {
    print_error "API tests failed"
    exit 1
}
print_success "API tests completed"
echo ""

# Run UI tests
print_status "Running UI tests..."
npm test -- --testPathPattern="__tests__/ui" --coverage --coverageDirectory=test-results/ui-coverage || {
    print_error "UI tests failed"
    exit 1
}
print_success "UI tests completed"
echo ""

# Run E2E tests
print_status "Running E2E tests..."
npm test -- --testPathPattern="__tests__/e2e" --coverage --coverageDirectory=test-results/e2e-coverage || {
    print_error "E2E tests failed"
    exit 1
}
print_success "E2E tests completed"
echo ""

# Generate combined coverage report
print_status "Generating combined coverage report..."
npm test -- --coverage --coverageDirectory=test-results/combined-coverage || {
    print_warning "Coverage report generation had issues"
}
print_success "Coverage report generated"
echo ""

# Display summary
echo "=================================================="
echo "✅ All tests completed successfully!"
echo "=================================================="
echo ""
echo "📊 Test Results Summary:"
echo "  - Unit Tests: ✓"
echo "  - Integration Tests: ✓"
echo "  - API Tests: ✓"
echo "  - UI Tests: ✓"
echo "  - E2E Tests: ✓"
echo ""
echo "📁 Coverage reports available in:"
echo "  - test-results/combined-coverage/"
echo ""
echo "To view coverage report, run:"
echo "  open test-results/combined-coverage/lcov-report/index.html"
echo ""

