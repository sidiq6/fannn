/**
 * ==========================================================================
 * AETHERIA 3D STUDIO — SCRIPT ENGINE
 * Three.js WebGL Core, Web Audio Synthesizer, 3D Tilt & Interactive Lab
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. PRELOADER & INITIALIZATION
  // ==========================================
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  let loadProgress = 0;

  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 15) + 8;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);

      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderStatus) loaderStatus.innerText = 'SISTEM SPASIAL SIAP';

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
        }
        initStatsCounter();
      }, 500);
    } else {
      if (loaderBar) loaderBar.style.width = `${loadProgress}%`;
      if (loaderStatus) {
        if (loadProgress > 70) loaderStatus.innerText = 'MENGKOMPILASI SHADER GLSL...';
        else if (loadProgress > 40) loaderStatus.innerText = 'MEMBANGKITKAN GEOMETRI SPASIAL...';
        else loaderStatus.innerText = 'MEMUAT SISTEM WEBGL...';
      }
    }
  }, 60);

  // ==========================================
  // 2. SYNTHESIZED WEB AUDIO API SYSTEM
  // ==========================================
  let audioCtx = null;
  let isSoundEnabled = false;
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const audioStatusLabel = document.getElementById('audio-status-label');

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.05) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  function playHoverSound() {
    if (!isSoundEnabled) return;
    playTone(950, 'sine', 0.08, 0.03);
  }

  function playClickSound() {
    if (!isSoundEnabled) return;
    playTone(520, 'triangle', 0.12, 0.08);
  }

  function playMorphSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  function playSuccessSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.25, 0.06);
      }, idx * 80);
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        soundBtn.classList.add('active');
        soundIcon.className = 'fa-solid fa-volume-high';
        soundText.innerText = 'Audio FX: Aktif';
        if (audioStatusLabel) audioStatusLabel.innerText = 'Aktif (Synthesized)';
        playSuccessSound();
      } else {
        soundBtn.classList.remove('active');
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundText.innerText = 'Audio FX: Mati';
        if (audioStatusLabel) audioStatusLabel.innerText = 'Mati';
      }
    });
  }

  // Attach sound triggers to interactive elements
  const interactiveTargets = document.querySelectorAll('button, a, .shape-btn, .hud-btn, .service-row, .theme-dot, input[type="range"]');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSound());
    el.addEventListener('click', () => playClickSound());
  });

  // ==========================================
  // 3. CUSTOM GLOWING CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  document.querySelectorAll('a, button, input, textarea, select, .tilt-card, .service-row').forEach(item => {
    item.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });

  // ==========================================
  // 4. THREE.JS 3D SCENE ARCHITECTURE
  // ==========================================
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('WebGL Canvas or Three.js not found');
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Dynamic Theme Colors in Hex
  const themeColors = {
    cyan: { primary: 0x00f0ff, secondary: 0x7000ff },
    purple: { primary: 0xb800ff, secondary: 0x00e5ff },
    emerald: { primary: 0x00ff88, secondary: 0x00b4d8 },
    amber: { primary: 0xffb703, secondary: 0xfb8500 }
  };
  let currentThemeKey = 'cyan';

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0e1424, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.PointLight(themeColors.cyan.primary, 3.5, 50);
  keyLight.position.set(6, 6, 8);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(themeColors.cyan.secondary, 2.5, 50);
  fillLight.position.set(-8, -6, -4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, 10, 5);
  scene.add(rimLight);

  // Group for the Main 3D Interactive Entity
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Geometries Registry
  const geometries = {
    torusknot: new THREE.TorusKnotGeometry(1.65, 0.48, 140, 24, 2, 3),
    icosahedron: new THREE.IcosahedronGeometry(2.1, 1),
    sphere: new THREE.SphereGeometry(2.0, 36, 36),
    torus: new THREE.TorusGeometry(2.2, 0.45, 30, 120)
  };

  // Materials
  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d1424,
    roughness: 0.15,
    metalness: 0.9,
    flatShading: true
  });

  const wireframeMaterial = new THREE.MeshStandardMaterial({
    color: themeColors.cyan.primary,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
    roughness: 0.3,
    metalness: 0.8
  });

  // Create Core Mesh & Outer Wireframe Lattice
  let currentGeometry = geometries.torusknot;
  const coreMesh = new THREE.Mesh(currentGeometry, solidMaterial);
  const wireMesh = new THREE.Mesh(currentGeometry, wireframeMaterial);
  wireMesh.scale.set(1.02, 1.02, 1.02);

  mainGroup.add(coreMesh);
  mainGroup.add(wireMesh);

  // Concentric Orbital Rings
  const orbitGroup = new THREE.Group();
  mainGroup.add(orbitGroup);

  const ringGeo1 = new THREE.TorusGeometry(3.3, 0.02, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: themeColors.cyan.primary,
    transparent: true,
    opacity: 0.3
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  orbitGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(3.8, 0.015, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: themeColors.cyan.secondary,
    transparent: true,
    opacity: 0.25
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  orbitGroup.add(ring2);

  // Vast 3D Particle Constellation / Starfield
  const particleCount = 2200;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 50;
    particlePositions[i + 1] = (Math.random() - 0.5) * 50;
    particlePositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
    particleScales[i / 3] = Math.random();
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: themeColors.cyan.primary,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Floating Geometrical Shards in the Scene
  const shardGroup = new THREE.Group();
  scene.add(shardGroup);
  const shardMeshes = [];
  const shardMat = new THREE.MeshStandardMaterial({
    color: 0x111b2e,
    roughness: 0.2,
    metalness: 0.9,
    wireframe: true
  });

  for (let i = 0; i < 18; i++) {
    const shardGeo = new THREE.TetrahedronGeometry(Math.random() * 0.4 + 0.2);
    const shard = new THREE.Mesh(shardGeo, shardMat);
    shard.position.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 15 - 2
    );
    shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    shardGroup.add(shard);
    shardMeshes.push({
      mesh: shard,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02
    });
  }

  // 3D Scene Interactive Parameters
  let rotationSpeedFactor = 1.0;
  let targetRotationSpeed = 1.0;
  let targetScale = 1.0;
  let isExploded = false;
  let isWireframeOnly = false;

  // Window Normalized Mouse Position
  let normMouseX = 0;
  let normMouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Touch Support for mobile rotation
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      normMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      normMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  // Scroll Responsive Camera Dolly
  let scrollProgress = 0;
  function updateScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });

  // Navbar dynamic blur on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Render Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp Mouse Movement
    smoothMouseX += (normMouseX - smoothMouseX) * 0.05;
    smoothMouseY += (normMouseY - smoothMouseY) * 0.05;

    // Smooth Lerp Scale
    mainGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    // Apply Rotations to Main 3D Entity
    const speed = 0.012 * rotationSpeedFactor;
    mainGroup.rotation.y += speed;
    mainGroup.rotation.x += speed * 0.6;

    // Mouse Parallax Interaction on mainGroup
    mainGroup.position.x = smoothMouseX * 1.5;
    mainGroup.position.y = smoothMouseY * 1.0;

    // Scroll Transformation: Rotate, push depth, and pan as user reads
    mainGroup.position.z = -scrollProgress * 4;
    mainGroup.rotation.z = scrollProgress * Math.PI * 1.5;

    // Animate Orbital Rings
    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.006;

    // Dynamic wave motion for particle starfield
    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3 + 1; // Y axis
      pos[idx] += Math.sin(elapsedTime * 1.2 + i) * 0.003;
    }
    particleGeometry.attributes.position.needsUpdate = true;
    particles.rotation.y = elapsedTime * 0.015;

    // Animate Shards
    shardMeshes.forEach(item => {
      item.mesh.rotation.x += item.rotSpeedX;
      item.mesh.rotation.y += item.rotSpeedY;
    });

    // Animate Dynamic Light Positions
    keyLight.position.x = Math.sin(elapsedTime * 0.8) * 8 + smoothMouseX * 3;
    keyLight.position.y = Math.cos(elapsedTime * 0.8) * 6 + smoothMouseY * 3;

    // Camera Gentle Bobbing
    camera.position.x = smoothMouseX * 0.8;
    camera.position.y = smoothMouseY * 0.6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ==========================================
  // 5. 3D LAB INTERACTIVE CONTROLS
  // ==========================================
  const shapeBtns = document.querySelectorAll('.shape-btn');
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shapeType = btn.getAttribute('data-shape');
      if (geometries[shapeType]) {
        shapeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Swap geometry
        coreMesh.geometry = geometries[shapeType];
        wireMesh.geometry = geometries[shapeType];

        // Trigger pulse/morph animation
        targetScale = 0.6;
        playMorphSound();
        setTimeout(() => {
          targetScale = 1.0;
        }, 180);
      }
    });
  });

  // Sliders
  const speedRange = document.getElementById('speed-range');
  const speedVal = document.getElementById('speed-val');
  if (speedRange && speedVal) {
    speedRange.addEventListener('input', (e) => {
      rotationSpeedFactor = parseFloat(e.target.value);
      speedVal.innerText = `${rotationSpeedFactor.toFixed(1)}x`;
    });
  }

  const scaleRange = document.getElementById('scale-range');
  const scaleVal = document.getElementById('scale-val');
  if (scaleRange && scaleVal) {
    scaleRange.addEventListener('input', (e) => {
      targetScale = parseFloat(e.target.value);
      scaleVal.innerText = `${targetScale.toFixed(1)}x`;
    });
  }

  const particleRange = document.getElementById('particle-range');
  const particleVal = document.getElementById('particle-val');
  if (particleRange && particleVal) {
    particleRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (val === 1) {
        particleMaterial.size = 0.04;
        particleMaterial.opacity = 0.3;
        particleVal.innerText = 'Rendah';
      } else if (val === 2) {
        particleMaterial.size = 0.08;
        particleMaterial.opacity = 0.6;
        particleVal.innerText = 'Sedang';
      } else {
        particleMaterial.size = 0.12;
        particleMaterial.opacity = 0.85;
        particleVal.innerText = 'Tinggi';
      }
    });
  }

  // HUD Top Control Buttons
  const btnWireframe = document.getElementById('btn-wireframe');
  if (btnWireframe) {
    btnWireframe.addEventListener('click', () => {
      isWireframeOnly = !isWireframeOnly;
      btnWireframe.classList.toggle('active', isWireframeOnly);
      coreMesh.visible = !isWireframeOnly;
      wireframeMaterial.wireframe = true;
      wireframeMaterial.opacity = isWireframeOnly ? 0.9 : 0.55;
    });
  }

  const btnExplode = document.getElementById('btn-explode');
  if (btnExplode) {
    btnExplode.addEventListener('click', () => {
      isExploded = !isExploded;
      btnExplode.classList.toggle('active', isExploded);
      playMorphSound();
      if (isExploded) {
        wireMesh.scale.set(1.4, 1.4, 1.4);
        orbitGroup.scale.set(1.5, 1.5, 1.5);
      } else {
        wireMesh.scale.set(1.02, 1.02, 1.02);
        orbitGroup.scale.set(1.0, 1.0, 1.0);
      }
    });
  }

  const btnResetCam = document.getElementById('btn-reset-cam');
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      normMouseX = 0;
      normMouseY = 0;
      rotationSpeedFactor = 1.0;
      if (speedRange) speedRange.value = "1.0";
      if (speedVal) speedVal.innerText = "1.0x";
      targetScale = 1.0;
      if (scaleRange) scaleRange.value = "1.0";
      if (scaleVal) scaleVal.innerText = "1.0x";
      isExploded = false;
      if (btnExplode) btnExplode.classList.remove('active');
      wireMesh.scale.set(1.02, 1.02, 1.02);
      orbitGroup.scale.set(1.0, 1.0, 1.0);
      coreMesh.visible = true;
      if (btnWireframe) btnWireframe.classList.remove('active');
      isWireframeOnly = false;
      playClickSound();
    });
  }

  // ==========================================
  // 6. THEME SWITCHER
  // ==========================================
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      if (themeColors[color]) {
        themeDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        document.body.setAttribute('data-theme', color);
        currentThemeKey = color;

        // Update Three.js materials & lights
        const c1 = themeColors[color].primary;
        const c2 = themeColors[color].secondary;

        keyLight.color.setHex(c1);
        fillLight.color.setHex(c2);
        wireframeMaterial.color.setHex(c1);
        ringMat1.color.setHex(c1);
        ringMat2.color.setHex(c2);
        particleMaterial.color.setHex(c1);

        playTone(750, 'sine', 0.15, 0.05);
      }
    });
  });

  // ==========================================
  // 7. 3D CARD TILT EFFECT (CSS PERSPECTIVE)
  // ==========================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // ==========================================
  // 8. ANIMATED STAT COUNTERS
  // ==========================================
  function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-number');
    statCards.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.ceil(target / 40);

      const updateCounter = () => {
        count += step;
        if (count >= target) {
          counter.innerText = target;
        } else {
          counter.innerText = count;
          setTimeout(updateCounter, 30);
        }
      };
      updateCounter();
    });
  }

  // ==========================================
  // 9. MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
    });
  });

  // ==========================================
  // 10. INTERACTIVE CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const messageVal = document.getElementById('message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.innerText = 'Mohon lengkapi semua bidang form.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Mentransmisikan Visi 3D...</span>';
      }

      // Simulate network request
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Pesan Terkirim!</span><i class="fa-solid fa-check"></i>';
        }
        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerText = `Terima kasih, ${nameVal}! Sinyal koordinat Anda telah diterima. Kami akan menghubungi Anda dalam waktu 24 jam.`;
        }
        playSuccessSound();
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = '<span>Kirim Pesan Spasial</span><i class="fa-solid fa-paper-plane"></i>';
          }
        }, 4000);
      }, 1500);
    });
  }

  // Project preview buttons in Portfolio
  const previewButtons = document.querySelectorAll('.project-preview-btn');
  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playSuccessSound();
      // Temporarily speed up the 3D entity & flash
      targetScale = 1.35;
      rotationSpeedFactor = 2.5;
      setTimeout(() => {
        targetScale = 1.0;
        rotationSpeedFactor = 1.0;
      }, 1200);
    });
  });
});
