# 快速开始指南 (Quick Start Guide)

## 一键启动 (One-Click Start)

### 方法 1: 使用脚本（推荐）

在 `leven` 目录下执行：

```bash
# 1. 安装所有依赖
pnpm install

# 2. 构建 Grid 包
cd packages/grid-table-kanban && pnpm build && cd ../..

# 3. 启动 Next.js 开发服务器
cd nextjs-grid-demo && pnpm dev
```

### 方法 2: 使用单个命令

```bash
cd /workspace/leven && \
  pnpm install && \
  (cd packages/grid-table-kanban && pnpm build) && \
  (cd nextjs-grid-demo && pnpm dev)
```

## 访问应用

开发服务器启动后，在浏览器中访问：

- **首页**: http://localhost:3001
- **Share View 示例**: http://localhost:3001/share/demo-share-id/view
- **简单 Grid 示例**: http://localhost:3001/simple-grid

## 验证检查清单

启动应用后，请验证以下功能：

### ✅ 基本功能

- [ ] 页面正常加载，无控制台错误
- [ ] Grid 显示 100 行数据
- [ ] 可以看到所有列（Task Name, Email, Status, Priority, Rating, Progress, Done, Created At）

### ✅ 列操作

- [ ] 拖动列边界可以调整列宽
- [ ] 右键点击列头显示菜单（如果实现）
- [ ] 可以冻结列（第一列默认冻结）

### ✅ 行操作

- [ ] 点击行前的复选框可以选择行
- [ ] 点击展开图标可以展开行（查看控制台日志）
- [ ] 可以选择多行

### ✅ 单元格显示

- [ ] **文本单元格**: Task Name 和 Created At 显示正常
- [ ] **链接单元格**: Email 显示为蓝色链接
- [ ] **选择单元格**: Status 和 Priority 显示带颜色的标签
- [ ] **评分单元格**: Rating 显示星星图标
- [ ] **数字单元格**: Progress 显示百分比
- [ ] **布尔单元格**: Done 显示复选框

### ✅ 交互功能

- [ ] 滚动流畅，虚拟滚动工作正常
- [ ] 可以使用键盘方向键导航（如果实现）
- [ ] 可以复制单元格内容（Ctrl+C）

## 常见问题排查

### 问题 1: 依赖安装失败

**症状**: `pnpm install` 报错

**解决方案**:
```bash
# 清理并重新安装
cd /workspace/leven
rm -rf node_modules pnpm-lock.yaml
rm -rf nextjs-grid-demo/node_modules
rm -rf packages/grid-table-kanban/node_modules
pnpm install
```

### 问题 2: Grid 包构建失败

**症状**: `pnpm build` 在 grid-table-kanban 中失败

**解决方案**:
```bash
# 确认依赖已安装
cd /workspace/leven/packages/grid-table-kanban
pnpm install

# 重新构建
pnpm build
```

### 问题 3: Next.js 启动失败

**症状**: `pnpm dev` 报错找不到模块

**解决方案**:
```bash
# 确认 Grid 包已构建
ls /workspace/leven/packages/grid-table-kanban/dist

# 如果 dist 目录不存在，重新构建
cd /workspace/leven/packages/grid-table-kanban
pnpm build

# 重新启动 Next.js
cd /workspace/leven/nextjs-grid-demo
pnpm dev
```

### 问题 4: 页面显示空白

**症状**: 页面加载但没有内容

**解决方案**:
1. 打开浏览器开发者工具（F12）
2. 查看控制台是否有错误
3. 查看网络标签是否有请求失败
4. 检查 `src/lib/mockData.ts` 是否正确生成数据

### 问题 5: Grid 显示异常

**症状**: Grid 显示但单元格内容不正确

**解决方案**:
1. 检查 `getCellContent` 函数是否正确实现
2. 查看控制台是否有 TypeScript 类型错误
3. 验证数据结构是否匹配

## 开发工具

### 推荐的 VS Code 扩展

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Tailwind CSS IntelliSense**: Tailwind 类名自动补全
- **TypeScript Vue Plugin (Volar)**: TypeScript 支持

### 调试技巧

1. **查看单元格数据**:
```typescript
const getCellContent = (cell: ICellItem): ICell => {
  const result = /* ... */;
  console.log('Cell:', cell, 'Result:', result);  // 调试输出
  return result;
};
```

2. **查看 Grid 状态**:
```typescript
useEffect(() => {
  console.log('Grid Ref:', gridRef.current);
}, []);
```

3. **监控回调调用**:
```typescript
const onSelectionChanged = (selection: CombinedSelection) => {
  console.log('Selection changed:', selection);
  setSelection(selection);
};
```

## 性能检查

### 测试大数据量

修改 `src/lib/mockData.ts`:

```typescript
// 生成 10000 行数据
records: generateMockRecords(10000),
```

