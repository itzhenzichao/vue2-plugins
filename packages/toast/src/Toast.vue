<template>
  <transition name="zc-toast-fade">
    <div class="zc-toast" :class="typeClass" v-show="visible">
      <span class="zc-toast__icon">{{ iconSymbol }}</span>
      <span class="zc-toast__content">{{ message }}</span>
      <button class="zc-toast__close" @click="handleClose">&times;</button>
    </div>
  </transition>
</template>

<script>
const TYPE_CONFIG = {
  success: { icon: '✔', color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' },
  warning: { icon: '❗', color: '#faad14', bgColor: '#fffbe6', borderColor: '#ffe58f' },
  error:   { icon: '✖', color: '#f56c6c', bgColor: '#fff2f0', borderColor: '#ffccc7' },
  info:    { icon: 'ℹ', color: '#1677ff', bgColor: '#e6f7ff', borderColor: '#91d5ff' }
};

export default {
  name: 'ZcToast',
  props: {
    id: { type: [Number, String], required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      default: 'info',
      validator: v => ['success', 'warning', 'error', 'danger', 'info'].includes(v)
    },
    duration: { type: Number, default: 2000 }
  },
  data() {
    return { visible: false };
  },
  computed: {
    normalizedType() {
      return this.type === 'danger' ? 'error' : this.type;
    },
    typeClass() {
      return `zc-toast--${this.normalizedType}`;
    },
    config() {
      return TYPE_CONFIG[this.normalizedType] || TYPE_CONFIG.info;
    },
    iconSymbol() {
      return this.config.icon;
    }
  },
  mounted() {
    this.visible = true;
    if (this.duration > 0) {
      this.timer = setTimeout(() => this.handleClose(), this.duration);
    }
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    handleClose() {
      this.visible = false;
      setTimeout(() => this.$emit('close', this.id), 300);
    }
  }
};
</script>

<style scoped>
.zc-toast {
  display: flex;
  align-items: center;
  min-width: 280px;
  max-width: 420px;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 14px;
  line-height: 1.5;
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s, transform 0.3s;
}

.zc-toast--success {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.zc-toast--warning {
  color: #faad14;
  background: #fffbe6;
  border-color: #ffe58f;
}

.zc-toast--error {
  color: #f56c6c;
  background: #fff2f0;
  border-color: #ffccc7;
}

.zc-toast--info {
  color: #1677ff;
  background: #e6f7ff;
  border-color: #91d5ff;
}

.zc-toast__icon {
  font-size: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.zc-toast__content {
  flex: 1;
  color: #1f2329;
}

.zc-toast__close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  flex-shrink: 0;
  line-height: 1;
}

.zc-toast__close:hover {
  color: #333;
}

.zc-toast-fade-enter-active {
  transition: opacity 0.3s, transform 0.3s;
}

.zc-toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.zc-toast-fade-enter {
  opacity: 0;
  transform: translateY(-8px);
}

.zc-toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>