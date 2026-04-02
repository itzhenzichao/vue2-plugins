<template>
  <div class="wrap">
    <section class="panel">
      <h2 class="panel-title">动态演示</h2>
      <div class="demo-container">
        <!-- 控制面板 -->
        <div class="controls">
          <div class="control-item">
            <label>选择图标</label>
            <select v-model="kkCurrentIcon" class="kk-select">
              <option v-for="icon in kkIconList" :key="icon" :value="icon">
                {{ icon }}
              </option>
            </select>
          </div>

          <div class="control-item">
            <label>设置颜色</label>
            <div class="color-picker-wrap">
              <input type="color" v-model="kkCurrentColor" class="kk-color-input">
              <input type="text" v-model="kkCurrentColor" class="kk-input" placeholder="#000000">
            </div>
          </div>

          <div class="control-item">
            <label>调整大小 ({{ kkCurrentSize }}px)</label>
            <input 
              type="range" 
              v-model.number="kkCurrentSize" 
              min="12" 
              max="120" 
              step="1" 
              class="kk-range"
            >
          </div>
        </div>

        <!-- 预览区域 -->
        <div class="preview-card">
          <div class="preview-icon-box">
            <ZcSvgIcon 
              :name="kkCurrentIcon" 
              :color="kkCurrentColor" 
              :size="kkCurrentSize" 
            />
          </div>
          <div class="preview-info">
            <code>&lt;ZcSvgIcon name="{{ kkCurrentIcon }}" color="{{ kkCurrentColor }}" :size="{{ kkCurrentSize }}" /&gt;</code>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header-with-tabs">
        <h2 class="panel-title">使用说明</h2>
        <div class="scheme-tabs">
          <button 
            class="scheme-tab-btn" 
            :class="{ active: kkActiveScheme === 'vite' }"
            @click="kkActiveScheme = 'vite'"
          >Vite 方案</button>
          <button 
            class="scheme-tab-btn" 
            :class="{ active: kkActiveScheme === 'webpack' }"
            @click="kkActiveScheme = 'webpack'"
          >Webpack 方案</button>
        </div>
      </div>
      
      <!-- 1. 安装依赖 -->
      <div class="block">
        <h3>1. 安装依赖</h3>
        <p>首先安装组件库：</p>
        <pre><code>npm install @zhenzichao/vue2-svg-icon</code></pre>
        
        <div v-if="kkActiveScheme === 'vite'" class="config-section" style="margin-top: 15px;">
          <p>安装 Vite 专用 SVG 雪碧图插件：</p>
          <pre><code>npm install vite-plugin-svg-icons -D</code></pre>
        </div>
        <div v-else class="config-section" style="margin-top: 15px;">
          <p>安装 Webpack 专用 Loader 及清理工具：</p>
          <pre><code>npm install svg-sprite-loader svgo-loader -D</code></pre>
        </div>
      </div>

      <!-- 2. 项目配置 -->
      <div class="block">
        <h3>2. 项目配置</h3>
        
        <div v-if="kkActiveScheme === 'vite'" class="config-section">
          <h4>Vite 配置 (vite.config.js)</h4>
          <pre><code>import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from "node:path";

export default {
  plugins: [
    createSvgIconsPlugin({
      // 指定图标文件夹
      iconDirs: [resolve(__dirname, 'src/assets/icons')],
      // 指定 symbolId 格式
      symbolId: 'icon-[name]',
      // 可选：清理 SVG 样式属性
      svgoOptions: {
        plugins: [
          { 
            name: 'removeAttrs', 
            params: { attrs: ['fill', 'stroke', 'color', 'width', 'height', 'style', 'fill-opacity'] } 
          }
        ]
      }
    })
  ]
}</code></pre>
        </div>

        <div v-else class="config-section">
          <h4>Webpack 配置 (vue.config.js)</h4>
          <p>利用 <code>exclude</code> 确保不破坏其他 SVG 的默认加载，并增加 <code>svgo-loader</code> 自动清理样式属性。</p>
          <pre><code>const path = require('path')

