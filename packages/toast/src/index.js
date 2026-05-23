import toast from './toast';

const ToastPlugin = {
  install(Vue, options = {}) {
    if (ToastPlugin.installed) return;
    ToastPlugin.installed = true;

    toast._defaults = {
      duration: options.duration || 2000
    };

    Vue.prototype.$toast = toast;
    Vue.toast = toast;
  }
};

ToastPlugin.installed = false;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ToastPlugin);
}

export default ToastPlugin;
export { toast };