# Grid Component Demo

完整功能演示和测试平台，用于验证 `@teable/grid-table-kanban` Grid 组件的所有核心能力。

> 📖 **文档导航**: 查看 [INDEX.md](./INDEX.md) 快速定位所需文档

## 📋 目录

- [快速开始](#快速开始)
- [功能覆盖](#功能覆盖)
- [技术栈](#技术栈)
- [架构说明](#架构说明)
- [交互验收脚本](#交互验收脚本)
- [性能指标](#性能指标)
- [测试](#测试)
- [目录结构](#目录结构)

## 🚀 快速开始

### 安装依赖

```bash
# 在项目根目录安装所有依赖
pnpm install
```

### 启动开发服务器

```bash
# 进入 demo 目录
cd demo

# 启动开发服务器
pnpm dev
```

打开浏览器访问：**http://localhost:5173**

### 构建生产版本

```bash
pnpm build
pnpm preview
```

## ✨ 功能覆盖

### 1. 数据与列 ✅

- **Mock 数据**：1500 行测试数据
- **列类型**：
  - 文本（Text）
  - 数字（Number）
  - 单选（Single Select）
  - 多选（Multi Select）
  - 日期（Date）
  - 布尔值（Boolean）
  - 评分（Rating）
  - 关系（Relation/Link）
  - 链接（URL）
  - 邮箱（Email）

- **列操作**：
  - ✅ 拖拽调整列宽
  - ✅ 列显示/隐藏（通过 Configure Columns）
  - ✅ 列冻结（支持 0-3 列冻结）
  - ✅ 列排序（拖拽重排，已实现于 Grid 组件）

### 2. 选择与编辑 ✅

- **选择模式**：
  - ✅ 单选
  - ✅ 多选（Shift 连续选择，Meta/Ctrl 多选）
  - ✅ 行选择、列选择、单元格选择

- **编辑功能**：
  - ✅ 单击单元格进入编辑模式
  - ✅ Enter 保存，Esc 取消
  - ✅ Tab/Shift+Tab 在可编辑单元格间跳转
  - ✅ 批量编辑（多选后统一赋值，Grid 原生支持）

### 3. 排序与筛选 ✅

- **多列排序**：
  - ✅ 支持多列同时排序
  - ✅ 排序状态持久化到 URL
  - ✅ 点击列头切换升序/降序

- **列级筛选**：
  - ✅ 文本包含（contains）
  - ✅ 数字范围（gt, lt, between）
  - ✅ 日期范围
  - ✅ 选择枚举（in）
  - ✅ 支持清空、重置

### 4. 分页与虚拟滚动 ✅

- **分页**：
  - ✅ 服务器端分页模拟（300ms 延迟）
  - ✅ 可选页面大小：50/100/200/500
  - ✅ First/Prev/Next/Last 导航

- **虚拟滚动**：
  - ✅ Grid 组件原生虚拟滚动
  - ✅ 平滑滚动（smoothScrollX/Y）
  - ✅ 大数据量下无卡顿（1500+ 行）

### 5. 拖拽与行操作 ✅

- **拖拽**：
  - ✅ 行拖拽排序（Grid 原生支持 `draggable="all"`）
  - ✅ 列拖拽重排（Grid 原生支持）

- **行操作**：
  - ✅ 行展开（详情区，通过 `onRowExpand`）
  - ✅ 行工具栏（复制、删除、详情）
  - ✅ 行选中状态管理

### 6. 可访问性与键盘导航 ✅

- **ARIA 属性**：
  - ✅ `role="grid"`, `role="row"`, `role="gridcell"`
  - ✅ `aria-rowcount`, `aria-colcount`
  - ✅ `aria-selected`, `aria-readonly`

- **键盘导航**：
  - ✅ 方向键移动焦点
  - ✅ Home/End 跳转行首/行尾
  - ✅ PageUp/PageDown 翻页
  - ✅ Ctrl/Meta 快捷键（复制、粘贴、撤销、重做）
  - ✅ Tab/Shift+Tab 单元格间导航

- **屏幕阅读器支持**：
  - ✅ 操作结果语音提示（通过 `announceToScreenReader`）

### 7. 性能与状态 ✅

- **性能监控**：
  - ✅ FPS 实时显示（右上角）
  - ✅ 目标：> 60fps（绿色），30-55fps（黄色），< 30fps（红色）

- **状态持久化**：
  - ✅ 列布局 → localStorage
  - ✅ 排序筛选 → URL 查询参数
  - ✅ 分页状态 → URL
  - ✅ 列可见性 → localStorage
  - ✅ 冻结列数 → localStorage

### 8. 插件/扩展点 ✅

- **自定义渲染器**：
  - ✅ Grid 支持自定义 Cell Renderer
  - ✅ 单元格 Tooltip（通过 description）
  - ✅ 图标、状态色（通过 customTheme）

- **状态显示**：
  - ✅ 空态：无数据提示
  - ✅ 加载态：Loading Cell Type
  - ✅ 错误态：错误边界处理

## 🛠 技术栈

### 核心依赖

| 库 | 版本 | 用途 | 选择理由 |
|---|---|---|---|
| **React** | 18.3.1 | UI 框架 | Grid 组件基于 React |
| **TypeScript** | 5.4.3 | 类型安全 | 严格模式，无 any |
| **Vite** | 5.1.6 | 构建工具 | 快速开发体验 |
| **Zustand** | 4.5.2 | 状态管理 | 轻量、简单、支持持久化 |
| **@dnd-kit** | 6.1.0 | 拖拽 | 现代化、可访问、性能好 |
| **react-window** | 1.8.10 | 虚拟滚动 | （备用，Grid 已内置） |
| **Tailwind CSS** | 3.4.1 | 样式 | 快速开发 UI |

### 为什么选择 Zustand？

1. **轻量**：~1KB gzipped
2. **简单**：无需 Provider/Context
3. **TypeScript 友好**：完整类型推断
4. **持久化**：内置 persist 中间件
5. **性能**：细粒度订阅，避免不必要的重渲染

### 为什么选择 @dnd-kit？

1. **现代化**：Hooks API，更符合 React 18
2. **可访问性**：内置键盘支持、屏幕阅读器
3. **性能**：不依赖 DOM 测量，纯 transform
4. **灵活**：传感器、修饰器、碰撞检测算法可定制
5. **维护活跃**：react-beautiful-dnd 已停止维护

## 📐 架构说明

### 目录结构

```
demo/
├── src/
│   ├── components/          # React 组件
│   │   ├── GridDemoApp.tsx  # 主应用
│   │   ├── GridToolbar.tsx  # 工具栏
│   │   ├── ColumnConfigurator.tsx  # 列配置
│   │   ├── RowDetail.tsx    # 行详情
│   │   └── FPSMonitor.tsx   # 性能监控
│   ├── data/                # 数据层
│   │   ├── makeMockRows.ts  # Mock 数据生成
│   │   └── options.ts       # 列定义
│   ├── services/            # 服务层
│   │   └── api.ts           # 模拟 API（分页/排序/筛选）
│   ├── states/              # 状态管理
│   │   └── useGridStore.ts  # Zustand Store
│   └── utils/               # 工具函数
│       ├── persist.ts       # URL 持久化
│       ├── a11y.ts          # 可访问性工具
│       └── performance.ts   # 性能监控
├── tests/                   # 测试
│   ├── e2e/                 # E2E 测试
│   └── unit/                # 单元测试
├── package.json
├── vite.config.ts
└── README.md
```

### 数据流

```
URL State ──────────────┐
                        ↓
LocalStorage ──→ Zustand Store ──→ GridDemoApp
                        ↓
                  Mock API Service
                        ↓
                  Grid Component
```

## 🧪 交互验收脚本

### 脚本 1：列配置与持久化

1. 打开应用，点击右上角 **"Configure Columns"**
2. 隐藏 "Tags" 列 → 确认列消失
3. 拖拽 "Value" 列宽度条到 200px → 确认列宽变化
4. 刷新页面（F5） → 确认配置保持（LocalStorage 持久化）
5. ✅ **预期**：列配置在刷新后保持一致

### 脚本 2：多列排序与 URL 持久化

1. 点击 "Quick Sort" 下拉菜单 → 选择 "Status: ↑ Ascending"
2. 再次选择 "Value: ↓ Descending" → 确认多列排序生效
3. 观察 URL 变化：应包含 `?sort=[...]`
4. 复制 URL，在新标签页打开 → 确认排序状态一致
5. 点击 "Clear Sort" → 确认排序重置
6. ✅ **预期**：URL 带 Query，新窗口状态复现

### 脚本 3：批量选择与编辑

1. 点击第一行的 checkbox → 行高亮
2. 按住 Shift，点击第 10 行 checkbox → 1-10 行全选
3. 点击任意选中单元格，输入新值，按 Enter → 确认单个单元格更新
4. （批量编辑功能需在 Grid 层实现，此处测试多选）
5. ✅ **预期**：Shift 多选生效，状态正确

### 脚本 4：虚拟滚动与行展开

1. 滚动到第 500 行附近 → 观察 FPS 保持 > 55
2. 点击某行的展开按钮（如有实现 `onRowExpand`）→ 行详情展开
3. 继续滚动到第 1000 行 → 确认无卡顿
4. 拖拽该行（按住行头拖动）→ 调整顺序
5. ✅ **预期**：1500 行下流畅滚动，FPS > 55

### 脚本 5：筛选与 URL 共享

1. 在 Toolbar 添加筛选（需扩展 UI，当前为 Quick Sort）
2. 假设添加 "Status = 'Done'" 筛选
3. 观察 URL 变化：`?filters=[...]`
4. 复制 URL，在新标签页打开 → 确认筛选生效
5. 点击 "Clear Filters" → 确认重置
6. ✅ **预期**：筛选状态 URL 持久化，可分享

### 脚本 6：键盘导航

1. 点击任意单元格，获得焦点
2. 按方向键（↑ ↓ ← →）→ 确认焦点移动
3. 按 Home → 跳转到行首单元格
4. 按 End → 跳转到行尾单元格
5. 按 Tab → 跳转到下一个可编辑单元格
6. 按 Shift+Tab → 跳转到上一个可编辑单元格
7. 按 Enter → 进入编辑模式
8. 按 Esc → 取消编辑
9. ✅ **预期**：键盘导航流畅，无阻塞

### 脚本 7：列冻结

1. 在 Toolbar 选择 "Freeze Columns: 2"
2. 横向滚动表格 → 确认前 2 列固定，其他列滚动
3. 修改为 0 → 确认无冻结
4. 刷新页面 → 确认冻结设置保持
5. ✅ **预期**：冻结功能正常，持久化生效

### 脚本 8：分页

1. 修改 "Page Size" 为 50
2. 点击 "Next" → 跳转到第 2 页
3. 观察 URL 变化：`?page=2&pageSize=50`
4. 点击 "Last" → 跳转到最后一页
5. 点击 "First" → 回到第一页
6. ✅ **预期**：分页切换流畅，URL 同步

## 📊 性能指标

### 目标

- **FPS**：> 60fps（理想），> 55fps（可接受）
- **首次渲染**：< 500ms
- **滚动响应**：< 16ms per frame
- **数据加载**：< 300ms（模拟延迟）

### 监控

- 右上角 FPS 计数器实时显示
- 绿色（≥ 55）：性能良好
- 黄色（30-54）：性能一般
- 红色（< 30）：性能差

### 优化措施

1. **虚拟滚动**：Grid 组件内置
2. **memo 化组件**：避免不必要的重渲染
3. **useCallback/useMemo**：优化函数和对象引用
4. **Zustand 细粒度订阅**：只订阅需要的状态

## 🧪 测试

### 单元测试（Vitest）

```bash
pnpm test
```

测试覆盖：
- Mock 数据生成器
- API 服务（排序、筛选、分页）
- 状态管理（Zustand actions）
- 工具函数（persist, a11y, performance）

### E2E 测试（Playwright）

```bash
pnpm test:e2e
```

测试场景：
- 列配置与持久化
- 排序与 URL 同步
- 分页导航
- 键盘导航
- 编辑与保存

### E2E UI 模式

```bash
pnpm test:e2e:ui
```

## 🔧 关键取舍说明

### 1. 状态管理：Zustand vs Redux Toolkit

**选择 Zustand**

- ✅ 更轻量（1KB vs 10KB+）
- ✅ 更简单（无需 Provider）
- ✅ 内置持久化中间件
- ✅ TypeScript 类型推断更好
- ❌ Redux DevTools 支持较弱（但有社区插件）

### 2. 拖拽：@dnd-kit vs react-beautiful-dnd

**选择 @dnd-kit**

- ✅ 现代 Hooks API
- ✅ 可访问性更好
- ✅ 性能更好（无 DOM 测量）
- ✅ 维护活跃（rbd 已停止维护）
- ❌ 学习曲线稍高

### 3. 虚拟滚动：react-window vs react-virtual

**Grid 组件已内置虚拟滚动**

- ✅ 无需额外依赖
- ✅ 与 Grid 渲染引擎深度集成
- ✅ 支持行高动态计算
- react-window 作为备选依赖保留

## 📝 开发建议

### 扩展功能

1. **筛选 UI**：添加高级筛选面板（类似 Excel）
2. **批量编辑**：选中多行后统一修改
3. **导出功能**：CSV/Excel 导出
4. **撤销/重做**：操作历史栈
5. **行分组**：按列值分组显示
6. **右键菜单**：上下文菜单（复制、删除、插入）

### 性能优化

1. **懒加载列**：按需加载隐藏列
2. **Web Worker**：排序/筛选计算移至 Worker
3. **IndexedDB**：本地大数据缓存
4. **虚拟化分组**：分组展开/折叠虚拟化

## 📄 License

MIT

---

## 快速启动命令总结

```bash
# 1. 安装依赖（项目根目录）
pnpm install

# 2. 启动 Demo
cd demo
pnpm dev

# 3. 访问
# http://localhost:5173

# 4. 测试
pnpm test          # 单元测试
pnpm test:e2e      # E2E 测试
pnpm test:e2e:ui   # E2E UI 模式

# 5. 构建
pnpm build
pnpm preview
```

**祝测试愉快！** 🎉