#!/bin/bash

# Grid Table Kanban Demo 启动脚本

echo "🚀 启动 Grid Table Kanban Demo..."
echo ""

# 检查 Node.js 版本
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 16+ 版本"
    exit 1
fi

echo "📦 Node.js 版本: $node_version"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 demo 目录中运行此脚本"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

echo "✅ 依赖检查完成"
echo ""

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "   应用将在 http://localhost:3000 启动"
echo "   按 Ctrl+C 停止服务器"
echo ""

npm run dev
