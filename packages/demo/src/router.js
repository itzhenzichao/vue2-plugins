import Vue from "vue";
import VueRouter from "vue-router";
import SvgIconPage from "./pages/SvgIconPage.vue";
import WatermarkPage from "./pages/WatermarkPage.vue";
import InfiniteScrollPage from "./pages/InfiniteScrollPage.vue";
import VirtualListPage from "./pages/VirtualListPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: { render: (h) => h("router-view") },
    redirect: "/svg-icon",
    children: [
      { path: "svg-icon", name: "svg-icon", component: SvgIconPage },
      { path: "watermark", name: "watermark", component: WatermarkPage },
      { path: "infinite-scroll", name: "infinite-scroll", component: InfiniteScrollPage },
      { path: "virtual-list", name: "virtual-list", component: VirtualListPage },
      { path: "vue-textellipsis-zzc", name: "vue-textellipsis-zzc" },
    ],
  },
];

export default new VueRouter({
  mode: "hash",
  base: "/vue2-plugins/",
  routes,
});