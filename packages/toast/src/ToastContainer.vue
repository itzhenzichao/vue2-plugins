<template>
  <div class="zc-toast-container">
    <ZcToast
      v-for="item in toasts"
      :key="item.id"
      :id="item.id"
      :message="item.message"
      :type="item.type"
      :duration="item.duration"
      @close="removeToast"
    />
  </div>
</template>

<script>
import ZcToast from './Toast.vue';

export default {
  name: 'ZcToastContainer',
  components: { ZcToast },
  data() {
    return { toasts: [] };
  },
  methods: {
    addToast(options) {
      this.toasts.push(options);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }
  }
};
</script>

<style scoped>
.zc-toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
</style>