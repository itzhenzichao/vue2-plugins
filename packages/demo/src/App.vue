<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">vue2-plugins</div>
        <div class="brand-sub">插件预览调试中心</div>
      </div>

      <nav class="menu" aria-label="插件菜单">
        <button
          v-for="item in menu"
          :key="item.key"
          class="menu-item"
          :class="{ active: item.key === activeKey }"
          type="button"
          @click="activeKey = item.key"
        >
          <div class="menu-item-title">{{ item.title }}</div>
          <div class="menu-item-sub">{{ item.sub }}</div>
        </button>
      </nav>
    </aside>

    <main class="content">
      <component :is="activePage" />
    </main>
  </div>
</template>

<script>
import SvgIconPage from "./pages/SvgIconPage.vue";
import WatermarkPage from "./pages/WatermarkPage.vue";

export default {
  name: "DemoApp",
  components: {
    SvgIconPage,
    WatermarkPage
  },
  data() {
    return {
      activeKey: "svg-icon",
      menu: [
        {
          key: "svg-icon",
          title: "SvgIcon 图标",
          sub: "@zhenzichao/vue2-svg-icon"
        },
        {
          key: "watermark",
          title: "Watermark 水印",
          sub: "@zhenzichao/watermark"
        }
      ]
    };
  },
  computed: {
    activePage() {
      if (this.activeKey === "watermark") return WatermarkPage;
      if (this.activeKey === "svg-icon") return SvgIconPage;
      return null;
    }
  }
};
</script>

<style scoped>
.app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1f2329;
}

.sidebar {
  width: 300px;
  border-right: 1px solid #e5e6eb;
  background: #fff;
  padding: 16px 12px;
  overflow: auto;
}

.brand {
  padding: 10px 10px 14px;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  margin-bottom: 14px;
  background: #fafafa;
}

.brand-title {
  font-weight: 700;
  font-size: 18px;
}

.brand-sub {
  margin-top: 4px;
  color: #4e5969;
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  text-align: left;
  border: 1px solid #e5e6eb;
  background: #fff;
  border-radius: 12px;
  padding: 12px 12px;
  cursor: pointer;
}

.menu-item.active {
  border-color: #1677ff;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
}

.menu-item-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.menu-item-sub {
  color: #4e5969;
  font-size: 12px;
  word-break: break-all;
}

.content {
  flex: 1;
  overflow: auto;
  background: #f7f8fa;
}
</style>
