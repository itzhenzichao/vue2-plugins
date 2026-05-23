<template>
  <div class="virtual-list-demo">
    <div class="demo-header">
      <h1 class="demo-title">VirtualList 虚拟滚动列表</h1>
      <p class="demo-desc">@zhenzichao/vue2-virtual-list</p>
    </div>

    <!-- 固定高度示例 -->
    <div class="demo-section">
      <h3>固定高度列表 (RecycledScroller)</h3>
      <p class="section-desc">每项高度固定，性能最优，适合表格行、固定卡片等场景</p>

      <ZcVirtualList
        :items="fixedItems"
        :item-size="50"
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
    </div>

    <!-- 动态高度示例 -->
    <div class="demo-section">
      <h3>动态高度列表 (DynamicScroller)</h3>
      <p class="section-desc">每项高度可变，自动测量，适合聊天消息、评论等场景</p>

      <ZcVirtualList
        :items="dynamicItems"
        :dynamic="true"
        :min-item-size="40"
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
    </div>

    <!-- 配置控制 -->
    <div class="demo-section">
      <h3>数据量控制</h3>

      <div class="control-group">
        <label>当前数据量：</label>
        <span class="value">{{ itemCount }} 条</span>
      </div>

      <div class="control-actions">
        <button class="btn btn-primary" @click="addItems(1000)">+1000</button>
        <button class="btn btn-primary" @click="addItems(5000)">+5000</button>
        <button class="btn btn-secondary" @click="resetItems">重置</button>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="demo-section">
      <h3>功能特性</h3>

      <div class="features-grid">
        <div class="feature-card">
          <h4>固定高度模式</h4>
          <p>RecycledScroller 复用 DOM 池，适合等高列表项，性能最优</p>
        </div>
        <div class="feature-card">
          <h4>动态高度模式</h4>
          <p>DynamicScroller 自动测量项高度，适合不等高内容</p>
        </div>
        <div class="feature-card">
          <h4>pageMode</h4>
          <p>支持页面级滚动模式，虚拟滚动区域跟随页面滚动</p>
        </div>
        <div class="feature-card">
          <h4>简化 API</h4>
          <p>一个 dynamic prop 切换模式，无需手动选择组件和配置</p>
        </div>
      </div>
    </div>

    <!-- 使用示例 -->
    <div class="demo-section">
      <h3>使用示例</h3>

      <div class="code-example">
        <h4>1. 固定高度列表</h4>
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :item-size="50"
  key-field="id"&gt;
  &lt;template #default="{ item }"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
      </div>

      <div class="code-example">
        <h4>2. 动态高度列表</h4>
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :dynamic="true"
  :min-item-size="40"
  key-field="id"&gt;
  &lt;template #default="{ item, index, active }"&gt;
    &lt;div&gt;
      &lt;h4&gt;{{ item.name }}&lt;/h4&gt;
      &lt;p&gt;{{ item.content }}&lt;/p&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
      </div>

      <div class="code-example">
        <h4>3. 页面滚动模式</h4>
        <pre v-pre><code>&lt;ZcVirtualList
  :items="list"
  :item-size="50"
  :page-mode="true"
  key-field="id"&gt;
  &lt;template #default="{ item }"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/ZcVirtualList&gt;</code></pre>
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
      itemCount: 1000
    };
  },
  methods: {
    addItems(count) {
      const start = this.itemCount;
      this.fixedItems.push(...generateFixedItems(count, start));
      this.dynamicItems.push(...generateDynamicItems(count, start));
      this.itemCount += count;
      this.$toast(`已添加 ${count} 条数据，当前共 ${this.itemCount} 条`, 'success');
    },
    resetItems() {
      this.fixedItems = generateFixedItems(1000);
      this.dynamicItems = generateDynamicItems(1000);
      this.itemCount = 1000;
      this.$toast('列表已重置', 'info');
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
  margin: 0 0 16px 0;
}

.section-desc {
  color: #4e5969;
  margin: 0 0 16px 0;
  font-size: 14px;
}

.demo-scroller {
  height: 400px;
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

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.control-group label {
  width: 140px;
  font-size: 14px;
  color: #4e5969;
}

.value {
  font-weight: 600;
  color: #1f2329;
}

.control-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1677ff;
  color: #fff;
}

.btn-primary:hover {
  background: #4096ff;
}

.btn-secondary {
  background: #f2f3f5;
  color: #1f2329;
}

.btn-secondary:hover {
  background: #e5e6eb;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
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
</style>