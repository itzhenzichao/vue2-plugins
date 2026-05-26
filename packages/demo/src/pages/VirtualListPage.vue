<template>
  <div class="virtual-list-demo">
    <div class="demo-header">
      <h1 class="demo-title">VirtualList 虚拟滚动列表</h1>
      <p class="demo-desc">@zhenzichao/vue2-virtual-list</p>
    </div>

    <!-- 固定高度示例 -->
    <div class="demo-section">
      <h3>1. 固定高度列表</h3>
      <p class="section-desc">每项高度固定，性能最优，适合表格行、固定卡片等场景</p>
      <ZcVirtualList
        :items="fixedItems"
        :item-size="50"
        height="400px"
        key-field="id"
        class="demo-scroller"
      >
        <template #default="{ item }">
          <div class="fixed-item">
            <span class="item-id">{{ item.id }}</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </template>
      </ZcVirtualList>
      <div class="code-example">
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :item-size="50"
  height="400px"
  key-field="id"&gt;
  &lt;template #default="{ item }"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
      </div>
    </div>

    <!-- 动态高度示例 -->
    <div class="demo-section">
      <h3>2. 动态高度列表</h3>
      <p class="section-desc">每项高度可变，自动测量，适合聊天消息、评论等场景</p>
      <ZcVirtualList
        :items="dynamicItems"
        :dynamic="true"
        :min-item-size="40"
        height="400px"
        key-field="id"
        class="demo-scroller"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.text]"
            :data-index="index"
          >
            <div class="dynamic-item">
              <div class="item-header">
                <span class="item-id">{{ item.id }}</span>
                <span class="item-name">{{ item.name }}</span>
              </div>
              <p class="item-text">{{ item.text }}</p>
            </div>
          </DynamicScrollerItem>
        </template>
      </ZcVirtualList>
      <div class="code-example">
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :dynamic="true"
  :min-item-size="40"
  key-field="id"&gt;
  &lt;template #default="{ item, index, active }"&gt;
    &lt;DynamicScrollerItem
      :item="item"
      :active="active"
      :size-dependencies="[item.text]"
      :data-index="index"&gt;
      &lt;div&gt;
        &lt;h4&gt;{{ item.name }}&lt;/h4&gt;
        &lt;p&gt;{{ item.content }}&lt;/p&gt;
      &lt;/div&gt;
    &lt;/DynamicScrollerItem&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
      </div>
    </div>

    <!-- 无限滚动加载示例 -->
    <div class="demo-section">
      <h3>3. 无限滚动加载</h3>
      <p class="section-desc">初始加载30条，滚动到底部自动加载，可通过按钮手动停止</p>
      <ZcVirtualList
        ref="loadScroll"
        :items="loadItems"
        :item-size="50"
        height="400px"
        key-field="id"
        :load-more="loadMoreFn"
        class="demo-scroller"
      >
        <template #default="{ item }">
          <div class="fixed-item">
            <span class="item-id">{{ item.id }}</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </template>
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
      </ZcVirtualList>
      <div class="demo-actions">
        <button class="btn btn-danger" @click="stopLoad">停止加载</button>
        <button class="btn btn-secondary" @click="resetLoad">重新加载</button>
      </div>
      <div class="code-example">
        <pre v-pre><code>&lt;ZcVirtualList
  ref="scroll"
  :items="list"
  :item-size="50"
  key-field="id"
  :load-more="loadMore"&gt;
  &lt;template #default="{ item }"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #loading&gt;
    &lt;div class="custom-loading"&gt;...&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #finished&gt;
    &lt;div&gt;加载完成&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;

// loadMore 返回 Promise，resolve(true) 表示加载完毕
loadMore() {
  return new Promise((resolve) => {
    this.list.push(...fetchData());
    resolve(false); // false: 继续加载, true: 加载完毕
  });
}

// 手动停止
this.$refs.scroll.finish()

