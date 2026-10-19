/**
 * Doodle Desk — Official Website Interactive Engine
 * Linear/Raycast-grade micro-interactions, procedural physics sandbox,
 * real-time audio FFT visualizer, sandboxed code runner, and keyboard HUD simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Mouse-Follow Spotlight Glow for Cards
  // ==========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    let rect = null;
    let cardRaf = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (cardRaf) cancelAnimationFrame(cardRaf);
      cardRaf = requestAnimationFrame(() => {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      if (cardRaf) cancelAnimationFrame(cardRaf);
    });
  });

  // ==========================================================================
  // Mobile Navigation Drawer Toggle
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-download-btn');

  function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-nav-locked');
    if (window.doodleAudio) window.doodleAudio.playKeyClick();
  }

  function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-nav-locked');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileNav);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileNav);
  }
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
  }
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // ==========================================================================
  // 2. Terminal Package Manager Command Bar & Copy
  // ==========================================================================
  const pkgCommands = {
    winget: 'winget install DoodleDesk',
    scoop: 'scoop install doodle-desk',
    brew: 'brew install --cask doodle-desk',
    bash: 'curl -fsSL https://doodledesk.dev/install.sh | sh',
  };

  const pkgTabs = document.querySelectorAll('[data-pkg-tab]');
  const cmdText = document.getElementById('terminal-command-text');
  const copyBtn = document.getElementById('copy-cmd-btn');
  const copyLabel = document.getElementById('copy-cmd-label');

  pkgTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      pkgTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const pkg = tab.dataset.pkgTab;
      if (cmdText && pkgCommands[pkg]) {
        cmdText.textContent = pkgCommands[pkg];
      }
      if (window.doodleAudio) window.doodleAudio.playKeyClick();
    });
  });

  if (copyBtn && cmdText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(cmdText.textContent.trim());
        copyLabel.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--doodle-emerald)';
        copyBtn.style.color = 'var(--doodle-emerald)';
        if (window.doodleAudio) window.doodleAudio.playKeyClick();

        setTimeout(() => {
          copyLabel.textContent = 'Copy';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch {
        // Fallback
      }
    });
  }

  const heroCopyBtn = document.getElementById('hero-copy-btn');
  const heroCmdCode = document.getElementById('hero-cmd-code');
  const heroCopyLabel = document.getElementById('hero-copy-label');
  if (heroCopyBtn && heroCmdCode) {
    heroCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(heroCmdCode.textContent.trim());
        if (heroCopyLabel) heroCopyLabel.textContent = 'Copied!';
        heroCopyBtn.style.borderColor = 'var(--doodle-emerald)';
        heroCopyBtn.style.color = 'var(--doodle-emerald)';
        if (window.doodleAudio) window.doodleAudio.playKeyClick();

        setTimeout(() => {
          if (heroCopyLabel) heroCopyLabel.textContent = 'Copy';
          heroCopyBtn.style.borderColor = '';
          heroCopyBtn.style.color = '';
        }, 2000);
      } catch {}
    });
  }

  // ==========================================================================
  // 3. Hero View Switcher (Studio Screenshot vs Interactive Canvas)
  // ==========================================================================
  const heroTabs = document.querySelectorAll('[data-hero-mode]');
  const screenshotView = document.getElementById('hero-screenshot-view');
  const interactiveView = document.getElementById('hero-interactive-view');

  heroTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.heroMode;
      heroTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (mode === 'screenshot') {
        screenshotView.style.display = 'block';
        interactiveView.classList.remove('active');
      } else {
        screenshotView.style.display = 'none';
        interactiveView.classList.add('active');
        window.dispatchEvent(new Event('resize'));
      }

      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.04);
    });
  });

  // ==========================================================================
  // 4. Interactive Napkin-to-Vector Split Slider
  // ==========================================================================
  const sliderContainer = document.getElementById('napkin-slider');
  const sliderDivider = document.getElementById('slider-divider');
  const vectorLayer = document.getElementById('layer-vector');

  if (sliderContainer && sliderDivider && vectorLayer) {
    let isDraggingSlider = false;

    function updateSlider(clientX) {
      const rect = sliderContainer.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));

      sliderDivider.style.left = `${percent}%`;
      vectorLayer.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    }

    sliderDivider.addEventListener('pointerdown', (e) => {
      isDraggingSlider = true;
      sliderDivider.setPointerCapture(e.pointerId);
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.03);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingSlider) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('pointerup', () => {
      isDraggingSlider = false;
    });

    sliderContainer.addEventListener('pointerdown', (e) => {
      updateSlider(e.clientX);
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.03);
    });
  }

  // ==========================================================================
  // 5. Bento 1: Geometric Shapes Previewer & Bound Text Engine
  // ==========================================================================
  const shapeCanvas = document.getElementById('bento-shape-canvas');
  const shapeInput = document.getElementById('shape-bound-input');
  const shapeBtns = document.querySelectorAll('.shape-btn');
  const swatchDots = document.querySelectorAll('.swatch-dot');
  let currentBentoShape = 'cylinder';
  let currentShapeColor = '#06b6d4';

  if (shapeCanvas) {
    const sCtx = shapeCanvas.getContext('2d');

    function renderBentoShape() {
      const w = shapeCanvas.width;
      const h = shapeCanvas.height;
      sCtx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 6;
      const text = shapeInput ? shapeInput.value : '';

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      sCtx.save();
      sCtx.strokeStyle = currentShapeColor;
      sCtx.fillStyle = currentShapeColor + '18';
      sCtx.lineWidth = 2.2;
      sCtx.lineCap = 'round';
      sCtx.lineJoin = 'round';

      switch (currentBentoShape) {
        case 'cylinder':
          // DB Cylinder
          sCtx.beginPath();
          sCtx.ellipse(cx, cy - 35, 75, 20, 0, 0, Math.PI * 2);
          sCtx.fill();
          sCtx.stroke();
          sCtx.beginPath();
          sCtx.rect(cx - 75, cy - 35, 150, 65);
          sCtx.fill();
          sCtx.stroke();
          sCtx.beginPath();
          sCtx.ellipse(cx, cy + 30, 75, 20, 0, 0, Math.PI);
          sCtx.stroke();
          // Hachures
          sCtx.strokeStyle = currentShapeColor + '60';
          sCtx.lineWidth = 1.2;
          for (let i = -50; i <= 50; i += 22) {
            sCtx.beginPath();
            sCtx.moveTo(cx + i - 8, cy - 10);
            sCtx.lineTo(cx + i + 8, cy + 20);
            sCtx.stroke();
          }
          break;

        case 'star':
          sCtx.beginPath();
          for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 === 0 ? 55 : 26;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (i === 0) sCtx.moveTo(px, py);
            else sCtx.lineTo(px, py);
          }
          sCtx.closePath();
          sCtx.fill();
          sCtx.stroke();
          break;

        case 'diamond':
          sCtx.beginPath();
          sCtx.moveTo(cx, cy - 50);
          sCtx.lineTo(cx + 80, cy);
          sCtx.lineTo(cx, cy + 50);
          sCtx.lineTo(cx - 80, cy);
          sCtx.closePath();
          sCtx.fill();
          sCtx.stroke();
          break;

        case 'hexagon':
          sCtx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const px = cx + Math.cos(a) * 58;
            const py = cy + Math.sin(a) * 58;
            if (i === 0) sCtx.moveTo(px, py);
            else sCtx.lineTo(px, py);
          }
          sCtx.closePath();
          sCtx.fill();
          sCtx.stroke();
          break;

        case 'triangle':
          sCtx.beginPath();
          sCtx.moveTo(cx, cy - 50);
          sCtx.lineTo(cx + 70, cy + 45);
          sCtx.lineTo(cx - 70, cy + 45);
          sCtx.closePath();
          sCtx.fill();
          sCtx.stroke();
          break;

        case 'cloud':
          sCtx.beginPath();
          sCtx.arc(cx - 40, cy, 30, Math.PI * 0.5, Math.PI * 1.5);
          sCtx.arc(cx - 15, cy - 30, 32, Math.PI * 1.0, Math.PI * 2.0);
          sCtx.arc(cx + 35, cy - 15, 30, Math.PI * 1.3, Math.PI * 0.2);
          sCtx.arc(cx + 40, cy + 15, 25, Math.PI * 1.8, Math.PI * 0.5);
          sCtx.closePath();
          sCtx.fill();
          sCtx.stroke();
          break;
      }

      // Bound Centered Text
      if (text) {
        sCtx.fillStyle = isLight ? '#09090b' : '#ffffff';
        sCtx.font = '600 13px "JetBrains Mono", monospace';
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillText(text, cx, cy);
      }

      sCtx.restore();
    }

    renderBentoShape();
    window.addEventListener('themedirty', renderBentoShape);

    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentBentoShape = btn.dataset.shape;
        renderBentoShape();
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
      });
    });

    swatchDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        swatchDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        currentShapeColor = dot.dataset.shapeColor;
        renderBentoShape();
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
      });
    });

    if (shapeInput) {
      shapeInput.addEventListener('input', () => {
        renderBentoShape();
      });
    }
  }

  // ==========================================================================
  // 6. Bento 2: 3D Flashcard Flip
  // ==========================================================================
  const flashcardStage = document.getElementById('flashcard-stage');
  if (flashcardStage) {
    flashcardStage.addEventListener('click', () => {
      flashcardStage.classList.toggle('flipped');
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.05);
    });
  }

  // ==========================================================================
  // 7. Bento 3: Synthesized Audio Engine & Real-Time FFT Waveform
  // ==========================================================================
  const rainBtn = document.getElementById('sound-rain');
  const lofiBtn = document.getElementById('sound-lofi');
  const whiteNoiseBtn = document.getElementById('sound-whitenoise');
  const visualizerCanvas = document.getElementById('audio-visualizer-canvas');
  const visualizerStatus = document.getElementById('visualizer-status');

  if (rainBtn) {
    rainBtn.addEventListener('click', () => {
      if (!window.doodleAudio) return;
      window.doodleAudio.toggleRain((isPlaying) => {
        rainBtn.classList.toggle('playing', isPlaying);
        const lbl = rainBtn.querySelector('.sound-status');
        if (lbl) lbl.textContent = isPlaying ? 'Playing' : 'Off';
      });
    });
  }

  if (lofiBtn) {
    lofiBtn.addEventListener('click', () => {
      if (!window.doodleAudio) return;
      window.doodleAudio.toggleLoFi((isPlaying) => {
        lofiBtn.classList.toggle('playing', isPlaying);
        const lbl = lofiBtn.querySelector('.sound-status');
        if (lbl) lbl.textContent = isPlaying ? 'Playing' : 'Off';
      });
    });
  }

  if (whiteNoiseBtn) {
    whiteNoiseBtn.addEventListener('click', () => {
      if (!window.doodleAudio) return;
      window.doodleAudio.toggleWhiteNoise((isPlaying) => {
        whiteNoiseBtn.classList.toggle('playing', isPlaying);
        const lbl = whiteNoiseBtn.querySelector('.sound-status');
        if (lbl) lbl.textContent = isPlaying ? 'Playing' : 'Off';
      });
    });
  }

  // Real-Time Audio Spectrum Canvas Loop
  if (visualizerCanvas) {
    const vCtx = visualizerCanvas.getContext('2d');
    let idleAngle = 0;

    function renderAudioVisualizer() {
      const w = visualizerCanvas.width;
      const h = visualizerCanvas.height;
      vCtx.clearRect(0, 0, w, h);

      const isPlaying = window.doodleAudio && window.doodleAudio.isAnyPlaying();
      const freqData = window.doodleAudio ? window.doodleAudio.getFrequencyData() : null;

      if (isPlaying && freqData) {
        if (visualizerStatus) visualizerStatus.textContent = 'Live Audio Synthesizer Active • 44.1 kHz';
        const barCount = 28;
        const barWidth = (w / barCount) - 3;

        for (let i = 0; i < barCount; i++) {
          const val = freqData[i * 2] || 0;
          const barHeight = Math.max(4, (val / 255) * h * 0.9);
          const x = i * (barWidth + 3) + 2;
          const y = h - barHeight;

          const grad = vCtx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(1, '#10b981');

          vCtx.fillStyle = grad;
          vCtx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        if (visualizerStatus) visualizerStatus.textContent = 'Idling • Click any sound below to start';
        // Calm idle sine wave
        vCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        vCtx.lineWidth = 1.5;
        vCtx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.04 + idleAngle) * 5;
          if (x === 0) vCtx.moveTo(x, y);
          else vCtx.lineTo(x, y);
        }
        vCtx.stroke();
        idleAngle += 0.04;
      }

      if (isVisualizerVisible) {
        requestAnimationFrame(renderAudioVisualizer);
      }
    }

    let isVisualizerVisible = false;
    const visualizerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wasVisible = isVisualizerVisible;
        isVisualizerVisible = entry.isIntersecting;
        if (isVisualizerVisible && !wasVisible) {
          requestAnimationFrame(renderAudioVisualizer);
        }
      });
    }, { threshold: 0.05 });
    visualizerObserver.observe(visualizerCanvas);
  }

  // ==========================================================================
  // 8. Bento 4: Executable JS Code Scratchpad
  // ==========================================================================
  const runCodeBtn = document.getElementById('run-code-btn');
  const codeEditor = document.getElementById('code-ide-editor');
  const codeOutput = document.getElementById('ide-console-output');

  if (runCodeBtn && codeEditor && codeOutput) {
    runCodeBtn.addEventListener('click', () => {
      const code = codeEditor.value;
      const logs = [];
      const customConsole = {
        log: (...args) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '));
        },
      };

      const start = performance.now();
      try {
        const fn = new Function('console', code);
        fn(customConsole);
        const elapsed = (performance.now() - start).toFixed(2);
        codeOutput.style.color = 'var(--doodle-emerald)';
        codeOutput.textContent = logs.length > 0
          ? `Output: ${logs.join(' | ')} (${elapsed}ms)`
          : `Executed successfully in ${elapsed}ms`;
      } catch (err) {
        codeOutput.style.color = '#ef4444';
        codeOutput.textContent = `Error: ${err.message}`;
      }

      if (window.doodleAudio) window.doodleAudio.playKeyClick();
    });

    const idePresets = {
      latency: `// Doodle Desk Sandboxed Runtime\nconst nodes = ['Gateway', 'Auth', 'Postgres'];\nconst latency = nodes.map(n => ({ node: n, ping: Math.floor(Math.random() * 8 + 2) + 'ms' }));\nconsole.log(latency);`,
      geom: `// Procedural Jitter & Bounds Calculation\nconst box = { x: 120, y: 80, w: 200, h: 140 };\nconst jitter = Array.from({length: 4}, () => +(Math.random() * 3 - 1.5).toFixed(2));\nconsole.log({ perimeter: 2 * (box.w + box.h), jitterOffsets: jitter });`,
      auth: `// Client JWT Token Verification Simulation\nconst token = { sub: 'usr_9941a', role: 'architect', exp: Date.now() + 3600000 };\nconst isValid = token.exp > Date.now();\nconsole.log({ user: token.sub, authorized: isValid, permissions: ['canvas:read', 'canvas:write'] });`
    };

    const idePresetPills = document.querySelectorAll('[data-ide-preset]');
    idePresetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        idePresetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const presetKey = pill.dataset.idePreset;
        if (idePresets[presetKey]) {
          codeEditor.value = idePresets[presetKey];
          runCodeBtn.click();
        }
      });
    });
  }

  // ==========================================================================
  // 9. Bento 5: Muscle-Memory Keyboard Shortcut HUD Simulator
  // ==========================================================================
  const keycaps = document.querySelectorAll('.keycap');
  const toolNameOutput = document.getElementById('active-key-name');

  function triggerKey(keyChar) {
    const targetKey = keyChar.toLowerCase();
    keycaps.forEach((cap) => {
      const capKey = cap.dataset.key.toLowerCase();
      if (capKey === targetKey) {
        cap.classList.add('pressed');
        if (toolNameOutput) toolNameOutput.textContent = cap.dataset.tool;
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
        setTimeout(() => cap.classList.remove('pressed'), 200);
      }
    });
  }

  keycaps.forEach((cap) => {
    cap.addEventListener('click', () => {
      const tool = cap.dataset.tool;
      if (toolNameOutput) toolNameOutput.textContent = tool;
      cap.classList.add('pressed');
      if (window.doodleAudio) window.doodleAudio.playKeyClick();
      setTimeout(() => cap.classList.remove('pressed'), 200);
    });
  });

  window.addEventListener('keydown', (e) => {
    // Only capture if not focused in inputs
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    const key = e.key.toLowerCase();
    if (['v', 'r', 'd', 'o', 'a', 'p'].includes(key)) {
      triggerKey(key);
    }
  });

  // ==========================================================================
  // 10. 2D Physics Drafting Table Sandbox
  // ==========================================================================
  const physicsCanvas = document.getElementById('physics-canvas');
  if (physicsCanvas) {
    const pCtx = physicsCanvas.getContext('2d');
    let pWidth = 0;
    let pHeight = 0;

    function resizePhysicsCanvas() {
      const rect = physicsCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      physicsCanvas.width = rect.width * dpr;
      physicsCanvas.height = rect.height * dpr;
      pWidth = rect.width;
      pHeight = rect.height;
      pCtx.scale(dpr, dpr);

      // Clamp any bodies outside viewport on resize
      if (bodies && bodies.length) {
        bodies.forEach((b, idx) => {
          const half = b.size / 2;
          if (b.x + half > pWidth - 10) {
            b.x = Math.max(half + 10, (pWidth / (bodies.length + 1)) * (idx + 1));
            b.vx = 0;
          }
        });
      }
    }

    const isMobileScreen = window.innerWidth <= 600;
    const initialWidth = physicsCanvas.getBoundingClientRect().width || (isMobileScreen ? 340 : 800);

    let bodies = [
      { type: 'triangle', x: initialWidth * 0.15, y: 70, vx: -0.2, vy: 0, size: isMobileScreen ? 32 : 40, color: '#f59e0b', label: 'Triangle' },
      { type: 'star', x: initialWidth * 0.35, y: 50, vx: 0.1, vy: 1, size: isMobileScreen ? 34 : 42, color: '#f43f5e', label: isMobileScreen ? 'Star' : 'Star (5-pt)' },
      { type: 'cylinder', x: initialWidth * 0.55, y: 40, vx: -0.1, vy: 2, size: isMobileScreen ? 36 : 46, color: '#06b6d4', label: isMobileScreen ? 'Postgres' : 'PostgreSQL' },
      { type: 'hexagon', x: initialWidth * 0.75, y: 70, vx: 0.2, vy: 0, size: isMobileScreen ? 32 : 40, color: '#10b981', label: 'Hexagon' },
      { type: 'box', x: initialWidth * 0.88, y: 60, vx: -0.1, vy: -1, size: isMobileScreen ? 34 : 44, color: '#a855f7', label: isMobileScreen ? 'Gateway' : 'API Gateway' },
    ];

    resizePhysicsCanvas();
    window.addEventListener('resize', resizePhysicsCanvas);

    let draggedBody = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isZeroGravity = false;

    const gravityVal = 0.38;
    const friction = 0.985;
    const bounce = -0.72;

    function updatePhysics() {
      pCtx.clearRect(0, 0, pWidth, pHeight);

      // Elastic Body-to-Body Separation so shapes never overlap into a messy pile
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = Math.max((b1.size + b2.size) * 0.85, 96);
          if (dist < minDist && dist > 0) {
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            if (b1 !== draggedBody) {
              b1.x -= nx * overlap;
              b1.y -= ny * overlap;
              b1.vx -= nx * 0.35;
            }
            if (b2 !== draggedBody) {
              b2.x += nx * overlap;
              b2.y += ny * overlap;
              b2.vx += nx * 0.35;
            }
          }
        }
      }

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      bodies.forEach((b) => {
        if (b !== draggedBody) {
          if (!isZeroGravity) {
            b.vy += gravityVal;
          }
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= friction;
          b.vy *= friction;

          // Floor collision with margin for labels
          const half = b.size / 2;
          const floorLimit = pHeight - half - 26;
          if (b.y > floorLimit) {
            b.y = floorLimit;
            b.vy *= bounce;
            if (Math.abs(b.vy) < 0.2) b.vy = 0;
          }

          // Ceiling collision
          if (b.y - half < 20) {
            b.y = 20 + half;
            b.vy *= bounce;
          }

          // Wall collision
          if (b.x - half < 0) {
            b.x = half;
            b.vx *= bounce;
          } else if (b.x + half > pWidth) {
            b.x = pWidth - half;
            b.vx *= bounce;
          }
        }

        // Draw Sketchy Rigid Body
        pCtx.save();
        pCtx.translate(b.x, b.y);
        pCtx.strokeStyle = b.color;
        pCtx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)';
        pCtx.lineWidth = 2.2;
        pCtx.lineCap = 'round';
        pCtx.lineJoin = 'round';

        const s = b.size;
        switch (b.type) {
          case 'triangle':
            pCtx.beginPath();
            pCtx.moveTo(0, -s / 2);
            pCtx.lineTo(s / 2, s / 2);
            pCtx.lineTo(-s / 2, s / 2);
            pCtx.closePath();
            pCtx.fill();
            pCtx.stroke();
            break;
          case 'star':
            pCtx.beginPath();
            for (let i = 0; i < 10; i++) {
              const a = -Math.PI / 2 + (i * Math.PI) / 5;
              const r = i % 2 === 0 ? s / 2 : s / 4;
              const px = Math.cos(a) * r;
              const py = Math.sin(a) * r;
              if (i === 0) pCtx.moveTo(px, py);
              else pCtx.lineTo(px, py);
            }
            pCtx.closePath();
            pCtx.fill();
            pCtx.stroke();
            break;
          case 'cylinder':
            pCtx.beginPath();
            pCtx.ellipse(0, -s / 3, s / 2, s / 5, 0, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.rect(-s / 2, -s / 3, s, s * 0.7);
            pCtx.fill();
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.ellipse(0, s / 3, s / 2, s / 5, 0, 0, Math.PI);
            pCtx.stroke();
            break;
          case 'hexagon':
            pCtx.beginPath();
            for (let i = 0; i < 6; i++) {
              const a = (i * Math.PI) / 3;
              const px = Math.cos(a) * (s / 2);
              const py = Math.sin(a) * (s / 2);
              if (i === 0) pCtx.moveTo(px, py);
              else pCtx.lineTo(px, py);
            }
            pCtx.closePath();
            pCtx.fill();
            pCtx.stroke();
            break;
          default:
            pCtx.strokeRect(-s / 2, -s / 2, s, s);
            pCtx.fillRect(-s / 2, -s / 2, s, s);
            break;
        }

        // Shape label with adaptive theme contrast
        pCtx.fillStyle = isLight ? '#09090b' : '#f4f4f5';
        pCtx.font = '600 11px "JetBrains Mono", monospace';
        pCtx.textAlign = 'center';
        pCtx.textBaseline = 'middle';
        pCtx.fillText(b.label, 0, s / 2 + 14);

        pCtx.restore();
      });

      if (isPhysicsVisible) {
        requestAnimationFrame(updatePhysics);
      }
    }

    let isPhysicsVisible = false;
    let lastTime = performance.now();
    const physicsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wasVisible = isPhysicsVisible;
        isPhysicsVisible = entry.isIntersecting;
        if (isPhysicsVisible && !wasVisible) {
          lastTime = performance.now();
          requestAnimationFrame(updatePhysics);
        }
      });
    }, { threshold: 0.05 });
    physicsObserver.observe(physicsCanvas);

    function getPointerPos(e) {
      const rect = physicsCanvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }

    physicsCanvas.addEventListener('pointerdown', (e) => {
      const [px, py] = getPointerPos(e);
      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i];
        const dist = Math.hypot(px - b.x, py - b.y);
        if (dist <= b.size) {
          draggedBody = b;
          dragOffsetX = b.x - px;
          dragOffsetY = b.y - py;
          b.vx = 0;
          b.vy = 0;
          physicsCanvas.setPointerCapture(e.pointerId);
          if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.06);
          break;
        }
      }
    });

    physicsCanvas.addEventListener('pointermove', (e) => {
      if (!draggedBody) return;
      const [px, py] = getPointerPos(e);
      const prevX = draggedBody.x;
      const prevY = draggedBody.y;

      draggedBody.x = px + dragOffsetX;
      draggedBody.y = py + dragOffsetY;

      draggedBody.vx = (draggedBody.x - prevX) * 0.7;
      draggedBody.vy = (draggedBody.y - prevY) * 0.7;
    });

    physicsCanvas.addEventListener('pointerup', () => {
      draggedBody = null;
    });

    // Radial blast explosion
    const blastBtn = document.getElementById('physics-blast-btn');
    if (blastBtn) {
      blastBtn.addEventListener('click', () => {
        bodies.forEach((b) => {
          b.vy = -12 - Math.random() * 8;
          b.vx = (Math.random() - 0.5) * 18;
        });
        if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.12);
      });
    }

    // Toggle zero gravity
    const gravityBtn = document.getElementById('physics-gravity-btn');
    if (gravityBtn) {
      gravityBtn.addEventListener('click', () => {
        isZeroGravity = !isZeroGravity;
        gravityBtn.classList.toggle('primary', isZeroGravity);
        const lbl = gravityBtn.querySelector('#gravity-btn-label') || gravityBtn.querySelector('span');
        if (lbl) {
          lbl.textContent = isZeroGravity ? 'Zero Gravity: ON' : 'Toggle Zero Gravity';
        }
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
      });
    }

    // Reset bodies
    const resetPhysicsBtn = document.getElementById('physics-reset-btn');
    if (resetPhysicsBtn) {
      resetPhysicsBtn.addEventListener('click', () => {
        bodies = [
          { type: 'triangle', x: 130, y: 70, vx: -0.2, vy: 0, size: 40, color: '#f59e0b', label: 'Triangle' },
          { type: 'star', x: 310, y: 50, vx: 0.1, vy: 1, size: 42, color: '#f43f5e', label: 'Star (5-pt)' },
          { type: 'cylinder', x: 490, y: 40, vx: -0.1, vy: 2, size: 46, color: '#06b6d4', label: 'PostgreSQL' },
          { type: 'hexagon', x: 670, y: 70, vx: 0.2, vy: 0, size: 40, color: '#10b981', label: 'Hexagon' },
          { type: 'box', x: 850, y: 60, vx: -0.1, vy: -1, size: 44, color: '#a855f7', label: 'API Gateway' },
        ];
        if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.08);
      });
    }
  }

  // ==========================================================================
  // 11. FAQ Accordion
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach((i) => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
        if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.03);
      });
    }
  });

  // ==========================================================================
  // 12. Raycast-Grade Command Palette (<kbd>Ctrl+K</kbd>)
  // ==========================================================================
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const openShortcutsBtns = document.querySelectorAll('[data-open-shortcuts]');
  const closeShortcutsBtn = document.getElementById('close-shortcuts-modal');
  const paletteInput = document.getElementById('palette-search-input');
  const paletteTabs = document.querySelectorAll('[data-palette-view]');
  const commandsView = document.getElementById('palette-commands-view');
  const shortcutsView = document.getElementById('palette-shortcuts-view');
  const paletteItems = document.querySelectorAll('.palette-item');
  const paletteResultCount = document.getElementById('palette-result-count');

  let activeIndex = 0;

  function getVisibleItems() {
    return Array.from(paletteItems).filter((item) => item.style.display !== 'none');
  }

  function updateActivePaletteItem() {
    const visible = getVisibleItems();
    paletteItems.forEach((it) => it.classList.remove('active'));
    if (visible.length > 0) {
      if (activeIndex >= visible.length) activeIndex = 0;
      if (activeIndex < 0) activeIndex = visible.length - 1;
      visible[activeIndex]?.classList.add('active');
      visible[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
    if (paletteResultCount) {
      paletteResultCount.textContent = `${visible.length} actions`;
    }
  }

  function filterPalette(query) {
    const q = query.toLowerCase().trim();
    paletteItems.forEach((item) => {
      const title = item.querySelector('.palette-title')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.palette-desc')?.textContent.toLowerCase() || '';
      const keywords = item.dataset.keywords?.toLowerCase() || '';
      const match = !q || title.includes(q) || desc.includes(q) || keywords.includes(q);
      item.style.display = match ? 'flex' : 'none';
    });

    document.querySelectorAll('.palette-section-label').forEach((lbl) => {
      lbl.style.display = q ? 'none' : 'block';
    });

    activeIndex = 0;
    updateActivePaletteItem();
  }

  if (paletteInput) {
    paletteInput.addEventListener('input', (e) => {
      filterPalette(e.target.value);
    });
  }

  paletteTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      paletteTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.paletteView;
      if (view === 'commands') {
        if (commandsView) commandsView.style.display = 'block';
        if (shortcutsView) shortcutsView.style.display = 'none';
        if (paletteInput) paletteInput.focus();
      } else {
        if (commandsView) commandsView.style.display = 'none';
        if (shortcutsView) shortcutsView.style.display = 'grid';
      }
      if (window.doodleAudio) window.doodleAudio.playKeyClick();
    });
  });

  function executePaletteAction(action) {
    closeModal();
    if (window.doodleAudio) window.doodleAudio.playKeyClick();

    switch (action) {
      case 'toggle-theme': {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
        break;
      }
      case 'download-app':
      case 'download-windows': {
        const heroBtn = document.getElementById('hero-download-btn');
        if (heroBtn && heroBtn.href && !heroBtn.href.startsWith('#')) {
          window.location.href = heroBtn.href;
        } else {
          const dl = document.getElementById('download');
          if (dl) dl.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'copy-winget': {
        const copyBtn = document.getElementById('hero-copy-btn');
        if (copyBtn) copyBtn.click();
        break;
      }
      case 'toggle-rain': {
        const rainBtn = document.getElementById('sound-rain');
        if (rainBtn) rainBtn.click();
        break;
      }
      case 'toggle-lofi': {
        const lofiBtn = document.getElementById('sound-lofi');
        if (lofiBtn) lofiBtn.click();
        break;
      }
      case 'jump-scanner': {
        const el = document.getElementById('scanner');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'jump-3d': {
        const el = document.getElementById('architecture-3d');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'jump-physics': {
        const el = document.getElementById('physics');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'jump-security': {
        const el = document.getElementById('security-audit');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'jump-comparison': {
        const el = document.getElementById('comparison');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  paletteItems.forEach((item) => {
    item.addEventListener('click', () => {
      const act = item.dataset.action;
      if (act) executePaletteAction(act);
    });
  });

  function openModal() {
    if (shortcutsModal) {
      shortcutsModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (paletteInput) {
        paletteInput.value = '';
        filterPalette('');
        setTimeout(() => paletteInput.focus(), 60);
      }
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.04);
    }
  }

  function closeModal() {
    if (shortcutsModal) {
      shortcutsModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openShortcutsBtns.forEach((btn) => btn.addEventListener('click', openModal));
  if (closeShortcutsBtn) closeShortcutsBtn.addEventListener('click', closeModal);

  if (shortcutsModal) {
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (shortcutsModal?.classList.contains('open')) {
        closeModal();
      } else {
        openModal();
      }
      return;
    }

    if (!shortcutsModal?.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible.length > 0) {
        activeIndex = (activeIndex + 1) % visible.length;
        updateActivePaletteItem();
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible.length > 0) {
        activeIndex = (activeIndex - 1 + visible.length) % visible.length;
        updateActivePaletteItem();
        if (window.doodleAudio) window.doodleAudio.playKeyClick();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible[activeIndex]) {
        const act = visible[activeIndex].dataset.action;
        if (act) executePaletteAction(act);
      }
    }
  });

  // ==========================================================================
  // 13. Dark / Light Theme Toggle with Persistence
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('doodle_site_theme') || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('doodle_site_theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to Paper Light' : 'Switch to Engineering Dark');
    }
    window.dispatchEvent(new CustomEvent('themedirty', { detail: { theme } }));
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.04);
    });
  }

  // ==========================================================================
  // 14. Hero 3D Perspective Tilt with Dynamic Specular Sheen
  // ==========================================================================
  const heroContainer = document.querySelector('.hero-showcase-container');
  const heroChassis = document.querySelector('.hero-device-chassis');

  if (heroContainer && heroChassis) {
    let heroRaf = null;
    let heroRect = null;

    heroContainer.addEventListener('mouseenter', () => {
      heroRect = heroContainer.getBoundingClientRect();
    });

    heroContainer.addEventListener('mousemove', (e) => {
      if (!heroRect) heroRect = heroContainer.getBoundingClientRect();
      const x = e.clientX - heroRect.left;
      const y = e.clientY - heroRect.top;

      const centerX = heroRect.width / 2;
      const centerY = heroRect.height / 2;

      // Calculate tilt angles (clamped to max 5.5deg)
      const rotateX = Math.max(-5.5, Math.min(5.5, ((centerY - y) / centerY) * 5.5));
      const rotateY = Math.max(-5.5, Math.min(5.5, ((x - centerX) / centerX) * 5.5));

      if (heroRaf) cancelAnimationFrame(heroRaf);
      heroRaf = requestAnimationFrame(() => {
        heroChassis.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        heroChassis.style.setProperty('--sheen-x', `${x}px`);
        heroChassis.style.setProperty('--sheen-y', `${y}px`);
      });
    });

    heroContainer.addEventListener('mouseleave', () => {
      heroRect = null;
      if (heroRaf) cancelAnimationFrame(heroRaf);
      heroChassis.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  // ==========================================================================
  // 15. Cryptographic Hash Copy Buttons
  // ==========================================================================
  const hashButtons = document.querySelectorAll('.hash-copy-btn');
  hashButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const hash = btn.dataset.copyHash;
      if (!hash) return;

      try {
        await navigator.clipboard.writeText(hash);
        const origIcon = btn.innerHTML;
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.style.color = 'var(--doodle-emerald)';
        if (window.doodleAudio) window.doodleAudio.playKeyClick();

        setTimeout(() => {
          btn.innerHTML = origIcon;
          btn.style.color = '';
        }, 2000);
      } catch {}
    });
  });

  // ==========================================================================
  // 16. Dynamic OS Detection & GitHub Release Auto-Download Router
  // ==========================================================================
  (function initDownloadRouter() {
    const GITHUB_REPO = 'yvvsatyanarayana-dev/Doodle-Desk';
    const CURRENT_RELEASE = {
      tag: 'v1.0.2',
      version: '1.0.2',
      assets: {
        winSetup: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-Setup-1.0.2.exe',
        winPortable: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2.exe',
        macArmDmg: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2-arm64.dmg',
        macIntelDmg: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2.dmg',
        macArmZip: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2-arm64-mac.zip',
        macIntelZip: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2-mac.zip',
        linuxAppImage: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/Doodle-Desk-1.0.2.AppImage',
        linuxDeb: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/doodle-desk_1.0.2_amd64.deb',
        linuxRpm: 'https://github.com/yvvsatyanarayana-dev/Doodle-Desk/releases/download/v1.0.2/doodle-desk-1.0.2.x86_64.rpm',
      }
    };

    const ICONS = {
      windows: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h11.377v11.372H0zM12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zM12.623 12.623H24V24H12.623z"/></svg>`,
      mac: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z"/></svg>`,
      linux: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2c-3.314 0-6 2.686-6 6 0 1.25.38 2.41 1.033 3.376C5.59 12.22 4.5 13.98 4.5 16c0 2.76 2.24 5 5 5h5c2.76 0 5-2.24 5-5 0-2.02-1.09-3.78-2.533-4.624A5.965 5.965 0 0 0 18.001 8c0-3.314-2.686-6-6-6zm-1.75 6.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm3.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-1.75 3c1.2 0 2.17.67 2.17 1.5H9.83c0-.83.97-1.5 2.17-1.5z"/></svg>`
    };

    function detectClientOS() {
      const ua = (navigator.userAgent || '').toLowerCase();
      const platform = (navigator.platform || '').toLowerCase();
      const uaData = navigator.userAgentData;

      if (uaData && uaData.platform) {
        const p = uaData.platform.toLowerCase();
        if (p.includes('mac')) return 'mac';
        if (p.includes('linux') || p.includes('android')) return 'linux';
        if (p.includes('win')) return 'windows';
      }

      if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os x')) {
        return 'mac';
      }
      if (platform.includes('linux') || ua.includes('linux')) {
        return 'linux';
      }
      return 'windows';
    }

    const detectedOS = detectClientOS();

    function updateOSUI(os) {
      const heroBtn = document.getElementById('hero-download-btn');
      const heroIcon = document.getElementById('hero-btn-icon');
      const heroTitle = document.getElementById('hero-btn-title');
      const heroSub = document.getElementById('hero-btn-sub');
      const heroCmd = document.getElementById('hero-cmd-code');

      const dlHeroRibbon = document.getElementById('dl-hero-ribbon');
      const dlHeroArch = document.getElementById('dl-hero-arch');
      const dlDetectedText = document.getElementById('dl-detected-text');
      const dlHeroTitle = document.getElementById('dl-hero-title');
      const dlHeroDesc = document.getElementById('dl-hero-desc');
      const dlHeroPlatform = document.getElementById('dl-hero-platform');
      const dlHeroInstaller = document.getElementById('dl-hero-installer');
      const dlHeroSecurity = document.getElementById('dl-hero-security');
      const dlHeroBtn = document.getElementById('dl-hero-btn');
      const dlHeroBtnIcon = document.getElementById('dl-hero-btn-icon');
      const dlHeroBtnText = document.getElementById('dl-hero-btn-text');
      const dlHeroSubActions = document.getElementById('dl-hero-sub-actions');

      const paletteDlTitle = document.getElementById('palette-dl-title');
      const paletteDlDesc = document.getElementById('palette-dl-desc');

      if (os === 'mac') {
        if (heroBtn) heroBtn.href = CURRENT_RELEASE.assets.macArmDmg;
        if (heroIcon) heroIcon.innerHTML = ICONS.mac;
        if (heroTitle) heroTitle.textContent = 'Download for macOS';
        if (heroSub) heroSub.textContent = `${CURRENT_RELEASE.tag} • Apple Silicon & Intel .dmg`;
        if (heroCmd) heroCmd.textContent = 'brew install --cask doodle-desk';

        if (dlHeroRibbon) dlHeroRibbon.textContent = `Official Release ${CURRENT_RELEASE.tag} (macOS)`;
        if (dlHeroArch) dlHeroArch.textContent = 'Universal • M1/M2/M3/M4 & Intel';
        if (dlDetectedText) dlDetectedText.textContent = 'Detected: macOS';
        if (dlHeroTitle) dlHeroTitle.textContent = 'Doodle Desk for macOS';
        if (dlHeroDesc) dlHeroDesc.textContent = 'Native desktop architecture studio for macOS with hardware-accelerated canvas, Retina precision, and local file storage.';
        if (dlHeroPlatform) dlHeroPlatform.textContent = 'macOS 11.0 Big Sur or later';
        if (dlHeroInstaller) dlHeroInstaller.textContent = 'Apple Disk Image (.dmg)';
        if (dlHeroSecurity) dlHeroSecurity.textContent = 'Verified SHA256 • Clean';
        if (dlHeroBtn) dlHeroBtn.href = CURRENT_RELEASE.assets.macArmDmg;
        if (dlHeroBtnIcon) dlHeroBtnIcon.innerHTML = ICONS.mac;
        if (dlHeroBtnText) dlHeroBtnText.textContent = 'Download macOS Apple Silicon (.dmg)';
        if (dlHeroSubActions) {
          dlHeroSubActions.innerHTML = `
            <span>Intel Mac?</span>
            <a href="${CURRENT_RELEASE.assets.macIntelDmg}" title="Download Intel x64 DMG">Download Intel x64 (.dmg)</a>
            <span>•</span>
            <a href="${CURRENT_RELEASE.assets.macArmZip}" title="Download Portable Zip">Download .zip</a>
          `;
        }

        if (paletteDlTitle) paletteDlTitle.textContent = 'Download Doodle Desk for macOS (.dmg)';
        if (paletteDlDesc) paletteDlDesc.textContent = `Apple Silicon & Intel universal DMG (${CURRENT_RELEASE.tag})`;

        const brewTab = document.querySelector('[data-pkg-tab="brew"]');
        if (brewTab) brewTab.click();
      } else if (os === 'linux') {
        if (heroBtn) heroBtn.href = CURRENT_RELEASE.assets.linuxAppImage;
        if (heroIcon) heroIcon.innerHTML = ICONS.linux;
        if (heroTitle) heroTitle.textContent = 'Download for Linux';
        if (heroSub) heroSub.textContent = `${CURRENT_RELEASE.tag} • .AppImage / .deb • 134 MB`;
        if (heroCmd) heroCmd.textContent = 'sudo apt install ./doodle-desk_1.0.2_amd64.deb';

        if (dlHeroRibbon) dlHeroRibbon.textContent = `Official Release ${CURRENT_RELEASE.tag} (Linux)`;
        if (dlHeroArch) dlHeroArch.textContent = 'x86_64 / glibc 2.28+';
        if (dlDetectedText) dlDetectedText.textContent = 'Detected: Linux';
        if (dlHeroTitle) dlHeroTitle.textContent = 'Doodle Desk for Linux';
        if (dlHeroDesc) dlHeroDesc.textContent = 'Fast offline vector studio compatible with Debian, Ubuntu, Fedora, Arch Linux, and portable AppImage on all modern distributions.';
        if (dlHeroPlatform) dlHeroPlatform.textContent = 'Linux x86_64 / all distros';
        if (dlHeroInstaller) dlHeroInstaller.textContent = 'Universal AppImage (.AppImage)';
        if (dlHeroSecurity) dlHeroSecurity.textContent = 'Verified SHA256 • Clean';
        if (dlHeroBtn) dlHeroBtn.href = CURRENT_RELEASE.assets.linuxAppImage;
        if (dlHeroBtnIcon) dlHeroBtnIcon.innerHTML = ICONS.linux;
        if (dlHeroBtnText) dlHeroBtnText.textContent = 'Download Linux Universal (.AppImage)';
        if (dlHeroSubActions) {
          dlHeroSubActions.innerHTML = `
            <span>Debian / Ubuntu?</span>
            <a href="${CURRENT_RELEASE.assets.linuxDeb}" title="Download Debian package">Download .deb (99.1 MB)</a>
            <span>•</span>
            <span>Fedora / RHEL?</span>
            <a href="${CURRENT_RELEASE.assets.linuxRpm}" title="Download RedHat RPM">Download .rpm (86.6 MB)</a>
          `;
        }

        if (paletteDlTitle) paletteDlTitle.textContent = 'Download Doodle Desk for Linux (.AppImage)';
        if (paletteDlDesc) paletteDlDesc.textContent = `Universal Linux AppImage & .deb (${CURRENT_RELEASE.tag})`;

        const bashTab = document.querySelector('[data-pkg-tab="bash"]');
        if (bashTab) bashTab.click();
      } else {
        // Windows Default
        if (heroBtn) heroBtn.href = CURRENT_RELEASE.assets.winSetup;
        if (heroIcon) heroIcon.innerHTML = ICONS.windows;
        if (heroTitle) heroTitle.textContent = 'Download for Windows';
        if (heroSub) heroSub.textContent = `${CURRENT_RELEASE.tag} • .exe Installer • 86 MB`;
        if (heroCmd) heroCmd.textContent = 'winget install DoodleDesk';

        if (dlHeroRibbon) dlHeroRibbon.textContent = `Official Release ${CURRENT_RELEASE.tag}`;
        if (dlHeroArch) dlHeroArch.textContent = 'x64 / ARM64';
        if (dlDetectedText) dlDetectedText.textContent = 'Detected: Windows';
        if (dlHeroTitle) dlHeroTitle.textContent = 'Doodle Desk for Windows';
        if (dlHeroDesc) dlHeroDesc.textContent = 'Complete offline desktop suite with native .doodle file associations, hardware-accelerated canvas rendering, and zero background telemetry.';
        if (dlHeroPlatform) dlHeroPlatform.textContent = 'Windows 10 / 11 (64-bit)';
        if (dlHeroInstaller) dlHeroInstaller.textContent = 'Standalone NSIS (.exe)';
        if (dlHeroSecurity) dlHeroSecurity.textContent = 'Verified SHA256 • Clean';
        if (dlHeroBtn) dlHeroBtn.href = CURRENT_RELEASE.assets.winSetup;
        if (dlHeroBtnIcon) dlHeroBtnIcon.innerHTML = ICONS.windows;
        if (dlHeroBtnText) dlHeroBtnText.textContent = 'Download Windows Installer (.exe)';
        if (dlHeroSubActions) {
          dlHeroSubActions.innerHTML = `
            <span>Prefer portable?</span>
            <a href="${CURRENT_RELEASE.assets.winPortable}" title="Download Windows portable binary">Download Windows Portable (.exe)</a>
            <span>•</span>
            <a href="https://github.com/${GITHUB_REPO}/releases" target="_blank" rel="noopener noreferrer">All Checksums</a>
          `;
        }

        if (paletteDlTitle) paletteDlTitle.textContent = 'Download Doodle Desk for Windows (.exe)';
        if (paletteDlDesc) paletteDlDesc.textContent = `Standalone NSIS setup installer (${CURRENT_RELEASE.tag})`;

        const winTab = document.querySelector('[data-pkg-tab="winget"]');
        if (winTab) winTab.click();
      }
    }

    // Initialize with detected OS
    updateOSUI(detectedOS);

    // Interactive switcher for clicking "Also available for: Windows • macOS • Linux"
    document.querySelectorAll('[data-select-os]').forEach(link => {
      link.addEventListener('click', (e) => {
        const sel = link.dataset.selectOs;
        if (sel === 'windows-portable') {
          return;
        }
        if (sel && ['windows', 'mac', 'linux'].includes(sel)) {
          e.preventDefault();
          updateOSUI(sel);
          const dlSection = document.getElementById('download');
          if (dlSection) dlSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Evergreen GitHub Release Check (fetches latest release in background)
    try {
      fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, { cache: 'no-cache' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!data || !data.assets || !Array.isArray(data.assets)) return;
          const tag = data.tag_name || CURRENT_RELEASE.tag;
          CURRENT_RELEASE.tag = tag;
          CURRENT_RELEASE.version = tag.replace(/^v/, '');

          data.assets.forEach(asset => {
            const name = (asset.name || '').toLowerCase();
            const url = asset.browser_download_url;
            if (name.includes('setup') && name.endsWith('.exe')) {
              CURRENT_RELEASE.assets.winSetup = url;
            } else if (!name.includes('setup') && name.endsWith('.exe')) {
              CURRENT_RELEASE.assets.winPortable = url;
            } else if (name.includes('arm64') && name.endsWith('.dmg')) {
              CURRENT_RELEASE.assets.macArmDmg = url;
            } else if (!name.includes('arm64') && name.endsWith('.dmg')) {
              CURRENT_RELEASE.assets.macIntelDmg = url;
            } else if (name.includes('arm64') && name.endsWith('.zip')) {
              CURRENT_RELEASE.assets.macArmZip = url;
            } else if (!name.includes('arm64') && name.endsWith('.zip')) {
              CURRENT_RELEASE.assets.macIntelZip = url;
            } else if (name.endsWith('.appimage')) {
              CURRENT_RELEASE.assets.linuxAppImage = url;
            } else if (name.endsWith('.deb')) {
              CURRENT_RELEASE.assets.linuxDeb = url;
            } else if (name.endsWith('.rpm')) {
              CURRENT_RELEASE.assets.linuxRpm = url;
            }
          });

          // Re-render UI with latest assets
          updateOSUI(detectedOS);
        })
        .catch(() => {
          // Seamless fallback to bundled v1.0.2 assets
        });
    } catch {}
  })();
});
