import Vue from "vue";
import App from "./App.vue";
import SvgIconPlugin from "@zhenzichao/vue2-svg-icon";
import "virtual:svg-icons-register";

Vue.config.productionTip = false;

Vue.use(SvgIconPlugin);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
