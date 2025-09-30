# SDK Table Demo - 项目总结

## 项目概述

这是一个使用 `@teable/sdk` 包创建的独立演示项目，展示了如何使用 Teable SDK 来创建类似 Airtable 的表格界面。

## 项目位置

```
/workspace/sdk-table-demo/
```

## 项目特点

### ✅ 已实现的功能

1. **使用 SDK 的 Grid 组件**
   - 调用 `@teable/sdk` 中的 `Grid` 组件
   - 展示类似 Airtable 的表格样式
   - 支持多列显示（标题、计数、状态）

2. **模拟数据展示**
   - 创建了 20 行示例数据
   - 包含不同类型的列（文本、数字）
   - 使用不同的单元格类型（CellType.Text, CellType.Number）

3. **现代化技术栈**
   - React 18
   - TypeScript
   - Vite (开发服务器)
   - TailwindCSS (样式)
   - TanStack Query (状态管理)

4. **Monorepo 集成**
   - 已添加到 pnpm workspace
   - 使用 workspace 依赖引用本地包

## 核心代码结构

### 主要文件

```
sdk-table-demo/
├── src/
│   ├── components/
│   │   └── AirtableDemo.tsx       # 核心表格演示组件
│   ├── App.tsx                    # 应用主入口
│   ├── main.tsx                   # React 渲染入口
│   └── index.css                  # 全局样式
├── index.html                     # HTML 模板
├── package.json                   # 项目配置
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 项目说明
```

### 关键组件：AirtableDemo.tsx

```typescript
import { Grid, CellType } from '@teable/sdk'

// 使用 Grid 组件
<Grid
  ref={gridRef}
  columns={columns}              // 列定义
  rowCount={mockData.rows.length} // 行数
  getCellContent={getCellContent} // 单元格内容获取函数
  rowHeight={40}                 // 行高
  columnHeaderHeight={40}        // 列头高度
/>
```

## 参考的实现

此 demo 参考了 `/workspace/apps/nextjs-app` 中的实现方式：

1. **Grid 组件使用**
   - 参考：`apps/nextjs-app/src/features/app/blocks/view/grid/GridViewBaseInner.tsx`
   - 学习了如何配置 Grid 的 props

2. **列定义**
   - 参考：SDK 中 `IGridColumn` 接口
   - 包含 id, name, width 等属性

3. **单元格内容**
   - 参考：`getCellContent` 函数的实现
   - 返回不同的 CellType（Text, Number 等）

## 运行说明

### 1. 安装依赖

```bash
cd /workspace
pnpm install
```

### 2. 构建依赖包

SDK 需要先构建以下包：

```bash
# 按顺序构建
pnpm -F @teable/icons build
pnpm -F @teable/ui-lib build
pnpm -F @teable/core build
pnpm -F @teable/openapi build
pnpm -F @teable/sdk build
```

### 3. 运行 Demo

```bash
cd /workspace/sdk-table-demo
pnpm dev
```

然后访问：http://localhost:3002

## 技术要点

### 1. Grid 组件的使用

Grid 是 SDK 中核心的表格展示组件，主要 props：

- `columns`: 列定义数组
- `rowCount`: 总行数
- `getCellContent`: 单元格内容获取函数
- `rowHeight`: 行高
- `columnHeaderHeight`: 列头高度

### 2. 单元格类型

SDK 支持多种单元格类型：

```typescript
import { CellType } from '@teable/sdk'

// 文本单元格
{
  type: CellType.Text,
  data: 'cell content'
}

// 数字单元格
{
  type: CellType.Number,
  data: '42'
}
```

### 3. 列配置

```typescript
const columns: IGridColumn[] = [
  {
    id: 'title',      // 唯一标识
    name: '标题',     // 显示名称
    width: 200        // 列宽度
  }
]
```

## 与 nextjs-app 的对比

### 相同点
- 使用相同的 `@teable/sdk` 包
- 使用相同的 Grid 组件
- 类似的组件结构

### 不同点
- **nextjs-app**: 完整的应用，包含后端集成、数据持久化、多视图等
- **sdk-table-demo**: 简化的演示，专注于展示 SDK 的基本使用

## 扩展建议

如果要扩展此 demo，可以添加：

1. **更多单元格类型**
   - Checkbox
   - Select
   - Date
   - Link

2. **交互功能**
   - 单元格编辑
   - 行排序
   - 列拖拽
   - 过滤器

3. **数据操作**
   - 添加/删除行
   - 数据导入/导出
   - 搜索功能

4. **主题定制**
   - 自定义颜色
   - 自定义图标
   - 响应式布局

## 总结

此 demo 成功演示了如何使用 `@teable/sdk` 包创建一个类似 Airtable 的表格界面。通过参考 `apps/nextjs-app` 的实现，我们创建了一个简洁、独立的演示项目，可以作为学习和参考的起点。

## 相关文档

- [Teable 项目](https://github.com/teableio/teable)
- [Demo README](/workspace/sdk-table-demo/README.md)