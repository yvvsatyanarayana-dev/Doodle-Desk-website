/**
 * Doodle Desk — Hero Interactive Sketchy Canvas Playground
 * Authentic hand-drawn vector physics & procedural sketchy rendering
 */

(function () {
  const canvas = document.getElementById('hero-doodle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let currentTool = 'draw';
  let currentColor = document.documentElement.getAttribute('data-theme') === 'light' ? '#09090b' : '#f4f4f5';
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let points = [];
  let elements = [];

  // Resize canvas to match display container with HiDPI support
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    redrawCanvas();
  }

  window.addEventListener('resize', resizeCanvas);

  // Sketchy line generator with double-pass jitter
  function drawSketchyLine(ctx, x1, y1, x2, y2, color, roughness = 1.2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const passes = 2;
    for (let p = 0; p < passes; p++) {
      const overshoot = (Math.random() - 0.5) * 4 * roughness;
      const bow = (Math.random() - 0.5) * 3 * roughness;
      const midX = (x1 + x2) / 2 + (-dy / len) * bow;
      const midY = (y1 + y2) / 2 + (dx / len) * bow;

      ctx.beginPath();
      ctx.moveTo(x1 - (dx / len) * overshoot, y1 - (dy / len) * overshoot);
      ctx.quadraticCurveTo(midX, midY, x2 + (dx / len) * overshoot, y2 + (dy / len) * overshoot);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Sketchy polygon renderer
  function drawSketchyPolygon(ctx, vertices, color, fill = null) {
    if (!vertices || vertices.length < 2) return;

    if (fill && fill !== 'transparent') {
      ctx.save();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(vertices[0][0], vertices[0][1]);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i][0], vertices[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const len = vertices.length;
    for (let i = 0; i < len; i++) {
      const p0 = vertices[i];
      const p1 = vertices[(i + 1) % len];
      drawSketchyLine(ctx, p0[0], p0[1], p1[0], p1[1], color);
    }
  }

  // Draw sketchy rectangle
  function drawSketchyRect(ctx, x, y, w, h, color, fill = null) {
    const vertices = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ];
    drawSketchyPolygon(ctx, vertices, color, fill);
  }

  // Draw sketchy diamond
  function drawSketchyDiamond(ctx, x, y, w, h, color, fill = null) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const vertices = [
      [cx, y],
      [x + w, cy],
      [cx, y + h],
      [x, cy],
    ];
    drawSketchyPolygon(ctx, vertices, color, fill);
  }

  // Draw sketchy triangle
  function drawSketchyTriangle(ctx, x, y, w, h, color, fill = null) {
    const cx = x + w / 2;
    const vertices = [
      [cx, y],
      [x + w, y + h],
      [x, y + h],
    ];
    drawSketchyPolygon(ctx, vertices, color, fill);
  }

  // Draw sketchy star
  function drawSketchyStar(ctx, x, y, w, h, color, fill = null) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const outerRx = Math.abs(w) / 2;
    const outerRy = Math.abs(h) / 2;
    const innerRx = outerRx * 0.45;
    const innerRy = outerRy * 0.45;
    const vertices = [];
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / points;
      const isOuter = i % 2 === 0;
      const rx = isOuter ? outerRx : innerRx;
      const ry = isOuter ? outerRy : innerRy;
      vertices.push([cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry]);
    }
    drawSketchyPolygon(ctx, vertices, color, fill);
  }

  // Draw sketchy ellipse
  function drawSketchyEllipse(ctx, x, y, w, h, color, fill = null) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = Math.abs(w) / 2;
    const ry = Math.abs(h) / 2;

    ctx.save();
    if (fill && fill !== 'transparent') {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;

    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      const steps = 36;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const jx = (Math.random() - 0.5) * 1.8;
        const jy = (Math.random() - 0.5) * 1.8;
        const px = cx + Math.cos(a) * rx + jx;
        const py = cy + Math.sin(a) * ry + jy;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw sketchy arrow
  function drawSketchyArrow(ctx, x1, y1, x2, y2, color) {
    drawSketchyLine(ctx, x1, y1, x2, y2, color);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 14;
    const a1 = angle - Math.PI / 6;
    const a2 = angle + Math.PI / 6;
    drawSketchyLine(ctx, x2, y2, x2 - headLen * Math.cos(a1), y2 - headLen * Math.sin(a1), color);
    drawSketchyLine(ctx, x2, y2, x2 - headLen * Math.cos(a2), y2 - headLen * Math.sin(a2), color);
  }

  // Draw sticky note
  function drawStickyNote(ctx, x, y, w, h, text = 'Note') {
    drawSketchyRect(ctx, x, y, w, h, '#ca8a04', '#fef08a');
    ctx.save();
    ctx.fillStyle = '#713f12';
    ctx.font = '15px "Caveat", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.restore();
  }

  // Redraw all elements
  function redrawCanvas() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    elements.forEach((el) => {
      switch (el.type) {
        case 'draw': {
          if (!el.points || el.points.length < 2) break;
          ctx.save();
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(el.points[0][0], el.points[0][1]);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i][0], el.points[i][1]);
          }
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'rectangle':
          drawSketchyRect(ctx, el.x, el.y, el.w, el.h, el.color, el.fill);
          break;
        case 'ellipse':
          drawSketchyEllipse(ctx, el.x, el.y, el.w, el.h, el.color, el.fill);
          break;
        case 'diamond':
          drawSketchyDiamond(ctx, el.x, el.y, el.w, el.h, el.color, el.fill);
          break;
        case 'triangle':
          drawSketchyTriangle(ctx, el.x, el.y, el.w, el.h, el.color, el.fill);
          break;
        case 'star':
          drawSketchyStar(ctx, el.x, el.y, el.w, el.h, el.color, el.fill);
          break;
        case 'arrow':
          drawSketchyArrow(ctx, el.x, el.y, el.x + el.w, el.y + el.h, el.color);
          break;
        case 'sticky':
          drawStickyNote(ctx, el.x, el.y, el.w, el.h, el.text);
          break;
        case 'text':
          ctx.save();
          ctx.fillStyle = el.color;
          ctx.font = '16px "Caveat", "Inter", sans-serif';
          ctx.fillText(el.text, el.x, el.y);
          ctx.restore();
          break;
      }
    });
  }

  // Mouse / Pointer Event Handling
  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId);
    [startX, startY] = getCoords(e);

    if (window.doodleAudio) {
      window.doodleAudio.playPencilScratch(0.06);
    }

    if (currentTool === 'draw') {
      points = [[startX, startY]];
    } else if (currentTool === 'sticky') {
      elements.push({
        type: 'sticky',
        x: startX - 55,
        y: startY - 45,
        w: 110,
        h: 90,
        text: 'Quick Idea',
      });
      isDrawing = false;
      redrawCanvas();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const [currentX, currentY] = getCoords(e);

    if (currentTool === 'draw') {
      points.push([currentX, currentY]);
      redrawCanvas();
      ctx.save();
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
      ctx.restore();
    } else {
      redrawCanvas();
      const w = currentX - startX;
      const h = currentY - startY;

      switch (currentTool) {
        case 'rectangle':
          drawSketchyRect(ctx, startX, startY, w, h, currentColor);
          break;
        case 'ellipse':
          drawSketchyEllipse(ctx, startX, startY, w, h, currentColor);
          break;
        case 'diamond':
          drawSketchyDiamond(ctx, startX, startY, w, h, currentColor);
          break;
        case 'triangle':
          drawSketchyTriangle(ctx, startX, startY, w, h, currentColor);
          break;
        case 'star':
          drawSketchyStar(ctx, startX, startY, w, h, currentColor);
          break;
        case 'arrow':
          drawSketchyArrow(ctx, startX, startY, currentX, currentY, currentColor);
          break;
      }
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    const [endX, endY] = getCoords(e);
    const w = endX - startX;
    const h = endY - startY;

    if (currentTool === 'draw' && points.length > 1) {
      elements.push({
        type: 'draw',
        points: [...points],
        color: currentColor,
      });
    } else if (Math.abs(w) > 5 || Math.abs(h) > 5) {
      elements.push({
        type: currentTool,
        x: startX,
        y: startY,
        w,
        h,
        color: currentColor,
        fill: 'rgba(255, 255, 255, 0.04)',
      });
    }
    redrawCanvas();
  });

  // Toolbar button listeners
  document.querySelectorAll('[data-demo-tool]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-demo-tool]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.dataset.demoTool;
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.04);
    });
  });

  // Preset Demonstrations
  function loadPreset(name) {
    elements = [];
    const rect = canvas.getBoundingClientRect();
    const w = rect.width > 200 ? rect.width : (canvas.parentElement ? canvas.parentElement.clientWidth || 1100 : 1100);
    const h = rect.height > 200 ? rect.height : 580;
    const cx = w / 2;
    const cy = h / 2;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const mainColor = isLight ? '#09090b' : '#f4f4f5';

    if (name === 'architecture') {
      // 3-Tier Architecture Preset
      elements = [
        { type: 'rectangle', x: cx - 280, y: cy - 40, w: 120, h: 80, color: mainColor, fill: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255, 255, 255, 0.05)' },
        { type: 'text', x: cx - 250, y: cy + 5, text: 'Client App', color: mainColor },

        { type: 'arrow', x: cx - 160, y: cy, w: 60, h: 0, color: '#f59e0b' },

        { type: 'diamond', x: cx - 90, y: cy - 50, w: 130, h: 100, color: '#06b6d4', fill: 'rgba(6, 182, 212, 0.06)' },
        { type: 'text', x: cx - 65, y: cy + 5, text: 'API Gateway', color: '#06b6d4' },

        { type: 'arrow', x: cx + 40, y: cy, w: 60, h: 0, color: '#f59e0b' },

        { type: 'ellipse', x: cx + 110, y: cy - 45, w: 130, h: 90, color: '#10b981', fill: 'rgba(16, 185, 129, 0.06)' },
        { type: 'text', x: cx + 145, y: cy + 5, text: 'Database', color: '#10b981' },

        { type: 'sticky', x: cx - 70, y: cy + 80, w: 140, h: 80, text: 'Local-First Sync' },
      ];
    } else if (name === 'flowchart') {
      // Flowchart preset
      elements = [
        { type: 'ellipse', x: cx - 70, y: cy - 140, w: 140, h: 60, color: '#10b981', fill: 'rgba(16, 185, 129, 0.08)' },
        { type: 'text', x: cx - 35, y: cy - 105, text: 'Start Flow', color: '#10b981' },

        { type: 'arrow', x: cx, y: cy - 80, w: 0, h: 45, color: '#a1a1aa' },

        { type: 'diamond', x: cx - 75, y: cy - 35, w: 150, h: 90, color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.08)' },
        { type: 'text', x: cx - 40, y: cy + 12, text: 'Is Valid ?', color: '#f59e0b' },

        { type: 'arrow', x: cx + 75, y: cy + 10, w: 60, h: 0, color: '#a1a1aa' },
        { type: 'rectangle', x: cx + 140, y: cy - 25, w: 120, h: 70, color: '#f43f5e', fill: 'rgba(244, 63, 94, 0.08)' },
        { type: 'text', x: cx + 170, y: cy + 15, text: 'Retry', color: '#f43f5e' },

        { type: 'arrow', x: cx, y: cy + 55, w: 0, h: 45, color: '#a1a1aa' },
        { type: 'rectangle', x: cx - 70, y: cy + 100, w: 140, h: 65, color: '#06b6d4', fill: 'rgba(6, 182, 212, 0.08)' },
        { type: 'text', x: cx - 35, y: cy + 138, text: 'Success!', color: '#06b6d4' },
      ];
    } else if (name === 'shapes') {
      // All Geometric Shapes Showcase
      elements = [
        { type: 'triangle', x: cx - 250, y: cy - 80, w: 90, h: 80, color: mainColor },
        { type: 'star', x: cx - 130, y: cy - 80, w: 85, h: 85, color: '#f59e0b' },
        { type: 'diamond', x: cx - 10, y: cy - 80, w: 90, h: 80, color: '#06b6d4' },
        { type: 'ellipse', x: cx + 110, y: cy - 80, w: 90, h: 80, color: '#10b981' },
        { type: 'rectangle', x: cx - 190, y: cy + 30, w: 110, h: 75, color: '#a855f7' },
        { type: 'sticky', x: cx - 30, y: cy + 25, w: 130, h: 90, text: 'All Shapes Native!' },
        { type: 'arrow', x: cx + 130, y: cy + 60, w: 80, h: -30, color: mainColor },
      ];
    }

    if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.12);
    redrawCanvas();
  }

  document.querySelectorAll('[data-hero-mode]').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.heroMode === 'interactive') {
        setTimeout(() => {
          resizeCanvas();
          loadPreset('architecture');
        }, 50);
      }
    });
  });

  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      loadPreset(btn.dataset.preset);
    });
  });

  const clearBtn = document.getElementById('clear-canvas-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      elements = [];
      redrawCanvas();
    });
  }

  window.addEventListener('themedirty', () => {
    currentColor = document.documentElement.getAttribute('data-theme') === 'light' ? '#09090b' : '#f4f4f5';
    elements.forEach((el) => {
      if (el.color === '#f4f4f5' || el.color === '#09090b') {
        el.color = currentColor;
      }
    });
    redrawCanvas();
  });

  // Initial setup: load architecture preset as welcome graphic
  setTimeout(() => {
    resizeCanvas();
    loadPreset('architecture');
  }, 100);
})();
