/**
 * @file Index - 主入口文件
 * @description 导出 VirtualList 组件和 Vue 插件
 * @author zhenzichao
 * @version 0.1.0
 */

import VirtualList from './VirtualList.vue';
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const VirtualListPlugin = {
  install(Vue) {
    if (VirtualListPlugin.installed) return;
    VirtualListPlugin.installed = true;

    // 注册 vue-virtual-scroller 的底层组件（供高级用户直接使用）
    Vue.component('RecycleScroller', RecycleScroller);
    Vue.component('DynamicScroller', DynamicScroller);
    Vue.component('DynamicScrollerItem', DynamicScrollerItem);

    // 注册封装后的简化组件
    Vue.component(VirtualList.name, VirtualList);
  }
};

VirtualListPlugin.installed = false;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VirtualListPlugin);
}

export default VirtualListPlugin;
export { VirtualList, RecycleScroller, DynamicScroller, DynamicScrollerItem };