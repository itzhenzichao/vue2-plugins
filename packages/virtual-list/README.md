# @zhenzichao/vue2-virtual-list

> 基于 vue-virtual-scroller 的 Vue2 虚拟滚动列表组件，支持固定高度与动态高度两种模式

[![npm version](https://img.shields.io/npm/v/@zhenzichao/vue2-virtual-list.svg)](https://www.npmjs.com/package/@zhenzichao/vue2-virtual-list)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 详细使用文档 (必看)

<div align="center">
  <br />
  <a href="https://itzhenzichao.github.io/vue2-plugins/#virtual-list">
    <img src="https://img.shields.io/badge/查看在线文档与演示-1677ff?style=for-the-badge&logo=googledocs&logoColor=white" alt="Online Documentation" />
  </a>
  <br />
</div>

## 特性

- **双模式切换** — 通过 `dynamic` 属性切换固定高度（RecycleScroller）和动态高度（DynamicScroller）模式
- **海量数据渲染** — 只渲染可视区域内的 DOM 节点，轻松处理万级以上数据列表
- **无限加载集成** — 内置 IntersectionObserver 无限加载支持，无需额外组件
- **滚动锁定** — 内置 wheelLock 机制，防止滚动链式传播
- **空状态自动判断** — 根据数据自动判断空状态，配合 loadMore 首次加载确定是否真实为空
- **页面级滚动** — 支持 `pageMode` 使用页面作为滚动容器
- **手动控制** — 提供 `finish()` 和 `reset()` 方法控制加载状态

## 安装

```bash
npm install @zhenzichao/vue2-virtual-list

yarn add @zhenzichao/vue2-virtual-list

pnpm add @zhenzichao/vue2-virtual-list
```

## 快速开始

### 注册插件

```javascript
import Vue from 'vue'
import VirtualList from '@zhenzichao/vue2-virtual-list'

Vue.use(VirtualList)
```

### 固定高度模式

```vue
<template>
  <ZcVirtualList :items="list" :item-size="50" height="400px">
    <template #default="{ item, index }">
      <div>{{ item.name }}</div>
    </template>
  </ZcVirtualList>
</template>
```

### 动态高度模式

```vue
<template>
  <ZcVirtualList :items="list" dynamic :min-item-size="40" height="400px">
    <template #default="{ item, index }">
      <div :style="{ height: item.height + 'px' }">{{ item.content }}</div>
    </template>
  </ZcVirtualList>
</template>
```

### 带无限加载的虚拟列表

```vue
<template>
  <ZcVirtualList
    :items="list"
    :item-size="50"
    height="400px"
    :load-more="loadMore"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </ZcVirtualList>
</template>

<script>
export default {
  data() {
    return { list: [] }
  },
  methods: {
    async loadMore() {
      const data = await api.getList(this.page++)
      this.list.push(...data)
      return data.length === 0
    }
  }
}
</script>
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `Array` | — | **必填**，列表数据数组，为空时自动显示 empty 插槽 |
| `dynamic` | `Boolean` | `false` | 是否使用动态高度模式（`true` 使用 DynamicScroller） |
| `itemSize` | `Number \| String` | `50` | 固定模式下每项高度（px） |
| `minItemSize` | `Number \| String` | `40` | 动态模式下最小项高度（px） |
| `keyField` | `String` | `'id'` | 数据项中作为唯一标识的字段名 |
| `height` | `Number \| String` | `''` | 容器高度，数字为 px，字符串直接使用（如 `'100vh'`），空则无固定高度 |
| `buffer` | `Number` | `200` | 视口外额外渲染的缓冲距离（px） |
| `pageMode` | `Boolean` | `false` | 使用页面作为滚动容器而非组件自身 |
| `loadMore` | `Function` | `null` | 触底加载函数，返回 Promise，resolve 为 `true` 表示完毕 |
| `throttle` | `Number` | `300` | 两次加载之间的最小间隔时间（ms） |
| `loadingText` | `String` | `'加载中...'` | 加载状态提示文字 |
| `finishedText` | `String` | `'加载完成'` | 加载完毕提示文字 |

## 插槽

| 插槽名 | 作用域数据 | 说明 |
|--------|-----------|------|
| `default` | `{ item, index, active }` | 列表项内容，必须使用作用域插槽 |
| `before` | — | 列表前置内容 |
| `after` | — | 列表后置内容 |
| `empty` | — | 空状态内容，`items` 为空且加载完毕时渲染 |
| `loading` | — | 自定义加载提示，默认显示 `loadingText` |
| `finished` | — | 自定义加载完毕提示，默认显示 `finishedText` |

## 方法（通过 ref 调用）

### `finish()`

手动标记为加载完毕状态。

```javascript
this.$refs.virtualList.finish()
```

### `reset()`

重置组件状态并滚动回顶部（scrollToItem(0)），适用于刷新列表场景。

```javascript
this.$refs.virtualList.reset()
```

## 导出

插件安装时全局注册以下组件：

- `ZcVirtualList` — 封装后的虚拟列表组件
- `RecycleScroller` — vue-virtual-scroller 固定高度滚动器
- `DynamicScroller` — vue-virtual-scroller 动态高度滚动器
- `DynamicScrollerItem` — vue-virtual-scroller 动态高度项组件

也可通过命名导出直接引入：

```javascript
import { VirtualList, RecycleScroller, DynamicScroller } from '@zhenzichao/vue2-virtual-list'
```

## 使用场景

### 场景 1：大数据量固定高度列表

适用于聊天消息、日志条目等高度一致的列表：

```vue
<template>
  <ZcVirtualList :items="logs" :item-size="32" height="500px" key-field="id">
    <template #default="{ item }">
      <div class="log-item">{{ item.time }} - {{ item.message }}</div>
    </template>
  </ZcVirtualList>
</template>
```

### 场景 2：动态高度内容列表

适用于富文本、评论等高度不固定的列表，每项数据需包含 `id` 字段：

```vue
<template>
  <ZcVirtualList :items="comments" dynamic :min-item-size="60" height="600px">
    <template #default="{ item }">
      <div class="comment">
        <p>{{ item.author }}</p>
        <p>{{ item.content }}</p>
      </div>
    </template>
  </ZcVirtualList>
</template>
```

### 场景 3：全页面滚动模式

适用于列表占据整个页面的场景，使用页面原生滚动：

```vue
<template>
  <ZcVirtualList :items="list" :item-size="80" page-mode>
    <template #default="{ item }">
      <div>{{ item.title }}</div>
    </template>
  </ZcVirtualList>
</template>
```

### 场景 4：无限加载 + 虚拟滚动

适用于分页加载海量数据的场景，兼具虚拟滚动性能和无限加载体验，初始数据为空时会自动触发首次加载判断是否真实为空：

```vue
<template>
  <ZcVirtualList
    :items="list"
    :item-size="50"
    height="100vh"
    :load-more="loadMore"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
    <template #empty>
      <div class="empty">暂无数据</div>
    </template>
  </ZcVirtualList>
</template>
```

## License

[MIT](LICENSE)