# Teable SDK Table Demo

这是一个使用 `@teable/sdk` 创建的表格演示项目，展示了如何创建类似 Airtable 的表格界面。

## 功能特性

- ✅ 使用 `@teable/sdk` 的 Grid 组件
- ✅ 类似 Airtable 的表格样式
- ✅ 支持多列显示
- ✅ 列宽度可调整
- ✅ 响应式布局

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

然后在浏览器中打开 http://localhost:3002

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
sdk-table-demo/
├── src/
│   ├── components/
│   │   └── AirtableDemo.tsx    # 主要的表格演示组件
│   ├── App.tsx                 # 应用入口
│   ├── main.tsx               # React 渲染入口
│   └── index.css              # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 核心代码说明

### 使用 Grid 组件

```typescript
import { Grid, CellType } from '@teable/sdk'

<Grid
  columns={columns}
  rowCount={rowCount}
  getCellContent={getCellContent}
  rowHeight={40}
  columnHeaderHeight={40}
/>
```

### 列定义

```typescript
const columns: IGridColumn[] = [
  { id: 'title', name: '标题', width: 200 },
  { id: 'count', name: '计数', width: 120 },
  { id: 'status', name: '状态', width: 150 },
]
```

### 单元格内容

```typescript
const getCellContent = (cell: ICellItem): ICell => {
  const [colIndex, rowIndex] = cell
  // 返回单元格数据
  return {
    type: CellType.Text,
    data: 'cell content',
  }
}
```

## 参考资料

- [Teable SDK 文档](https://github.com/teableio/teable)
- 参考了 `apps/nextjs-app` 中的实现方式
