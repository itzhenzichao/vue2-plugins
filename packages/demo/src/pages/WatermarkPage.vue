<template>
  <div class="watermark-demo">
    <div class="demo-header">
      <h1 class="demo-title">Watermark 水印插件</h1>
      <p class="demo-desc">@zhenzichao/vue2-watermark-plugin</p>
    </div>

    <!-- 配置控制面板 -->
    <div class="control-panel">
      <h3>配置选项</h3>

      <div class="control-group">
        <label>文字大小：</label>
        <input v-model.number="config.fontSize" type="number" min="8" max="48" />
      </div>

      <div class="control-group">
        <label>行间距：</label>
        <input v-model.number="config.lineHeight" type="number" min="0" max="60" />
      </div>

      <div class="control-group">
        <label>颜色：</label>
        <input v-model="config.color" type="color" />
      </div>

      <div class="control-group">
        <label>透明度：</label>
        <input v-model.number="config.opacity" type="range" min="0" max="1" step="0.05" />
        <span class="value">{{ config.opacity }}</span>
      </div>

      <div class="control-group">
        <label>旋转角度：</label>
        <input v-model.number="config.rotate" type="range" min="-90" max="90" step="5" />
        <span class="value">{{ config.rotate }}°</span>
      </div>

      <div class="control-group">
        <label>水平间距：</label>
        <input v-model.number="config.gap[0]" type="number" min="0" max="200" />
      </div>

      <div class="control-group">
        <label>垂直间距：</label>
        <input v-model.number="config.gap[1]" type="number" min="0" max="200" />
      </div>

      <div class="control-group">
        <label>左偏移：</label>
        <input v-model.number="config.offset[0]" type="number" min="0" max="200" />
      </div>

      <div class="control-group">
        <label>上偏移：</label>
        <input v-model.number="config.offset[1]" type="number" min="0" max="200" />
      </div>

      <div class="control-group">
        <label>对齐方式：</label>
        <select v-model="config.textAlign">
          <option value="left">左对齐</option>
          <option value="center">居中对齐</option>
          <option value="right">右对齐</option>
        </select>
      </div>

      <div class="control-group">
        <label>布局方式：</label>
        <select v-model="config.layout">
          <option value="repeat">重复铺满</option>
          <option value="cover">单个覆盖</option>
        </select>
      </div>

      <div class="control-group">
        <label>点击穿透：</label>
        <select v-model="config.pointerEvents">
          <option :value="true">是（默认）</option>
          <option :value="false">否</option>
          <option value="auto">自动</option>
        </select>
      </div>

      <div class="control-group">
        <label>水印层级：</label>
        <input v-model.number="config.zIndex" type="number" min="0" max="100000" />
      </div>

      <div class="control-actions">
        <button class="btn btn-primary" @click="applyGlobalWatermark">应用全局水印</button>
        <button class="btn btn-danger" @click="removeWatermark">移除水印</button>
        <button class="btn btn-secondary" @click="resetConfig">重置配置</button>
      </div>
    </div>

    <!-- 局部水印容器示例 -->
    <div class="demo-section">
      <h3>局部水印示例</h3>
      <p class="section-desc">这个容器使用 v-watermark 指令添加局部水印</p>
      
      <div class="watermark-container" v-watermark="localWatermarkConfig">
        <div class="content-card">
          <h4>这是一个内容卡片</h4>
          <p>局部水印不会影响其他区域，只在这个容器内显示。</p>
          <p>你可以点击这里测试点击穿透功能。</p>
          <button @click="handleClick">测试点击</button>
        </div>
        <div class="content-card">
          <h4>另一个卡片</h4>
          <p>水印覆盖在整个容器上，不受原有布局影响。</p>
        </div>
      </div>

      <div class="control-actions">
        <button class="btn btn-primary" @click="updateLocalWatermark">更新局部水印</button>
      </div>
    </div>

    <!-- 功能展示 -->
    <div class="demo-section">
      <h3>功能特性</h3>
      
      <div class="features-grid">
        <div class="feature-card">
          <h4>✅ 防删除防篡改</h4>
          <p>使用 MutationObserver 监听 DOM 变化，水印被删除或修改时自动恢复</p>
        </div>
        <div class="feature-card">
          <h4>✅ 全局/局部支持</h4>
          <p>支持整个页面的全局水印，也支持指定容器的局部水印</p>
        </div>
        <div class="feature-card">
          <h4>✅ 多行水印</h4>
          <p>支持单行和多行水印内容，内容配置灵活</p>
        </div>
        <div class="feature-card">
          <h4>✅ 高度可配置</h4>
          <p>支持文字大小、颜色、透明度、旋转角度、间距等全方位配置</p>
        </div>
        <div class="feature-card">
          <h4>✅ Canvas 生成</h4>
          <p>使用 Canvas 生成水印图片，避免文字被选中复制</p>
        </div>
        <div class="feature-card">
          <h4>✅ 弹窗浮层支持</h4>
          <p>支持弹窗、抽屉、浮层内正常显示水印，不被遮挡</p>
        </div>
        <div class="feature-card">
          <h4>✅ 点击穿透</h4>
          <p>可配置水印是否可点击穿透，不影响原有交互</p>
        </div>
        <div class="feature-card">
          <h4>✅ Vue 原生支持</h4>
          <p>提供 v-watermark 指令和 Vue 插件，使用简单方便</p>
        </div>
      </div>
    </div>

    <!-- 使用示例 -->
    <div class="demo-section">
      <h3>使用示例</h3>
      
      <div class="code-example">
        <h4>1. Vue 插件方式（全局水印）</h4>
        <pre><code>// main.js
