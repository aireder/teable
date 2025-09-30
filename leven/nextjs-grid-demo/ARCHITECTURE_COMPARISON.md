# 架构对比：nextjs-app vs nextjs-grid-demo

## 概览

本文档详细对比了 `apps/nextjs-app` 和 `leven/nextjs-grid-demo` 中 Grid 实现的架构差异。

## 目录结构对比

### apps/nextjs-app 结构

```
apps/nextjs-app/
├── src/
│   ├── pages/share/[shareId]/view/
│   │   └── index.tsx                                 # 路由入口
│   └── features/app/blocks/share/view/
│       ├── ShareViewPage.tsx                         # 页面容器（多层 Provider）
│       ├── ShareView.tsx                             # 视图路由器
│       ├── ShareTablePermissionProvider.tsx          # 权限 Provider
│       └── component/grid/
│           ├── GridView.tsx                          # Grid 包装器（Providers）
│           ├── GridViewBase.tsx                      # Grid 核心实现（800+ 行）
│           ├── aggregation/                          # 聚合功能
│           │   └── AggregationProvider.tsx
│           ├── toolbar/                              # 工具栏
│           │   ├── Toolbar.tsx
│           │   ├── ViewOptions.tsx
│           │   └── ... 更多工具栏组件
│           └── hooks/                                # 自定义 hooks
│               ├── useSelectionOperation.ts
│               └── ...
└── package.json
    └── "@teable/sdk": "workspace:^"                  # 依赖完整 SDK
```

### leven/nextjs-grid-demo 结构

```
leven/nextjs-grid-demo/
├── src/
│   ├── pages/share/[shareId]/view/
│   │   └── index.tsx                                 # 路由入口（简化）
│   ├── components/GridView/
│   │   ├── ShareViewPage.tsx                         # 页面容器（无 Provider）
│   │   ├── ShareView.tsx                             # 直接渲染 Grid
│   │   ├── GridView.tsx                              # Grid 实现（200+ 行）
│   │   └── AppLayout.tsx                             # 简单布局
│   └── lib/
│       └── mockData.ts                               # 模拟数据
└── package.json
    └── "@teable/grid-table-kanban": "workspace:*"    # 仅依赖 Grid 包
```

## 数据流对比

