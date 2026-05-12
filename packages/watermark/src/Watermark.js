/**
 * @file Watermark - 专业水印插件
 * @description 支持全局/局部水印，防删除防篡改，使用 Canvas 生成
 * @author zhenzichao
 * @version 1.0.0
 */

/**
 * 默认配置
 */
const DEFAULT_OPTIONS = {
  content: ['zzc的插件库', '防删除防篡改'],
  container: null,
  width: undefined,
  height: undefined,
  fontSize: 14,
  fontFamily: 'normal normal normal 14px sans-serif',
  color: 'rgba(0, 0, 0, 0.15)',
  opacity: 0.15,
  rotate: -22,
  gap: [80, 40],
  offset: [0, 0],
  zIndex: 9999,
  textAlign: 'center',
  textBaseline: 'alphabetic',
  layout: 'repeat',
  pointerEvents: true,
  lineHeight: 20,
  debug: false // 调试模式：显示 Canvas 边界（边框和背景色）
};

/**
 * 防篡改水印类
 */
class Watermark {
  constructor(options = {}) {
    this.options = this.mergeOptions(options);
    this.watermarkElement = null;
    this.container = null;
    this.mutationObserver = null;
    this.resizeObserver = null;
    this.canvas = null;
    this.base64DataUrl = '';
    this.instanceId = this.generateInstanceId();
    this.parentObserver = null;
    this.observerRetryCount = 0;
    this.observerMaxRetry = 5;
    
    this.handleResize = this.handleResize.bind(this);
    this.handleMutation = this.handleMutation.bind(this);
    this.checkWatermarkPresence = this.checkWatermarkPresence.bind(this);
  }

  mergeOptions(options) {
    const merged = { ...DEFAULT_OPTIONS };
    for (const key in options) {
      if (options[key] !== undefined) {
        merged[key] = options[key];
      }
    }
    return merged;
  }

