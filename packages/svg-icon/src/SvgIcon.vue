<template>
  <span class="zc-svg-icon" :style="wrapStyle">
    <svg class="zc-svg" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
  </span>
</template>

<script>
export default {
  name: "ZcSvgIcon",
  props: {
    /**
     * 图标名称，对应 sprite 中的 symbolId（示例里为 icon-${name}）
     * 例如：name="close" => <use xlink:href="#icon-close" />
     */
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 20
    },
    color: {
      type: String,
      default: "currentColor"
    }
  },
  computed: {
    wrapStyle() {
      const size =
        typeof this.size === "number"
          ? `${this.size}px`
          : /^\d+$/.test(String(this.size))
            ? `${this.size}px`
            : String(this.size);
      return {
        width: size,
        height: size,
        color: this.color
      };
    },
    symbolId() {
      // 与 vite-plugin-svg-icons 中的 symbolId 保持一致
      return `#icon-${this.name}`;
    }
  }
};
</script>

<style scoped>
.zc-svg-icon {
  display: inline-flex;
  line-height: 0;
  vertical-align: middle;
}

.zc-svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: currentColor;
}
</style>

