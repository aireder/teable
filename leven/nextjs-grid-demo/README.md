# Next.js Grid Demo

This is a Next.js application that demonstrates how to use the Grid component from `@teable/grid-table-kanban` package, modeled after the share view implementation in the main Teable nextjs-app.

## 项目概述 (Project Overview)

本项目演示了如何在 Next.js 应用中使用 `leven/packages/grid-table-kanban` 中的 Grid 组件，参照了 `apps/nextjs-app` 中的 share view 页面的实现模式。

This project demonstrates how to use the Grid component from `leven/packages/grid-table-kanban` in a Next.js application, following the implementation pattern of the share view page in `apps/nextjs-app`.

## 主要特性 (Key Features)

### 1. Grid 组件集成 (Grid Component Integration)
- ✅ 使用本地 workspace 中的 `@teable/grid-table-kanban` 包
- ✅ 支持列调整大小、冻结和排序
- ✅ 支持行选择和展开
- ✅ 多种单元格类型：文本、链接、选择、评分、数字、布尔值等

### 2. Share View 模式 (Share View Pattern)
- ✅ 遵循 `apps/nextjs-app/src/pages/share/[shareId]/view` 的目录结构
- ✅ 服务器端数据获取 (SSR)
- ✅ 模拟共享视图数据结构

### 3. 组件架构 (Component Architecture)
```
src/
├── pages/
│   ├── index.tsx                    # 首页
│   ├── simple-grid.tsx              # 简单网格示例
│   └── share/[shareId]/view/
│       └── index.tsx                # Share view 页面 (仿照 nextjs-app)
├── components/
│   └── GridView/
│       ├── ShareViewPage.tsx        # Share view 页面容器
│       ├── ShareView.tsx            # Share view 组件
│       ├── GridView.tsx             # Grid 视图实现
│       └── AppLayout.tsx            # 应用布局
└── lib/
    └── mockData.ts                  # 模拟数据生成器
```

## 快速开始 (Getting Started)

### 1. 安装依赖 (Install Dependencies)

在 `leven` 目录下运行：

```bash
cd /workspace/leven
pnpm install
```

### 2. 构建 Grid 包 (Build Grid Package)

```bash
cd packages/grid-table-kanban
pnpm build
```

### 3. 运行开发服务器 (Run Development Server)

```bash
cd nextjs-grid-demo
pnpm dev
```

应用将在 http://localhost:3001 启动

### 4. 访问示例页面 (Access Demo Pages)

- **首页**: http://localhost:3001
- **Share View 示例**: http://localhost:3001/share/demo-share-id/view
- **简单 Grid 示例**: http://localhost:3001/simple-grid

## 关键实现细节 (Key Implementation Details)

### 1. Grid 组件使用 (Grid Component Usage)

```tsx
import {
  Grid,
  type IGridRef,
  type IGridColumn,
  type ICell,
  type ICellItem,
  CellType,
  Colors,
} from '@teable/grid-table-kanban';

// 在组件中使用
<Grid
  ref={gridRef}
  columns={columns}
  rowCount={records.length}
  rowHeight={48}
  columnHeaderHeight={32}
  freezeColumnCount={1}
  getCellContent={getCellContent}
  onSelectionChanged={onSelectionChanged}
  onColumnResize={onColumnResize}
  style={{ width: '100%', height: '100%' }}
/>
```

### 2. 单元格内容渲染 (Cell Content Rendering)

Grid 组件通过 `getCellContent` 回调函数来获取每个单元格的内容：

```tsx
const getCellContent = useCallback<(cell: ICellItem) => ICell>(
  (cell) => {
    const [colIndex, rowIndex] = cell;
    const record = recordMap[rowIndex];
    const field = fields[colIndex];

    // 返回不同类型的单元格
    return {
      type: CellType.Text,
      data: record.name,
      displayData: record.name,
    };
  },
  [recordMap, fields]
);
```

### 3. 与 nextjs-app 的对比 (Comparison with nextjs-app)

#### nextjs-app 实现:
- 使用 `@teable/sdk/components` 中的 Grid
- 集成了完整的 Teable SDK 生态系统
- 包含认证、权限、实时协作等功能
- 使用 React Query 进行数据管理

#### 本项目实现:
- 直接使用 `@teable/grid-table-kanban` 包
- 简化的数据结构和状态管理
- 专注于 Grid 组件的核心功能
- 使用模拟数据，便于理解和测试

## 支持的单元格类型 (Supported Cell Types)

本示例展示了以下单元格类型：

1. **Text**: 文本单元格
2. **Link**: 链接单元格
3. **Select**: 单选/多选单元格（带颜色）
4. **Rating**: 星级评分单元格
5. **Number**: 数字单元格
6. **Boolean**: 布尔值（复选框）单元格
7. **Loading**: 加载状态单元格

## 项目结构说明 (Project Structure)

### `/src/pages/share/[shareId]/view/index.tsx`
这是主要的共享视图页面，模仿了 `apps/nextjs-app` 中的相同路由结构：
- 使用 Next.js 的动态路由 `[shareId]`
- 实现 `getServerSideProps` 进行服务器端数据获取
- 传递数据到 `ShareViewPage` 组件

### `/src/components/GridView/GridView.tsx`
Grid 的核心实现组件：
- 将数据转换为 Grid 所需的格式
- 实现所有必要的回调函数
- 处理用户交互（选择、调整大小、排序等）

### `/src/lib/mockData.ts`
模拟数据生成器：
- 生成测试用的记录数据
- 定义字段配置
- 模拟共享视图的数据结构

## 技术栈 (Tech Stack)

- **Next.js 14**: React 框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式
- **@teable/grid-table-kanban**: Grid 组件（来自本地 workspace）
- **React 18**: UI 库

## 开发注意事项 (Development Notes)

1. **包依赖**: 项目使用 `workspace:*` 引用本地的 grid 包，确保在 `pnpm-workspace.yaml` 中正确配置
2. **类型定义**: Grid 组件提供了完整的 TypeScript 类型定义
3. **性能**: Grid 组件使用虚拟滚动，可以高效处理大量数据

## 下一步 (Next Steps)

可以在此基础上扩展：

1. 添加数据持久化（本地存储或 API）
2. 实现更多单元格类型
3. 添加筛选和排序功能
4. 集成分组和聚合功能
5. 添加实时协作功能

## 参考资料 (References)

- Grid 包文档: `leven/packages/grid-table-kanban/README.md`
- 原始实现: `apps/nextjs-app/src/features/app/blocks/share/view/component/grid/`
- Grid 示例: `leven/examples/basic-grid/`

## 📚 完整文档

本项目提供了详尽的文档系统，请查看 **[INDEX.md](./INDEX.md)** 获取完整的文档导航。

### 文档列表

1. **[INDEX.md](./INDEX.md)** - 📑 文档索引和导航（从这里开始！）
2. **[QUICK_START.md](./QUICK_START.md)** - 🚀 快速开始指南
3. **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - 📖 详细使用指南
4. **[ARCHITECTURE_COMPARISON.md](./ARCHITECTURE_COMPARISON.md)** - 🔍 架构对比分析
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 📋 项目总结

### 推荐阅读顺序

```
第一次使用: INDEX.md → QUICK_START.md → 运行项目
深入学习: USAGE_GUIDE.md → ARCHITECTURE_COMPARISON.md
```

## 许可证 (License)

MIT