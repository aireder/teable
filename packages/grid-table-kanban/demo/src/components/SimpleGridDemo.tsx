import React, { useState } from 'react'

// 简化的 Grid 演示组件
const SimpleGridDemo: React.FC = () => {
  const [data, setData] = useState([
    ['张三', 'zhangsan@company.com', '技术部', true, 5, '活跃'],
    ['李四', 'lisi@company.com', '产品部', false, 4, '休假'],
    ['王五', 'wangwu@company.com', '设计部', true, 3, '活跃'],
    ['赵六', 'zhaoliu@company.com', '运营部', true, 5, '活跃'],
    ['钱七', 'qianqi@company.com', '市场部', false, 2, '离职'],
  ])

  const [editable, setEditable] = useState(true)

  const handleCellEdit = (rowIndex: number, colIndex: number, newValue: string | boolean | number) => {
    if (!editable) return
    
    const newData = [...data]
    newData[rowIndex] = [...newData[rowIndex]]
    newData[rowIndex][colIndex] = String(newValue)
    setData(newData)
  }

  const getComplexityColor = (rating: number) => {
    if (rating >= 4) return '#10B981' // 绿色
    if (rating >= 3) return '#F59E0B' // 黄色
    return '#EF4444' // 红色
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '活跃': return '#10B981'
      case '休假': return '#F59E0B'
      case '离职': return '#EF4444'
      default: return '#6B7280'
    }
  }

  return (
    <div className="demo-section">
      <div className="demo-header">
        <h2>Grid 表格演示</h2>
        <p>高性能的基于 Canvas 的表格系统演示（简化版本）</p>
      </div>
      
      <div className="demo-content">
        <div className="info-box">
          <h3>Grid 系统特性</h3>
          <p>
            这是一个简化的表格演示，展示了 Grid 系统的核心概念。
            完整的 Grid 系统支持 Canvas 渲染、虚拟滚动、多种单元格类型等功能。
          </p>
        </div>

        <div className="controls">
          <button
            className={`control-button ${editable ? 'primary' : ''}`}
            onClick={() => setEditable(!editable)}
          >
            {editable ? '✓ 编辑模式' : '编辑模式'}
          </button>
          
          <button
            className="control-button"
            onClick={() => {
              const newRow = [
                `用户${data.length + 1}`,
                `user${data.length + 1}@company.com`,
                '技术部',
                Math.random() > 0.5,
                Math.floor(Math.random() * 5) + 1,
                ['活跃', '休假', '离职'][Math.floor(Math.random() * 3)]
              ]
              setData([...data, newRow])
            }}
          >
            + 添加行
          </button>
        </div>

        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '6px', 
          overflow: 'hidden',
          background: 'white'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>姓名</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>邮箱</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>部门</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>在职</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>评分</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>状态</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    {editable ? (
                      <input
                        type="text"
                        value={String(row[0])}
                        onChange={(e) => handleCellEdit(rowIndex, 0, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          width: '100%',
                          background: 'white'
                        }}
                      />
                    ) : (
                      row[0]
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editable ? (
                      <input
                        type="email"
                        value={String(row[1])}
                        onChange={(e) => handleCellEdit(rowIndex, 1, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          width: '100%',
                          background: 'white'
                        }}
                      />
                    ) : (
                      row[1]
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editable ? (
                      <select
                        value={String(row[2])}
                        onChange={(e) => handleCellEdit(rowIndex, 2, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          width: '100%',
                          background: 'white'
                        }}
                      >
                        <option value="技术部">技术部</option>
                        <option value="产品部">产品部</option>
                        <option value="设计部">设计部</option>
                        <option value="运营部">运营部</option>
                        <option value="市场部">市场部</option>
                      </select>
                    ) : (
                      row[2]
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {editable ? (
                      <input
                        type="checkbox"
                        checked={Boolean(row[3])}
                        onChange={(e) => handleCellEdit(rowIndex, 3, e.target.checked)}
                      />
                    ) : (
                      <span style={{ color: Boolean(row[3]) ? '#10B981' : '#EF4444' }}>
                        {Boolean(row[3]) ? '✓' : '✗'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {editable ? (
                      <select
                        value={String(row[4])}
                        onChange={(e) => handleCellEdit(rowIndex, 4, Number(e.target.value))}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          background: 'white'
                        }}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < Number(row[4]) ? getComplexityColor(Number(row[4])) : '#d1d5db',
                              marginRight: '2px'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editable ? (
                      <select
                        value={String(row[5])}
                        onChange={(e) => handleCellEdit(rowIndex, 5, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          width: '100%',
                          background: 'white'
                        }}
                      >
                        <option value="活跃">活跃</option>
                        <option value="休假">休假</option>
                        <option value="离职">离职</option>
                      </select>
                    ) : (
                      <span style={{ 
                        color: getStatusColor(String(row[5])),
                        fontWeight: '500'
                      }}>
                        {row[5]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="feature-list">
          <div className="feature-card">
            <h3>完整 Grid 系统特性</h3>
            <ul>
              <li>Canvas 渲染，支持百万行数据</li>
              <li>虚拟滚动，流畅的用户体验</li>
              <li>多种单元格类型（文本、布尔、评分、选择器）</li>
              <li>实时编辑和验证</li>
              <li>拖拽排序和列调整</li>
              <li>键盘导航支持</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>性能优化</h3>
            <ul>
              <li>智能缓存策略</li>
              <li>内存优化算法</li>
              <li>响应式设计</li>
              <li>TypeScript 完整支持</li>
              <li>模块化架构</li>
              <li>可扩展组件系统</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>使用场景</h3>
            <ul>
              <li>数据表格和报表</li>
              <li>数据分析和可视化</li>
              <li>内容管理系统</li>
              <li>财务和会计系统</li>
              <li>项目管理系统</li>
              <li>CRM 和 ERP 系统</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleGridDemo
