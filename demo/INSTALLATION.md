# 安装与运行指南

## 前置要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0（推荐使用 pnpm）

如果未安装 pnpm：

```bash
npm install -g pnpm
```

## 安装步骤

### 方法 1：在 Monorepo 中运行（推荐）

如果你在 Teable 项目根目录：

```bash
# 1. 安装所有依赖（包括 demo）
pnpm install

# 2. 构建 Grid 组件
cd packages/grid-table-kanban
pnpm build

# 3. 启动 Demo
cd ../../demo
pnpm dev
```

### 方法 2：独立运行 Demo

如果只想运行 Demo（不依赖 Monorepo）：

```bash
# 1. 进入 demo 目录
cd demo

# 2. 安装依赖
pnpm install

# 3. 确保 @teable/grid-table-kanban 已构建
# 如果报错找不到包，需要先构建：
cd ../packages/grid-table-kanban
pnpm build
cd ../../demo

# 4. 启动开发服务器
pnpm dev
```

## 访问应用

开发服务器启动后，打开浏览器访问：

**http://localhost:5173**

## 可用命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 运行 E2E 测试（UI 模式）
pnpm test:e2e:ui

# 类型检查
pnpm typecheck

# Lint 检查
pnpm lint
```

## 故障排除

### 问题 1：找不到 @teable/grid-table-kanban

**原因**：Grid 组件包未构建

**解决**：

```bash
cd packages/grid-table-kanban
pnpm build
```

### 问题 2：端口 5173 已被占用

**解决**：修改 `vite.config.ts` 中的端口：

```typescript
export default defineConfig({
  server: {
    port: 5174, // 改为其他端口
  },
});
```

### 问题 3：类型错误

**原因**：TypeScript 缓存问题

**解决**：

```bash
# 删除缓存
rm -rf node_modules/.vite
rm -rf dist

# 重新安装
pnpm install
```

### 问题 4：E2E 测试失败

**原因**：Playwright 浏览器未安装

**解决**：

```bash
pnpm exec playwright install
```

## 依赖说明

所有依赖都在 `package.json` 中声明，主要包括：

- **核心**：React 18.3.1, TypeScript 5.4.3
- **状态管理**：Zustand 4.5.2
- **拖拽**：@dnd-kit 6.1.0
- **样式**：Tailwind CSS 3.4.1
- **测试**：Vitest 2.1.5, Playwright 1.42.0
- **构建**：Vite 5.1.6

## 性能优化建议

开发模式下如果遇到性能问题：

1. **关闭 React Strict Mode**（已在 `main.tsx` 中配置）
2. **减少 Mock 数据量**：修改 `GridDemoApp.tsx` 中的 `generateMockRows(1500)` 为更小的数字
3. **调整页面大小**：使用较小的 `pageSize`（如 50）

## 下一步

安装完成后，请查看 [README.md](./README.md) 了解：

- 功能覆盖详情
- 交互验收脚本
- 键盘快捷键
- 技术架构说明

祝你使用愉快！🎉