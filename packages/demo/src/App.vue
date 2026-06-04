<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">vue2-plugins</div>
        <div class="brand-sub">插件预览调试中心</div>
      </div>

      <nav class="menu" aria-label="插件菜单">
        <router-link
          v-for="item in menu"
          :key="item.key"
          :to="item.path"
          class="menu-item"
          :class="{ active: $route.path === item.path }"
          tag="button"
        >
          <div class="menu-item-title">{{ item.title }}</div>
          <div class="menu-item-sub">{{ item.sub }}</div>
        </router-link>
      </nav>
    </aside>

    <main class="content">
      <div v-show="isMicroApp" id="subapp-viewport">
        <div class="micro-loading">
          <div class="micro-loading-spinner"></div>
          <p>正在加载子应用...</p>
        </div>
      </div>
      <router-view v-show="!isMicroApp" />
    </main>
  </div>
</template>

<script>
const MICRO_APP_HASHES = ["/vue-textellipsis-zzc"];

export default {
  name: "DemoApp",
  data() {
    return {
      menu: [
        {
          key: "svg-icon",
          path: "/svg-icon",
          title: "SvgIcon 图标",
          sub: "@zhenzichao/vue2-svg-icon"
        },
        {
          key: "watermark",
          path: "/watermark",
          title: "Watermark 水印",
          sub: "@zhenzichao/vue2-watermark-plugin"
        },
        {
          key: "infinite-scroll",
          path: "/infinite-scroll",
          title: "InfiniteScroll 无限滚动",
          sub: "@zhenzichao/vue2-infinite-scroll"
        },
        {
          key: "virtual-list",
          path: "/virtual-list",
          title: "VirtualList 虚拟列表",
          sub: "@zhenzichao/vue2-virtual-list"
        },
        {
          key: "vue-textellipsis-zzc",
          path: "/vue-textellipsis-zzc",
          title: "TextEllipsis 文本省略",
          sub: "vue-textellipsis-zzc (微前端)"
        }
      ],
    };
  },
  computed: {
    isMicroApp() {
      return MICRO_APP_HASHES.includes(this.$route.path);
    }
  },
  watch: {
    $route() {
      const content = document.querySelector('.content');
      if (content) content.scrollTop = 0;
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
  color: #1f2329;
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

#subapp-viewport {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.micro-loading {
  text-align: center;
  padding: 40px 0;
  color: #4e5969;
  font-size: 14px;
}

.micro-loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e6eb;
  border-top-color: #1677ff;
  border-radius: 50%;
  animation: micro-spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes micro-spin {
  to { transform: rotate(360deg); }
}
</style>