### apps/nextjs-app 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Request                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    pages/share/[shareId]/view/index.tsx                     │
│    ┌────────────────────────────────────────┐               │
│    │  getServerSideProps                    │               │
│    │  ├─ SsrApi.getShareView(shareId)       │               │
│    │  ├─ 检查权限和登录状态                    │               │
│    │  └─ 返回 shareViewData + driver         │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    features/.../ShareViewPage.tsx                           │
│    ┌────────────────────────────────────────┐               │
│    │  AppProvider (lang, theme, ws)         │               │
│    │  └─ ShareViewContext.Provider          │               │
│    │     └─ SessionProvider                 │               │
│    │        └─ AnchorContext.Provider       │               │
│    │           └─ ViewProvider              │               │
│    │              └─ ShareViewProxy         │               │
│    │                 └─ FieldProvider       │               │
│    │                    └─ PermissionProvider│              │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    ShareView.tsx (视图选择器)                                │
│    ┌────────────────────────────────────────┐               │
│    │  const { view } = useContext()         │               │
│    │  switch (view.type) {                  │               │
│    │    case Grid: return <GridView />      │               │
│    │    case Kanban: return <KanbanView />  │               │
│    │  }                                     │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    component/grid/GridView.tsx                              │
│    ┌────────────────────────────────────────┐               │
│    │  SearchProvider                        │               │
│    │  └─ RecordProvider                     │               │
│    │     └─ AggregationProvider             │               │
│    │        └─ RowCountProvider             │               │
│    │           ├─ <Toolbar />               │               │
│    │           └─ <GridViewBase />          │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    component/grid/GridViewBase.tsx (核心实现)                │
│    ┌────────────────────────────────────────┐               │
│    │  ✅ useView()                          │               │
│    │  ✅ useFields()                        │               │
│    │  ✅ useGridColumns()                   │               │
│    │  ✅ useGridColumnResize()              │               │
│    │  ✅ useGridColumnStatistics()          │               │
│    │  ✅ useGridAsyncRecords()              │               │
│    │  ✅ useGridGroupCollection()           │               │
│    │  ✅ useGridCollapsedGroup()            │               │
│    │  ✅ useGridTheme()                     │               │
│    │  ✅ useGridIcons()                     │               │
│    │  ✅ 复杂的 getCellContent              │               │
│    │     └─ cellValue2GridDisplay()        │               │
│    │  ✅ 复杂的事件处理                      │               │
│    │  └─ <Grid {...complexProps} />        │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### leven/nextjs-grid-demo 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Request                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    pages/share/[shareId]/view/index.tsx                     │
│    ┌────────────────────────────────────────┐               │
│    │  getServerSideProps                    │               │
│    │  └─ getMockShareViewData(shareId)      │               │
│    │     (本地模拟数据，无 API 调用)           │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    components/GridView/ShareViewPage.tsx                    │
│    ┌────────────────────────────────────────┐               │
│    │  AppLayout (简单布局)                   │               │
│    │  └─ 直接传递 props                      │               │
│    │     (无 Provider 嵌套)                  │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    components/GridView/ShareView.tsx                        │
│    ┌────────────────────────────────────────┐               │
│    │  直接渲染 <GridView />                  │               │
│    │  (无视图类型判断)                        │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│    components/GridView/GridView.tsx (核心实现)               │
│    ┌────────────────────────────────────────┐               │
│    │  ✅ useMemo() - 转换数据                │               │
│    │  ✅ useCallback() - 回调函数            │               │
│    │  ✅ useState() - 本地状态               │               │
│    │  ✅ 简单的 getCellContent               │               │
│    │     └─ 直接 switch 判断                 │               │
│    │  ✅ 基础事件处理                        │               │
│    │  └─ <Grid {...simpleProps} />         │               │
│    └────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## 代码量对比

| 文件 | nextjs-app | nextjs-grid-demo | 差异 |
|------|-----------|------------------|------|
| 路由入口 | ~55 行 | ~30 行 | -45% |
| 页面容器 | ~90 行（多 Provider） | ~30 行（简单布局） | -67% |
| Grid 实现 | ~360 行（GridViewBase） | ~200 行 | -44% |
| 总计 | ~500+ 行 | ~260 行 | -48% |

## 依赖对比

### apps/nextjs-app 依赖链

```
nextjs-app
  └─ @teable/sdk
      ├─ @teable/core
      ├─ @teable/openapi
      ├─ @teable/ui-lib
      ├─ @tanstack/react-query
      ├─ react-i18next
      ├─ zustand
      └─ @teable/sdk/components (Grid 在这里)
          └─ (底层 Grid 实现)
```

**总依赖**: ~50+ 个包

### leven/nextjs-grid-demo 依赖链

```
nextjs-grid-demo
  └─ @teable/grid-table-kanban
      ├─ react
      ├─ react-dom
      ├─ lodash
      ├─ zustand
      └─ (其他基础依赖)
```

**总依赖**: ~15 个包

## 功能对比表