验证：
- [ ] 页面加载时间 < 2 秒
- [ ] 滚动流畅，无卡顿
- [ ] 内存使用合理

### 性能指标

在浏览器开发者工具中：

1. **Performance 标签**:
   - 记录滚动性能
   - FPS 应该保持在 60

2. **Memory 标签**:
   - 检查是否有内存泄漏
   - 多次滚动后内存应该稳定

## 修改和实验

### 添加新列

在 `src/lib/mockData.ts` 中：

```typescript
export function getMockFields(): MockField[] {
  return [
    // ... 现有字段
    { id: 'fld-description', name: 'Description', type: 'text', width: 300 },
  ];
}

export function generateMockRecords(count: number): MockRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    // ... 现有字段
    description: `This is task ${i + 1} description`,
  }));
}
```

在 `src/components/GridView/GridView.tsx` 的 `getCellContent` 中添加：

```typescript
case 'fld-description':
  return {
    type: CellType.Text,
    data: record.description,
    displayData: record.description,
  };
```

### 修改样式

在 `src/components/GridView/ShareViewPage.tsx` 中修改布局：

```typescript
<div className="flex size-full flex-col md:px-6 md:pb-6">  {/* 增加 padding */}
  {/* ... */}
</div>
```

### 添加工具栏

创建 `src/components/GridView/Toolbar.tsx`:

```typescript
export const Toolbar = () => {
  return (
    <div className="border-b p-2 flex gap-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded">
        Add Row
      </button>
      <button className="px-3 py-1 bg-green-500 text-white rounded">
        Export
      </button>
    </div>
  );
};
```

在 `GridView.tsx` 中使用：

```typescript
return (
  <div className="relative size-full overflow-hidden flex flex-col">
    <Toolbar />
    <div className="flex-1">
      <Grid {...props} />
    </div>
  </div>
);
```

## 生产构建

### 构建应用

```bash
cd /workspace/leven/nextjs-grid-demo
pnpm build
```

### 运行生产版本

```bash
pnpm start
```

### 构建检查

- [ ] 构建无错误
- [ ] 构建输出在 `.next` 目录
- [ ] 生产版本启动正常
- [ ] 性能符合预期

## 部署

### Vercel 部署

1. 在 Vercel 中导入项目
2. 设置构建命令: `pnpm build`
3. 设置输出目录: `.next`
4. 部署

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 workspace 文件
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/grid-table-kanban ./packages/grid-table-kanban
COPY nextjs-grid-demo ./nextjs-grid-demo

# 安装依赖
RUN pnpm install

# 构建 Grid 包
RUN cd packages/grid-table-kanban && pnpm build

# 构建 Next.js 应用
RUN cd nextjs-grid-demo && pnpm build

WORKDIR /app/nextjs-grid-demo

EXPOSE 3000

CMD ["pnpm", "start"]
```

## 学习路径

### 第 1 天: 基础理解

1. [ ] 启动应用，浏览所有页面
2. [ ] 查看 `src/pages/simple-grid.tsx` - 理解最简实现
3. [ ] 查看 `src/lib/mockData.ts` - 理解数据结构
4. [ ] 修改数据，观察变化

### 第 2 天: 深入 Grid

1. [ ] 查看 `src/components/GridView/GridView.tsx`
2. [ ] 理解 `getCellContent` 函数
3. [ ] 理解各种单元格类型
4. [ ] 添加一个新的列

### 第 3 天: 对比学习

1. [ ] 阅读 `USAGE_GUIDE.md`
2. [ ] 对比本项目与 `apps/nextjs-app` 的实现
3. [ ] 理解简化的地方
4. [ ] 理解可以扩展的地方

### 第 4 天: 实践扩展

1. [ ] 添加新的单元格类型
2. [ ] 实现数据持久化
3. [ ] 添加工具栏功能
4. [ ] 优化性能

## 获取帮助

### 文档资源

- **README.md**: 项目概述
- **USAGE_GUIDE.md**: 详细使用指南
- **PROJECT_SUMMARY.md**: 项目总结
- **本文件**: 快速开始

### 代码参考

- **Simple Grid**: `src/pages/simple-grid.tsx`
- **完整 Grid**: `src/components/GridView/GridView.tsx`
- **原始实现**: `apps/nextjs-app/src/features/app/blocks/share/view/component/grid/`

### 在线资源

- Grid 包源码: `leven/packages/grid-table-kanban/src/grid/`
- Grid 示例: `leven/examples/basic-grid/`
- Next.js 文档: https://nextjs.org/docs

## 成功标志

当你能够：

- ✅ 独立启动和运行应用
- ✅ 理解 Grid 的基本工作原理
- ✅ 修改和添加新的列和单元格类型
- ✅ 理解与 nextjs-app 的区别和联系
- ✅ 能够基于此项目构建自己的应用

那么你已经成功掌握了 Grid 组件的使用！

祝你学习愉快！🚀