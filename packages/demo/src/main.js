import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";
import Watermark from "@zhenzichao/vue2-watermark-plugin";
import InfiniteScroll from "@zhenzichao/vue2-infinite-scroll";
import VirtualList from "@zhenzichao/vue2-virtual-list";
import Toast from "@zhenzichao/vue2-toast";
import { registerMicroApps, start } from "qiankun";
import "virtual:svg-icons-register";

Vue.config.productionTip = false;

Vue.use(SvgIconPlugin);
Vue.use(Watermark);
Vue.use(InfiniteScroll);
Vue.use(VirtualList);
Vue.use(Toast);

registerMicroApps([
  {
    name: "textellipsis",
    entry: process.env.PROD_MICRO
      ? "https://itzhenzichao.github.io/vue-textellipsis-zzc/"
      : "//localhost:8080",
    container: "#subapp-viewport",
    activeRule: (location) => location.hash.startsWith("#/vue-textellipsis-zzc"),
  },
]);

start({
  sandbox: { experimentalStyleIsolation: true },
  prefetch: false,
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");