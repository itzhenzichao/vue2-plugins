<template>
  <RecycleScroller
    v-if="!dynamic"
    ref="scroller"
    :items="items"
    :item-size="itemSize"
    :key-field="keyField"
    :buffer="buffer"
    :page-mode="pageMode"
    :style="containerStyle"
    class="zc-virtual-list"
    v-on="$listeners"
  >
    <template #default="{ item, index, active }">
      <slot :item="item" :index="index" :active="active" />
    </template>
    <template #before>
      <slot name="before" />
    </template>
    <template #after>
      <slot name="after" />
      <div v-if="isInnerEmpty && finished" class="zc-virtual-list-empty">
        <slot name="empty" />
      </div>
      <div v-if="loading" class="zc-virtual-list-loading">
        <slot name="loading">{{ loadingText }}</slot>
      </div>
      <div v-if="finished && !isInnerEmpty" class="zc-virtual-list-finished">
        <slot name="finished">{{ finishedText }}</slot>
      </div>
      <div v-if="loadMore && !finished" ref="sentinel" class="zc-virtual-list-sentinel" />
    </template>
  </RecycleScroller>

  <DynamicScroller
    v-else
    ref="scroller"
    :items="items"
    :min-item-size="minItemSize"
    :key-field="keyField"
    :buffer="buffer"
    :page-mode="pageMode"
    :style="containerStyle"
    class="zc-virtual-list"
    v-on="$listeners"
  >
    <template #default="{ item, index, active }">
      <slot :item="item" :index="index" :active="active" />
    </template>
    <template #before>
      <slot name="before" />
    </template>
    <template #after>
      <slot name="after" />
      <div v-if="isInnerEmpty && finished" class="zc-virtual-list-empty">
        <slot name="empty" />
      </div>
      <div v-if="loading" class="zc-virtual-list-loading">
        <slot name="loading">{{ loadingText }}</slot>
      </div>
      <div v-if="finished && !isInnerEmpty" class="zc-virtual-list-finished">
        <slot name="finished">{{ finishedText }}</slot>
      </div>
      <div v-if="loadMore && !finished" ref="sentinel" class="zc-virtual-list-sentinel" />
    </template>
  </DynamicScroller>
</template>

<script>
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  name: 'ZcVirtualList',

  components: {
    RecycleScroller,
    DynamicScroller,
    DynamicScrollerItem
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    dynamic: {
      type: Boolean,
      default: false
    },
    itemSize: {
      type: [Number, String],
      default: 50
    },
    minItemSize: {
      type: [Number, String],
      default: 40
    },
    keyField: {
      type: String,
      default: 'id'
    },
    height: {
      type: [Number, String],
      default: ''
    },
    buffer: {
      type: Number,
      default: 200
    },
    pageMode: {
      type: Boolean,
      default: false
    },
    loadMore: {
      type: Function,
      default: null
    },
    throttle: {
      type: Number,
      default: 300
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    finishedText: {
      type: String,
      default: '加载完成'
    }
  },

  computed: {
    isInnerEmpty() {
      return this.items.length === 0;
    },
    containerStyle() {
      if (!this.height) return {};
      const h = typeof this.height === 'number' ? `${this.height}px` : this.height;
      return { height: h };
    }
  },

  data() {
    return {
      loading: false,
      finished: false,
      lastLoadEndTime: 0
    };
  },

  mounted() {
    this.initObserver();
    this.bindWheelLock();
  },

  beforeDestroy() {
    this.destroyObserver();
    this.unbindWheelLock();
  },

  methods: {
    initObserver() {
      if (!this.loadMore) return;
      this.$nextTick(() => {
        if (!this.$refs.sentinel) return;
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !this.loading && !this.finished) {
            this.doLoad();
          }
        }, { root: this.$refs.scroller.$el, threshold: 0 });
        this.observer.observe(this.$refs.sentinel);
      });
    },

    destroyObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },

    doLoad() {
      if (this.finished) {
        this.loading = false;
        return;
      }

      const now = Date.now();
      const remaining = this.throttle - (now - this.lastLoadEndTime);

      if (remaining > 0) {
        this.loading = true;
        setTimeout(() => {
          this.doLoad();
        }, remaining);
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

    checkAndLoad() {
      if (this.loading || this.finished) return;
      this.$nextTick(() => {
        if (!this.$refs.sentinel) return;
        const rect = this.$refs.sentinel.getBoundingClientRect();
        const rootRect = this.$refs.scroller.$el.getBoundingClientRect();
        if (rect.top <= rootRect.bottom) {
          this.doLoad();
        }
      });
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
        if (this.$refs.scroller) {
          this.$refs.scroller.scrollToItem(0);
        }
        this.initObserver();
      });
    },

    bindWheelLock() {
      this._wheelHandler = (e) => {
        e.preventDefault();
        const el = this.$refs.scroller && this.$refs.scroller.$el;
        if (el) {
          el.scrollTop += e.deltaY;
        }
      };
      this.$nextTick(() => {
        const el = this.$refs.scroller && this.$refs.scroller.$el;
        if (el) {
          el.addEventListener('wheel', this._wheelHandler, { passive: false });
        }
      });
    },

    unbindWheelLock() {
      if (this._wheelHandler) {
        const el = this.$refs.scroller && this.$refs.scroller.$el;
        if (el) {
          el.removeEventListener('wheel', this._wheelHandler);
        }
        this._wheelHandler = null;
      }
    }
  }
};
</script>

<style scoped>
.zc-virtual-list {
  width: 100%;
}

.zc-virtual-list-loading,
.zc-virtual-list-finished {
  text-align: center;
  padding: 12px 0;
  color: #999;
  font-size: 14px;
}

.zc-virtual-list-empty {
  width: 100%;
}

.zc-virtual-list-sentinel {
  height: 1px;
  width: 1px;
  overflow: hidden;
}
</style>