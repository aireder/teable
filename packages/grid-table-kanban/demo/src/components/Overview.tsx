import React from 'react'

interface OverviewProps {
  onNavigate: (page: 'overview' | 'grid' | 'kanban') => void
}

const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div>
      <div className="demo-section">
        <div className="demo-header">
          <h2>Grid Table Kanban 演示</h2>
          <p>高性能的基于 Canvas 的表格和看板系统</p>
        </div>
        
        <div className="demo-content">
          <div className="info-box">
            <h3>欢迎使用 Grid Table Kanban Demo</h3>
            <p>
              这是一个完整的演示应用，展示了 <code>@teable/grid-table-kanban</code> 包的核心功能。
              您可以体验高性能的表格渲染和完整的任务管理工作流。
            </p>
          </div>

          <div className="feature-list">
            <div className="feature-card">
              <h3>🚀 Grid 表格系统</h3>
              <ul>
                <li>Canvas 渲染，支持百万行数据</li>
                <li>虚拟滚动，流畅的用户体验</li>
                <li>多种单元格类型（文本、布尔、评分、选择器）</li>
                <li>实时编辑和验证</li>
                <li>拖拽排序和列调整</li>
                <li>键盘导航支持</li>
              </ul>
              <button 
                className="control-button primary"
                onClick={() => onNavigate('grid')}
                style={{ marginTop: '16px' }}
              >
                体验 Grid 表格 →
              </button>
            </div>

            <div className="feature-card">
              <h3>📋 Kanban 看板系统</h3>
              <ul>
                <li>7 列完整工作流程</li>
                <li>任务生命周期管理</li>
                <li>子任务和验收标准</li>
                <li>测试用例和 Bug 跟踪</li>
                <li>依赖关系管理</li>
                <li>严格的质量门控</li>
              </ul>
              <button 
                className="control-button primary"
                onClick={() => onNavigate('kanban')}
                style={{ marginTop: '16px' }}
              >
                体验 Kanban 看板 →
              </button>
            </div>

            <div className="feature-card">
              <h3>⚡ 性能特性</h3>
              <ul>
                <li>Canvas 渲染引擎</li>
                <li>智能虚拟化</li>
                <li>内存优化算法</li>
                <li>响应式设计</li>
                <li>TypeScript 支持</li>
                <li>可扩展架构</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>🛠️ 技术栈</h3>
              <ul>
                <li>React 18 + TypeScript</li>
                <li>Canvas 2D API</li>
                <li>Zustand 状态管理</li>
                <li>虚拟滚动算法</li>
                <li>LRU 缓存策略</li>
                <li>模块化设计</li>
              </ul>
            </div>
          </div>

          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            background: '#F0F9FF', 
            border: '1px solid #BAE6FD',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#0369A1', marginBottom: '12px' }}>
              📖 快速开始
            </h3>
            <p style={{ color: '#0C4A6E', marginBottom: '16px' }}>
              安装并使用 Grid Table Kanban 包：
            </p>
            <pre style={{ 
              background: '#1E293B', 
              color: '#F1F5F9', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
{`# 安装包
npm install @teable/grid-table-kanban

# 基础使用
import { Grid, useKanbanStore } from '@teable/grid-table-kanban';

// Grid 表格
<Grid 
  columns={columns}
  rowCount={1000}
  getCellContent={getCellContent}
/>

// Kanban 看板
const { initializeBoard, addTask } = useKanbanStore();`}
            </pre>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#F0FDF4', 
            border: '1px solid #BBF7D0',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#166534', marginBottom: '12px' }}>
              🔗 相关链接
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a 
                href="https://github.com/teableio/teable" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#166534', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #22C55E',
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                GitHub 仓库
              </a>
              <a 
                href="https://teable.io" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#166534', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #22C55E',
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                Teable 官网
              </a>
              <a 
                href="https://docs.teable.io" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#166534', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #22C55E',
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                文档
              </a>
            </div>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#FEF3C7', 
            border: '1px solid #FCD34D',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#92400E', marginBottom: '12px' }}>
              💡 使用提示
            </h3>
            <ul style={{ color: '#92400E', paddingLeft: '20px' }}>
              <li>在 Grid 演示中，尝试编辑单元格和调整列宽</li>
              <li>在 Kanban 演示中，点击任务卡片查看详细信息</li>
              <li>尝试拖拽任务卡片到不同状态列</li>
              <li>测试大数据量下的性能表现</li>
              <li>使用键盘快捷键进行导航</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
