# Qiankun 微前端集成方案

## qiankun 是什么

一句话：**qiankun 让你在一个网页里加载另一个独立项目的页面，像iframe一样嵌入但比iframe更好用。**

核心原理：
1. 主应用通过 URL fetch 子应用的 HTML 文件
2. 解析出里面的 JS 和 CSS 资源
3. 在一个 JS 沙箱里执行这些脚本（隔离全局变量，不污染主应用）
4. 从脚本中提取 `bootstrap/mount/unmount` 三个生命周期函数
5. 调用 `mount` 把子应用渲染到指定容器，调用 `unmount` 时销毁

和 iframe 的区别：qiankun 的子应用和主应用共享同一个 DOM，可以互相通信，没有 iframe 的割裂感。样式可以通过 `experimentalStyleIsolation` 做沙箱隔离。

更多细节见 [qiankun 官方文档](https://qiankun.umijs.org/zh/guide)。

## 背景

主应用（vue2-plugins）和子应用（vue-textellipsis-zzc）是两个独立的 Git 仓库，各自是 Vue2 插件库。子应用已有完整的 demo 预览页面，希望通过 qiankun 微前端方式嵌入主应用的 demo 中，避免重复设计预览页面，同时保持两个项目各自独立开发和部署。

- **主应用仓库**：https://github.com/itzhenzichao/vue2-plugins
- **子应用仓库**：https://github.com/itzhenzichao/vue-textellipsis-zzc
- **子应用线上地址**：https://itzhenzichao.github.io/vue-textellipsis-zzc/

### 技术栈差异

两个项目虽然都是 Vue2，但构建工具和开发模式完全不同：

| | 主应用（vue2-plugins） | 子应用（vue-textellipsis-zzc） |
|---|---|---|
| **Vue 版本** | Vue 2.7 | Vue 2.6 |
| **构建工具** | Vite + `vite-plugin-vue2` | Vue CLI 4（Webpack 4） |
| **路由** | vue-router（hash 模式） | vue-router（hash 模式） + Vuex |
| **包管理** | pnpm workspace（monorepo） | yarn（独立项目） |
| **开发服务器** | Vite dev server（5173） | webpack-dev-server（8080） |
| **模块格式** | ES module（Vite 原生） | CommonJS / UMD（Webpack） |

这些差异正是选择 qiankun 的原因之一——qiankun 不要求子应用和主应用使用相同的构建工具或模块格式，只要子应用能导出 `bootstrap/mount/unmount` 生命周期，qiankun 就能接管。Webpack 的 CommonJS/UMD 产出通过 ES module export 和 `window[name]` 双路径兜底，确保生命周期函数在任何模块格式下都能被提取。

这也带来了一些配置上的额外处理：
- 子应用必须关闭 `splitChunks`（Webpack 分 chunk 会导致生命周期函数不在主 bundle 中，qiankun 沙箱提取 export 失败）
- 子应用必须关闭 HMR（`hot: false`）和 liveReload（`liveReload: false`），避免 webpack runtime 的 WebSocket 连接干扰 qiankun 沙箱
- 子应用 dev server 必须配置 CORS headers，因为主应用（Vite 5173）需要跨域 fetch 子应用（Webpack 8080）的资源

## 嵌入方案

采用 **hash 模式 + qiankun** 的方案，原因如下：

1. 主应用和子应用都部署在 GitHub Pages 的二级目录下，history 模式会导致直接访问子路由路径时 404
2. hash 模式下所有路由请求都指向同一份 index.html，GitHub Pages 天然支持，无需 404.html hack

### 路由结构

```
主应用：/vue2-plugins/#/svg-icon           → SvgIcon 页面
        /vue2-plugins/#/watermark          → Watermark 页面
        /vue2-plugins/#/infinite-scroll    → InfiniteScroll 页面
        /vue2-plugins/#/virtual-list       → VirtualList 页面
        /vue2-plugins/#/vue-textellipsis-zzc → qiankun 子应用容器

子应用独立运行：/vue-textellipsis-zzc/#/textellipsis → Textellipsis 页面
```

### 架构说明

主应用使用 vue-router（hash 模式）管理自身页面路由，`vue-textellipsis-zzc` 是一个只注册路由名、不绑定组件的路由项——由 qiankun 接管渲染。当 hash 以 `#/vue-textellipsis-zzc` 开头时，qiankun 激活子应用，子应用完整页面渲染到 `#subapp-viewport` 容器中。

**hash 模式下 qiankun 的限制**：主应用和子应用共用 `window.location.hash`，子应用无法有独立的 hash 路由空间。因此 qiankun 环境下子应用直接渲染组件（不走 router），独立运行时才使用完整路由。

## 用到的 API

### 主应用（qiankun 注册与启动）

```js
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "textellipsis",                    // 子应用名称
    entry: "//localhost:8080",                // 子应用地址（开发用本地，生产用线上）
    container: "#subapp-viewport",            // 子应用容器 DOM
    activeRule: (location) =>                 // 激活规则（基于 hash）
      location.hash.startsWith("#/vue-textellipsis-zzc"),
  },
]);

start({
  sandbox: { experimentalStyleIsolation: true },  // 样式隔离
  prefetch: true,                                  // 预加载，主应用空闲时提前 fetch 子应用资源
});
```

### name 字段的重要性

`registerMicroApps` 中的 `name` 字段不仅用于标识子应用，还直接影响 qiankun 获取生命周期函数的方式：

1. **ES module export**（主路径）— qiankun 在沙箱中执行子应用脚本后提取 `export { bootstrap, mount, unmount }`
2. **`window[name]` 全局变量**（兜底路径）— 当 ES module export 提取失败时（如 webpack 分 chunk、异步加载等），qiankun 会从 `window[name]` 取生命周期

因此 `window[name]` 的变量名**必须和 `name` 字段一致**。当前配置 `name: "textellipsis"`，子应用必须挂载 `window["textellipsis"]`，而不是随意命名如 `window.textellipsisApp`。

> 正常情况下 ES module export 路径生效，`window[name]` 不起作用。但一旦沙箱 export 提取失败（webpack 配置变更、异步 chunk 等），`window[name]` 就是唯一的兜底保障。

### 子应用（生命周期导出）

```js
let app = null;

function render(container) {
  if (container) {
    // qiankun 环境：直接渲染组件
    app = new Vue({ render: (h) => h(Textellipsis) }).$mount();
    container.appendChild(app.$el);
  } else {
    // 独立运行：完整 SPA
    app = new Vue({ router, store, render: (h) => h(App) }).$mount("#app");
  }
}

// 独立运行时自动渲染
if (!window.__POWERED_BY_QIANKUN__) { render(); }

// 导出生命周期
async function bootstrap() {}
async function mount(props) { render(props.container); }
async function unmount() {
  app.$destroy();
  if (app.$el && app.$el.parentNode) app.$el.parentNode.removeChild(app.$el);
  app = null;
}

// 手动挂全局，变量名必须和 registerMicroApps 的 name 字段一致
// qiankun 通过 window[name] 获取生命周期函数
window["textellipsis"] = { bootstrap, mount, unmount };
export { bootstrap, mount, unmount };
```

### 子应用 webpack 配置

```js
// vue.config.js
module.exports = {
  devServer: {
    port: 8080,
    headers: { "Access-Control-Allow-Origin": "*" },  // 跨域
    hot: false,                                         // 关闭 HMR，避免 webpack runtime 干扰 qiankun 沙箱
  },
  configureWebpack: {
    optimization: { splitChunks: false },               // 禁用分 chunk，确保生命周期在主 bundle 中
  },
};
```

## 本地调试

### 方式一：本地联调（同时运行两个 dev server）

需要同时启动主应用和子应用的 dev server，qiankun 从子应用本地地址加载：

```bash
# 1. 启动子应用
cd vue-textellipsis-zzc && yarn dev   # localhost:8080

# 2. 启动主应用
cd vue2-plugins && pnpm dev                     # localhost:5173/vue2-plugins/
```

访问 `http://localhost:5173/vue2-plugins/#/svg-icon`，切换到"文本省略"菜单即可看到子应用。

注意：子应用 dev 模式关闭了 HMR（`hot: false`），改代码需要手动刷新浏览器。

### 方式二：预览线上效果（不需要运行子应用）

主应用从子应用的线上地址加载，不需要启动子应用 dev server：

```bash
cd vue2-plugins && pnpm dev:prod
```

访问 `http://localhost:5173/vue2-plugins/`，切换到"文本省略"菜单，qiankun 从 `https://itzhenzichao.github.io/vue-textellipsis-zzc/` 加载子应用。

## 部署

### 主应用部署

```bash
pnpm build:demo
```

构建时 `PROD_MICRO=1` 环境变量通过 Vite `define` 注入，qiankun entry 指向子应用线上地址。推到 GitHub 后自动部署到 `https://itzhenzichao.github.io/vue2-plugins/`。

### 子应用部署

```bash
cd vue-textellipsis-zzc && yarn build
```

构建产物推到 GitHub 后自动部署到 `https://itzhenzichao.github.io/vue-textellipsis-zzc/`。

子应用构建产物中 `window["textellipsis"] = { bootstrap, mount, unmount }` 确保 qiankun 能获取生命周期函数。变量名必须和主应用 `registerMicroApps` 的 `name` 字段一致。

## 加载优化

子应用首次加载时需要 fetch HTML → 解析脚本 → 执行 → mount Vue 实例，会产生短暂白屏。通过以下两个优化减少等待感知：

### 1. 开启预加载（prefetch）

```js
start({ prefetch: true });
```

`prefetch: true` 让 qiankun 在主应用空闲时提前 fetch 子应用的 HTML 和 JS 资源。用户点击菜单时子应用资源已缓存，直接 mount，几乎无等待。

### 2. 加载过渡动画

在 `#subapp-viewport` 容器内放置 loading spinner，子应用 mount 后 DOM 自然替换，无缝过渡：

```html
<div id="subapp-viewport">
  <div class="micro-loading">
    <div class="micro-loading-spinner"></div>
    <p>正在加载子应用...</p>
  </div>
</div>
```

```css
.micro-loading-spinner {
  width: 32px; height: 32px;
  border: 3px solid #e5e6eb;
  border-top-color: #1677ff;
  border-radius: 50%;
  animation: micro-spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes micro-spin { to { transform: rotate(360deg); } }
```

## 新增子应用步骤

1. 子应用仓库：导出 `bootstrap/mount/unmount` 生命周期，手动挂到 `window[appName]`
2. 主应用 `main.js`：在 `registerMicroApps` 中新增一条配置
3. 主应用 `router.js`：在 children 中新增路由项（只注册 name，不绑定 component）
4. 主应用 `App.vue`：在 `MICRO_APP_HASHES` 数组中新增子应用 hash，菜单中新增一项