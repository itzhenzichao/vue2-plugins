import Vue from "vue";
import App from "./App.vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";
import Watermark from "@zhenzichao/vue2-watermark-plugin";
import "virtual:svg-icons-register";

Vue.config.productionTip = false;

Vue.use(SvgIconPlugin);
Vue.use(Watermark);
// Vue.use(Watermark, {
//   content: '全局水印',
//   global: true // 启用全局水印
// })
new Vue({
  render: (h) => h(App)
}).$mount("#app");
