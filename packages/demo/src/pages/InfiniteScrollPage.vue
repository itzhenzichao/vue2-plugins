<template>
  <div class="infinite-scroll-demo">
    <div class="demo-header">
      <h1 class="demo-title">InfiniteScroll 无限滚动</h1>
      <p class="demo-desc">@zhenzichao/vue2-infinite-scroll</p>
    </div>

    <!-- 无限滚动加载示例 -->
    <div class="demo-section">
      <h3>1. 无限滚动加载</h3>
      <p class="section-desc">滚动到底部自动加载，可通过按钮手动停止，resolve(true) 表示加载完毕</p>

      <div class="api-block">
        <h4>Props</h4>
        <table class="api-table">
          <thead>
            <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
          </thead>
          <tbody>
            <tr><td>load-more</td><td>加载回调函数，返回 Promise，resolve(true) 表示加载完毕</td><td>Function</td><td>—</td></tr>
            <tr><td>throttle</td><td>节流间隔（ms），防止频繁触发</td><td>Number</td><td>300</td></tr>
            <tr><td>loading-text</td><td>加载中文案（未使用 #loading 插槽时生效）</td><td>String</td><td>'加载中...'</td></tr>
            <tr><td>finished-text</td><td>加载完毕文案（未使用 #finished 插槽时生效）</td><td>String</td><td>'--到底了--'</td></tr>
          </tbody>
        </table>
      </div>
      <div class="api-block">
        <h4>Methods</h4>
        <table class="api-table">
          <thead>
            <tr><th>方法</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr><td>finish()</td><td>停止加载，显示 finished 状态</td></tr>
            <tr><td>reset()</td><td>重置状态，重新开始触底加载</td></tr>
          </tbody>
        </table>
      </div>
      <div class="api-block">
        <h4>Slots</h4>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr><td>default</td><td>列表内容，有数据时显示</td></tr>
            <tr><td>empty</td><td>空数据状态内容，加载完毕后数据仍为空时显示</td></tr>
            <tr><td>loading</td><td>加载中内容，默认显示 loading-text</td></tr>
            <tr><td>finished</td><td>加载完毕内容，默认显示 finished-text</td></tr>
          </tbody>
        </table>
      </div>

      <div class="code-example">
        <pre v-pre><code>&lt;ZcInfiniteScroll
  ref="scroll"
  :load-more="loadMore"
  :throttle="800"&gt;
  &lt;div v-for="item in list" :key="item.id"&gt;
    {{ item.name }}
  &lt;/div&gt;
  &lt;template #loading&gt;
    &lt;div class="custom-loading"&gt;...&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #finished&gt;
    &lt;div&gt;加载完成&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #empty&gt;
    &lt;div&gt;暂无数据&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcInfiniteScroll&gt;

// loadMore 返回 Promise，resolve(true) 表示加载完毕
loadMore() {
  return new Promise((resolve) => {
    setTimeout(() => {
      this.list.push(...fetchData());
      resolve(false); // false: 继续加载, true: 加载完毕
    }, 100);
  });
}

// 手动停止
stopLoad() {
  this.$refs.scroll.finish()
}

// 清空数据
setEmpty() {
  this.$refs.scroll.finish()
  this.list = []
}