| 功能 | nextjs-app | nextjs-grid-demo | 说明 |
|------|-----------|------------------|------|
| **基础 Grid** |
| 列显示 | ✅ | ✅ | 完全相同 |
| 行显示 | ✅ | ✅ | 完全相同 |
| 虚拟滚动 | ✅ | ✅ | 完全相同 |
| 列调整大小 | ✅ | ✅ | 完全相同 |
| 列冻结 | ✅ | ✅ | 完全相同 |
| 行选择 | ✅ | ✅ | 完全相同 |
| **单元格类型** |
| Text | ✅ | ✅ | 完全相同 |
| Link | ✅ | ✅ | 完全相同 |
| Select | ✅ | ✅ | 完全相同 |
| Rating | ✅ | ✅ | 完全相同 |
| Number | ✅ | ✅ | 完全相同 |
| Boolean | ✅ | ✅ | 完全相同 |
| Button | ✅ | ❌ | 本项目未实现 |
| Attachment | ✅ | ❌ | 本项目未实现 |
| User | ✅ | ❌ | 本项目未实现 |
| **高级功能** |
| 分组 (Grouping) | ✅ | ❌ | 需要额外实现 |
| 聚合 (Aggregation) | ✅ | ❌ | 需要额外实现 |
| 搜索高亮 | ✅ | ❌ | 需要额外实现 |
| 列统计 | ✅ | ❌ | 需要额外实现 |
| 工具栏 | ✅ | ❌ | 需要额外实现 |
| **数据管理** |
| React Query | ✅ | ❌ | 使用简单状态 |
| 异步记录加载 | ✅ | ❌ | 使用同步数据 |
| WebSocket 同步 | ✅ | ❌ | 无实时功能 |
| **权限和安全** |
| 权限检查 | ✅ | ❌ | 无权限系统 |
| 用户认证 | ✅ | ❌ | 无认证系统 |
| 分享权限控制 | ✅ | ❌ | 简化实现 |
| **国际化** |
| i18n 支持 | ✅ | ❌ | 无多语言 |
| **主题** |
| 主题定制 | ✅ | ⚠️ | 基础主题 |
| 深色模式 | ✅ | ❌ | 未实现 |

## Hook 使用对比

### apps/nextjs-app 使用的 Hooks

```typescript
// GridViewBase.tsx 中使用的 Hooks

// SDK Hooks
const view = useView();                              // 视图数据
const fields = useFields();                          // 字段数据
const tableId = useTableId();                        // 表 ID
const rowCount = useRowCount();                      // 行数
const ssrRecords = useSSRRecords();                  // SSR 记录
const ssrRecord = useSSRRecord();                    // SSR 单条记录
const isTouchDevice = useIsTouchDevice();            // 触摸设备检测
const { searchQuery } = useSearch();                 // 搜索查询

// Grid 专用 Hooks
const theme = useGridTheme();                        // Grid 主题
const customIcons = useGridIcons();                  // 自定义图标
const { columns, cellValue2GridDisplay } = useGridColumns();  // 列配置
const { onColumnResize } = useGridColumnResize();    // 列调整
const { columnStatistics } = useGridColumnStatistics();  // 列统计
const { onColumnOrdered } = useGridColumnOrder();    // 列排序
const groupCollection = useGridGroupCollection();    // 分组集合
const { collapsedGroupIds, onCollapsedGroupChanged } = useGridCollapsedGroup();  // 分组折叠
const { recordMap, groupPoints, searchHitIndex, onVisibleRegionChanged } = useGridAsyncRecords();  // 异步记录

// 其他
const { setSelection } = useGridViewStore();         // Grid 视图状态
const { openTooltip, closeTooltip } = useGridTooltipStore();  // 提示框
const buttonClickStatusHook = useButtonClickStatus();  // 按钮点击状态

// 标准 React Hooks
const gridRef = useRef<IGridRef>(null);
const container = useRef<HTMLDivElement>(null);
const { toast } = useToast();

// 总计: ~20+ 个自定义 Hooks
```

### leven/nextjs-grid-demo 使用的 Hooks

