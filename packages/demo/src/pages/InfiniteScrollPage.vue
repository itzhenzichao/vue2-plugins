<template>
  <div class="infinite-scroll-demo">
    <div class="demo-header">
      <h1 class="demo-title">InfiniteScroll 无限滚动</h1>
      <p class="demo-desc">@zhenzichao/vue2-infinite-scroll</p>
    </div>

    <div class="code-example">
      <h4>2. 完整配置 + 停止加载</h4>
      <pre v-pre><code>&lt;ZcInfiniteScroll
  ref="scroll"
  :load-more="loadMore"
  :is-empty="list.length === 0"
  :throttle="300"
  loading-text="正在加载更多..."
  finished-text="没有更多了"&gt;
  &lt;div v-for="item in list" :key="item.id"&gt;
    {{ item.name }}
  &lt;/div&gt;
  &lt;template #empty&gt;
    &lt;div&gt;暂无数据&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcInfiniteScroll&gt;


methods: {
    loadMore() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.list.push(...generateItems(10));
          resolve();
        }, 100);
      });
    }
  }
// 停止加载
this.$refs.scroll.finish()

// 重置（重新开始加载）
document.querySelector('.content').scrollTop = 0;//将页面重置到顶部
this.$refs.scroll.reset()</code></pre>
    </div>

    <div class="api-section">
      <h4>API</h4>
      <div class="api-block">
        <h5>Props</h5>
        <table class="api-table">
          <thead>
            <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
          </thead>
          <tbody>
            <tr><td>load-more</td><td>加载回调函数，支持 Promise</td><td>Function</td><td>—</td></tr>
            <tr><td>is-empty</td><td>是否为空数据状态，为 true 时显示 empty 插槽</td><td>Boolean</td><td>false</td></tr>
            <tr><td>throttle</td><td>节流间隔（ms），防止频繁触发</td><td>Number</td><td>300</td></tr>
            <tr><td>loading-text</td><td>加载中文案</td><td>String</td><td>加载中...</td></tr>
            <tr><td>finished-text</td><td>加载完毕文案</td><td>String</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <div class="api-block">
        <h5>Methods</h5>
        <table class="api-table">
          <thead>
            <tr><th>方法</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr><td>finish()</td><td>停止加载，显示 finished-text 文案</td></tr>
            <tr><td>reset()</td><td>重置状态，重新开始触底加载</td></tr>
          </tbody>
        </table>
      </div>
      <div class="api-block">
        <h5>Slots</h5>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr><td>default</td><td>列表内容，is-empty 为 false 时显示</td></tr>
            <tr><td>empty</td><td>空数据状态内容，is-empty 为 true 且非 loading 时显示</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 列表区域 -->
    <ZcInfiniteScroll
      ref="scroll"
      :load-more="loadMore"
      :is-empty="list.length === 0"
      :throttle="800"
      loading-text="正在加载更多数据..."
      finished-text="已加载全部数据"
    >
    <template #before>
      <div class="test">123</div>
</template>
      <div v-for="(item, index) in list"
      :id="index"
      :key="index" class="list-item">
        <div class="item-avatar">{{ index + 1 }}</div>
        <div class="item-content">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-desc">{{ item.desc }}</div>
        </div>
        <button class="btn btn-danger" @click="stopLoad">停止加载</button>
        <button class="btn btn-warning" @click="setEmpty">空数据</button>
        <button class="btn btn-primary" @click="resetList">重置列表</button>
      </div>
      <template #empty>
        <div class="empty-state">
          <img src="@/assets/image/empty.webp" alt="暂无数据" class="empty-image" />
          <button class="btn btn-primary" @click="resetList">重新获取</button>
        </div>
      </template>
    </ZcInfiniteScroll>
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
      list: []
    };
  },
  methods: {
    loadMore() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.list.push(...generateItems(10));
          resolve();
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.feature-card {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1677ff;
}

.feature-card h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #1f2329;
}

.feature-card p {
  margin: 0;
  color: #4e5969;
  font-size: 14px;
  line-height: 1.5;
}

.code-example {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.code-example h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #4e5969;
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

.item-meta {
  color: #1677ff;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

::v-deep .empty-state {
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

.empty-text {
  margin: 16px 0 0 0;
  color: #4e5969;
  font-size: 14px;
}

.btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  color: #fff;
  margin: 0px 2px;
}

.btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
  opacity: 0.95;
}

.btn-primary {
  background: #1677ff;
}

.btn-danger {
  background: #f56c6c;
}

.btn-warning {
  background: #e6a23c;
}

.api-section {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.api-section h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #1f2329;
}

.api-block {
  margin-bottom: 16px;
}

.api-block:last-child {
  margin-bottom: 0;
}

.api-block h5 {
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