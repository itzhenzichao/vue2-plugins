# vue2-plugins

基于 Vue2 的通用插件库 monorepo，支持独立发布、独立安装、统一调试。

## 特性

- Vue2.7 + Vite + `vite-plugin-vue2`
- `pnpm workspace` 多包管理
- 插件包独立构建（ESM + CJS）
- `demo` 项目本地实时调试 + 热更新
- npm scope 统一为 `@zhenzichao`

## 目录结构

```text
vue2-plugins/
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── packages/
    ├── demo/
    └── dialog/
```

## 快速开始

```bash
pnpm install
pnpm dev
pnpm build
```

## 根脚本

- `pnpm dev`：启动 `packages/demo`
- `pnpm build`：构建所有插件包（不包含 demo）
- `pnpm publish:all`：发布所有插件包到 npm

## 使用说明（通用）

1. 安装插件

```bash
npm install @zhenzichao/vue2-xxx
```

2. 在 Vue2 中引入并安装

```js
import Vue from "vue";
import XxxPlugin from "@zhenzichao/vue2-xxx";

Vue.use(XxxPlugin);
```

3. 基础使用示例

```vue
<template>
  <ZcXxx />
</template>
```

## 新增插件规范

当你新增插件时，遵循下面约定：

1. 目录：`packages/[插件名]`
2. npm 包名：`@zhenzichao/vue2-[插件名]`
3. 保持与现有插件一致的 `package.json`、`vite.config.js`、`src/index.js` 结构
4. 必须支持 `Vue.use()`
5. 在 `demo` 中可直接引入调试
6. 构建输出 ESM + CJS，`vue` 设为 external
