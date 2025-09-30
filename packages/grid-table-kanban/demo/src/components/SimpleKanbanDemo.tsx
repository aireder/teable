import React, { useState } from 'react'

// 任务状态类型
type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'testing' | 'blocked' | 'done'

// 任务复杂度类型
type TaskComplexity = 'S' | 'M' | 'L'

// 任务接口
interface Task {
  id: string
  title: string
  description: string
  developer: string
  complexity: TaskComplexity
  goal: string
  status: TaskStatus
  subTasks?: Array<{
    id: string
    title: string
    completed: boolean
  }>
  acceptanceCriteria?: Array<{
    id: string
    description: string
    validated: boolean
  }>
  bugs?: Array<{
    id: string
    description: string
    priority: 'P0' | 'P1' | 'P2'
  }>
}

// 简化的 Kanban 演示组件
const SimpleKanbanDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '用户认证系统重构',
      description: '重构现有的用户认证系统，支持 OAuth2 和 JWT',
      developer: '张三',
      complexity: 'L',
      goal: '提供更安全、更灵活的用户认证体验',
      status: 'backlog',
      subTasks: [
        { id: '1-1', title: '设计新的认证架构', completed: true },
        { id: '1-2', title: '实现 OAuth2 集成', completed: false },
        { id: '1-3', title: 'JWT token 管理', completed: false },
      ],
      acceptanceCriteria: [
        { id: '1-ac-1', description: '支持 Google OAuth2 登录', validated: false },
        { id: '1-ac-2', description: 'JWT token 自动刷新机制', validated: false },
      ]
    },
    {
      id: '2',
      title: '数据库查询优化',
      description: '优化慢查询，提升系统性能',
      developer: '李四',
      complexity: 'M',
      goal: '将查询响应时间从 2s 降低到 200ms',
      status: 'in_progress',
      subTasks: [
        { id: '2-1', title: '分析慢查询日志', completed: true },
        { id: '2-2', title: '添加必要的索引', completed: true },
        { id: '2-3', title: '重写复杂查询', completed: false },
      ]
    },
    {
      id: '3',
      title: '移动端适配',
      description: '优化移动端用户体验',
      developer: '王五',
      complexity: 'M',
      goal: '确保在移动设备上的良好体验',
      status: 'todo'
    },
    {
      id: '4',
      title: 'API 文档生成',
      description: '自动生成 API 文档',
      developer: '赵六',
      complexity: 'S',
      goal: '提供完整的 API 文档',
      status: 'in_review',
      acceptanceCriteria: [
        { id: '4-ac-1', description: '自动生成 OpenAPI 规范', validated: true },
        { id: '4-ac-2', description: '集成 Swagger UI', validated: false },
      ]
    },
    {
      id: '5',
      title: '单元测试覆盖率提升',
      description: '提升代码测试覆盖率到 80%',
      developer: '钱七',
      complexity: 'M',
      goal: '提高代码质量和可维护性',
      status: 'testing',
      bugs: [
        { id: '5-bug-1', description: '测试用例执行失败', priority: 'P1' }
      ]
    },
    {
      id: '6',
      title: '部署流程优化',
      description: '优化 CI/CD 流程，提升部署效率',
      developer: '孙八',
      complexity: 'L',
      goal: '实现自动化部署和回滚',
      status: 'done',
      acceptanceCriteria: [
        { id: '6-ac-1', description: '自动化部署流程', validated: true },
        { id: '6-ac-2', description: '一键回滚功能', validated: true },
      ]
    },
    {
      id: '7',
      title: '安全漏洞修复',
      description: '修复发现的安全漏洞',
      developer: '周九',
      complexity: 'S',
      goal: '确保系统安全性',
      status: 'blocked'
    }
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const columns = [
    { id: 'backlog', name: '需求池', color: '#6B7280' },
    { id: 'todo', name: 'Sprint待办', color: '#3B82F6' },
    { id: 'in_progress', name: '开发中', color: '#F59E0B' },
    { id: 'in_review', name: '代码审查', color: '#8B5CF6' },
    { id: 'testing', name: 'QA测试中', color: '#EC4899' },
    { id: 'blocked', name: '阻塞', color: '#EF4444' },
    { id: 'done', name: '验收通过', color: '#10B981' },
  ]

  const getComplexityColor = (complexity: TaskComplexity): string => {
    switch (complexity) {
      case 'S': return '#10B981'
      case 'M': return '#F59E0B'
      case 'L': return '#EF4444'
      default: return '#6B7280'
    }
  }

  // const moveTask = (taskId: string, newStatus: TaskStatus) => {
  //   setTasks(tasks.map(task => 
  //     task.id === taskId ? { ...task, status: newStatus } : task
  //   ))
  // }

  const addNewTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `新任务 ${tasks.length + 1}`,
      description: '这是一个新创建的任务',
      developer: '开发者',
      complexity: 'M',
      goal: '完成任务目标',
      status: 'backlog',
      subTasks: [
        { id: `st-${Date.now()}`, title: '分析需求', completed: false }
      ],
      acceptanceCriteria: [
        { id: `ac-${Date.now()}`, description: '完成基本功能', validated: false }
      ]
    }
    setTasks([...tasks, newTask])
  }

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.subTasks) {
        return {
          ...task,
          subTasks: task.subTasks.map(st => 
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          )
        }
      }
      return task
    }))
  }

  const toggleAcceptanceCriteria = (taskId: string, criteriaId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.acceptanceCriteria) {
        return {
          ...task,
          acceptanceCriteria: task.acceptanceCriteria.map(ac => 
            ac.id === criteriaId ? { ...ac, validated: !ac.validated } : ac
          )
        }
      }
      return task
    }))
  }

  return (
    <div className="demo-section">
      <div className="demo-header">
        <h2>Kanban 看板演示</h2>
        <p>完整的任务管理工作流，支持 7 列工作流程和严格的质量控制（简化版本）</p>
      </div>
      
      <div className="demo-content">
        <div className="info-box">
          <h3>Kanban 工作流特性</h3>
          <p>
            这是一个简化的看板演示，展示了完整的任务管理系统概念。
            完整的 Kanban 系统支持严格的工作流程规则、质量门控、依赖关系跟踪等功能。
          </p>
        </div>

        <div className="controls">
          <button
            className="control-button primary"
            onClick={addNewTask}
          >
            + 添加新任务
          </button>
          
          <button
            className="control-button"
            onClick={() => setSelectedTask(selectedTask ? null : tasks[0])}
          >
            {selectedTask ? '隐藏' : '显示'}任务详情
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px',
          marginBottom: '20px'
        }}>
          {columns.map(column => {
            const columnTasks = tasks.filter(task => task.status === column.id)
            return (
              <div key={column.id} style={{ 
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '16px' 
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: column.color,
                    marginRight: '8px'
                  }} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    {column.name}
                  </h3>
                  <span style={{ 
                    marginLeft: 'auto',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    {columnTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9fafb'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{ 
                          margin: 0, 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: '#111827',
                          lineHeight: '1.4'
                        }}>
                          {task.title}
                        </h4>
                        <span style={{
                          background: getComplexityColor(task.complexity),
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500',
                          marginLeft: '8px',
                          flexShrink: 0
                        }}>
                          {task.complexity}
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '12px', 
                        color: '#6B7280',
                        lineHeight: '1.4'
                      }}>
                        {task.description}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        <span>👤 {task.developer}</span>
                        {task.subTasks && (
                          <span>
                            {task.subTasks.filter(st => st.completed).length}/
                            {task.subTasks.length} 子任务
                          </span>
                        )}
                      </div>

                      {task.bugs && task.bugs.length > 0 && (
                        <div style={{ 
                          marginTop: '8px',
                          padding: '4px 8px',
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#DC2626'
                        }}>
                          🐛 {task.bugs.length} 个 Bug
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {selectedTask && (
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0, color: '#111827' }}>
                任务详情: {selectedTask.title}
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: '#374151' }}>基本信息</h4>
                <p><strong>开发者:</strong> {selectedTask.developer}</p>
                <p><strong>复杂度:</strong> 
                  <span style={{ 
                    color: getComplexityColor(selectedTask.complexity),
                    fontWeight: 'bold',
                    marginLeft: '4px'
                  }}>
                    {selectedTask.complexity}
                  </span>
                </p>
                <p><strong>状态:</strong> {columns.find(c => c.id === selectedTask.status)?.name}</p>
                <p><strong>目标:</strong> {selectedTask.goal}</p>
                <p><strong>描述:</strong> {selectedTask.description}</p>
              </div>

              {selectedTask.subTasks && (
                <div>
                  <h4 style={{ marginBottom: '8px', color: '#374151' }}>子任务</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedTask.subTasks.map(subTask => (
                      <li key={subTask.id} style={{ 
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <input
                          type="checkbox"
                          checked={subTask.completed}
                          onChange={() => toggleSubTask(selectedTask.id, subTask.id)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ 
                          textDecoration: subTask.completed ? 'line-through' : 'none',
                          color: subTask.completed ? '#6B7280' : '#111827'
                        }}>
                          {subTask.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.acceptanceCriteria && (
                <div>
                  <h4 style={{ marginBottom: '8px', color: '#374151' }}>验收标准</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedTask.acceptanceCriteria.map(criteria => (
                      <li key={criteria.id} style={{ 
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <input
                          type="checkbox"
                          checked={criteria.validated}
                          onChange={() => toggleAcceptanceCriteria(selectedTask.id, criteria.id)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ 
                          color: criteria.validated ? '#10B981' : '#111827'
                        }}>
                          {criteria.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.bugs && selectedTask.bugs.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '8px', color: '#374151' }}>Bug 列表</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedTask.bugs.map(bug => (
                      <li key={bug.id} style={{ 
                        padding: '8px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '4px',
                        marginBottom: '4px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#DC2626', fontSize: '12px' }}>
                            {bug.description}
                          </span>
                          <span style={{
                            background: bug.priority === 'P0' ? '#DC2626' : 
                                       bug.priority === 'P1' ? '#F59E0B' : '#6B7280',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            {bug.priority}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="feature-list">
          <div className="feature-card">
            <h3>工作流程</h3>
            <ul>
              <li>需求池 → Sprint待办 → 开发中</li>
              <li>代码审查 → QA测试 → 验收通过</li>
              <li>阻塞状态管理</li>
              <li>严格的质量门控</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>任务管理</h3>
            <ul>
              <li>子任务分解和跟踪</li>
              <li>验收标准定义</li>
              <li>测试用例管理</li>
              <li>Bug 优先级管理</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>质量控制</h3>
            <ul>
              <li>PR 审查流程</li>
              <li>开发日志记录</li>
              <li>状态验证规则</li>
              <li>依赖关系跟踪</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleKanbanDemo
