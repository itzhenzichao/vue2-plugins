# @zhenzichao/vue2-watermark-plugin

> 专业前端水印插件，支持 Vue 2 和原生 JavaScript，防删除防篡改

[![npm version](https://img.shields.io/npm/v/@zhenzichao/vue2-watermark-plugin.svg)](https://www.npmjs.com/package/@zhenzichao/vue2-watermark-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- **全局/局部水印** — 支持全页面水印和指定容器内的局部水印
- **防删除防篡改** — 使用 MutationObserver 监听 DOM 变化，水印被删除或修改时自动恢复
- **多行水印** — 支持单行和多行水印内容，内容可自由配置
- **高度可配置** — 支持文字大小、颜色、透明度、旋转角度、间距、对齐方式、偏移量等全方位配置
- **Canvas 生成** — 使用 Canvas 生成水印图片，避免文字被选中复制，内容不可通过选区获取
- **点击穿透** — 可配置水印是否允许点击穿透，不影响原有交互
- **弹窗浮层支持** — 支持弹窗、抽屉、浮层内正常显示水印，不被遮挡
- **容器自适应** — 监听容器尺寸变化，自动重新生成水印
- **Vue 指令支持** — 提供 `v-watermark` 指令和 Vue 插件，使用简单方便
- **零依赖** — 不依赖任何第三方库，轻量高效

## 安装

```bash
npm install @zhenzichao/vue2-watermark-plugin

yarn add @zhenzichao/vue2-watermark-plugin

pnpm add @zhenzichao/vue2-watermark-plugin
```

## 快速开始

### Vue 2 全局水印

```javascript
// main.js
import Vue from 'vue'
import Watermark from '@zhenzichao/vue2-watermark-plugin'

Vue.use(Watermark, {
  content: 'CONFIDENTIAL',
  global: true // 启用全局水印
})
```

### Vue 指令方式（局部水印）

```vue
<template>
  <div v-watermark="{
    content: ['内部机密', '禁止外传'],
    color: 'rgba(255, 0, 0, 0.1)'
  }">
    内容区域
  </div>
</template>
```

### 原生 JavaScript 方式

```javascript
import { Watermark } from '@zhenzichao/vue2-watermark-plugin'

// 创建水印实例
const watermark = new Watermark({
  content: ['机密文档', '禁止外传'],
  fontSize: 16,
  color: 'rgba(0, 0, 0, 0.15)',
  rotate: -30
})

// 初始化水印（默认添加到 document.body）
watermark.init()

// 局部水印
watermark.init({ container: '#content-area' })

// 更新水印
watermark.update({ content: '新水印' })

// 销毁水印
watermark.destroy()
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string \| string[]` | `['zzc的插件库', '防删除防篡改']` | 水印内容，支持单行或多行 |
| `container` | `HTMLElement \| string \| null` | `null` | 水印容器，`null` 表示 `document.body` |
| `width` | `number` | 自动计算 | 单张水印图片宽度，默认根据内容自动计算 |
| `height` | `number` | 自动计算 | 单张水印图片高度，默认根据内容自动计算 |
| `fontSize` | `number` | `14` | 文字大小（px） |
| `fontFamily` | `string` | `'normal normal normal 14px sans-serif'` | 字体样式（CSS font 属性） |
| `color` | `string` | `'rgba(0, 0, 0, 0.15)'` | 文字颜色，支持 `#hex`、`rgb()`、`rgba()` |
| `opacity` | `number` | `0.15` | 文字透明度（0-1），用于 rgba 转换 |
| `rotate` | `number` | `-22` | 旋转角度（度），取值范围 -90 ~ 90 |
| `gap` | `number \| [number, number]` | `[80, 40]` | 水印间距 `[水平, 垂直]`，传入单个数字则为等距 |
| `offset` | `number \| [number, number]` | `[0, 0]` | 偏移量 `[水平, 垂直]`，调整背景图起始位置 |
| `zIndex` | `number` | `9999` | 水印层级 z-index |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'center'` | 文字对齐方式 |
| `textBaseline` | `string` | `'alphabetic'` | Canvas 文本基线 |
| `layout` | `'repeat' \| 'cover'` | `'repeat'` | 布局方式：`repeat` 重复铺满，`cover` 仅单张 |
| `pointerEvents` | `boolean \| string` | `true` | 点击穿透：`true` 穿透（`none`），`false` 不穿透，`'auto'` 自动 |
| `lineHeight` | `number` | `20` | 多行水印的行间距（px） |
| `debug` | `boolean` | `false` | 调试模式：显示 Canvas 边界（红色边框和背景色），并输出尺寸日志 |

## API

### Watermark 实例方法

#### `new Watermark(options?)`
创建水印实例。

```javascript
const watermark = new Watermark({
  content: '水印内容',
  color: 'rgba(0, 0, 0, 0.1)'
})
```

#### `init(options?)`
初始化并渲染水印。可选传入配置项覆盖构造函数中的配置。

```javascript
watermark.init()
// 或
watermark.init({ container: '#local-container' })
```

#### `update(options)`
更新水印配置，内部先销毁再重建。

```javascript
watermark.update({
  content: '新水印内容',
  fontSize: 18
})
```

#### `destroy()`
销毁水印，移除 DOM 元素和所有监听器。

```javascript
watermark.destroy()
```

#### `getOptions()`
获取当前完整配置（返回副本）。

```javascript
const options = watermark.getOptions()
```

#### `getContainer()`
获取当前水印容器元素。

```javascript
const container = watermark.getContainer()
```

### Vue 插件全局 API

安装 Vue 插件后，可通过 `this.$watermark`（组件内）或 `Vue.watermark` 访问：

```javascript
// 初始化全局水印
this.$watermark.init({ content: 'CONFIDENTIAL' })

// 更新水印
this.$watermark.update({ color: 'rgba(255, 0, 0, 0.1)' })

// 销毁水印
this.$watermark.destroy()

// 获取当前配置
this.$watermark.getOptions()

// 创建独立实例（不受全局水印影响）
const instance = this.$watermark.createInstance({
  content: '局部水印',
  container: '#local-container'
})
instance.init()
```

### Vue 指令：`v-watermark`

指令绑定值即水印配置对象，支持动态更新：

```vue
<template>
  <div v-watermark="watermarkConfig">
    <p>这是机密内容区域</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      watermarkConfig: {
        content: '内部资料',
        color: 'rgba(255, 0, 0, 0.08)'
      }
    }
  }
}
</script>
```

指令会在元素 `inserted` 时初始化水印，`update` 时同步配置，`unbind` 时自动销毁。

## 使用场景

### 场景 1：全局水印

适用于整个网站或应用需要添加统一水印的场景：

```javascript
import Watermark from '@zhenzichao/vue2-watermark-plugin'

Vue.use(Watermark, {
  content: ['企业机密', '禁止外传'],
  fontSize: 14,
  color: 'rgba(0, 0, 0, 0.1)',
  rotate: -22,
  global: true
})
```

### 场景 2：局部容器水印

适用于只有特定区域需要添加水印的场景：

```vue
<template>
  <div v-watermark="watermarkConfig">
    <p>这是机密内容区域</p>
    <p>水印只在这个容器内显示</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      watermarkConfig: {
        content: '内部资料',
        color: 'rgba(255, 0, 0, 0.08)'
      }
    }
  }
}
</script>
```

### 场景 3：动态用户水印

适用于需要根据用户信息动态生成水印的场景（防止截图泄露）：

```javascript
const watermark = new Watermark({
  content: [`${currentUser.name}`, `${currentUser.id}`],
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.08)',
  rotate: -15
})
watermark.init()
```

### 场景 4：弹窗/浮层水印

适用于弹窗、抽屉等浮层内容需要添加水印的场景：

```javascript
const modal = document.querySelector('.modal')
const watermark = new Watermark({
  content: '机密文档',
  container: modal,
  zIndex: 100
})
watermark.init()
```

## 防篡改机制

水印插件内置了多重防篡改机制：

1. **MutationObserver 监听** — 监听容器 DOM 变化，水印被删除或属性被修改时自动恢复
2. **父元素观察** — 监听水印父元素的子节点变化，容器被删除时自动重建
3. **定期检查** — 每 2 秒检查一次水印元素是否存在于 DOM 中
4. **属性监听** — 监听水印元素的 style 和 class 属性变化
5. **重试机制** — 最大重试 5 次，防止无限循环恢复

## 已知问题

- 在某些特殊浏览器环境下，MutationObserver 可能不可用
- 局部水印容器必须支持 `position: relative` 或 `position: absolute`（`position: static` 会自动转为 `relative`）

## License

[MIT](LICENSE)
