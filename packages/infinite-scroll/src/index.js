/**
 * @file Index - 主入口文件
 * @description 导出 InfiniteScroll 组件和 Vue 插件
 * @author zhenzichao
 * @version 0.1.0
 */

import InfiniteScroll from './InfiniteScroll.vue';

const InfiniteScrollPlugin = {
  install(Vue) {
    if (InfiniteScrollPlugin.installed) return;
    InfiniteScrollPlugin.installed = true;

    Vue.component(InfiniteScroll.name, InfiniteScroll);
  }
};

InfiniteScrollPlugin.installed = false;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(InfiniteScrollPlugin);
}

export default InfiniteScrollPlugin;
export { InfiniteScroll };