# @zhenzichao/vue2-svg-icon

一款专为 Vue2 设计的轻量级 SVG 图标组件插件，支持文件夹图标自动管理、实时染色、尺寸调节以及样式自动注入。

> ⚠️ **重要提示**：本插件必须配合构建工具（如 Vite 或 Webpack）及其对应的 SVG 雪碧图插件一起使用，才能实现图标的自动加载。详情请参考[在线文档](https://itzhenzichao.github.io/vue2-plugins/)。

## ✨ 特性

- **简单易用**：基于 `<use>` 标签的 SVG 雪碧图方案。
- **自动清理**：支持自动移除 SVG 源码中的内联颜色和尺寸属性，确保 100% 受 CSS 控制。
- **样式注入**：打包产物已包含必要 CSS，无需手动引入样式文件。
- **多环境支持**：提供 Vite 和 Webpack (Vue CLI) 的详细配置方案。

## 📖 详细使用文档 (必看)

<div align="center">
  <br />
  <a href="https://itzhenzichao.github.io/vue2-plugins/">
    <img src="https://img.shields.io/badge/查看在线文档与演示-1677ff?style=for-the-badge&logo=googledocs&logoColor=white" alt="Online Documentation" />
  </a>
  <br />
  <p><strong>包含 Vite / Webpack 详细配置、实时演示、SVGO 清理规则等</strong></p>
  <a href="https://itzhenzichao.github.io/vue2-plugins/">https://itzhenzichao.github.io/vue2-plugins/</a>
  <br />
  <br />
</div>

## 🚀 快速开始摘要

### 安装
```bash
npm install @zhenzichao/vue2-svg-icon
```

### 引入
```javascript
import Vue from "vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";

// 注册插件
Vue.use(SvgIconPlugin);
```

### 使用
```html
<ZcSvgIcon name="home" color="#1677ff" size="32" />
```

---

更多高级配置（如 Vite/Webpack 插件配置）请参考上述[在线文档](https://itzhenzichao.github.io/vue2-plugins/)。
