<template>
  <div class="zc-infinite-scroll">
    <slot v-if="!isEmpty" />
    <div>
      <slot name="empty" v-if="isEmpty && !loading" />
    </div>
    <div v-if="loading" class="zc-infinite-scroll-loading">
      <slot name="loading">{{ loadingText }}</slot>
    </div>
    <div v-if="finished && !isEmpty" class="zc-infinite-scroll-finished">
      <slot name="finished">{{ finishedText }}</slot>
    </div>
    <div ref="sentinel" class="zc-infinite-scroll-sentinel" />
  </div>
</template>

<script>
export default {
  name: 'ZcInfiniteScroll',

  props: {
    loadMore: {
      type: Function,
      required: true
    },
    throttle: {
      type: Number,
      default: 300
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    finishedText: {
      type: String,
      default: '--到底了--'
    }
  },

  data() {
    return {
      loading: false,
      finished: false,
      lastLoadEndTime: 0,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initObserver();
    });
  },

  beforeDestroy() {
    this.destroyObserver();
  },

  methods: {
    initObserver() {
      const options = {
        root: null,
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.triggerLoad();
        }
      }, options);

      this.observer.observe(this.$refs.sentinel);
    },

    destroyObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },

    triggerLoad() {
      if (this.loading || this.finished) return;

      const now = Date.now();
      const remaining = this.throttle - (now - this.lastLoadEndTime);

      if (remaining > 0) {
        this.loading = true;
        setTimeout(() => {
          this.doLoad();
        }, remaining);
      } else {
        this.doLoad();
      }
    },

    doLoad() {
      if (this.finished) {
        this.loading = false;
        return;
      }

      this.loading = true;
      const result = this.loadMore();
      if (result && typeof result.then === 'function') {
        result.then((isFinished) => {
          this.loading = false;
          this.lastLoadEndTime = Date.now();
          if (isFinished) this.finished = true;
          this.checkAndLoad();
        }).catch(() => {
          this.loading = false;
          this.lastLoadEndTime = Date.now();
        });
      } else {
        this.loading = false;
        this.lastLoadEndTime = Date.now();
      }
    },

    finish() {
      this.finished = true;
    },

    reset() {
      this.finished = false;
      this.loading = false;
      this.lastLoadEndTime = 0;
      this.destroyObserver();
      this.$nextTick(() => {
        this.initObserver();
      });
    },

    checkAndLoad() {
      if (this.loading || this.finished) return;
      this.$nextTick(() => {
        if (!this.$refs.sentinel) return;
        const rect = this.$refs.sentinel.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top - viewportHeight < 0) {
          this.triggerLoad();
        }
      });
    }
  }
};
</script>

<style scoped>
.zc-infinite-scroll {
  width: 100%;
}

.zc-infinite-scroll-loading,
.zc-infinite-scroll-finished {
  text-align: center;
  padding: 12px 0;
  color: #999;
  font-size: 14px;
}

.zc-infinite-scroll-sentinel {
  height: 1px;
  width: 1px;
  overflow: hidden;
}
</style>