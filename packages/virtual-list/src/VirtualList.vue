<template>
  <component
    :is="scrollerComponent"
    :items="items"
    :item-size="itemSize"
    :min-item-size="minItemSize"
    :key-field="keyField"
    :list-class="listClass"
    :list-style="listStyle"
    :buffer="buffer"
    :page-mode="pageMode"
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
    </template>
    <template #empty>
      <slot name="empty" />
    </template>
  </component>
</template>

<script>
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  name: 'ZcVirtualList',

  components: {
    RecycleScroller,
    DynamicScroller
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    // 是否使用动态高度模式
    dynamic: {
      type: Boolean,
      default: false
    },
    // RecycledScroller: 固定/估算高度
    itemSize: {
      type: [Number, String],
      default: 50
    },
    // DynamicScroller: 最小估算高度
    minItemSize: {
      type: [Number, String],
      default: 40
    },
    // 数据唯一标识字段
    keyField: {
      type: String,
      default: 'id'
    },
    // 列表容器额外 class
    listClass: {
      type: String,
      default: ''
    },
    // 列表容器额外 style
    listStyle: {
      type: Object,
      default: () => ({})
    },
    // 缓冲区域大小（可视区域外额外渲染的项数）
    buffer: {
      type: Number,
      default: 200
    },
    // 使用页面滚动模式（而非组件自身作为滚动容器）
    pageMode: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    scrollerComponent() {
      return this.dynamic ? 'DynamicScroller' : 'RecycleScroller';
    }
  }
};
</script>

<style scoped>
.zc-virtual-list {
  width: 100%;
}
</style>