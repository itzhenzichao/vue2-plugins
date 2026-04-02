(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".zc-svg-icon[data-v-9f65f34e]{display:inline-flex;line-height:0;vertical-align:middle}.zc-svg[data-v-9f65f34e]{width:100%;height:100%;display:block;fill:currentColor}")),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}})();
var m = function() {
  var e = this, s = e.$createElement, o = e._self._c || s;
  return o("span", {
    staticClass: "zc-svg-icon",
    style: e.wrapStyle
  }, [o("svg", {
    staticClass: "zc-svg",
    attrs: {
      "aria-hidden": "true"
    }
  }, [o("use", {
    attrs: {
      "xlink:href": e.symbolId
    }
  })])]);
}, S = [];
function y(e, s, o, p, a, l, u, h) {
  var t = typeof e == "function" ? e.options : e;
  s && (t.render = s, t.staticRenderFns = o, t._compiled = !0), p && (t.functional = !0), l && (t._scopeId = "data-v-" + l);
  var i;
  if (u ? (i = function(n) {
    n = n || // cached call
    this.$vnode && this.$vnode.ssrContext || // stateful
    this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !n && typeof __VUE_SSR_CONTEXT__ < "u" && (n = __VUE_SSR_CONTEXT__), a && a.call(this, n), n && n._registeredComponents && n._registeredComponents.add(u);
  }, t._ssrRegister = i) : a && (i = h ? function() {
    a.call(
      this,
      (t.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : a), i)
    if (t.functional) {
      t._injectStyles = i;
      var v = t.render;
      t.render = function(g, f) {
        return i.call(f), v(g, f);
      };
    } else {
      var _ = t.beforeCreate;
      t.beforeCreate = _ ? [].concat(_, i) : [i];
    }
  return {
    exports: e,
    options: t
  };
}
const C = {
  name: "ZcSvgIcon",
  props: {
    /**
     * 图标名称，对应 sprite 中的 symbolId（示例里为 icon-${name}）
     * 例如：name="close" => <use xlink:href="#icon-close" />
     */
    name: {
      type: String,
      required: !0
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
      const e = typeof this.size == "number" ? `${this.size}px` : /^\d+$/.test(String(this.size)) ? `${this.size}px` : String(this.size);
      return {
        width: e,
        height: e,
        color: this.color
      };
    },
    symbolId() {
      return `#icon-${this.name}`;
    }
  }
}, c = {};
var $ = /* @__PURE__ */ y(
  C,
  m,
  S,
  !1,
  w,
  "9f65f34e",
  null,
  null
);
function w(e) {
  for (let s in c)
    this[s] = c[s];
}
const d = /* @__PURE__ */ function() {
  return $.exports;
}(), r = {
  install(e) {
    r.install && r.install.installed || (r.install || (r.install = {}), r.install.installed = !0, e.component(d.name, d));
  }
};
typeof window < "u" && window.Vue && window.Vue.use(r);
export {
  d as SvgIcon,
  r as SvgIconPlugin,
  r as default
};