import Watermark from '@zhenzichao/vue2-watermark-plugin'
Vue.use(Watermark, {
  content: ['CONFIDENTIAL'],
  global: true // 启用全局水印
})</code></pre>
      </div>

      <div class="code-example">
        <h4>2. Vue 指令方式（局部水印）</h4>
        <pre><code><template>
  <div v-watermark="{
    content: ['内部机密', '禁止外传'],
    color: 'rgba(255, 0, 0, 0.1)'
  }">
    内容区域
  </div>
</template></code></pre>
      </div>

      <div class="code-example">
        <h4>3. 普通 JavaScript 方式</h4>
        <pre><code>import { Watermark } from '@zhenzichao/vue2-watermark-plugin'

// 创建水印实例
const watermark = new Watermark({
  content: ['机密文档', '禁止外传'],
  fontSize: 16,
  color: 'rgba(0, 0, 0, 0.15)',
  rotate: -30
})

// 初始化水印
watermark.init()

// 更新水印
watermark.update({ content: ['新水印'] })

// 销毁水印
watermark.destroy()</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WatermarkPage',
  data() {
    return {
      // 全局水印配置
      config: {
        fontSize: 14,
        color: '#000000',
        opacity: 0.15,
        rotate: -22,
        gap: [70, 60], // [水平间距, 垂直间距]
        offset: [30, 10], // [左偏移, 上偏移]
        lineHeight: 20,
        textAlign: 'center',
        layout: 'repeat',
        pointerEvents: true,
        zIndex: 9999
      },
      // 局部水印配置
      localWatermarkConfig: {
        content: ['局部水印', '机密'],
        fontSize: 16,
        color: 'rgba(0, 0, 255, 0.1)',
        opacity: 0.15,
        rotate: -15,
        gap: [100, 60],
        offset: [0, 0],
        lineHeight: 20,
        textAlign: 'center',
        layout: 'repeat',
        pointerEvents: true,
        zIndex: 1
      },
      defaultConfig: {
        fontSize: 14,
        color: '#000000',
        opacity: 0.15,
        rotate: -22,
        gap: [70, 60], // [水平间距, 垂直间距]
        offset: [30, 10], // [左偏移, 上偏移]
        lineHeight: 20,
        textAlign: 'center',
        layout: 'repeat',
        pointerEvents: true,
        zIndex: 9999
      }
    };
  },
  watch: {
    // 监听配置变化，实时更新水印
    config: {
      deep: true,
      handler() {
        this.applyGlobalWatermark();
      }
    }
  },
  mounted() {
    this.applyGlobalWatermark();
  },
  beforeDestroy() {
    this.removeWatermark();
  },
  methods: {
    updateContentArray() {
      // 更新内容数组
    },

    applyGlobalWatermark() {
      if (this.$watermark) {
        const rgbaColor = this.hexToRgba(this.config.color, this.config.opacity);
        
        this.$watermark.init({
          fontSize: this.config.fontSize,
          color: rgbaColor,
          opacity: this.config.opacity,
          rotate: this.config.rotate,
          gap: this.config.gap,
          offset: this.config.offset,
          lineHeight: this.config.lineHeight,
          textAlign: this.config.textAlign,
          layout: this.config.layout,
          pointerEvents: this.config.pointerEvents,
          zIndex: this.config.zIndex
        });
      }
    },

    removeWatermark() {
      if (this.$watermark) {
        this.$watermark.destroy();
      }
    },

    updateLocalWatermark() {
      // 修改局部水印配置
      this.localWatermarkConfig = {
        ...this.localWatermarkConfig,
        content: ['已更新-', '局部水印'],
        color: 'rgba(0, 128, 0, 0.1)'
      };
    },

    resetConfig() {
      this.config = { ...this.defaultConfig };
      this.applyGlobalWatermark();
    },

    handleClick() {
      alert('点击成功！水印的点击穿透功能正常工作。');
    },

    hexToRgba(hex, opacity) {
      if (hex.startsWith('#')) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return hex;
    }
  }
};
</script>

<style scoped>
.watermark-demo {
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

.control-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.control-panel h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #1f2329;
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
  flex-shrink: 0;
}

.control-group input[type="text"],
.control-group input[type="number"],
.control-group select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  font-size: 14px;
}

.control-group input[type="color"] {
  width: 60px;
  height: 36px;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  cursor: pointer;
}

.control-group input[type="range"] {
  flex: 1;
  margin-right: 12px;
}

.value {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #4e5969;
}

.control-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e6eb;
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

.btn-danger {
  background: #f53f3f;
  color: #fff;
}

.btn-danger:hover {
  background: #ff7875;
}

.btn-secondary {
  background: #f2f3f5;
  color: #1f2329;
}

.btn-secondary:hover {
  background: #e5e6eb;
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

.watermark-container {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  min-height: 200px;
  border: 1px solid #e5e6eb;
  overflow: hidden;
}

.content-card {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.content-card:last-child {
  margin-bottom: 0;
}

.content-card h4 {
  margin: 0 0 8px 0;
  color: #1f2329;
}

.content-card p {
  margin: 0 0 12px 0;
  color: #4e5969;
}

.content-card button {
  background: #1677ff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.content-card button:hover {
  background: #4096ff;
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
