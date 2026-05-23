import Vue from "vue";
import App from "./App.vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";
import Watermark from "@zhenzichao/vue2-watermark-plugin";
import InfiniteScroll from "@zhenzichao/vue2-infinite-scroll";
import VirtualList from "@zhenzichao/vue2-virtual-list";
import Toast from "@zhenzichao/vue2-toast";
import "virtual:svg-icons-register";

Vue.config.productionTip = false;

Vue.use(SvgIconPlugin);
Vue.use(Watermark);
Vue.use(InfiniteScroll);
Vue.use(VirtualList);
Vue.use(Toast);
// Vue.use(Watermark, {
//   content: '全局水印',
//   global: true // 启用全局水印
// })
new Vue({
  render: (h) => h(App)
}).$mount("#app");
