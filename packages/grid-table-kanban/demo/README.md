# Grid Table Kanban Demo

这是 `@teable/grid-table-kanban` 包的演示应用，展示了高性能表格和看板系统的核心功能。

> **注意**: 这是一个简化版本的演示，使用原生 HTML/CSS/JavaScript 实现，避免了复杂的依赖问题。完整的包提供了基于 Canvas 的高性能渲染引擎。

## 功能演示

### 🚀 Grid 表格系统
- **高性能渲染**: Canvas 渲染引擎，支持百万行数据
- **虚拟滚动**: 流畅的大数据量浏览体验
- **多种单元格类型**: 文本、布尔值、评分、选择器等
- **实时编辑**: 支持就地编辑和数据验证
- **交互功能**: 拖拽排序、列调整、键盘导航

### 📋 Kanban 看板系统
- **7 列工作流程**: 需求池 → Sprint待办 → 开发中 → 代码审查 → QA测试 → 阻塞 → 验收通过
- **任务管理**: 完整的任务生命周期管理
- **质量控制**: 子任务、验收标准、测试用例跟踪
- **状态验证**: 严格的工作流程规则和门控

## 快速开始

### 安装依赖

```bash
cd demo
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

## 演示页面

### 1. 概览页面
- 功能介绍和快速开始指南
- 技术栈说明
- 相关链接

### 2. Grid 表格演示
- **数据规模测试**: 支持 100 到 100,000 行数据
- **单元格类型**: 演示文本、布尔、评分、选择器等类型
- **编辑功能**: 实时编辑和数据验证
- **性能展示**: 虚拟滚动和 Canvas 渲染性能

### 3. Kanban 看板演示
- **工作流程**: 完整的 7 列任务流程
- **任务管理**: 创建、编辑、移动任务
- **详细信息**: 子任务、验收标准、测试用例
- **状态控制**: 工作流程规则验证

## 使用指南

### Grid 表格操作
1. **编辑单元格**: 双击单元格进入编辑模式
2. **调整列宽**: 拖拽列边界调整宽度
3. **选择单元格**: 点击或使用键盘导航
4. **切换数据规模**: 使用控制按钮测试不同数据量

### Kanban 看板操作
1. **查看任务**: 点击任务卡片查看详细信息
2. **移动任务**: 拖拽任务到不同状态列
3. **添加任务**: 点击"添加新任务"按钮
4. **管理子任务**: 在任务详情中勾选/取消勾选子任务

## 技术特性

### 性能优化
- Canvas 渲染引擎，避免 DOM 操作开销
- 虚拟滚动算法，只渲染可见区域
- LRU 缓存策略，减少重复计算
- 内存优化，支持大数据集

### 用户体验
- 流畅的滚动和交互
- 响应式设计，适配不同屏幕
- 键盘快捷键支持
- 触摸设备友好

### 开发体验
- 完整的 TypeScript 支持
- 模块化架构设计
- 丰富的 API 接口
- 详细的类型定义

## 自定义配置

### Grid 主题配置
```typescript
const customTheme = {
  fontSizeSM: 12,
  fontSizeMD: 14,
  fontSizeLG: 16,
  iconSizeSM: 14,
  iconSizeMD: 18,
  iconSizeLG: 22,
}

<Grid theme={customTheme} />
```

### Kanban 工作流程
```typescript
const { initializeBoard, addTask } = useKanbanStore()

initializeBoard({
  name: '我的项目',
  description: '项目描述',
  currentSprint: 'Sprint 1',
})

addTask({
  title: '新功能开发',
  description: '功能描述',
  developer: '开发者',
  complexity: 'M',
  goal: '功能目标',
})
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 故障排除

### 常见问题

1. **构建失败**: 确保 Node.js 版本 >= 16
2. **依赖问题**: 删除 `node_modules` 重新安装
3. **性能问题**: 在开发者工具中检查内存使用

### 调试模式

```bash
# 启用调试模式
DEBUG=* npm run dev
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进演示应用。

## 许可证

MIT License
