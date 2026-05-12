/**
 * @file Vue 集成 - 插件和指令
 * @description 提供 Vue 插件和 v-watermark 指令
 * @author zhenzichao
 * @version 1.0.0
 */

import Watermark from './Watermark';

/**
 * Vue 指令：v-watermark
 * @param {Vue} Vue - Vue 构造函数
 */
function createWatermarkDirective(Vue) {
  const watermarkInstances = new WeakMap();
  
  return {
    inserted(el, binding, vnode) {
      const options = binding.value || {};
      const instance = new Watermark(options);
      instance.init({ container: el });
      watermarkInstances.set(el, instance);
    },
    
    update(el, binding) {
      const instance = watermarkInstances.get(el);
      if (instance && binding.value !== undefined) {
        instance.update(binding.value);
      }
    },
    
    unbind(el) {
      const instance = watermarkInstances.get(el);
      if (instance) {
        instance.destroy();
        watermarkInstances.delete(el);
      }
    }
  };
}

/**
 * Vue 插件安装
 * @param {Vue} Vue - Vue 构造函数
 * @param {Object} options - 全局配置
 */
function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  
  install.installed = true;
  install.globalWatermark = new Watermark(options);
  
  if (options.global !== undefined && options.global) {
    install.globalWatermark.init();
  }
  
  Vue.directive('watermark', createWatermarkDirective(Vue));
  
  Vue.prototype.$watermark = {
    init: (instanceOptions) => install.globalWatermark.init(instanceOptions),
    update: (newOptions) => install.globalWatermark.update(newOptions),
    destroy: () => install.globalWatermark.destroy(),
    getOptions: () => install.globalWatermark.getOptions(),
    getContainer: () => install.globalWatermark.getContainer(),
    createInstance: (instanceOptions) => new Watermark(instanceOptions)
  };
  
  Vue.watermark = Vue.prototype.$watermark;
}

install.installed = false;

export default {
  install,
  Watermark
};

export { Watermark };
