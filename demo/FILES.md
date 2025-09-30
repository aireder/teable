# 完整文件清单

本文档列出 Grid Demo 项目的所有文件及其说明。

## 📁 项目根目录

| 文件 | 类型 | 说明 |
|------|------|------|
| `package.json` | 配置 | 项目依赖和脚本 |
| `vite.config.ts` | 配置 | Vite 构建配置 |
| `tsconfig.json` | 配置 | TypeScript 主配置 |
| `tsconfig.node.json` | 配置 | TypeScript Node 配置 |
| `tailwind.config.js` | 配置 | Tailwind CSS 配置 |
| `postcss.config.js` | 配置 | PostCSS 配置 |
| `playwright.config.ts` | 配置 | Playwright E2E 测试配置 |
| `vitest.config.ts` | 配置 | Vitest 单元测试配置 |
| `.eslintrc.cjs` | 配置 | ESLint 代码规范配置 |
| `.gitignore` | 配置 | Git 忽略文件 |
| `index.html` | HTML | 应用入口 HTML |
| `start.sh` | 脚本 | 快速启动脚本 |

## 📄 文档

| 文件 | 内容 | 字数 |
|------|------|------|
| `README.md` | 主文档：功能说明、验收脚本、技术栈 | 3000+ |
| `INSTALLATION.md` | 安装指南、故障排除 | 800+ |
| `SUMMARY.md` | 交付总结、检查清单 | 1500+ |
| `CHECKLIST.md` | 验收检查清单（80+ 项） | 800+ |
| `FILES.md` | 本文件，文件清单 | 500+ |

## 📂 src/ - 源代码

### src/components/ - React 组件

| 文件 | 行数 | 说明 |
|------|------|------|
| `GridDemoApp.tsx` | 379 | 主应用组件，整合所有功能 |
| `GridToolbar.tsx` | 182 | 工具栏：排序、筛选、分页控制 |
| `ColumnConfigurator.tsx` | 115 | 列配置器：显示/隐藏、宽度调整 |
| `RowDetail.tsx` | 105 | 行详情面板：展开行显示详细信息 |
| `FPSMonitor.tsx` | 40 | FPS 监控器：性能实时监控 |

**小计**: 821 行

### src/data/ - 数据层

| 文件 | 行数 | 说明 |
|------|------|------|
| `makeMockRows.ts` | 200 | Mock 数据生成器：1500 行测试数据 |
| `options.ts` | 60 | 列定义、类型定义 |

**小计**: 260 行

### src/services/ - 服务层

| 文件 | 行数 | 说明 |
|------|------|------|
| `api.ts` | 180 | Mock API 服务：分页、排序、筛选 |

**小计**: 180 行

### src/states/ - 状态管理

| 文件 | 行数 | 说明 |
|------|------|------|
| `useGridStore.ts` | 250 | Zustand 状态管理：列、行、分页、排序、筛选 |

**小计**: 250 行

### src/utils/ - 工具函数

| 文件 | 行数 | 说明 |
|------|------|------|
| `persist.ts` | 70 | URL 持久化：序列化/反序列化 |
| `a11y.ts` | 50 | 可访问性工具：ARIA 属性、屏幕阅读器 |
| `performance.ts` | 40 | 性能监控：FPS 计数器 |

**小计**: 160 行

### src/ - 其他

| 文件 | 行数 | 说明 |
|------|------|------|
| `main.tsx` | 10 | 应用入口 |
| `index.css` | 30 | 全局样式（Tailwind） |

**小计**: 40 行

## 📂 tests/ - 测试

### tests/unit/ - 单元测试

| 文件 | 测试数 | 说明 |
|------|--------|------|
| `mockData.test.ts` | 11 | Mock 数据生成器测试 |
| `api.test.ts` | 15 | API 服务测试（分页、排序、筛选、操作） |
| `persist.test.ts` | 12 | URL 持久化测试 |

**小计**: 38 个测试，410 行

### tests/e2e/ - E2E 测试

| 文件 | 测试数 | 说明 |
|------|--------|------|
| `grid.spec.ts` | 11 | Grid 组件 E2E 测试 |

**小计**: 11 个测试，180 行

### tests/ - 其他

| 文件 | 说明 |
|------|------|
| `setup.ts` | Vitest 测试环境配置 |

## 📊 代码统计

### 按类型统计