// 重置（重新开始加载）重置下页面回到顶部
resetList() {
  document.querySelector('.content').scrollTop = 0
  this.$refs.scroll.reset()
  this.list = generateItems(10)
}</code></pre>
      </div>

      <div class="demo-actions">
        <button class="btn btn-danger" @click="stopLoad">停止加载</button>
        <button class="btn btn-warning" @click="setEmpty">空数据</button>
        <button class="btn btn-secondary" @click="resetList">重置列表</button>
      </div>

      <ZcInfiniteScroll
        ref="scroll"
        :load-more="loadMoreFn"
        :throttle="800"
      >
        <div v-for="(item, index) in list" :key="index" class="list-item">
          <div class="item-avatar">{{ index + 1 }}</div>
          <div class="item-content">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.desc }}</div>
          </div>
        </div>
        <template #loading>
          <div class="custom-loading">
            <div class="spinner"></div>
            <span>正在加载更多数据...</span>
          </div>
        </template>
        <template #finished>
          <div class="custom-finished">
            <span class="finished-icon">✓</span>
            <span>已加载全部数据</span>
          </div>
        </template>
        <template #empty>
          <div class="empty-state">
            <img src="@/assets/image/empty.webp" alt="暂无数据" class="empty-image" />
            <button class="btn btn-primary" @click="resetList">重新获取</button>
          </div>
        </template>
      </ZcInfiniteScroll>
    </div>
  </div>
</template>

<script>

function generateItems(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `商品`,
    desc: `这是商品的描述信息`,
  }));
}

export default {
  name: 'InfiniteScrollPage',
  data() {
    return {
      list: generateItems(10)
    };
  },
  methods: {
    loadMoreFn() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.list.push(...generateItems(10));
          resolve(false);
        }, 100);
      });
    },
    stopLoad() {
      this.$refs.scroll.finish();
      this.$toast('停止成功', 'success');
    },
    setEmpty() {
      this.$refs.scroll.finish();
      this.list = [];
      this.$toast('数据已清空', 'warning');
    },
    resetList() {
      document.querySelector('.content').scrollTop = 0;
      this.$refs.scroll.reset();
      this.list = generateItems(10);
      this.$toast('列表已重置', 'success');
    }
  }
};
</script>

<style scoped>
.infinite-scroll-demo {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 32px;
}

.demo-title {
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #1f2329;
}

.demo-desc {
  font-size: 14px;
  color: #4e5969;
  margin: 0;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h3 {
  font-size: 20px;
  color: #1f2329;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #4e5969;
  margin: 0 0 16px 0;
  font-size: 14px;
}

.demo-actions {
  display: flex;
  gap: 12px;
  margin: 12px 0px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
}

.item-avatar {
  width: 48px;
  height: 48px;
  background: #1677ff;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  margin-left: 16px;
}

.item-name {
  font-weight: 600;
  color: #1f2329;
  font-size: 16px;
  margin-bottom: 4px;
}

.item-desc {
  color: #4e5969;
  font-size: 13px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  background: #fff;
}

.empty-image {
  width: 160px;
  height: auto;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
}

.btn-primary {
  background: #1677ff;
}

.btn-primary:hover {
  background: #4096ff;
}

.btn-danger {
  background: #f56c6c;
}

.btn-danger:hover {
  background: #f78989;
}

.btn-warning {
  background: #e6a23c;
}

.btn-warning:hover {
  background: #ebb563;
}

.btn-secondary {
  background: #f2f3f5;
  color: #1f2329;
}

.btn-secondary:hover {
  background: #e5e6eb;
}

.code-example {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.code-example pre {
  margin: 0;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
  overflow-x: auto;
}

.code-example code {
  font-size: 13px;
  color: #1f2329;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.custom-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  color: #999;
  font-size: 14px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e6eb;
  border-top-color: #1677ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.custom-finished {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  color: #999;
  font-size: 14px;
}

.finished-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #52c41a;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.api-block {
  margin-bottom: 16px;
}

.api-block:last-child {
  margin-bottom: 0;
}

.api-block h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1677ff;
  font-weight: 600;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.api-table th {
  background: #f7f8fa;
  padding: 10px 12px;
  text-align: left;
  color: #1f2329;
  font-weight: 600;
  border-bottom: 1px solid #e5e6eb;
}

.api-table td {
  padding: 10px 12px;
  color: #4e5969;
  border-bottom: 1px solid #e5e6eb;
}

.api-table tr:last-child td {
  border-bottom: none;
}

.api-table td:first-child {
  color: #1677ff;
  font-weight: 500;
}
</style>