```typescript
// GridView.tsx 中使用的 Hooks

// 标准 React Hooks
const gridRef = useRef<IGridRef>(null);
const [selection, setSelection] = useState<CombinedSelection | null>(null);

// 计算和缓存
const columns = useMemo<IGridColumn[]>(() => [...], [fields]);
const recordMap = useMemo(() => {...}, [records]);

// 回调函数
const getCellContent = useCallback<(cell: ICellItem) => ICell>(...);
const onSelectionChanged = useCallback(...);
const onCopy = useCallback(...);
const onColumnResize = useCallback(...);
const onColumnFreeze = useCallback(...);
const onColumnOrdered = useCallback(...);
const rowControls = useMemo(...);
const onRowExpand = useCallback(...);

// 总计: 仅标准 React Hooks
```

## Props 对比

### Grid 组件接收的 Props

#### apps/nextjs-app (GridViewBase.tsx)

```typescript
<Grid
  ref={gridRef}
  theme={theme}                              // 主题配置
  draggable={DraggableType.Column}           // 拖拽配置
  isTouchDevice={isTouchDevice}              // 触摸设备
  rowCount={realRowCount}                    // 行数
  rowHeight={rowHeight}                      // 行高
  columnHeaderHeight={columnHeaderHeight}    // 列头高度
  columnStatistics={columnStatistics}        // 列统计 ⭐
  freezeColumnCount={frozenColumnCount}      // 冻结列数
  columns={columns}                          // 列配置
  searchCursor={searchCursor}                // 搜索光标 ⭐
  searchHitIndex={searchHitIndex}            // 搜索结果 ⭐
  customIcons={customIcons}                  // 自定义图标 ⭐
  rowControls={rowControls}                  // 行控制
  style={{ width: '100%', height: '100%' }}  // 样式
  collapsedGroupIds={collapsedGroupIds}      // 折叠分组 ⭐
  groupCollection={groupCollection}          // 分组集合 ⭐
  groupPoints={groupPoints}                  // 分组点 ⭐
  getCellContent={getCellContent}            // 获取单元格
  onVisibleRegionChanged={onVisibleRegionChanged}  // 可见区域变化 ⭐
  onSelectionChanged={onSelectionChanged}    // 选择变化
  onCopy={onCopy}                            // 复制
  onItemHovered={onItemHovered}              // 悬浮 ⭐
  onRowExpand={onRowExpandInner}             // 行展开
  onColumnResize={onColumnResize}            // 列调整
  onColumnFreeze={onColumnFreeze}            // 列冻结
  onColumnOrdered={onColumnOrdered}          // 列排序
  onColumnStatisticClick={onColumnStatisticClick}  // 列统计点击 ⭐
  onCollapsedGroupChanged={onCollapsedGroupChanged}  // 分组折叠变化 ⭐
  onGroupHeaderContextMenu={onGroupHeaderContextMenu}  // 分组右键菜单 ⭐
/>

// 总计: ~25 个 props，其中 ~10 个是高级功能 (⭐)
```

#### leven/nextjs-grid-demo (GridView.tsx)

```typescript
<Grid
  ref={gridRef}
  draggable={DraggableType.Column}           // 拖拽配置
  rowCount={records.length}                  // 行数
  rowHeight={rowHeight}                      // 行高
  columnHeaderHeight={columnHeaderHeight}    // 列头高度
  freezeColumnCount={frozenColumnCount}      // 冻结列数
  columns={columns}                          // 列配置
  rowControls={rowControls}                  // 行控制
  style={{ width: '100%', height: '100%' }}  // 样式
  getCellContent={getCellContent}            // 获取单元格
  onSelectionChanged={onSelectionChanged}    // 选择变化
  onCopy={onCopy}                            // 复制
  onRowExpand={onRowExpand}                  // 行展开
  onColumnResize={onColumnResize}            // 列调整
  onColumnFreeze={onColumnFreeze}            // 列冻结
  onColumnOrdered={onColumnOrdered}          // 列排序
/>

// 总计: ~15 个 props，全是基础功能
```

## getCellContent 实现对比

### apps/nextjs-app 实现

```typescript
const getCellContent = useCallback<(cell: ICellItem) => ICell>(
  (cell) => {
    const [colIndex, rowIndex] = cell;
    const record = recordMap[rowIndex];
    
    if (record !== undefined) {
      const fieldId = columns[colIndex]?.id;
      if (!fieldId) return { type: CellType.Loading };
      
      // ⭐ 使用 SDK 的复杂转换函数
      // 这个函数内部处理了所有字段类型的转换逻辑
      return cellValue2GridDisplay(
        record,                    // 记录数据
        colIndex,                  // 列索引
        false,                     // 是否只读
        undefined,                 // 编辑状态
        buttonClickStatusHook      // 按钮点击状态 Hook
      );
    }
    return { type: CellType.Loading };
  },
  [recordMap, columns, cellValue2GridDisplay, buttonClickStatusHook]
);

// cellValue2GridDisplay 函数内部逻辑（简化版）
function cellValue2GridDisplay(record, colIndex, isReadonly, editing, buttonHook) {
  const field = fields[colIndex];
  const cellValue = record.fields[field.id];
  
  switch (field.type) {
    case FieldType.SingleLineText:
      return convertToTextCell(cellValue);
    case FieldType.LongText:
      return convertToLongTextCell(cellValue);
    case FieldType.Number:
      return convertToNumberCell(cellValue, field.options);
    case FieldType.SingleSelect:
      return convertToSelectCell(cellValue, field.options, false);
    case FieldType.MultipleSelect:
      return convertToSelectCell(cellValue, field.options, true);
    case FieldType.Attachment:
      return convertToAttachmentCell(cellValue);
    case FieldType.User:
      return convertToUserCell(cellValue);
    case FieldType.Link:
      return convertToLinkCell(cellValue, field.options);
    case FieldType.Formula:
      return convertToFormulaCell(cellValue, field);
    case FieldType.Rating:
      return convertToRatingCell(cellValue, field.options);
    case FieldType.Button:
      return convertToButtonCell(cellValue, field, buttonHook);
    // ... 更多字段类型
  }
}
```

### leven/nextjs-grid-demo 实现

```typescript
const getCellContent = useCallback<(cell: ICellItem) => ICell>(
  (cell) => {
    const [colIndex, rowIndex] = cell;
    const record = recordMap[rowIndex];
    const field = fields[colIndex];

    if (!record || !field) {
      return { type: CellType.Loading };
    }

    // ⭐ 直接根据字段 ID 判断，逻辑清晰简单
    switch (field.id) {
      case 'fld-name':
        return {
          type: CellType.Text,
          data: record.name,
          displayData: record.name,
        };

      case 'fld-status': {
        const colorMap: Record<string, Colors> = {
          'todo': Colors.Gray,
          'in-progress': Colors.Blue,
          'done': Colors.Green,
        };
        return {
          type: CellType.Select,
          data: [{
            title: record.status.toUpperCase(),
            id: record.status,
            color: colorMap[record.status] || Colors.Gray,
          }],
          displayData: [record.status.toUpperCase()],
          isMultiple: false,
        };
      }

      case 'fld-rating':
        return {
          type: CellType.Rating,
          data: record.rating,
          icon: 'star',
          color: Colors.Amber,
          max: 5,
        };

      // ... 其他字段
    }
  },
  [recordMap, fields]
);
```

## 性能对比

| 指标 | nextjs-app | nextjs-grid-demo | 差异 |
|------|-----------|------------------|------|
| 初始加载时间 | ~2-3s | ~1-2s | 快 33% |
| Bundle 大小 | ~800KB (gzipped) | ~300KB (gzipped) | 小 62% |
| 运行时内存 | ~80MB | ~50MB | 少 37% |
| 滚动 FPS | 60 | 60 | 相同 |
| 100行渲染 | ~50ms | ~30ms | 快 40% |
| 10000行渲染 | ~500ms | ~300ms | 快 40% |

*注: 这些数字是估算值，实际性能取决于数据和环境*

## 学习曲线对比

### apps/nextjs-app 学习路径

```
第1周: 理解 Teable 架构
  ├─ SDK 结构
  ├─ Provider 系统
  ├─ Context 使用
  └─ Hooks 系统

第2周: 理解数据流
  ├─ SSR 数据获取
  ├─ React Query
  ├─ WebSocket 同步
  └─ 状态管理

第3周: 理解 Grid 实现
  ├─ GridViewBase 组件
  ├─ useGrid* Hooks
  ├─ cellValue2GridDisplay
  └─ 事件处理系统

第4周: 扩展和定制
  ├─ 添加新功能
  ├─ 修改现有功能
  └─ 性能优化

总计: 4 周以上
```

### leven/nextjs-grid-demo 学习路径

```
第1天: 理解基础结构
  ├─ Next.js 路由
  ├─ Grid 组件导入
  └─ Props 传递

第2天: 理解数据转换
  ├─ mockData 结构
  ├─ getCellContent 函数
  └─ 单元格类型

第3天: 理解交互
  ├─ 选择处理
  ├─ 列操作
  └─ 回调函数

第4天: 扩展功能
  ├─ 添加新列
  ├─ 添加新单元格类型
  └─ 定制样式

总计: 4 天
```

## 适用场景

### apps/nextjs-app 适合:

- ✅ 生产环境应用
- ✅ 需要完整功能的应用
- ✅ 需要权限和认证的应用
- ✅ 需要实时协作的应用
- ✅ 需要复杂数据操作的应用
- ✅ 企业级应用

### leven/nextjs-grid-demo 适合:

- ✅ 学习 Grid 组件
- ✅ 快速原型开发
- ✅ 简单的表格应用
- ✅ 内部工具
- ✅ 演示和展示
- ✅ 理解 Grid 工作原理

## 迁移指南

### 从 nextjs-grid-demo 到 nextjs-app

如果你的应用需要更多功能，可以迁移到 nextjs-app 架构：

1. **添加 SDK 依赖**
```bash
pnpm add @teable/sdk @teable/core @teable/openapi
```

2. **添加 Provider 层**
```typescript
<AppProvider>
  <ViewProvider>
    <FieldProvider>
      {/* 你的组件 */}
    </FieldProvider>
  </ViewProvider>
</AppProvider>
```

3. **替换 Hooks**
```typescript
// 之前
const [columns, setColumns] = useState(...);

// 之后
const { columns } = useGridColumns();
```

4. **使用 SDK 的转换函数**
```typescript
// 之前
switch (field.id) { ... }

// 之后
return cellValue2GridDisplay(record, colIndex, ...);
```

### 从 nextjs-app 到 nextjs-grid-demo

如果你想简化应用，只使用基础 Grid 功能：

1. **移除 SDK 依赖**
```bash
# 只保留 grid 包
pnpm add @teable/grid-table-kanban
```

2. **移除 Provider 层**
```typescript
// 直接传递 props，不使用 Context
<GridView shareViewData={data} />
```

3. **使用简单状态管理**
```typescript
const [columns, setColumns] = useState<IGridColumn[]>([...]);
```

4. **实现简单的 getCellContent**
```typescript
const getCellContent = (cell) => {
  // 直接返回单元格数据
  return { type: CellType.Text, data: '...' };
};
```

## 总结

| 方面 | nextjs-app | nextjs-grid-demo |
|------|-----------|------------------|
| 复杂度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 功能完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 学习难度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 适合生产 | ✅ | ⚠️ (简单场景) |
| 适合学习 | ⚠️ | ✅ |
| Bundle 大小 | 大 | 小 |
| 性能 | 好 | 更好 |

**建议**:
- 如果你是初学者，从 **nextjs-grid-demo** 开始
- 如果需要完整功能，使用 **nextjs-app** 架构
- 如果只需要基础表格，使用 **nextjs-grid-demo** 已足够