(function () {
  'use strict';

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isCoarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  // ==================== TACTILE 3D CARD TILT (DESKTOP) ====================
  function initCardTilt() {
    if (prefersReducedMotion || isCoarsePointer) return;
    const canHover =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const attachTilt = (el, maxDeg) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';

      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-ny * maxDeg).toFixed(2);
        const ry = (nx * maxDeg).toFixed(2);
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    };

    document.querySelectorAll('.meta-chip').forEach((el) => attachTilt(el, 4.5));

    const cardsList = document.getElementById('location-cards');
    if (cardsList) {
      const bindCards = () => {
        cardsList.querySelectorAll('.loc-card').forEach((el) => attachTilt(el, 3.2));
      };
      bindCards();
      const observer = new MutationObserver(bindCards);
      observer.observe(cardsList, { childList: true });
    }
  }

  // ==================== THREE.JS 3D GRADUATION STAGE ====================
  function initHero3D() {
    const stage = document.getElementById('hero-3d-stage');
    const canvas = document.getElementById('hero-3d-canvas');
    const fallback = document.getElementById('hero-3d-fallback');
    if (!stage || !canvas || typeof window.THREE === 'undefined') return;

    const THREE = window.THREE;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (_) {
      return; // Leave graceful SVG fallback visible if WebGL is unavailable
    }

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0.35, 6.2);

    // Studio celebratory lighting
    const hemi = new THREE.HemisphereLight(0xfff7e6, 0x0b1a30, 1.05);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe7b3, 1.45);
    keyLight.position.set(4.5, 6, 5.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.85);
    rimLight.position.set(-4.5, -2.5, 3.5);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xf2b84b, 0.85, 14);
    warmFill.position.set(1.5, 1.5, 3);
    scene.add(warmFill);

    // Main Showcase Group
    const showcase = new THREE.Group();
    scene.add(showcase);

    // Materials
    const navyVelvetMat = new THREE.MeshStandardMaterial({
      color: 0x162f56,
      roughness: 0.48,
      metalness: 0.16
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0b1a30,
      roughness: 0.55,
      metalness: 0.2
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf4bd4f,
      roughness: 0.22,
      metalness: 0.82
    });
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xfdf8ec,
      roughness: 0.65,
      metalness: 0.04
    });
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.35,
      metalness: 0.25
    });

    // --- 1. 3D Graduation Cap ---
    const capGroup = new THREE.Group();
    capGroup.position.set(0.12, 0.22, 0);
    capGroup.rotation.set(0.24, -0.45, -0.1);
    showcase.add(capGroup);

    // Mortarboard square
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.085, 2.32), navyVelvetMat);
    board.position.y = 0.34;
    capGroup.add(board);

    // Subtle gold inner rim bevel under board
    const boardRim = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.025, 2.38), goldMat);
    boardRim.position.y = 0.295;
    capGroup.add(boardRim);

    // Skullcap dome
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 1.0, 0.66, 40), navyVelvetMat);
    crown.position.y = -0.02;
    capGroup.add(crown);

    // Gold headband torus
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.985, 0.032, 12, 48), goldMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.32;
    capGroup.add(band);

    // Bottom dark inner edge
    const innerBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.04, 32), darkTrimMat);
    innerBottom.position.y = -0.34;
    capGroup.add(innerBottom);

    // Center gold button
    const buttonMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 24), goldMat);
    buttonMesh.position.y = 0.41;
    capGroup.add(buttonMesh);

    // Tassel cord draped over right-front edge
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.42, 0),
      new THREE.Vector3(0.55, 0.43, 0.08),
      new THREE.Vector3(1.16, 0.40, 0.14),
      new THREE.Vector3(1.24, 0.25, 0.16)
    ]);
    const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 20, 0.025, 10, false), goldMat);
    capGroup.add(cordMesh);

    // Hanging tassel pivot (animated subtle sway)
    const tasselPivot = new THREE.Group();
    tasselPivot.position.set(1.24, 0.25, 0.16);
    capGroup.add(tasselPivot);

    const dropCord = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.42, 12), goldMat);
    dropCord.position.y = -0.21;
    tasselPivot.add(dropCord);

    const tasselKnot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.11, 16), goldMat);
    tasselKnot.position.y = -0.44;
    tasselPivot.add(tasselKnot);

    const tasselSkirt = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.42, 20), goldMat);
    tasselSkirt.position.y = -0.68;
    tasselPivot.add(tasselSkirt);

    // --- 2. Floating 3D Diploma Scroll ---
    const scrollGroup = new THREE.Group();
    scrollGroup.position.set(-0.98, -0.44, 0.42);
    scrollGroup.rotation.set(0.18, 0.35, 0.62);
    showcase.add(scrollGroup);

    const scrollBody = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 1.38, 28), paperMat);
    scrollBody.rotation.z = Math.PI / 2;
    scrollGroup.add(scrollBody);

    const scrollCore = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 1.4, 20), goldMat);
    scrollCore.rotation.z = Math.PI / 2;
    scrollGroup.add(scrollCore);

    const ribbonRing = new THREE.Mesh(new THREE.TorusGeometry(0.162, 0.032, 12, 32), ribbonMat);
    ribbonRing.rotation.y = Math.PI / 2;
    scrollGroup.add(ribbonRing);

    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.06), ribbonMat);
    tail1.position.set(-0.04, -0.24, 0.1);
    tail1.rotation.set(0.2, 0, -0.35);
    scrollGroup.add(tail1);

    const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.06), goldMat);
    tail2.position.set(0.04, -0.22, 0.12);
    tail2.rotation.set(0.25, 0, 0.32);
    scrollGroup.add(tail2);

    // --- 3. Ambient Floating 3D Sparkles & Confetti ---
    const palette = [0xf2b84b, 0x5eead4, 0xfef3c7, 0xf59e0b];
    const ambientCount = isMobile ? 24 : 46;
    const ambientPieces = [];
    const confettiGeo = new THREE.PlaneGeometry(0.09, 0.055);
    const starGeo = new THREE.OctahedronGeometry(0.042, 0);

    for (let i = 0; i < ambientCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.3,
        metalness: 0.65,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(i % 3 === 0 ? starGeo : confettiGeo, mat);
      const radius = 1.65 + Math.random() * 1.45;
      const angle = (i / ambientCount) * Math.PI * 2 + Math.random() * 0.5;
      const baseY = (Math.random() - 0.45) * 2.2;
      mesh.position.set(
        Math.cos(angle) * radius * 0.95,
        baseY,
        Math.sin(angle) * radius * 0.55 - 0.3
      );
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      scene.add(mesh);
      ambientPieces.push({
        mesh,
        baseY,
        angle,
        radius,
        speed: 0.18 + Math.random() * 0.3,
        bobAmp: 0.1 + Math.random() * 0.16,
        spinX: (Math.random() - 0.5) * 1.6,
        spinY: (Math.random() - 0.5) * 1.8
      });
    }

    // --- 4. Click/Tap Confetti Burst Pool ---
    const burstParticles = [];
    function spawnConfettiBurst() {
      if (prefersReducedMotion) return;
      const count = isMobile ? 22 : 38;
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: palette[i % palette.length],
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1
        });
        const mesh = new THREE.Mesh(confettiGeo, mat);
        mesh.position.set(0, 0.25, 0.2);
        const theta = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 2.6;
        const vy = 1.6 + Math.random() * 2.4;
        scene.add(mesh);
        burstParticles.push({
          mesh,
          vx: Math.cos(theta) * speed,
          vy,
          vz: (Math.random() - 0.5) * speed,
          rx: (Math.random() - 0.5) * 10,
          ry: (Math.random() - 0.5) * 10,
          life: 1.0
        });
      }
    }

    // --- Resize Handling ---
    function handleResize() {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      const compactHeight = rect.height < 260;
      camera.position.y = compactHeight ? 0.05 : 0.32;
      camera.position.z = compactHeight ? 6.9 : (camera.aspect < 1.0 ? 6.2 / Math.max(0.75, camera.aspect) : 6.1);
      camera.updateProjectionMatrix();

      const scale = rect.width < 320 ? 0.88 : (compactHeight ? 0.96 : 1.04);
      showcase.scale.setScalar(scale);
    }

    handleResize();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(handleResize);
      ro.observe(stage);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // --- Pointer Drag & Parallax Interaction ---
    let isDragging = false;
    let dragDist = 0;
    let lastX = 0;
    let lastY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let velY = 0;
    let velX = 0;
    let popBounce = 0;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;

    stage.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragDist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      stage.classList.add('is-dragging');
      if (stage.setPointerCapture) {
        try {
          stage.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragDist += Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      velY = dx * 0.011;
      velX = dy * 0.008;
      targetRotY += velY;
      targetRotX = Math.max(-0.55, Math.min(0.55, targetRotX + velX));
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-dragging');
      if (stage.releasePointerCapture && e && e.pointerId !== undefined) {
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
      if (dragDist < 7) {
        // Celebratory tap spin + confetti!
        velY += 0.14;
        popBounce = 0.24;
        spawnConfettiBurst();
      }
    };

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    const heroEl = stage.closest('.hero');
    if (heroEl && !isCoarsePointer) {
      heroEl.addEventListener('pointermove', (e) => {
        if (isDragging || e.pointerType !== 'mouse') return;
        const rect = heroEl.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointerOffsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.28;
        pointerOffsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.16;
      });
      heroEl.addEventListener('pointerleave', () => {
        pointerOffsetX = 0;
        pointerOffsetY = 0;
      });
    }

    // --- Animation Loop with Visibility + Viewport Pause ---
    let isVisible = true;
    let rafId = null;
    let lastTime = performance.now();
    let elapsed = 0;
    let markedReady = false;

    const renderFrame = (now) => {
      rafId = null;
      if (!isVisible || document.hidden) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!prefersReducedMotion) {
        elapsed += dt;
      }

      if (!isDragging) {
        targetRotY += velY;
        targetRotX = Math.max(-0.55, Math.min(0.55, targetRotX + velX));
        velY *= 0.93;
        velX *= 0.93;
        if (!prefersReducedMotion) {
          targetRotY += dt * 0.22; // gentle continuous showroom turn
        }
        targetRotX *= 0.985;
      }

      currentRotY += (targetRotY + pointerOffsetX - currentRotY) * 0.1;
      currentRotX += (targetRotX + pointerOffsetY - currentRotX) * 0.1;
      popBounce *= 0.9;

      showcase.rotation.y = currentRotY;
      showcase.rotation.x = currentRotX;
      showcase.position.y = (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.6) * 0.11) + popBounce;

      // Subtle tassel sway and scroll counter-bob
      tasselPivot.rotation.z = prefersReducedMotion ? 0.05 : Math.sin(elapsed * 2.4) * 0.09 + 0.05;
      scrollGroup.position.y = -0.44 + (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.9 + 1.2) * 0.06);

      // Update ambient floating sparkles
      for (let i = 0; i < ambientPieces.length; i++) {
        const p = ambientPieces[i];
        if (!prefersReducedMotion) {
          p.angle += dt * p.speed * 0.35;
          p.mesh.position.x = Math.cos(p.angle) * p.radius * 0.95;
          p.mesh.position.z = Math.sin(p.angle) * p.radius * 0.55 - 0.3;
          p.mesh.position.y = p.baseY + Math.sin(elapsed * p.speed * 3 + i) * p.bobAmp;
          p.mesh.rotation.x += dt * p.spinX;
          p.mesh.rotation.y += dt * p.spinY;
        }
      }

      // Update confetti burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.vy -= dt * 4.5;
        bp.vx *= 0.985;
        bp.vz *= 0.985;
        bp.mesh.position.x += bp.vx * dt;
        bp.mesh.position.y += bp.vy * dt;
        bp.mesh.position.z += bp.vz * dt;
        bp.mesh.rotation.x += bp.rx * dt;
        bp.mesh.rotation.y += bp.ry * dt;
        bp.life -= dt * 0.72;
        bp.mesh.material.opacity = Math.max(0, bp.life);
        if (bp.life <= 0) {
          scene.remove(bp.mesh);
          bp.mesh.material.dispose();
          burstParticles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);

      if (!markedReady) {
        markedReady = true;
        stage.classList.add('is-ready');
        if (fallback) fallback.setAttribute('aria-hidden', 'true');
      }

      if (!prefersReducedMotion || isDragging || burstParticles.length > 0 || Math.abs(velY) > 0.001) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const scheduleRender = () => {
      if (rafId === null && isVisible && !document.hidden) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0] ? entries[0].isIntersecting : true;
          if (isVisible) scheduleRender();
        },
        { threshold: 0.05 }
      );
      io.observe(stage);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scheduleRender();
    });

    scheduleRender();
  }

  let hero3dInitialized = false;
  function tryInitHero3D() {
    if (hero3dInitialized || typeof window.THREE === 'undefined') return;
    hero3dInitialized = true;
    initHero3D();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCardTilt();
    tryInitHero3D();
  });
  window.addEventListener('load', tryInitHero3D, { once: true });
  window.addEventListener('three-ready', tryInitHero3D, { once: true });
})();
