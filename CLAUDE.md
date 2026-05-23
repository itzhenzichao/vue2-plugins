每次处理本项目的开发/修改任务时，默认启用 Superpower 模式，按以下流程执行：
1.  先分析现有代码结构与相关文件
2.  明确需求/问题，制定修改方案
3.  编写实现代码，优先按 TDD 流程
4.  完成后自动做代码审查，给出优化建议

---

# vue2-plugins 项目指南

## 项目概述

Vue2 插件 monorepo，使用 pnpm workspace 管理。每个插件独立构建为 npm 包，demo 应用用于在线预览。

- **仓库**: git@github.com:itzhenzichao/vue2-plugins.git
- **预览地址**: https://itzhenzichao.github.io/vue2-plugins/
- **CI**: 推送 main 分支自动部署 demo 到 GitHub Pages

## 架构

```
packages/
  svg-icon/          → @zhenzichao/vue2-svg-icon
  watermark/         → @zhenzichao/vue2-watermark-plugin
  infinite-scroll/   → @zhenzichao/vue2-infinite-scroll
  virtual-list/      → @zhenzichao/vue2-virtual-list
  toast/             → @zhenzichao/vue2-toast
  demo/              → @zhenzichao/vue2-demo (私有，开发预览)
```

## 约定

- **npm scope**: `@zhenzichao/vue2-<功能名>`
- **组件名**: `Zc` 前缀（ZcInfiniteScroll、ZcToast 等）
- **插件入口**: `src/index.js` → `{ install(Vue) }` 对象，防重复安装标志，`window.Vue` 自动安装
- **导出模式**: `export default PluginObject; export { Component/Class }`
- **构建**: Vite library 模式，双格式 ESM(.mjs) + CJS(.js)，vue 外部化，CSS 注入 JS（vite-plugin-css-injected-by-js）
- **Demo 别名**: demo 的 vite.config.js 将每个插件包名映射到 `../<pkg>/src/index.js`，开发时无需先构建插件

## 插件一览

| 插件 | 调用方式 | 说明 |
|------|---------|------|
| svg-icon | `<ZcSvgIcon name="xxx" />` | SVG 图标组件，依赖 vite-plugin-svg-icons |
| watermark | `Vue.use(Watermark)` / `v-watermark` / `$watermark` | Canvas 水印，防篡改，支持全局/局部 |
| infinite-scroll | `<ZcInfiniteScroll :load-more="fn" />` | IntersectionObserver 无限滚动，finish()/reset() 方法 |
| virtual-list | `<ZcVirtualList :items="list" />` | 虚拟滚动，依赖 vue-virtual-scroller，dynamic prop 切换模式 |
| toast | `this.$toast(msg, type)` / `this.$toast.success(msg)` | 函数式消息提示，独立 Vue 实例挂载到 body |

## Demo 应用

- 无 vue-router，App.vue 侧边栏 + `<component :is>` 动态切换页面
- main.js 中 Vue.use() 注册所有插件
- toast 无独立页面，在其他页面中通过 `$toast()` 调用

## 常用命令

```bash
pnpm install                          # 安装依赖
pnpm dev                              # 启动 demo 开发服务器
pnpm build                            # 构建所有插件（不含 demo）
pnpm build:demo                       # 构建 demo 用于部署
pnpm --filter @zhenzichao/vue2-xxx run build  # 构建单个插件
```

## 开发流程

1. 新增插件：在 `packages/` 下创建目录，遵循上述约定，添加到 pnpm-workspace（自动识别）
2. 集成到 demo：添加 workspace 依赖 + vite 别名 + main.js Vue.use() + 新建页面组件
3. 发布：`pnpm --filter @zhenzichao/vue2-xxx publish --access public`