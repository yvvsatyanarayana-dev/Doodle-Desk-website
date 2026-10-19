/**
 * Doodle Desk — Ultra-Smooth 120 FPS 3D Isometric Architecture Engine
 * High-performance decoupled rAF loop with inertial damping, GPU CSS custom properties,
 * zero layout thrashing, and native hardware acceleration.
 */

(function () {
  'use strict';

  // Preset Camera Angles
  const CAMERA_PRESETS = {
    architecture: { name: 'Multi-Tier Stack', pitch: 55, yaw: 30, spacing: 105 },
    isometric: { name: 'True Isometric', pitch: 60, yaw: 45, spacing: 90 },
    cinematic: { name: 'Cinematic Angle', pitch: 42, yaw: 20, spacing: 125 },
    top: { name: 'Top-Down 2D', pitch: 0, yaw: 0, spacing: 15 },
  };

  // 4 Architecture Tiers
  const TIERS = [
    {
      id: 3,
      name: 'Client & UI Layer',
      subtitle: 'React Web, iOS/Android, Desktop Studio',
      color: '#ec4899',
      order: 3,
    },
    {
      id: 2,
      name: 'API Gateway & Security',
      subtitle: 'Envoy Ingress, JWT Auth, GraphQL Federation',
      color: '#6366f1',
      order: 2,
    },
    {
      id: 1,
      name: 'Services & Compute',
      subtitle: 'Go Microservices, Search Engine, Kafka Mesh',
      color: '#06b6d4',
      order: 1,
    },
    {
      id: 0,
      name: 'Data & Storage',
      subtitle: 'PostgreSQL Primary, Redis Cache, S3 Buckets',
      color: '#10b981',
      order: 0,
    },
  ];

  // Standard column coordinates on 720x380 plate
  const COL1_X = 65;
  const COL2_X = 275;
  const COL3_X = 485;
  const NODE_Y = 160;
  const NODE_W = 170;
  const NODE_H = 60;

  // Architecture Nodes
  const NODES = [
    // Tier 3: Client
    {
      id: 'node-web',
      name: 'React 19 Web App',
      tier: 3,
      x: COL1_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#ec4899',
      protocol: 'HTTPS / TLS 1.3',
      latency: '0.8 ms',
      tech: 'Next.js 15 • Tailwind • WASM',
      desc: 'Local-first web dashboard with client-side canvas acceleration.',
    },
    {
      id: 'node-desktop',
      name: 'Doodle Desk Studio',
      tier: 3,
      x: COL2_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#f43f5e',
      protocol: 'Local IPC / 0ms',
      latency: '< 0.1 ms',
      tech: 'Electron 33 • Chromium • V8',
      desc: 'Native desktop application with offline file system access.',
    },
    {
      id: 'node-mobile',
      name: 'Mobile iOS / Android',
      tier: 3,
      x: COL3_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#ec4899',
      protocol: 'P2P WebRTC / HTTP3',
      latency: '1.2 ms',
      tech: 'Swift UI • Kotlin Jetpack',
      desc: 'Mobile stylus companion with live low-latency synchronization.',
    },

    // Tier 2: Gateway
    {
      id: 'node-envoy',
      name: 'Envoy Edge Proxy',
      tier: 2,
      x: COL1_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#6366f1',
      protocol: 'HTTP/2 • mTLS',
      latency: '0.4 ms',
      tech: 'Envoy v1.30 • Zero-Copy TCP',
      desc: 'L7 load balancing, DDoS mitigation, and certificate offloading.',
    },
    {
      id: 'node-auth',
      name: 'OAuth2 / JWT Gate',
      tier: 2,
      x: COL2_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#818cf8',
      protocol: 'Ed25519 Token Verify',
      latency: '0.2 ms',
      tech: 'Rust Core • JWKS Cache',
      desc: 'Stateless offline token verification with zero round-trip latency.',
    },
    {
      id: 'node-graphql',
      name: 'Federated Gateway',
      tier: 2,
      x: COL3_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#6366f1',
      protocol: 'GraphQL over gRPC',
      latency: '0.6 ms',
      tech: 'Apollo Federation • Protobuf',
      desc: 'Unified schema graph layer aggregating microservice schemas.',
    },

    // Tier 1: Compute
    {
      id: 'node-order',
      name: 'Core Sync Service',
      tier: 1,
      x: COL1_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#06b6d4',
      protocol: 'gRPC HTTP/2',
      latency: '0.5 ms',
      tech: 'Go 1.23 • Goroutines • CRDT',
      desc: 'Conflict-free replicated data types for atomic stroke merging.',
    },
    {
      id: 'node-eventbus',
      name: 'Kafka Event Mesh',
      tier: 1,
      x: COL2_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#0ea5e9',
      protocol: 'TCP Stream / Binary',
      latency: '0.9 ms',
      tech: 'Apache Kafka • 3-Node Raft',
      desc: 'High-throughput append-only log handling 50k canvas events/sec.',
    },
    {
      id: 'node-search',
      name: 'Vector & CV Engine',
      tier: 1,
      x: COL3_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#06b6d4',
      protocol: 'ONNX Runtime / CUDA',
      latency: '3.4 ms',
      tech: 'OpenCV • WebGL Accelerate',
      desc: 'Offline contour extraction converting napkin sketches to vectors.',
    },

    // Tier 0: Storage
    {
      id: 'node-pg',
      name: 'PostgreSQL 16 (WAL)',
      tier: 0,
      x: COL1_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#10b981',
      protocol: 'Postgres Binary Wire',
      latency: '0.3 ms',
      tech: 'Postgres 16 • NVMe SSD',
      desc: 'ACID transaction store with synchronous replication to standby.',
    },
    {
      id: 'node-redis',
      name: 'Redis 7.2 Cluster',
      tier: 0,
      x: COL2_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#34d399',
      protocol: 'RESP3 in-memory',
      latency: '0.1 ms',
      tech: 'Redis Sharded • Sub-ms',
      desc: 'Sub-millisecond presence sessions, locks, and room subscriptions.',
    },
    {
      id: 'node-s3',
      name: 'MinIO / S3 Store',
      tier: 0,
      x: COL3_X,
      y: NODE_Y,
      width: NODE_W,
      height: NODE_H,
      color: '#10b981',
      protocol: 'S3 API Signature v4',
      latency: '2.1 ms',
      tech: 'Erasure Coded • ZFS',
      desc: 'High-durability blob storage for high-res canvas image attachments.',
    },
  ];

  // 3D Risers (Vertical Guide Beams connecting straight down between tiers)
  const RISERS = [
    { from: 'node-web', to: 'node-envoy', color: '#fda4af' },
    { from: 'node-envoy', to: 'node-order', color: '#818cf8' },
    { from: 'node-order', to: 'node-pg', color: '#67e8f9' },

    { from: 'node-desktop', to: 'node-auth', color: '#f43f5e' },
    { from: 'node-auth', to: 'node-eventbus', color: '#818cf8' },
    { from: 'node-eventbus', to: 'node-redis', color: '#67e8f9' },

    { from: 'node-mobile', to: 'node-graphql', color: '#fda4af' },
    { from: 'node-graphql', to: 'node-search', color: '#818cf8' },
    { from: 'node-search', to: 'node-s3', color: '#67e8f9' },
  ];

  class IsometricArchitectureStudio {
    constructor(container) {
      this.container = container;
      this.stage = container.querySelector('.iso-3d-stage');
      this.viewport = container.querySelector('.iso-3d-viewport');
      this.nodeInfoCard = container.querySelector('.iso-node-details');

      // Pre-cached telemetry DOM elements
      this.pitchEl = container.querySelector('#iso-stat-pitch');
      this.yawEl = container.querySelector('#iso-stat-yaw');
      this.spacingEl = container.querySelector('#iso-stat-spacing');
      this.slider = container.querySelector('#iso-spacing-slider');

      // Camera State with Target Lerping for 120 FPS Butter
      this.currentPitch = 55;
      this.currentYaw = 30;
      this.targetPitch = 55;
      this.targetYaw = 30;
      this.elevationSpacing = 105;
      this.activePreset = 'architecture';

      this.isDragging = false;
      this.autoRotate = false;
      this.autoRotateDirection = 1;

      // 3D Scroll Story / Layer-by-Layer Assembly State
      this.revealedLayerCount = 4;
      this.isAutoTouring = false;
      this.tourInterval = null;
      this.wheelAccumulator = 0;
      this.lastWheelTime = 0;
      this.userInteractedWithStory = false;

      this.plateElements = [];
      this.nodeElements = [];
      this.riserElements = [];

      this.dragStart = { x: 0, y: 0, pitch: 55, yaw: 30 };
      this.selectedNodeId = 'node-desktop';
      this.needsForceRender = true;

      window.addEventListener('resize', () => {
        this.needsForceRender = true;
      });

      this.lastRenderedPitch = -999;
      this.lastRenderedYaw = -999;
      this.rafId = null;

      this.init();
    }

    init() {
      // Set initial CSS custom property on stage
      this.stage.style.setProperty('--elevation-spacing', `${this.elevationSpacing}px`);
      this.stage.style.setProperty('--riser-pulse-dist', `${this.elevationSpacing}px`);

      this.renderTiersAndNodes();
      this.bindEvents();
      this.selectNode(this.selectedNodeId);

      // Initialize all 4 tiers assembled
      this.setRevealedLayerCount(4, { playSound: false });

      // Start the decoupled rendering loop
      this.startLoop();
    }

    renderTiersAndNodes() {
      this.stage.innerHTML = '';
      this.plateElements = [];
      this.nodeElements = [];
      this.riserElements = [];

      // Base Ground Plate
      const ground = document.createElement('div');
      ground.className = 'iso-ground-plate';
      this.stage.appendChild(ground);

      // Render Tier Glass Floor Plates (positioned via calc(var(--tier-order) * var(--elevation-spacing)))
      TIERS.forEach((tier) => {
        const plate = document.createElement('div');
        plate.className = `iso-tier-plate iso-tier-plate-${tier.id}`;
        plate.dataset.tierOrder = tier.order;
        plate.style.setProperty('--tier-order', tier.order);
        plate.style.setProperty('--tier-color', tier.color);

        const badge = document.createElement('div');
        badge.className = 'iso-tier-badge';
        badge.innerHTML = `
          <span class="iso-tier-badge-dot" style="background: ${tier.color}"></span>
          <span class="iso-tier-badge-name">${tier.name}</span>
          <span class="iso-tier-badge-elevation">+${tier.order * this.elevationSpacing}px</span>
        `;
        plate.appendChild(badge);
        this.stage.appendChild(plate);
        this.plateElements.push(plate);
      });

      // Render 3D Vertical Guide Risers
      const nodeMap = new Map(NODES.map((n) => [n.id, n]));

      RISERS.forEach((r, idx) => {
        const src = nodeMap.get(r.from);
        const tgt = nodeMap.get(r.to);
        if (!src || !tgt) return;

        const srcX = src.x + src.width / 2;
        const srcY = src.y + src.height / 2;
        const minTier = Math.min(src.tier, tgt.tier);

        const riser = document.createElement('div');
        riser.className = 'iso-3d-riser-beam';
        riser.dataset.srcTier = src.tier;
        riser.dataset.tgtTier = tgt.tier;
        riser.style.left = `${srcX}px`;
        riser.style.top = `${srcY}px`;
        riser.style.height = `${this.elevationSpacing}px`;
        riser.style.transform = `translate3d(0, 0, ${minTier * this.elevationSpacing}px) rotateX(90deg)`;
        riser.style.background = `linear-gradient(to bottom, ${src.color}, ${tgt.color})`;

        const pulse = document.createElement('div');
        pulse.className = 'iso-riser-pulse';
        pulse.style.background = src.color;
        riser.appendChild(pulse);

        this.stage.appendChild(riser);
        this.riserElements.push({ element: riser, src, tgt, minTier });
      });

      // Render 3D Elevated Nodes
      NODES.forEach((node) => {
        const nodeEl = document.createElement('div');
        nodeEl.className = `iso-3d-node ${node.id === this.selectedNodeId ? 'is-selected' : ''}`;
        nodeEl.id = `iso-${node.id}`;
        nodeEl.dataset.nodeId = node.id;
        nodeEl.dataset.nodeTier = node.tier;
        nodeEl.style.setProperty('--node-tier', node.tier);
        nodeEl.style.setProperty('--node-color', node.color);

        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;
        nodeEl.style.width = `${node.width}px`;
        nodeEl.style.height = `${node.height}px`;

        nodeEl.innerHTML = `
          <div class="iso-node-side-shadow"></div>
          <div class="iso-node-body">
            <div class="iso-node-header">
              <span class="iso-node-dot" style="background: ${node.color}"></span>
              <span class="iso-node-title">${node.name}</span>
            </div>
            <div class="iso-node-meta">
              <span class="iso-node-proto">${node.protocol}</span>
              <span class="iso-node-ping">${node.latency}</span>
            </div>
          </div>
          <div class="iso-node-elevation-pill" style="background: ${node.color}">L${node.tier}</div>
        `;

        nodeEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectNode(node.id);
        });

        this.stage.appendChild(nodeEl);
        this.nodeElements.push(nodeEl);
      });
    }

    setRevealedLayerCount(count, { playSound = true } = {}) {
      const clamped = Math.max(1, Math.min(4, count));
      this.revealedLayerCount = clamped;

      // 1. Update Floor Plates
      if (this.plateElements) {
        this.plateElements.forEach((plate) => {
          const order = Number(plate.dataset.tierOrder);
          const isRevealed = order < clamped;
          const isTopActive = order === clamped - 1;

          plate.classList.toggle('is-unrevealed', !isRevealed);
          plate.classList.toggle('is-active-tier', isTopActive);
        });
      }

      // 2. Update Nodes
      if (this.nodeElements) {
        this.nodeElements.forEach((nodeEl) => {
          const tier = Number(nodeEl.dataset.nodeTier);
          const isRevealed = tier < clamped;
          nodeEl.classList.toggle('is-unrevealed', !isRevealed);
        });
      }

      // 3. Update Risers
      if (this.riserElements) {
        this.riserElements.forEach((r) => {
          const isVisible = r.src.tier < clamped && r.tgt.tier < clamped;
          r.element.classList.toggle('is-hidden', !isVisible);
        });
      }

      // 4. Update Scrubber UI (Chips & Buttons)
      const chips = this.container.querySelectorAll('.iso-tier-chip');
      chips.forEach((chip) => {
        const c = Number(chip.dataset.tierCount);
        chip.classList.toggle('active', c <= clamped);
        chip.classList.toggle('is-top', c === clamped);
      });

      const prevBtn = this.container.querySelector('#iso-step-prev');
      const nextBtn = this.container.querySelector('#iso-step-next');
      if (prevBtn) prevBtn.disabled = clamped <= 1;
      if (nextBtn) nextBtn.disabled = clamped >= 4;

      const allBtn = this.container.querySelector('#iso-all-btn');
      if (allBtn) {
        allBtn.textContent = clamped === 4 ? 'Base Only' : 'Show All';
      }

      // 5. Select active node if currently selected node is on hidden tier
      const selNode = NODES.find((n) => n.id === this.selectedNodeId);
      if (selNode && selNode.tier >= clamped) {
        const fallback = NODES.find((n) => n.tier === clamped - 1);
        if (fallback) this.selectNode(fallback.id);
      }

      if (playSound && window.doodleAudio) {
        window.doodleAudio.playKeyClick();
      }
    }

    startTour() {
      if (this.isAutoTouring) return;
      this.isAutoTouring = true;
      const tourBtn = this.container.querySelector('#iso-tour-btn');
      if (tourBtn) {
        tourBtn.classList.add('is-active');
        tourBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          <span>Pause</span>
        `;
      }

      this.tourInterval = setInterval(() => {
        const next = this.revealedLayerCount >= 4 ? 1 : this.revealedLayerCount + 1;
        this.setRevealedLayerCount(next, { playSound: false });
        this.targetYaw = (this.targetYaw + 2.5) % 65;
      }, 1900);
    }

    stopTour() {
      if (!this.isAutoTouring) return;
      this.isAutoTouring = false;
      if (this.tourInterval) {
        clearInterval(this.tourInterval);
        this.tourInterval = null;
      }
      const tourBtn = this.container.querySelector('#iso-tour-btn');
      if (tourBtn) {
        tourBtn.classList.remove('is-active');
        tourBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Auto Tour</span>
        `;
      }
    }

    toggleTour() {
      if (this.isAutoTouring) {
        this.stopTour();
      } else {
        this.startTour();
      }
    }

    scrollToTier(tierCount) {
      const clamped = Math.max(1, Math.min(4, tierCount));
      const track = document.getElementById('architecture-3d');
      if (!track) {
        this.setRevealedLayerCount(clamped);
        return;
      }

      const stickyTop = 68;
      const totalScrollable = track.offsetHeight - (window.innerHeight - stickyTop);
      const progressMap = { 1: 0.04, 2: 0.32, 3: 0.58, 4: 0.88 };
      const targetProgress = progressMap[clamped] ?? 0.04;
      const trackAbsoluteTop = track.getBoundingClientRect().top + window.scrollY;
      const targetY = trackAbsoluteTop - stickyTop + (targetProgress * totalScrollable);

      window.scrollTo({
        top: Math.round(targetY),
        behavior: 'smooth',
      });
      this.setRevealedLayerCount(clamped);
    }

    getResponsiveScale() {
      const w = window.innerWidth;
      if (w <= 360) return 0.38;
      if (w <= 420) return 0.44;
      if (w <= 640) return 0.52;
      if (w <= 768) return 0.62;
      if (w <= 1024) return 0.80;
      return 1.0;
    }

    startLoop() {
      const tick = () => {
        // Auto-Rotate handling
        if (this.autoRotate && !this.isDragging) {
          this.targetYaw += 0.22 * this.autoRotateDirection;
          if (this.targetYaw >= 60) this.autoRotateDirection = -1;
          if (this.targetYaw <= 10) this.autoRotateDirection = 1;
        }

        // Inertial Lerping
        const deltaYaw = this.targetYaw - this.currentYaw;
        const deltaPitch = this.targetPitch - this.currentPitch;

        if (this.isDragging) {
          // Instant tracking while pointer is down for razor-sharp response
          this.currentYaw += deltaYaw * 0.45;
          this.currentPitch += deltaPitch * 0.45;
        } else {
          // Smooth glide damping when releasing
          this.currentYaw += deltaYaw * 0.22;
          this.currentPitch += deltaPitch * 0.22;
        }

        // Only commit to DOM if moved beyond threshold or force render
        if (
          Math.abs(this.currentPitch - this.lastRenderedPitch) > 0.04 ||
          Math.abs(this.currentYaw - this.lastRenderedYaw) > 0.04 ||
          this.needsForceRender
        ) {
          this.needsForceRender = false;
          const scale = this.getResponsiveScale();
          const scaleStr = scale < 1.0 ? ` scale(${scale})` : '';
          const yOffset = window.innerWidth <= 768 ? '10px' : '40px';
          this.stage.style.transform = `translateY(${yOffset}) rotateX(${this.currentPitch.toFixed(2)}deg) rotateZ(${this.currentYaw.toFixed(2)}deg)${scaleStr}`;
          this.lastRenderedPitch = this.currentPitch;
          this.lastRenderedYaw = this.currentYaw;

          // Update telemetry text only when rounded int changes
          const rPitch = Math.round(this.currentPitch);
          const rYaw = Math.round(this.currentYaw);
          if (this.pitchEl && this.pitchEl.textContent !== `${rPitch}°`) this.pitchEl.textContent = `${rPitch}°`;
          if (this.yawEl && this.yawEl.textContent !== `${rYaw}°`) this.yawEl.textContent = `${rYaw}°`;
        }

        this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);
    }

    updateElevationSpacing(spacing) {
      this.elevationSpacing = spacing;

      // 1. Single GPU CSS custom property on stage updates ALL plates and nodes in hardware!
      this.stage.style.setProperty('--elevation-spacing', `${spacing}px`);
      this.stage.style.setProperty('--riser-pulse-dist', `${spacing}px`);

      // 2. Update risers transform
      if (this.riserElements) {
        for (let i = 0; i < this.riserElements.length; i++) {
          const r = this.riserElements[i];
          r.element.style.height = `${spacing}px`;
          r.element.style.transform = `translate3d(0, 0, ${r.minTier * spacing}px) rotateX(90deg)`;
        }
      }

      // 3. Update plate badges text
      const badges = this.stage.querySelectorAll('.iso-tier-badge-elevation');
      badges.forEach((b, idx) => {
        const tier = TIERS[idx];
        if (tier) b.textContent = `+${tier.order * spacing}px`;
      });

      if (this.spacingEl) this.spacingEl.textContent = `${spacing}px`;
    }

    applyPreset(presetKey) {
      const preset = CAMERA_PRESETS[presetKey];
      if (!preset) return;

      this.activePreset = presetKey;
      this.targetPitch = preset.pitch;
      this.targetYaw = preset.yaw;

      const presetButtons = this.container.querySelectorAll('[data-iso-preset]');
      presetButtons.forEach((b) => {
        b.classList.toggle('active', b.dataset.isoPreset === presetKey);
      });

      if (this.slider && this.elevationSpacing !== preset.spacing) {
        this.slider.value = preset.spacing;
        this.updateElevationSpacing(preset.spacing);
      }

      if (window.doodleAudio) window.doodleAudio.playKeyClick();
    }

    selectNode(nodeId) {
      this.selectedNodeId = nodeId;
      const allNodes = this.stage.querySelectorAll('.iso-3d-node');
      allNodes.forEach((n) => n.classList.remove('is-selected'));

      const activeEl = this.stage.querySelector(`#iso-${nodeId}`);
      if (activeEl) activeEl.classList.add('is-selected');

      const node = NODES.find((n) => n.id === nodeId);
      if (node && this.nodeInfoCard) {
        const titleEl = this.nodeInfoCard.querySelector('.iso-inspect-title');
        const tierEl = this.nodeInfoCard.querySelector('.iso-inspect-tier');
        const latencyEl = this.nodeInfoCard.querySelector('.iso-inspect-latency');
        const protocolEl = this.nodeInfoCard.querySelector('.iso-inspect-protocol');
        const techEl = this.nodeInfoCard.querySelector('.iso-inspect-tech');
        const descEl = this.nodeInfoCard.querySelector('.iso-inspect-desc');
        const dotEl = this.nodeInfoCard.querySelector('.iso-inspect-dot');

        if (titleEl) titleEl.textContent = node.name;
        if (tierEl) {
          tierEl.textContent = `Tier ${node.tier}: ${TIERS.find((t) => t.id === node.tier)?.name || 'Custom'}`;
          tierEl.style.color = node.color;
        }
        if (latencyEl) latencyEl.textContent = node.latency;
        if (protocolEl) protocolEl.textContent = node.protocol;
        if (techEl) techEl.textContent = node.tech;
        if (descEl) descEl.textContent = node.desc;
        if (dotEl) dotEl.style.background = node.color;
      }

      if (window.doodleAudio) window.doodleAudio.playPencilScratch(0.04);
    }

    bindEvents() {
      const viewport = this.viewport;
      if (!viewport) return;

      // Sticky Scrollytelling Progress Tracker:
      // Smoothly maps window scroll position along the sticky track to tiers 1..4.
      // Once all layers are assembled, natural page scrolling continues down or up!
      const updateScrollProgress = () => {
        if (this.isAutoTouring) return;
        const track = document.getElementById('architecture-3d');
        if (!track) return;

        const rect = track.getBoundingClientRect();
        const stickyTop = 68;
        const totalScrollable = track.offsetHeight - (window.innerHeight - stickyTop);
        if (totalScrollable <= 0) return;

        const currentScroll = stickyTop - rect.top;

        if (currentScroll <= 0) {
          // Above section or just entered: Base Foundation Tier (Data)
          if (this.revealedLayerCount !== 1) {
            this.setRevealedLayerCount(1, { playSound: false });
          }
        } else if (currentScroll >= totalScrollable) {
          // Bottom of track reached: All 4 tiers assembled, natural page scroll continues down!
          if (this.revealedLayerCount !== 4) {
            this.setRevealedLayerCount(4, { playSound: false });
          }
        } else {
          // Inside sticky track: progress 0.0 to 1.0
          const progress = currentScroll / totalScrollable;
          let targetCount = 1;
          if (progress >= 0.72) {
            targetCount = 4;
          } else if (progress >= 0.46) {
            targetCount = 3;
          } else if (progress >= 0.20) {
            targetCount = 2;
          } else {
            targetCount = 1;
          }

          if (targetCount !== this.revealedLayerCount) {
            this.setRevealedLayerCount(targetCount, { playSound: false });
          }
        }
      };

      let scrollTicking = false;
      window.addEventListener('scroll', () => {
        if (!scrollTicking) {
          requestAnimationFrame(() => {
            updateScrollProgress();
            scrollTicking = false;
          });
          scrollTicking = true;
        }
      }, { passive: true });

      // Check on load in case the page is already scrolled to this section
      setTimeout(updateScrollProgress, 120);

      // Scrubber Chips Click -> Smoothly glide page scroll to target tier
      const chips = this.container.querySelectorAll('.iso-tier-chip');
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          if (this.isAutoTouring) this.stopTour();
          this.scrollToTier(Number(chip.dataset.tierCount));
        });
      });

      // Scrubber Step Prev / Next
      const prevBtn = this.container.querySelector('#iso-step-prev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (this.isAutoTouring) this.stopTour();
          this.scrollToTier(this.revealedLayerCount - 1);
        });
      }

      const nextBtn = this.container.querySelector('#iso-step-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.isAutoTouring) this.stopTour();
          this.scrollToTier(this.revealedLayerCount + 1);
        });
      }

      // Auto Tour Button
      const tourBtn = this.container.querySelector('#iso-tour-btn');
      if (tourBtn) {
        tourBtn.addEventListener('click', () => {
          this.toggleTour();
        });
      }

      // Show All / Base Only Button
      const allBtn = this.container.querySelector('#iso-all-btn');
      if (allBtn) {
        allBtn.addEventListener('click', () => {
          if (this.isAutoTouring) this.stopTour();
          if (this.revealedLayerCount === 4) {
            this.scrollToTier(1);
          } else {
            this.scrollToTier(4);
          }
        });
      }

      // Keyboard shortcuts when focusing viewport
      viewport.addEventListener('keydown', (e) => {
        if (e.key === 'PageDown' || e.key === ']') {
          e.preventDefault();
          if (this.isAutoTouring) this.stopTour();
          this.scrollToTier(this.revealedLayerCount + 1);
        } else if (e.key === 'PageUp' || e.key === '[') {
          e.preventDefault();
          if (this.isAutoTouring) this.stopTour();
          this.scrollToTier(this.revealedLayerCount - 1);
        }
      });

      // Pointer Orbit Dragging with Zero-Stutter Inertial Handling
      viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.iso-controls-dock') || e.target.closest('.iso-node-details') || e.target.closest('.iso-story-scrubber')) return;

        if (this.isAutoTouring) this.stopTour();

        this.isDragging = true;
        this.stage.classList.add('is-dragging');

        this.dragStart = {
          x: e.clientX,
          y: e.clientY,
          pitch: this.currentPitch,
          yaw: this.currentYaw,
        };

        viewport.setPointerCapture(e.pointerId);
        viewport.style.cursor = 'grabbing';
      });

      viewport.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;

        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;

        // Update TARGET only — decouple from raw event frequency!
        this.targetYaw = Math.max(-15, Math.min(75, this.dragStart.yaw + dx * 0.35));
        this.targetPitch = Math.max(20, Math.min(75, this.dragStart.pitch - dy * 0.35));
      });

      const handlePointerUp = (e) => {
        if (this.isDragging) {
          this.isDragging = false;
          this.stage.classList.remove('is-dragging');
          viewport.style.cursor = 'grab';
          try {
            viewport.releasePointerCapture(e.pointerId);
          } catch {}
        }
      };

      viewport.addEventListener('pointerup', handlePointerUp);
      viewport.addEventListener('pointercancel', handlePointerUp);

      // Camera Presets Buttons
      const presetButtons = this.container.querySelectorAll('[data-iso-preset]');
      presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.applyPreset(btn.dataset.isoPreset);
        });
      });

      // Elevation Spacing Slider
      if (this.slider) {
        this.slider.addEventListener('input', (e) => {
          this.updateElevationSpacing(Number(e.target.value));
        });
      }

      // Auto-Rotate Button
      const autoRotateBtn = this.container.querySelector('#iso-auto-rotate-btn');
      if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
          this.autoRotate = !this.autoRotate;
          autoRotateBtn.classList.toggle('active', this.autoRotate);
          if (window.doodleAudio) window.doodleAudio.playKeyClick();
        });
      }

      // Reset View Button
      const resetBtn = this.container.querySelector('#iso-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.applyPreset('architecture');
        });
      }

      // Snapshot Download Button
      const snapshotBtn = this.container.querySelector('#iso-snapshot-btn');
      if (snapshotBtn) {
        snapshotBtn.addEventListener('click', () => {
          if (window.doodleAudio) window.doodleAudio.playKeyClick();
          const orig = snapshotBtn.innerHTML;
          snapshotBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>3D Snapshot Captured</span>
          `;
          snapshotBtn.style.borderColor = 'var(--doodle-emerald)';
          snapshotBtn.style.color = 'var(--doodle-emerald)';

          setTimeout(() => {
            snapshotBtn.innerHTML = orig;
            snapshotBtn.style.borderColor = '';
            snapshotBtn.style.color = '';
          }, 2400);
        });
      }
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('isometric-3d-studio');
    if (container) {
      window.doodle3DStudio = new IsometricArchitectureStudio(container);
    }
  });
})();