| 类型 | 文件数 | 代码行数 |
|------|--------|----------|
| TypeScript 源码 | 15 | 1,711 |
| React 组件 (TSX) | 5 | 821 |
| 测试代码 | 5 | 590 |
| 配置文件 | 10 | 200 |
| 文档 | 5 | 6,600+ 字 |

**总计**: 40 个文件，约 3,300 行代码

### 按功能统计

| 功能模块 | 代码行数 | 占比 |
|----------|----------|------|
| React 组件 | 821 | 48% |
| 数据层 | 260 | 15% |
| 状态管理 | 250 | 15% |
| 服务层 | 180 | 11% |
| 工具函数 | 160 | 9% |
| 其他 | 40 | 2% |

## 🎯 关键文件说明

### 核心组件

**GridDemoApp.tsx** (379 行)
- 主应用组件
- 整合 Grid、Toolbar、Monitor
- 处理数据流和事件回调
- 实现 URL 持久化
- 可访问性支持

**GridToolbar.tsx** (182 行)
- 排序控制（Quick Sort）
- 筛选控制
- 分页导航（First/Prev/Next/Last）
- 冻结列控制
- Reset All 功能

**ColumnConfigurator.tsx** (115 行)
- 列可见性切换
- 列宽度调整（滑块）
- 弹窗 UI
- LocalStorage 持久化

### 数据与状态

**makeMockRows.ts** (200 行)
- 生成 1500 行测试数据
- 10 种列类型
- 转换为 Grid Cell 格式
- Choice Maps（选择项）

**useGridStore.ts** (250 行)
- Zustand 状态管理
- 列、行、分页、排序、筛选状态
- 40+ Actions
- LocalStorage 持久化中间件

**api.ts** (180 行)
- Mock API 服务
- 分页逻辑
- 排序逻辑（多列、升降序）
- 筛选逻辑（6 种操作符）
- CRUD 操作

### 工具与配置

**persist.ts** (70 行)
- URL 序列化/反序列化
- 支持 page, pageSize, sort, filters
- JSON 编码/解码
- 错误处理

**a11y.ts** (50 行)
- ARIA 属性生成
- 屏幕阅读器提示
- Grid 可访问性工具

**performance.ts** (40 行)
- FPS 计数器类
- 60 帧平均计算
- 性能测量工具

## 🧪 测试文件

### 单元测试覆盖

- **Mock 数据**: 行生成、字段完整性、唯一性、Cell 转换
- **API 服务**: 分页、排序（单列、多列）、筛选（6 种）、CRUD
- **持久化**: 序列化、反序列化、完整状态

### E2E 测试覆盖

- 数据展示
- 分页导航
- URL 持久化
- 列配置
- 排序
- 冻结
- 性能监控

## 📋 配置文件详解

### package.json
- 依赖：React, TypeScript, Zustand, @dnd-kit, Tailwind
- DevDependencies: Vitest, Playwright, ESLint
- Scripts: dev, build, test, test:e2e

### vite.config.ts
- React 插件
- 路径别名（@）
- Dev server 端口 5173

### tsconfig.json
- 严格模式
- ES2020 target
- React JSX
- 路径映射

### playwright.config.ts
- Chromium 测试
- Base URL: http://localhost:5173
- Web server 自动启动

### vitest.config.ts
- jsdom 环境
- 全局变量
- Setup 文件

## 🚀 使用指南

### 启动项目

```bash
# 方法 1: 使用启动脚本
./start.sh

# 方法 2: 手动启动
pnpm install
pnpm dev
```

### 运行测试

```bash
# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e

# E2E UI 模式
pnpm test:e2e:ui
```

### 构建

```bash
pnpm build
pnpm preview
```

## 📌 文件依赖关系

```
index.html
  └─ main.tsx
      └─ GridDemoApp.tsx
          ├─ GridToolbar.tsx ──→ useGridStore.ts
          ├─ ColumnConfigurator.tsx ──→ useGridStore.ts
          ├─ FPSMonitor.tsx ──→ performance.ts
          ├─ Grid (from @teable/grid-table-kanban)
          ├─ makeMockRows.ts
          ├─ api.ts
          ├─ persist.ts
          └─ a11y.ts
```

---

**文件总数**: 40+
**代码总行数**: 3,300+
**文档字数**: 6,600+
**测试数量**: 49 个（38 单元 + 11 E2E）

所有文件均为 TypeScript 严格模式，无 any。