  generateInstanceId() {
    return `watermark_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  getContainerElement(container) {
    if (!container) return document.body;
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) throw new Error(`Container selector "${container}" not found`);
      return element;
    }
    return container;
  }

  convertColorWithOpacity(color, opacity) {
    const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(',').map(p => p.trim());
      if (color.startsWith('rgba') && parts.length === 4) return color;
      if (color.startsWith('rgb')) return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
    }
    if (color && color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }

  calculateContentWidth(content, ctx) {
    const lines = Array.isArray(content) ? content : [content];
    let maxWidth = 0;
    lines.forEach(line => {
      const width = ctx.measureText(line).width;
      if (width > maxWidth) maxWidth = width;
    });
    return maxWidth;
  }

  /**
   * 单行在块坐标系中的左右边界（块左上角为 (0,0)，宽 contentWidth）
   */
  getLineHorizontalExtent(ctx, line, textAlign, contentWidth) {
    const m = ctx.measureText(line);
    const w = m.width;
    let left;
    let right;
    if (textAlign === 'left') {
      left = 0;
      right = w;
    } else if (textAlign === 'right') {
      right = contentWidth;
      left = contentWidth - w;
    } else {
      left = contentWidth / 2 - w / 2;
      right = contentWidth / 2 + w / 2;
    }
    return { left, right };
  }

  generateWatermark() {
    const {
      content, width, height, fontSize, fontFamily,
      color, opacity, rotate, textAlign, lineHeight, debug
    } = this.options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context is not available');
    
    const dpr = window.devicePixelRatio || 1;

    let drawFont = fontFamily;
    if (fontFamily.match(/\d+px/)) {
      drawFont = fontFamily.replace(/\d+px/, `${fontSize}px`);
    } else {
      drawFont = `${fontSize}px ${fontFamily}`;
    }

    ctx.font = drawFont;

    const contentLines = Array.isArray(content) ? content : [content];
    
    const contentWidth = this.calculateContentWidth(content, ctx);
    const contentHeight = (contentLines.length - 1) * lineHeight + fontSize;
    const startY = (contentHeight - ((contentLines.length - 1) * lineHeight + fontSize)) / 2 + fontSize / 2;

    const halfEm = fontSize / 2;
    const rotateRad = rotate * Math.PI / 180;
    const cos = Math.cos(rotateRad);
    const sin = Math.sin(rotateRad);
    const rx = contentWidth / 2;
    const ry = contentHeight / 2;

    const transformCorner = (px, py) => {
      const dx = px - rx;
      const dy = py - ry;
      const x = dx * cos - dy * sin + rx;
      const y = dx * sin + dy * cos + ry;
      return { x, y };
    };

    let minXp = Infinity;
    let minYp = Infinity;
    let maxXp = -Infinity;
    let maxYp = -Infinity;

    contentLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      const { left, right } = this.getLineHorizontalExtent(ctx, line, textAlign, contentWidth);
      const yTop = y - halfEm;
      const yBottom = y + halfEm;
      const corners = [
        [left, yTop],
        [right, yTop],
        [left, yBottom],
        [right, yBottom]
      ];
      corners.forEach(([px, py]) => {
        const p = transformCorner(px, py);
        minXp = Math.min(minXp, p.x);
        minYp = Math.min(minYp, p.y);
        maxXp = Math.max(maxXp, p.x);
        maxYp = Math.max(maxYp, p.y);
      });
    });

    const logicalWidth = Math.max(1, maxXp - minXp);
    const logicalHeight = Math.max(1, maxYp - minYp);

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    ctx.scale(dpr, dpr);

    if (debug) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, logicalWidth - 2, logicalHeight - 2);

      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      const markerSize = 5;
      ctx.fillRect(0, 0, markerSize, markerSize);
      ctx.fillRect(logicalWidth - markerSize, 0, markerSize, markerSize);
      ctx.fillRect(0, logicalHeight - markerSize, markerSize, markerSize);
      ctx.fillRect(logicalWidth - markerSize, logicalHeight - markerSize, markerSize, markerSize);

      console.log('[Watermark Debug]', {
        canvasSize: { width: logicalWidth, height: logicalHeight },
        contentSize: { width: contentWidth, height: contentHeight },
        gap: this.options.gap,
        offset: this.options.offset,
        angle: rotate
      });
    }

    ctx.font = drawFont;
    ctx.fillStyle = this.convertColorWithOpacity(color, opacity);
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.translate(-minXp, -minYp);
    ctx.translate(rx, ry);
    ctx.rotate(rotateRad);
    ctx.translate(-rx, -ry);

    contentLines.forEach((line, index) => {
      let x;
      if (textAlign === 'left') x = 0;
      else if (textAlign === 'right') x = contentWidth;
      else x = contentWidth / 2;
      ctx.fillText(line, x, startY + index * lineHeight);
    });

    ctx.restore();
    
    this.canvas = canvas;
    this.base64DataUrl = canvas.toDataURL();
    return this.base64DataUrl;
  }

  createWatermarkElement() {
    const {
      offset, zIndex, pointerEvents, layout
    } = this.options;

    const offsetLeft = Array.isArray(offset) ? offset[0] : 0;
    const offsetTop = Array.isArray(offset) ? offset[1] : 0;

    const watermarkDiv = document.createElement('div');
    this.generateWatermark();

    const { dataUrl, paddedWidth, paddedHeight } = this.buildPaddedBackground();

    watermarkDiv.id = this.instanceId;
    watermarkDiv.style.cssText = `
      pointer-events: ${pointerEvents === true ? 'none' : pointerEvents};
      position: absolute;
      inset: 0;
      z-index: ${zIndex};
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      background-repeat: ${layout === 'repeat' ? 'repeat' : 'no-repeat'};
      background-position: ${offsetLeft}px ${offsetTop}px;
      background-size: ${paddedWidth}px ${paddedHeight}px;
      background-image: url(${dataUrl});
    `;

    this.watermarkElement = watermarkDiv;
    return watermarkDiv;
  }


  init(options = {}) {
    if (options && Object.keys(options).length > 0) {
      this.options = this.mergeOptions(options);
    }
    
    try {
      this.container = this.getContainerElement(this.options.container);
      if (!this.container) throw new Error('Container element not found');
      
      this.destroy();
      
      const watermarkElement = this.createWatermarkElement();
      
      if (this.options.container === null || this.options.container === 'body') {
        this.container.appendChild(watermarkElement);
      } else {
        const containerStyle = window.getComputedStyle(this.container);
        if (containerStyle.position === 'static') {
          this.container.style.position = 'relative';
        }
        this.container.appendChild(watermarkElement);
      }
      
      this.setupMutationObserver();
      this.setupResizeObserver();
      this.setupParentObserver();
      this.startWatermarkCheck();
    } catch (error) {
      console.error('[Watermark] Init failed:', error);
    }
  }

  setupMutationObserver() {
    if (this.mutationObserver) this.mutationObserver.disconnect();
    if (!this.container || !this.watermarkElement) return;
    
    this.mutationObserver = new MutationObserver((mutations) => this.handleMutation(mutations));
    this.mutationObserver.observe(this.container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  setupResizeObserver() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (!this.container) return;
    
    this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries));
    this.resizeObserver.observe(this.container);
  }

  setupParentObserver() {
    if (this.parentObserver) this.parentObserver.disconnect();
    if (!this.container || this.container === document.body) return;
    
    this.parentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const removedNodes = Array.from(mutation.removedNodes);
          if (removedNodes.includes(this.container)) {
            console.warn('[Watermark] Container removed, attempting to restore');
            this.observerRetryCount = 0;
            this.recoverWatermark();
          }
        }
      });
    });
    
    const parent = this.container.parentElement;
    if (parent) {
      this.parentObserver.observe(parent, { childList: true });
    }
  }

  handleMutation(mutations) {
    let needsRecovery = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removedNodes = Array.from(mutation.removedNodes);
        removedNodes.forEach((node) => {
          if (node === this.watermarkElement || (node.contains && node.contains(this.watermarkElement))) {
            needsRecovery = true;
          }
        });
        if (this.watermarkElement && this.watermarkElement.parentNode !== this.container) {
          needsRecovery = true;
        }
      }
      if (mutation.type === 'attributes' && mutation.target === this.watermarkElement) {
        needsRecovery = true;
      }
    });
    if (needsRecovery) this.recoverWatermark();
  }

  buildPaddedBackground() {
    const { gap, width, height } = this.options;

    const gapX = Array.isArray(gap) ? gap[0] : 80;
    const gapY = Array.isArray(gap) ? gap[1] : 40;
    const dpr = window.devicePixelRatio || 1;

    const imageWidth = this.canvas ? this.canvas.width / dpr : width || 100;
    const imageHeight = this.canvas ? this.canvas.height / dpr : height || 100;

    const paddedWidth = imageWidth + gapX;
    const paddedHeight = imageHeight + gapY;

    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = paddedWidth * dpr;
    paddedCanvas.height = paddedHeight * dpr;

    const pctx = paddedCanvas.getContext('2d');
    pctx.scale(dpr, dpr);
    pctx.drawImage(this.canvas, 0, 0, imageWidth, imageHeight);

    this.canvas = paddedCanvas;
    this.base64DataUrl = paddedCanvas.toDataURL();

    return {
      dataUrl: this.base64DataUrl,
      paddedWidth,
      paddedHeight
    };
  }

  handleResize(entries) {
    if (this.watermarkElement && this.container) {
      this.generateWatermark();
      const { dataUrl, paddedWidth, paddedHeight } = this.buildPaddedBackground();
      this.watermarkElement.style.backgroundImage = `url(${dataUrl})`;
      this.watermarkElement.style.backgroundSize = `${paddedWidth}px ${paddedHeight}px`;
    }
  }

  recoverWatermark() {
    if (this.observerRetryCount >= this.observerMaxRetry) {
      console.warn('[Watermark] Max retry attempts reached');
      return;
    }
    this.observerRetryCount++;
    
    if (!this.container) {
      try {
        this.container = this.getContainerElement(this.options.container);
      } catch (error) {
        console.error('[Watermark] Cannot recover container:', error);
        return;
      }
    }
    if (!this.container) return;
    
    if (this.watermarkElement && this.watermarkElement.parentNode) {
      this.watermarkElement.parentNode.removeChild(this.watermarkElement);
    }
    
    const watermarkElement = this.createWatermarkElement();
    this.container.appendChild(watermarkElement);
    
    this.setupMutationObserver();
    this.setupParentObserver();
  }

  startWatermarkCheck() {
    if (this.checkTimer) clearInterval(this.checkTimer);
    this.checkTimer = setInterval(() => this.checkWatermarkPresence(), 2000);
  }

  checkWatermarkPresence() {
    if (!this.container) return;
    const existingWatermark = document.getElementById(this.instanceId);
    if (!existingWatermark || existingWatermark.parentNode !== this.container) {
      this.recoverWatermark();
    }
  }

  update(options) {
    const currentContainer = this.options.container;
    this.options = this.mergeOptions(options);
    this.options.container = currentContainer;
    this.destroy();
    this.init(null);
  }

  destroy() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.parentObserver) {
      this.parentObserver.disconnect();
      this.parentObserver = null;
    }
    if (this.watermarkElement && this.watermarkElement.parentNode) {
      this.watermarkElement.parentNode.removeChild(this.watermarkElement);
    }
    this.watermarkElement = null;
    this.canvas = null;
    this.base64DataUrl = '';
    this.observerRetryCount = 0;
  }

  getOptions() {
    return { ...this.options };
  }

  getContainer() {
    return this.container;
  }
}

export default Watermark;
