#!/bin/bash

# Grid Demo 快速启动脚本
# Quick start script for Grid Demo

set -e

echo "🚀 Grid Component Demo - Quick Start"
echo "======================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm found: $(pnpm --version)"
echo ""

# Check if we're in the demo directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the demo directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo ""

# Check if Grid package is built
GRID_DIST="../packages/grid-table-kanban/dist"
if [ ! -d "$GRID_DIST" ]; then
    echo "⚠️  Grid package not built. Building now..."
    cd ../packages/grid-table-kanban
    pnpm build
    cd ../../demo
    echo "✅ Grid package built successfully"
    echo ""
fi

# Start dev server
echo "🎯 Starting development server..."
echo ""
echo "📍 The demo will be available at:"
echo "   http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev