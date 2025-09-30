# Grid 使用指南 (Grid Usage Guide)

本文档详细说明了如何在 Next.js 应用中使用 `@teable/grid-table-kanban` 包，以及它与 `apps/nextjs-app` 中 share view 实现的关系。

## 目录 (Table of Contents)

1. [核心概念](#核心概念)
2. [nextjs-app 中的实现分析](#nextjs-app-中的实现分析)
3. [本项目的简化实现](#本项目的简化实现)
4. [关键代码对比](#关键代码对比)
5. [完整示例](#完整示例)

## 核心概念

### Grid 组件的核心特性

1. **虚拟滚动**: 只渲染可见区域的单元格，支持大数据量
2. **列操作**: 调整大小、冻结、排序、拖拽
3. **行操作**: 选择、展开、拖拽
4. **单元格类型**: 文本、链接、选择、评分、数字、布尔值等
5. **交互**: 复制、粘贴、删除、编辑

### 数据流

```
服务器数据 (Server Data)
    ↓
转换为 Grid 格式 (Transform to Grid Format)
    ↓
Grid 组件渲染 (Grid Component Renders)
    ↓
用户交互 (User Interactions)
    ↓
回调处理 (Callback Handlers)
```

## nextjs-app 中的实现分析

### 文件结构

```
apps/nextjs-app/src/
├── pages/share/[shareId]/view/
│   └── index.tsx                          # 路由入口，SSR 数据获取
└── features/app/blocks/share/view/
    ├── ShareViewPage.tsx                  # 页面容器，提供 Context
    ├── ShareView.tsx                      # 视图路由器（Grid/Kanban/Form等）
    └── component/grid/
        ├── GridView.tsx                   # Grid 包装器，提供 Providers
        └── GridViewBase.tsx               # Grid 核心实现
```

### 关键代码片段

#### 1. 路由层 (`pages/share/[shareId]/view/index.tsx`)

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shareId } = query;
  const shareViewData = await ssrApi.getShareView(shareId);
  
  return {
    props: {
      shareViewData,
      driver,
    },
  };
};

export default function ShareView({ shareViewData, driver }) {
  return <ShareViewPage shareViewData={shareViewData} driver={driver} />;
}
```

**关键点**:
- 使用 `getServerSideProps` 进行服务器端数据获取
- 通过 API 获取共享视图数据
- 传递数据给页面组件

#### 2. 页面容器层 (`ShareViewPage.tsx`)

```typescript
export const ShareViewPage = (props: IShareViewPageProps) => {
  const { tableId, viewId, view, fields, shareId } = props.shareViewData;

  return (
    <AppProvider lang={i18n.language} wsPath={wsPath} locale={sdkLocale}>
      <ShareViewContext.Provider value={props.shareViewData}>
        <SessionProvider user={user} disabledApi>
          <AnchorContext.Provider value={{ tableId, viewId }}>
            <ViewProvider serverData={[view]}>
              <FieldProvider serverSideData={fields}>
                <ShareView />
              </FieldProvider>
            </ViewProvider>
          </AnchorContext.Provider>
        </SessionProvider>
      </ShareViewContext.Provider>
    </AppProvider>
  );
};
```

**关键点**:
- 多层 Provider 架构
- 提供全局状态和配置
- 支持国际化、主题、WebSocket 等

#### 3. 视图选择层 (`ShareView.tsx`)

```typescript
export const ShareView = () => {
  const { view } = useContext(ShareViewContext);
  
  switch (view?.type) {
    case ViewType.Grid:
      return <GridView />;
    case ViewType.Kanban:
      return <KanbanView />;
    // ...
  }
};
```

**关键点**:
- 根据视图类型选择对应的视图组件
- 使用 Context 获取视图数据

#### 4. Grid 包装层 (`GridView.tsx`)

```typescript
export const GridView = () => {
  const { records, view, extra } = useContext(ShareViewContext);

  return (
    <SearchProvider>
      <RecordProvider serverRecords={records}>
        <AggregationProvider>
          <RowCountProvider>
            <Toolbar />
            <GridViewBase groupPointsServerData={extra?.groupPoints} />
          </RowCountProvider>
        </AggregationProvider>
      </RecordProvider>
    </SearchProvider>
  );
};
```

**关键点**:
- 提供 Grid 特定的 Providers
- 包含工具栏和其他 UI 组件
- 传递分组数据等额外信息

#### 5. Grid 核心实现层 (`GridViewBase.tsx`)

```typescript
export const GridViewBase = (props: IGridViewProps) => {
  const view = useView();
  const fields = useFields();
  const gridRef = useRef<IGridRef>(null);
  
  const { columns } = useGridColumns();
  const { onColumnResize } = useGridColumnResize(originalColumns);
  const { columnStatistics } = useGridColumnStatistics(columns);
  
  const getCellContent = useCallback<(cell: ICellItem) => ICell>(
    (cell) => {
      const [colIndex, rowIndex] = cell;
      const record = recordMap[rowIndex];
      const fieldId = columns[colIndex]?.id;
      
      return cellValue2GridDisplay(record, colIndex, ...);
    },
    [recordMap, columns, cellValue2GridDisplay]
  );

  return (
    <Grid
      ref={gridRef}
      theme={theme}
      columns={columns}
      rowCount={realRowCount}
      rowHeight={rowHeight}
      getCellContent={getCellContent}
      onSelectionChanged={onSelectionChanged}
      onColumnResize={onColumnResize}
      // ... 其他 props
    />
  );
};
```

**关键点**:
- 使用多个自定义 hooks 处理不同功能
- `getCellContent` 是核心函数，将数据转换为单元格
- 处理所有用户交互回调

## 本项目的简化实现

### 简化的文件结构

```
nextjs-grid-demo/src/
├── pages/share/[shareId]/view/
│   └── index.tsx                          # 路由 + SSR
├── components/GridView/
│   ├── ShareViewPage.tsx                  # 页面容器
│   ├── ShareView.tsx                      # 视图包装
│   ├── GridView.tsx                       # Grid 实现（合并了 GridViewBase）
│   └── AppLayout.tsx                      # 布局
└── lib/
    └── mockData.ts                        # 模拟数据
```

### 主要简化

1. **移除复杂的 Provider 层**: 直接传递数据，不使用 Context API
2. **移除 SDK 依赖**: 使用原生 Grid 组件，不依赖 Teable SDK
3. **简化数据处理**: 直接在组件中处理数据转换
4. **模拟数据**: 使用本地数据而不是 API

## 关键代码对比

### getCellContent 函数

#### nextjs-app 版本（复杂）:

```typescript
const getCellContent = useCallback<(cell: ICellItem) => ICell>(
  (cell) => {
    const [colIndex, rowIndex] = cell;
    const record = recordMap[rowIndex];
    const fieldId = columns[colIndex]?.id;
    
    if (!fieldId) return { type: CellType.Loading };
    
    // 使用 SDK 的转换函数
    return cellValue2GridDisplay(
      record, 
      colIndex, 
      false, 
      undefined, 
      buttonClickStatusHook
    );
  },
  [recordMap, columns, cellValue2GridDisplay, buttonClickStatusHook]
);
```

#### 本项目版本（简化）:

```typescript
const getCellContent = useCallback<(cell: ICellItem) => ICell>(
  (cell) => {
    const [colIndex, rowIndex] = cell;
    const record = recordMap[rowIndex];
    const field = fields[colIndex];

    if (!record || !field) {
      return { type: CellType.Loading };
    }

    // 直接根据字段类型返回单元格数据
    switch (field.id) {
      case 'fld-name':
        return {
          type: CellType.Text,
          data: record.name,
          displayData: record.name,
        };
      
      case 'fld-status':
        return {
          type: CellType.Select,
          data: [{
            title: record.status.toUpperCase(),
            id: record.status,
            color: Colors.Blue,
          }],
          displayData: [record.status.toUpperCase()],
          isMultiple: false,
        };
      
      // ... 其他字段
    }
  },
  [recordMap, fields]
);
```

### Grid 组件配置

#### 共同的核心 props:

```typescript
<Grid
  ref={gridRef}
  columns={columns}
  rowCount={rowCount}
  rowHeight={rowHeight}
  getCellContent={getCellContent}
  onSelectionChanged={onSelectionChanged}
  onColumnResize={onColumnResize}
/>
```

#### nextjs-app 额外的功能:

```typescript
<Grid
  // ... 基础 props
  theme={theme}                              // 主题定制
  customIcons={customIcons}                 // 自定义图标
  searchCursor={searchCursor}               // 搜索高亮
  searchHitIndex={searchHitIndex}           // 搜索结果
  collapsedGroupIds={collapsedGroupIds}     // 分组折叠
  groupCollection={groupCollection}         // 分组集合
  groupPoints={groupPoints}                 // 分组点
  columnStatistics={columnStatistics}       // 列统计
  onCopy={onCopy}                           // 复制处理
  onItemHovered={onItemHovered}             // 悬浮提示
  onCollapsedGroupChanged={...}             // 分组变化
  onGroupHeaderContextMenu={...}            // 分组菜单
/>
```

## 完整示例

### 最小化 Grid 实现

```typescript
import { useCallback, useRef } from 'react';
import {
  Grid,
  type IGridRef,
  type IGridColumn,
  type ICell,
  type ICellItem,
  CellType,
} from '@teable/grid-table-kanban';

export default function MinimalGrid() {
  const gridRef = useRef<IGridRef>(null);
  
  // 定义列
  const columns: IGridColumn[] = [
    { id: 'name', name: 'Name', width: 200, isPrimary: true },
    { id: 'age', name: 'Age', width: 100 },
  ];
  
  // 定义数据
  const data = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
  ];
  
  // 单元格内容获取
  const getCellContent = useCallback((cell: ICellItem): ICell => {
    const [colIndex, rowIndex] = cell;
    const column = columns[colIndex];
    const row = data[rowIndex];
    
    if (column.id === 'name') {
      return {
        type: CellType.Text,
        data: row.name,
        displayData: row.name,
      };
    }
    
    if (column.id === 'age') {
      return {
        type: CellType.Number,
        data: row.age,
        displayData: String(row.age),
      };
    }
    
    return { type: CellType.Text, data: '', displayData: '' };
  }, []);
  
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Grid
        ref={gridRef}
        columns={columns}
        rowCount={data.length}
        getCellContent={getCellContent}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
```

### 带完整功能的 Grid

参考 `src/components/GridView/GridView.tsx` 查看包含以下功能的完整实现：

- ✅ 多种单元格类型
- ✅ 列调整大小
- ✅ 列冻结
- ✅ 列排序
- ✅ 行选择
- ✅ 行展开
- ✅ 复制功能
- ✅ 键盘导航

## 从 nextjs-app 迁移到独立 Grid

如果你想从 nextjs-app 的实现迁移到使用独立的 Grid 包，需要：

### 1. 替换导入

**之前**:
```typescript
import { Grid } from '@teable/sdk/components';
```

**现在**:
```typescript
import { Grid } from '@teable/grid-table-kanban';
```

### 2. 移除 SDK Hooks

**之前**:
```typescript
const { columns } = useGridColumns();
const { onColumnResize } = useGridColumnResize(originalColumns);
```

**现在**:
```typescript
const [columns, setColumns] = useState<IGridColumn[]>([...]);

const onColumnResize = useCallback((column, newSize, colIndex) => {
  setColumns(prev => prev.map((c, i) => 
    i === colIndex ? { ...c, width: newSize } : c
  ));
}, []);
```

### 3. 简化 getCellContent

**之前（使用 SDK）**:
```typescript
return cellValue2GridDisplay(record, colIndex, ...complexParams);
```

**现在（直接实现）**:
```typescript
return {
  type: CellType.Text,
  data: record[field.id],
  displayData: record[field.id],
};
```

### 4. 移除 Context Providers

**之前**:
```typescript
<ViewProvider>
  <FieldProvider>
    <Grid ... />
  </FieldProvider>
</ViewProvider>
```

**现在**:
```typescript
<Grid ... />
```

## 性能优化建议

1. **使用 useMemo 缓存数据转换**:
```typescript
const recordMap = useMemo(() => {
  const map: Record<number, Record> = {};
  records.forEach((record, index) => {
    map[index] = record;
  });
  return map;
}, [records]);
```

2. **使用 useCallback 缓存回调函数**:
```typescript
const getCellContent = useCallback((cell: ICellItem) => {
  // ...
}, [recordMap, columns]);
```

3. **避免在 getCellContent 中进行复杂计算**:
```typescript
// ❌ 不好
const getCellContent = (cell) => {
  const expensiveValue = complexCalculation(data);  // 每次都计算
  return { type: CellType.Text, data: expensiveValue };
};

// ✅ 好
const precomputedValues = useMemo(() => 
  data.map(complexCalculation), [data]
);

const getCellContent = (cell) => {
  return { type: CellType.Text, data: precomputedValues[cell[1]] };
};
```

## 总结

| 特性 | nextjs-app 实现 | 本项目实现 |
|------|----------------|-----------|
| Grid 来源 | `@teable/sdk/components` | `@teable/grid-table-kanban` |
| Provider 层 | 多层嵌套（AppProvider, ViewProvider等） | 简化或无 |
| 数据来源 | API + WebSocket | 模拟数据 |
| 状态管理 | SDK Hooks + Context | Local State |
| 功能复杂度 | 高（分组、聚合、实时协作等） | 中（核心 Grid 功能） |
| 学习曲线 | 陡峭 | 平缓 |
| 适用场景 | 生产环境，完整应用 | 学习、原型、简单应用 |

本项目提供了一个清晰的示例，展示了如何在没有完整 Teable SDK 的情况下使用 Grid 组件，这对于理解 Grid 的核心工作原理非常有帮助。