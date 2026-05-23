在 packages/ 下创建一个新的 Vue2 插件，名称为 $ARGUMENTS。

请严格按照以下步骤执行，每一步都要完成后再进入下一步：

## 第 1 步：创建插件包文件

在 `packages/$ARGUMENTS/` 下创建以下文件：

### 1.1 package.json
参考 `packages/infinite-scroll/package.json` 的格式，替换为：
- name: `@zhenzichao/vue2-$ARGUMENTS`
- description: 根据插件功能编写简短描述
- main: `dist/$ARGUMENTS.js`
- module: `dist/$ARGUMENTS.mjs`
- exports 的 import 和 require 路径对应替换
- keywords 根据功能编写
- peerDependencies: vue ^2.7.14
- devDependencies: vite ^4.5.14, vue-template-compiler 2.7.14, vite-plugin-vue2 ^2.0.3, vite-plugin-css-injected-by-js ^4.0.1

### 1.2 vite.config.js
参考 `packages/infinite-scroll/vite.config.js`，替换为：
- entry: `resolve(__dirname, 'src/index.js')`
- name(UMD全局名): `Vue2${PascalCase}Plugin`（如 Vue2ToastPlugin）
- fileName: `$ARGUMENTS.mjs` / `$ARGUMENTS.js`
- external: ['vue']

### 1.3 src/index.js
遵循项目约定：
- import 组件
- 定义 `{ install(Vue) }` 插件对象，installed 标志防重复
- `Vue.component(Component.name, Component)` 注册
- `window.Vue` 自动安装
- `export default PluginObject; export { Component }`

### 1.4 src/$ARGUMENTS.vue (PascalCase组件文件)
根据用户描述的插件功能编写组件：
- name 属性使用 `Zc` 前缀（如 ZcToast）
- 编写 template、script、style scoped
- 样式使用 `.zc-$ARGUMENTS` 前缀的 class 名

## 第 2 步：集成到 demo 项目

修改以下 4 个文件：

### 2.1 packages/demo/package.json
在 dependencies 中添加：`"@zhenzichao/vue2-$ARGUMENTS": "workspace:*"`

### 2.2 packages/demo/vite.config.js
在 resolve.alias 中添加：
`"@zhenzichao/vue2-$ARGUMENTS": resolve(__dirname, "../$ARGUMENTS/src/index.js")`

### 2.3 packages/demo/src/main.js
添加 import 和 Vue.use()，放在其他插件后面

### 2.4 packages/demo/src/App.vue
- 在 script 中 import 新的页面组件并注册到 components
- 在 menu 数组中添加新的菜单项（key、title、sub）
- 在 activePage computed 中添加对应的条件判断
- 在 pages/ 下创建对应的 XxxPage.vue demo 页面

## 第 3 步：安装依赖并验证

运行 `pnpm install` 安装新包依赖