// 重新开始
this.$refs.scroll.reset()</code></pre>
      </div>
    </div>

    <!-- 空状态示例 -->
    <div class="demo-section">
      <h3>4. 空状态</h3>
      <p class="section-desc">当 items 为空数组且 isEmpty 为 true 时显示 empty 插槽</p>
      <div class="demo-actions">
        <button class="btn btn-danger" @click="setEmptyState">切换空状态</button>
        <button class="btn btn-secondary" @click="resetEmptyState">恢复数据</button>
      </div>
      <ZcVirtualList
        :items="emptyStateItems"
        :item-size="50"
        height="400px"
        key-field="id"
        :is-empty="emptyStateItems.length === 0"
        class="demo-scroller"
      >
        <template #default="{ item }">
          <div class="fixed-item">
            <span class="item-id">{{ item.id }}</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </template>
        <template #empty>
          <div class="custom-empty">
            <img src="@/assets/image/empty.webp" alt="暂无数据" class="empty-image" />
            <p>暂无数据</p>
          </div>
        </template>
      </ZcVirtualList>
      <div class="code-example">
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :item-size="50"
  key-field="id"
  :is-empty="list.length === 0"&gt;
  &lt;template #default="{ item }"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #empty&gt;
    &lt;div&gt;暂无数据&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
      </div>
    </div>

    <!-- API -->
    <div class="demo-section">
      <h3>API</h3>
      <div class="api-block">
        <h4>Props</h4>
        <table class="api-table">
          <thead>
            <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
          </thead>
          <tbody>
            <tr><td>items</td><td>列表数据</td><td>Array</td><td>—</td></tr>
            <tr><td>height</td><td>可视窗口高度，支持数字(px)或字符串</td><td>Number | String</td><td>—</td></tr>
            <tr><td>dynamic</td><td>是否使用动态高度模式</td><td>Boolean</td><td>false</td></tr>
            <tr><td>item-size</td><td>每项固定高度（固定模式）</td><td>Number</td><td>50</td></tr>
            <tr><td>min-item-size</td><td>每项最小估算高度（动态模式）</td><td>Number</td><td>40</td></tr>
            <tr><td>key-field</td><td>数据唯一标识字段</td><td>String</td><td>'id'</td></tr>
            <tr><td>buffer</td><td>可视区域外额外渲染的项数</td><td>Number</td><td>200</td></tr>
            <tr><td>page-mode</td><td>使用页面级滚动模式</td><td>Boolean</td><td>false</td></tr>
            <tr><td>load-more</td><td>加载回调函数，返回 Promise，resolve(true) 表示加载完毕</td><td>Function</td><td>null</td></tr>
            <tr><td>throttle</td><td>节流间隔（ms）</td><td>Number</td><td>300</td></tr>
            <tr><td>loading-text</td><td>加载中文案（未使用 #loading 插槽时生效）</td><td>String</td><td>'加载中...'</td></tr>
            <tr><td>finished-text</td><td>加载完毕文案（未使用 #finished 插槽时生效）</td><td>String</td><td>'加载完成'</td></tr>
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
            <tr><td>reset()</td><td>重置状态并滚动到顶部，重新开始加载</td></tr>
          </tbody>
        </table>
      </div>
      <div class="api-block">
        <h4>Slots</h4>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>说明</th><th>作用域</th></tr>
          </thead>
          <tbody>
            <tr><td>default</td><td>列表项内容</td><td>{ item, index, active }</td></tr>
            <tr><td>before</td><td>列表前置内容</td><td>—</td></tr>
            <tr><td>after</td><td>列表后置内容</td><td>—</td></tr>
            <tr><td>empty</td><td>空数据状态内容</td><td>—</td></tr>
            <tr><td>loading</td><td>加载中内容，默认显示 loading-text</td><td>—</td></tr>
            <tr><td>finished</td><td>加载完毕内容，默认显示 finished-text</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
function generateFixedItems(count, start = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    name: `Item ${start + i}`
  }));
}

function generateDynamicItems(count, start = 0) {
  return Array.from({ length: count }, (_, i) => {
    const lines = Math.floor(Math.random() * 5) + 1;
    return {
      id: start + i,
      name: `Message ${start + i}`,
      text: Array.from({ length: lines }, (_, l) =>
        `这是第 ${start + i} 条消息的第 ${l + 1} 行内容，模拟不同高度的列表项。`
      ).join('\n')
    };
  });
}

export default {
  name: 'VirtualListPage',
  data() {
    return {
      fixedItems: generateFixedItems(1000),
      dynamicItems: generateDynamicItems(1000),
      loadItems: generateFixedItems(30),
      emptyStateItems: generateFixedItems(100)
    };
  },
  methods: {
    loadMoreFn() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const start = this.loadItems.length;
          this.loadItems.push(...generateFixedItems(30, start));
          resolve(false);
        }, 200);
      });
    },
    stopLoad() {
      this.$refs.loadScroll.finish();
      this.$toast('已停止加载', 'success');
    },
    resetLoad() {
      this.$refs.loadScroll.reset();
      this.loadItems = generateFixedItems(30);
    },
    setEmptyState() {
      this.emptyStateItems = [];
      this.$toast('已切换空状态', 'warning');
    },
    resetEmptyState() {
      this.emptyStateItems = generateFixedItems(100);
      this.$toast('数据已恢复', 'success');
    }
  }
};
</script>

<style scoped>
.virtual-list-demo {
  padding: 24px;
  max-width: 1200px;
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

.demo-scroller {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
}

.fixed-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 50px;
  border-bottom: 1px solid #f2f3f5;
}

.item-id {
  width: 80px;
  font-weight: 600;
  color: #1677ff;
}

.item-name {
  color: #1f2329;
}

.dynamic-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f2f3f5;
}

.item-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.item-text {
  color: #4e5969;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-line;
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

.btn-danger {
  background: #f56c6c;
}

.btn-danger:hover {
  background: #f78989;
}

.btn-secondary {
  background: #f2f3f5;
  color: #1f2329;
}

.btn-secondary:hover {
  background: #e5e6eb;
}

.demo-actions {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}

.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #999;
  font-size: 14px;
}

.empty-image {
  width: 160px;
  height: auto;
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