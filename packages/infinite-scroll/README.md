# @zhenzichao/vue2-infinite-scroll

> 基于 IntersectionObserver 的 Vue2 无限滚动组件，轻松实现列表无限加载

[![npm version](https://img.shields.io/npm/v/@zhenzichao/vue2-infinite-scroll.svg)](https://www.npmjs.com/package/@zhenzichao/vue2-infinite-scroll)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 详细使用文档 (必看)

<div align="center">
  <br />
  <a href="https://itzhenzichao.github.io/vue2-plugins/#infinite-scroll">
    <img src="https://img.shields.io/badge/查看在线文档与演示-1677ff?style=for-the-badge&logo=googledocs&logoColor=white" alt="Online Documentation" />
  </a>
  <br />
</div>

## 特性

- **IntersectionObserver 驱动** — 使用现代浏览器 API 检测滚动触底，无需手动计算滚动位置
- **节流控制** — 内置加载节流机制，防止短时间内重复触发请求
- **自动填充检测** — 一页数据不足以填满视口时，自动触发下一次加载
- **空状态支持** — 内置空数据展示，可通过插槽自定义空状态内容
- **加载完成提示** — 数据全部加载完毕后显示提示文字，支持自定义
- **手动控制** — 提供 `finish()` 和 `reset()` 方法，可手动控制加载状态
- **零依赖** — 不依赖任何第三方库，轻量高效

## 安装

```bash
npm install @zhenzichao/vue2-infinite-scroll

yarn add @zhenzichao/vue2-infinite-scroll

pnpm add @zhenzichao/vue2-infinite-scroll
```

## 快速开始

### 注册插件

```javascript
import Vue from 'vue'
import InfiniteScroll from '@zhenzichao/vue2-infinite-scroll'

Vue.use(InfiniteScroll)
```

### 基础使用

```vue
<template>
  <ZcInfiniteScroll :load-more="loadMore" :is-empty="list.length === 0">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
  </ZcInfiniteScroll>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      page: 1
    }
  },
  methods: {
    async loadMore() {
      const res = await fetch(`/api/list?page=${this.page}`)
      const data = res.data
      this.list.push(...data)
      this.page++
      return data.length === 0 // 返回 true 表示已加载完毕
    }
  }
}
</script>
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadMore` | `Function` | — | **必填**，触底时调用的加载函数，应返回 Promise，resolve 为 `true` 表示加载完毕 |
| `throttle` | `Number` | `300` | 两次加载之间的最小间隔时间（ms） |
| `isEmpty` | `Boolean` | `false` | 当前数据是否为空 |
| `loadingText` | `String` | `'加载中...'` | 加载状态提示文字 |
| `finishedText` | `String` | `'--到底了--'` | 加载完毕提示文字 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 列表内容区域，`isEmpty` 为 `false` 时渲染 |
| `empty` | 空状态内容，`isEmpty` 为 `true` 且非加载中时渲染 |
| `loading` | 自定义加载提示，默认显示 `loadingText` |
| `finished` | 自定义加载完毕提示，默认显示 `finishedText` |

## 方法（通过 ref 调用）

### `finish()`

手动标记为加载完毕状态。

```vue
<template>
  <ZcInfiniteScroll ref="scroll" :load-more="loadMore">
    ...
  </ZcInfiniteScroll>
</template>

<script>
export default {
  methods: {
    stopLoading() {
      this.$refs.scroll.finish()
    }
  }
}
</script>
```

### `reset()`

重置组件状态（清除 finished 和 loading 标记，重新初始化 Observer），适用于刷新列表场景。

```javascript
this.$refs.scroll.reset()
```

## 使用场景

### 场景 1：分页列表加载

```vue
<template>
  <ZcInfiniteScroll :load-more="loadMore" :is-empty="!list.length && !loading">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
  </ZcInfiniteScroll>
</template>

<script>
export default {
  data() {
    return { list: [], page: 1, loading: false }
  },
  methods: {
    async loadMore() {
      this.loading = true
      const data = await api.getList(this.page++)
      this.list.push(...data)
      this.loading = false
      return data.length < 10 // 每页10条，不足10条说明到底了
    }
  }
}
</script>
```

### 场景 2：自定义空状态与加载提示

```vue
<template>
  <ZcInfiniteScroll :load-more="loadMore" :is-empty="!list.length">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
    <template #empty>
      <div class="empty-state">暂无数据</div>
    </template>
    <template #loading>
      <div class="custom-loading">正在加载更多...</div>
    </template>
    <template #finished>
      <div class="custom-finished">没有更多内容了</div>
    </template>
  </ZcInfiniteScroll>
</template>
```

### 场景 3：刷新重置列表

```javascript
// 清空数据后重置滚动组件
this.list = []
this.$refs.scroll.reset()
```

## License

[MIT](LICENSE)