module.exports = {
  chainWebpack: config => {
    const iconDir = path.resolve(__dirname, 'src/assets/icons')
    
    // 1. 排除 iconDir 的默认 svg 处理规则
    config.module
      .rule('svg')
      .exclude.add(iconDir)
      .end()
    
    // 2. 专门处理 iconDir 下的 SVG 文件并生成雪碧图
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(iconDir)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      // 3. 自动清理 fill/stroke 等多余属性
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false, cleanupIDs: false } } },
          'removeDimensions',
          { name: 'removeAttrs', params: { attrs: '(fill|stroke|color|width|height|style|fill-opacity)' } }
        ]
      })
  }
}</code></pre>
        </div>
      </div>

      <!-- 3. 引入并注册 -->
      <div class="block">
        <h3>3. 引入并注册</h3>
        <p>在 <code>main.js</code> 中统一引入并注册组件：</p>
        
        <div v-if="kkActiveScheme === 'vite'" class="config-section">
          <h4>Vite 引入方式</h4>
          <pre><code>import Vue from "vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";
import "virtual:svg-icons-register";

Vue.use(SvgIconPlugin);</code></pre>
        </div>

        <div v-else class="config-section">
          <h4>Webpack 引入方式</h4>
          <pre><code>import Vue from "vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";

// 自动导入 src/assets/icons 目录下的所有 SVG 文件
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)

Vue.use(SvgIconPlugin);</code></pre>
          
          <div class="comparison-box" style="margin-top: 12px; font-size: 13px; border: 1px solid #ffe58f; background: #fffbe6; padding: 12px; border-radius: 8px;">
            <h5 style="margin: 0 0 8px; color: #856404;">💡 Webpack 技巧：</h5>
            <p style="margin: 0; color: #856404;">您可以将 <code>require.context</code> 的逻辑封装在图标目录的 <code>index.js</code> 中，然后在 <code>main.js</code> 里直接 <code>import './assets/icons'</code> 即可保持入口文件整洁。</p>
          </div>
        </div>
      </div>

      <div class="block">
        <h3>4. 组件使用</h3>
        <pre><code>&lt;!-- 基础用法 --&gt;
&lt;ZcSvgIcon name="close" /&gt;

&lt;!-- 自定义大小 --&gt;
&lt;ZcSvgIcon name="check" :size="32" /&gt;

&lt;!-- 自定义颜色 (需确保已配置 SVGO 清理) --&gt;
&lt;ZcSvgIcon name="info" color="#1677ff" size="40px" /&gt;</code></pre>
      </div>

      <div class="tips">
        <strong>💡 最佳实践</strong>：只推荐用于“单色 / 可统一染色”的图标。素材导出时尽量不要带内联样式，或者通过插件配置 <code>svgo</code> 自动移除 <code>fill/stroke/color/width/height/style</code> 等属性，确保图标完全受 CSS 控制。
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "SvgIconPage",
  data() {
    return {
      kkActiveScheme: "vite",
      kkCurrentIcon: "ocr-detector",
      kkCurrentColor: "#1677ff",
      kkCurrentSize: 48,
      kkIconList: [
        "ocr-detector",
        "close",
        "home",
        "message",
      ]
    };
  }
};
</script>

<style scoped>
.wrap {
  padding: 24px;
  color: #1f2329;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.panel {
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.panel-header-with-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f2;
  padding-bottom: 12px;
}

.panel-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
}

.scheme-tabs {
  display: flex;
  background: #f4f5f8;
  padding: 4px;
  border-radius: 8px;
}

.scheme-tab-btn {
  border: none;
  background: transparent;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #86909c;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.scheme-tab-btn:hover {
  color: #4e5969;
}

.scheme-tab-btn.active {
  background: #fff;
  color: #1677ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.demo-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item label {
  font-size: 14px;
  color: #4e5969;
  font-weight: 500;
}

.kk-select, .kk-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s;
}

.kk-select:focus, .kk-input:focus {
  border-color: #1677ff;
}

.color-picker-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}

.kk-color-input {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.kk-range {
  width: 100%;
  cursor: pointer;
}

.preview-card {
  width: 320px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-icon-box {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.preview-info {
  padding: 16px;
  background: #f8f9fa;
}

.preview-info code {
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 12px;
  color: #c41d7f;
  word-break: break-all;
}

.row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.item {
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.label {
  font-size: 12px;
  color: #86909c;
  margin-bottom: 8px;
}

.block {
  margin-bottom: 24px;
}

.block h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #1d2129;
}

.block p {
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 8px;
}

.config-section h4 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #1d2129;
}

pre {
  background: #f2f3f5;
  padding: 12px;
  border-radius: 8px;
  overflow: auto;
}

code {
  font-size: 13px;
}

.tips {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #003a8c;
}

@media (max-width: 768px) {
  .demo-container {
    flex-direction: column;
  }
  .preview-card {
    width: 100%;
  }
}
</style>

