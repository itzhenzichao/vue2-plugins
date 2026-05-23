import Vue from 'vue';
import ToastContainer from './ToastContainer.vue';

let containerInstance = null;

function getContainer() {
  if (containerInstance) return containerInstance;

  const Constructor = Vue.extend(ToastContainer);
  const instance = new Constructor();
  const el = document.createElement('div');
  document.body.appendChild(el);
  instance.$mount(el);
  containerInstance = instance;
  return containerInstance;
}

function toast(message, type = 'info', options = {}) {
  const container = getContainer();
  const id = Date.now() + Math.random();
  const duration = options.duration !== undefined ? options.duration : (toast._defaults && toast._defaults.duration || 2000);
  container.addToast({ id, message, type, duration });
  return () => container.removeToast(id);
}

toast.success = (msg, opts) => toast(msg, 'success', opts);
toast.warning = (msg, opts) => toast(msg, 'warning', opts);
toast.error = (msg, opts) => toast(msg, 'error', opts);
toast.danger = (msg, opts) => toast(msg, 'danger', opts);
toast.info = (msg, opts) => toast(msg, 'info', opts);

export default toast;