import SvgIcon from "./SvgIcon.vue";

const SvgIconPlugin = {
  install(Vue) {
    if (SvgIconPlugin.install && SvgIconPlugin.install.installed) return;
    if (!SvgIconPlugin.install) {
      SvgIconPlugin.install = {};
    }
    SvgIconPlugin.install.installed = true;
    Vue.component(SvgIcon.name, SvgIcon);
  }
};

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(SvgIconPlugin);
}

export default SvgIconPlugin;
export { SvgIcon, SvgIconPlugin };

