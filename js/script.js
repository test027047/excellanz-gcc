// =============================================
// HERO — Particle Canvas System
// =============================================
(function () {
  const canvas = document.getElementById('heroParticles');
  const hero = document.getElementById('heroSection');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 120;
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '34,211,238' : '79,70,229',
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse gravitational pull
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += dx * 0.00008;
        p.vy += dy * 0.00008;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.shadowColor = `rgba(${p.color},0.6)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connection lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x;
        const ddy = p.y - p2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < MAX_DIST) {
          const lineAlpha = (1 - d / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(79,70,229,${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();


// =============================================
// HERO — Mouse Parallax for Floating Shapes
// =============================================
(function () {
  const hero = document.getElementById('heroSection');
  const floaters = document.getElementById('heroFloaters');
  if (!hero || !floaters) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;

    const children = floaters.children;
    for (let i = 0; i < children.length; i++) {
      const depth = 0.5 + (i % 3) * 0.4;
      const tx = mx * 30 * depth;
      const ty = my * 20 * depth;
      children[i].style.transform += '';
      children[i].style.setProperty('--px', tx + 'px');
      children[i].style.setProperty('--py', ty + 'px');
    }
  });
})();


// =============================================
// COURSE TAB SWITCHER
// =============================================
const courseTabs = document.querySelectorAll('.course-tab');
const courseOptions = document.querySelectorAll('.course-options');

courseTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update active tab button
    courseTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show correct options panel
    courseOptions.forEach(panel => {
      panel.classList.add('hidden');
    });
    const targetPanel = document.getElementById(`tab-${target}`);
    if (targetPanel) targetPanel.classList.remove('hidden');

    // Clear any previous radio selection when switching tabs
    document.querySelectorAll('input[name="course"]').forEach(r => r.checked = false);
  });
});

// =============================================
// HERO FORM — Submit Handler
// =============================================
(function () {
  const form      = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('hfSubmitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate a course was selected
    const selected = form.querySelector('input[name="hf_course"]:checked');
    if (!selected) {
      const courseSection = form.querySelector('.hf-field:last-of-type .hf-label');
      if (courseSection) {
        courseSection.style.color = '#FC8181';
        setTimeout(() => courseSection.style.color = '', 2000);
      }
      return;
    }

    // Loading state
    const textEl    = submitBtn.querySelector('.hf-submit-text');
    const loadingEl = submitBtn.querySelector('.hf-submit-loading');
    if (textEl)    textEl.style.display    = 'none';
    if (loadingEl) loadingEl.style.display = 'flex';
    submitBtn.disabled = true;

    // TODO: Replace with your Laravel fetch() call
    setTimeout(() => {
      if (textEl)    textEl.style.display    = 'flex';
      if (loadingEl) loadingEl.style.display = 'none';
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Thank You! We\'ll Call You Soon';
    }, 1500);
  });
})();

// =============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =============================================
// HEADER SHOW/HIDE ON SCROLL
// =============================================
const header = document.querySelector('.top-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
});


// =============================================
// SECTION 3: DUPLICATE MARQUEE FOR SEAMLESS LOOP
// =============================================
(function () {
  ['exzMarquee1', 'exzMarquee2'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    track.innerHTML += track.innerHTML;
  });
})();


// =============================================
// SECTION 3: ANIMATED COUNTER — Stats Row
// =============================================
(function () {
  const statNums = document.querySelectorAll('.exz-stat-num[data-count]');
  if (!statNums.length) return;

  function formatNum(val, target) {
    if (target >= 1000) {
      return val >= 1000 ? Math.floor(val / 1000) + 'K' : val;
    }
    return Math.floor(val);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNum(ease * target, target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = formatNum(target, target);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();


// =============================================
// SECTION 5: COURSE FILTER TABS
// =============================================
(function () {
  const tabs = document.querySelectorAll('.crs-tab');
  const blocks = document.querySelectorAll('.crs-category-block');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('crs-tab-active'));
      tab.classList.add('crs-tab-active');

      // Show/hide category blocks with animation
      blocks.forEach(block => {
        const cat = block.dataset.category;
        if (filter === 'all' || filter === cat) {
          block.classList.remove('crs-block-hidden');
          block.style.animation = 'crsFadeIn 0.4s ease forwards';
        } else {
          block.classList.add('crs-block-hidden');
        }
      });
    });
  });
})();


// =============================================
// SECTION 5: COURSE FILTER TABS
// =============================================
(function () {
  const tabs   = document.querySelectorAll('.crs-tab');
  const blocks = document.querySelectorAll('.crs-category-block');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('crs-tab-active'));
      tab.classList.add('crs-tab-active');

      // Show/hide blocks + re-animate cards
      blocks.forEach(block => {
        if (filter === block.dataset.category) {
          block.classList.remove('crs-block-hidden');
          block.style.animation = 'crsFadeIn 0.35s ease forwards';

          // Re-trigger card entrance for newly visible cards
          const cards = block.querySelectorAll('.crs-card');
          cards.forEach((card, i) => {
            if (!card.classList.contains('crs-card-visible')) {
              setTimeout(() => {
                card.classList.remove('crs-card-hidden');
                card.classList.add('crs-card-visible');
              }, i * 80);
            }
          });
        } else {
          block.classList.add('crs-block-hidden');
        }
      });
    });
  });
})();


// =============================================
// SECTION 5: INITIAL BACHELORS CARD ENTRANCE
// =============================================
(function () {
  const cards = document.querySelectorAll(
    '.crs-category-block[data-category="bachelors"] .crs-card'
  );
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card  = entry.target;
      const siblings = Array.from(card.parentElement.children);
      const index = siblings.indexOf(card);

      setTimeout(() => {
        card.classList.remove('crs-card-hidden');
        card.classList.add('crs-card-visible');
      }, index * 80);

      observer.unobserve(card);
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();


// =============================================
// HERO FORM — Course Tab Switcher
// =============================================
(function () {
  const tabs = document.querySelectorAll('.hf-ctab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('hf-ctab-active'));
      tab.classList.add('hf-ctab-active');

      document.querySelectorAll('.hf-course-options').forEach(panel => {
        panel.classList.add('hf-hidden');
      });

      const target_panel = document.getElementById('hf-tab-' + target);
      if (target_panel) {
        target_panel.classList.remove('hf-hidden');
        // Deselect any previous radio in hidden panels
        target_panel.querySelectorAll('input[type="radio"]')
          .forEach(r => r.checked = false);
      }
    });
  });
})();


// =============================================
// ENQUIRY POPUP — Unified Controller
// =============================================
(function () {
  const overlay      = document.getElementById('enqOverlay');
  const closeBtn     = document.getElementById('enqClose');
  const form         = document.getElementById('enqForm');
  const submitBtn    = document.getElementById('enqSubmit');
  const successBox   = document.getElementById('enqSuccess');
  const successClose = document.getElementById('enqSuccessClose');

  // Dynamic labels
  const modalTitle   = document.getElementById('enqModalTitle');
  const modalDesc    = document.getElementById('enqModalDesc');
  const formTitle    = document.getElementById('enqFormTitle');
  const formSub      = document.getElementById('enqFormSub');
  const submitLabel  = document.getElementById('enqSubmitLabel');

  if (!overlay) return;

  // Course name → tab key mapping
  const courseTabMap = {
    'Master of'   : 'pg',
    'Bachelor of' : 'ug',
    '10th'        : 'secondary',
    '12th'        : 'secondary',
    'BPP'         : 'secondary',
    'Doctor'      : 'doctorate',
  };

  // ---- Open ----
  function openModal(courseName, mode) {
    mode = mode || 'enquire';
    form.style.display       = 'flex';
    successBox.style.display = 'none';
    clearErrors();

    // Update modal copy based on mode
    if (mode === 'brochure') {
      if (modalTitle) modalTitle.innerHTML = 'Download Your<br/><span>Free Brochure</span>';
      if (modalDesc)  modalDesc.textContent = 'Enter your details and we\'ll send the brochure straight to you.';
      if (formTitle)  formTitle.textContent = 'Download Brochure';
      if (formSub)    formSub.textContent   = 'Fill in your details to receive the brochure';
      if (submitLabel) submitLabel.textContent = ' Download the Brochure';
    } else {
      if (modalTitle) modalTitle.innerHTML = 'Start Your<br/><span>Journey Today</span>';
      if (modalDesc)  modalDesc.textContent = 'Our academic counsellor will reach out within 24 hours \u2014 completely free.';
      if (formTitle)  formTitle.textContent = 'Enquire Now';
      if (formSub)    formSub.textContent   = 'We\'ll get back to you within 24 hours';
      if (submitLabel) submitLabel.textContent = 'Submit Enquiry';
    }

    // Pre-select course if provided
    if (courseName) {
      let tabKey = 'pg';
      for (const [key, tab] of Object.entries(courseTabMap)) {
        if (courseName.startsWith(key)) { tabKey = tab; break; }
      }

      // Activate correct tab
      document.querySelectorAll('.enq-ctab').forEach(t =>
        t.classList.remove('enq-ctab-active'));
      const activeTab = document.querySelector(`.enq-ctab[data-tab="${tabKey}"]`);
      if (activeTab) activeTab.classList.add('enq-ctab-active');

      document.querySelectorAll('.enq-pills-wrap').forEach(p =>
        p.classList.add('enq-hidden'));
      const panel = document.getElementById('enq-tab-' + tabKey);
      if (panel) panel.classList.remove('enq-hidden');

      // Select matching radio
      document.querySelectorAll('.enq-pill-opt input[type="radio"]').forEach(r => {
        if (r.value.includes(courseName) || courseName.includes(r.value.split('(')[0].trim())) {
          r.checked = true;
          const hidden = document.getElementById('enqCourseVal');
          if (hidden) hidden.value = r.value;
        }
      });
    }

    overlay.classList.add('enq-open');
    document.body.style.overflow = 'hidden';
  }

  // ---- Close ----
  function closeModal() {
    overlay.classList.remove('enq-open');
    document.body.style.overflow = '';
  }

  // ---- Course tab switcher inside modal ----
  document.querySelectorAll('.enq-ctab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.enq-ctab').forEach(t => t.classList.remove('enq-ctab-active'));
      tab.classList.add('enq-ctab-active');
      document.querySelectorAll('.enq-pills-wrap').forEach(p => p.classList.add('enq-hidden'));
      const panel = document.getElementById('enq-tab-' + target);
      if (panel) panel.classList.remove('enq-hidden');
    });
  });

  // Sync pill radio → hidden input
  document.querySelectorAll('.enq-pill-opt input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const hidden = document.getElementById('enqCourseVal');
      if (hidden) hidden.value = radio.value;
      const field = document.getElementById('enqCourseVal')?.closest('.enq-field');
      if (field) field.classList.remove('enq-has-error');
    });
  });

  // ---- Triggers ----

  // 1. "Enquire Now" on course cards → pass course name, enquire mode
  document.addEventListener('click', e => {
    const btn = e.target.closest('.crs-btn-enquire');
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest('.crs-card');
    const name = card?.querySelector('.crs-course-name')?.textContent.trim();
    openModal(name || null, 'enquire');
  });

  // 2. "Download Brochure" hero button → brochure mode
  document.getElementById('btnDownloadBrochure')?.addEventListener('click', () => {
    openModal(null, 'brochure');
  });

  // 3. "Apply Now" in admission section banner → enquire mode
  document.addEventListener('click', e => {
    const btn = e.target.closest('.adm-banner-actions .hf-submit');
    if (!btn) return;
    e.preventDefault();
    openModal(null, 'enquire');
  });

  // Close events
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  successClose?.addEventListener('click', closeModal);

  // ---- Validation helpers ----
  function validateField(el, rule) {
    const field = el?.closest('.enq-field');
    if (!field) return true;
    if (!rule(el.value.trim())) {
      field.classList.add('enq-has-error');
      return false;
    }
    field.classList.remove('enq-has-error');
    return true;
  }

  function clearErrors() {
    document.querySelectorAll('.enq-field').forEach(f =>
      f.classList.remove('enq-has-error'));
  }

  // Live validation
  document.getElementById('enqFullName')?.addEventListener('input', function () {
    validateField(this, v => v.length >= 2);
  });
  document.getElementById('enqEmail')?.addEventListener('input', function () {
    validateField(this, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  });
  document.getElementById('enqPhone')?.addEventListener('input', function () {
    validateField(this, v => /^[\d\s\+\-\(\)]{6,15}$/.test(v));
  });

  // ---- Single Submit Handler ----
  form?.addEventListener('submit', e => {
    e.preventDefault();

    const courseVal   = document.getElementById('enqCourseVal')?.value;
    const courseField = document.getElementById('enqCourseVal')?.closest('.enq-field');

    const valid = [
      validateField(document.getElementById('enqFullName'), v => v.length >= 2),
      validateField(document.getElementById('enqEmail'),    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validateField(document.getElementById('enqPhone'),    v => /^[\d\s\+\-\(\)]{6,15}$/.test(v)),
    ].every(Boolean);

    if (!courseVal) {
      courseField?.classList.add('enq-has-error');
      return;
    }

    if (!valid) return;

    // Loading state
    const textEl    = submitBtn.querySelector('.enq-submit-text');
    const loadingEl = submitBtn.querySelector('.enq-submit-loading');
    textEl.style.display    = 'none';
    loadingEl.style.display = 'flex';
    submitBtn.disabled      = true;

    // TODO: Replace with your Laravel fetch() call
    setTimeout(() => {
      textEl.style.display    = 'flex';
      loadingEl.style.display = 'none';
      submitBtn.disabled      = false;
      form.style.display      = 'none';
      successBox.style.display= 'flex';
    }, 1500);
  });
})();



// =============================================
// SECTION 6: TESTIMONIALS SPOTLIGHT
// =============================================
(function () {
  const slides   = document.querySelectorAll('.tst-slide');
  const dotsWrap = document.getElementById('tstDotsRow');
  const prevBtn  = document.getElementById('tstPrev');
  const nextBtn  = document.getElementById('tstNext');
  const progress = document.getElementById('tstProgress');

  if (!slides.length) return;

  const TOTAL    = slides.length;
  const DURATION = 5000;
  const TICK     = 50;

  let current    = 0;
  let progTimer  = null;
  let elapsed    = 0;
  let isPaused   = false;

  // ---- Build dots ----
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tst-dot' + (i === 0 ? ' tst-dot-active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = Array.from(dotsWrap?.querySelectorAll('.tst-dot') || []);

  // ---- Go to slide ----
  function goTo(index) {
    const prev = current;
    current = (index + TOTAL) % TOTAL;
    if (prev === current) return;

    // Exit old
    slides[prev].classList.add('tst-exit');
    slides[prev].classList.remove('tst-active');
    setTimeout(() => slides[prev].classList.remove('tst-exit'), 600);

    // Enter new
    slides[current].classList.add('tst-active');

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('tst-dot-active', i === current));

    resetProgress();
  }

  // ---- Progress ----
  function resetProgress() {
    elapsed = 0;
    if (progress) progress.style.width = '0%';
    clearInterval(progTimer);
    if (!isPaused) startProgress();
  }

  function startProgress() {
    clearInterval(progTimer);
    progTimer = setInterval(() => {
      elapsed += TICK;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      if (progress) progress.style.width = pct + '%';
      if (elapsed >= DURATION) goTo(current + 1);
    }, TICK);
  }

  function stopProgress() { clearInterval(progTimer); }

  // ---- Controls ----
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  prevBtn?.addEventListener('click', () => goTo(current - 1));

  // ---- Hover pause ----
  const spotlight = document.querySelector('.tst-spotlight');
  spotlight?.addEventListener('mouseenter', () => { isPaused = true;  stopProgress(); });
  spotlight?.addEventListener('mouseleave', () => { isPaused = false; startProgress(); });

  // ---- Touch swipe ----
  let touchX = 0;
  spotlight?.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    isPaused = true; stopProgress();
  }, { passive: true });

  spotlight?.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    isPaused = false; startProgress();
  }, { passive: true });

  // ---- Image fallback ----
  document.querySelectorAll('.tst-person-av img').forEach(img => {
    img.addEventListener('error', function () {
      const initials = this.alt
        .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const wrap = this.parentElement;
      wrap.innerHTML = initials;
      wrap.classList.add('tst-av-fallback');
    });
  });

  // ---- Init ----
  slides[0].classList.add('tst-active');
  startProgress();

})();


// =============================================
// SECTION 7: CONTACT — Region Tab Filter
// =============================================
(function () {
  const tabs  = document.querySelectorAll('.cnt-tab');
  const cards = document.querySelectorAll('.cnt-card');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const region = tab.dataset.region;

      // Update active tab
      tabs.forEach(t => t.classList.remove('cnt-tab-active'));
      tab.classList.add('cnt-tab-active');

      // Filter cards with staggered animation
      let delay = 0;
      cards.forEach(card => {
        const cardRegion = card.dataset.region;
        const show = region === 'all' || cardRegion === region;

        if (show) {
          card.classList.remove('cnt-hidden');
          card.style.animationDelay = delay + 'ms';
          card.style.animation = 'none';
          // Force reflow
          void card.offsetWidth;
          card.style.animation = 'cntCardIn 0.45s ease both';
          delay += 60;
        } else {
          card.classList.add('cnt-hidden');
        }
      });
    });
  });
})();



// =============================================
// FOOTER 3D LOGO BANNER — Three.js
// =============================================
(function () {

  const canvas  = document.getElementById('fbCanvas');
  const banner  = document.getElementById('fb-banner');
  const hint    = document.getElementById('fbHint');

  if (!canvas || !banner || typeof THREE === 'undefined') return;

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  // Ensure the canvas clears to transparent (prevents visible “black box”)
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  function resize() {
    const w = banner.offsetWidth;
    const h = banner.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Lighting ----
  // Ambient
  scene.add(new THREE.AmbientLight(0xfff8e7, 0.5));

  // Main key light — warm gold
  const keyLight = new THREE.DirectionalLight(0xFFCC44, 3.5);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  // Fill light — gold/amber
  const fillLight = new THREE.PointLight(0xFFAA22, 2.2, 20);
  fillLight.position.set(-4, 2, 3);
  scene.add(fillLight);

  // Rim light — warm gold rim for depth
  const rimLight = new THREE.DirectionalLight(0xFFDD88, 0.8);
  rimLight.position.set(-3, -2, -3);
  scene.add(rimLight);

  // Sweeping gold SpotLight — always passes through the logo
  const sweepLight = new THREE.SpotLight(0xFFD700, 6.0, 18, Math.PI / 6, 0.5, 1.5);
  sweepLight.position.set(-8, 2, 4);
  sweepLight.target.position.set(0, 0, 0);
  scene.add(sweepLight);
  scene.add(sweepLight.target);

  // ---- Background particles ----
  const PTCOUNT = 200;
  const ptPositions = new Float32Array(PTCOUNT * 3);
  for (let i = 0; i < PTCOUNT; i++) {
    ptPositions[i*3]   = (Math.random() - 0.5) * 18;
    ptPositions[i*3+1] = (Math.random() - 0.5) * 8;
    ptPositions[i*3+2] = (Math.random() - 0.5) * 6 - 3;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));
  const ptMat = new THREE.PointsMaterial({
    color: 0xFFCC44,
    size: 0.035,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(ptGeo, ptMat));

  // ---- Logo Mesh ----
  const loader = new THREE.TextureLoader();
  loader.load(
    'images/3dlogo.png',           // ← use PNG with transparent bg
    function (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;

      // If the source PNG has a dark/black matte, make near-black pixels transparent.
      // This removes the visible black square behind the logo.
      let mapTexture = texture;
      try {
        const img = texture.image;
        if (img && img.width && img.height) {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const id = ctx.getImageData(0, 0, c.width, c.height);
          const d = id.data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            const a = d[i + 3];
            // Remove near-black pixels while keeping existing alpha.
            if (a > 0 && r < 18 && g < 18 && b < 18) d[i + 3] = 0;
          }
          ctx.putImageData(id, 0, 0);
          mapTexture = new THREE.CanvasTexture(c);
          mapTexture.colorSpace = THREE.SRGBColorSpace;
        }
      } catch (e) {
        // Fallback to original texture if anything goes wrong.
        mapTexture = texture;
      }

      // Aspect ratio — logo is roughly 3:1
      const aspect  = texture.image.width / texture.image.height;
      // Slightly smaller model for a tighter footer layout
      const pWidth  = 3.7;
      const pHeight = pWidth / aspect;

      // Main logo plane
      const geo = new THREE.PlaneGeometry(pWidth, pHeight, 20, 20);
      // Physical shading makes the flat logo feel more "3D" via specular highlights
      const mat = new THREE.MeshPhysicalMaterial({
        map:              mapTexture,
        transparent:      true,
        alphaTest:        0.12,
        metalness:        0.95,
        roughness:        0.12,
        clearcoat:        1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity:  2.5,
        emissive:         new THREE.Color(0xFFAA22),
        emissiveIntensity: 0.55,
        side:             THREE.DoubleSide,
      });

      logo = new THREE.Mesh(geo, mat);
      scene.add(logo);

      // Shadow plane behind logo
      const shadowGeo = new THREE.PlaneGeometry(pWidth * 1.02, pHeight * 1.02);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.position.z = -0.15;
      shadowPlane.position.y = -0.1;
      scene.add(shadowPlane);

      // Glow sprite behind logo
      const glowTex = makeGlowTexture();
      const spriteMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xFFAA22,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Sprite(spriteMat);
      glow.scale.set(pWidth * 2.0, pHeight * 2.0, 1);
      glow.position.z = -0.5;
      scene.add(glow);
      glowSprite = glow;
      glowSpriteMat = spriteMat;
    },
    undefined,
    function () {
      // Fallback — if PNG fails, show text mesh
      console.warn('Logo texture failed, using fallback');
    }
  );

  let logo        = null;
  let glowSprite  = null;
  let glowSpriteMat = null;

  // ---- Glow texture builder ----
  function makeGlowTexture() {
    const c   = document.createElement('canvas');
    c.width   = c.height = 256;
    const ctx = c.getContext('2d');
    const g   = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0,   'rgba(255,220,80,1)');
    g.addColorStop(0.4, 'rgba(255,160,30,0.45)');
    g.addColorStop(1,   'rgba(255,140,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  // ---- State ----
  const mouse      = { x: 0, y: 0, tx: 0, ty: 0 };
  let   isSpinning = false;
  let   spinAngle  = 0;
  let   frame      = 0;
  let   touchActive = false;

  // ---- Mouse tracking ----
  banner.addEventListener('mousemove', (e) => {
    const r = banner.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    mouse.ty = -((e.clientY - r.top)  / r.height - 0.5) * 2;
  });

  banner.addEventListener('mouseleave', () => {
    mouse.tx = 0;
    mouse.ty = 0;
  });

  // ---- Touch tracking ----
  banner.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = banner.getBoundingClientRect();
    mouse.tx = ((t.clientX - r.left) / r.width  - 0.5) * 2;
    mouse.ty = -((t.clientY - r.top)  / r.height - 0.5) * 2;
  }, { passive: false });

  banner.addEventListener('touchend', () => {
    mouse.tx = 0;
    mouse.ty = 0;
  });

  // ---- Click / Tap → Trigger spin ----
  function triggerSpin(e) {
    if (isSpinning) return;
    isSpinning = true;
    spinAngle  = 0;

    // Hint fades out after first tap
    if (hint) hint.style.opacity = '0';

    // Ripple effect
    const r   = banner.getBoundingClientRect();
    const cx  = (e.clientX || (e.touches && e.touches[0]?.clientX) || r.left + r.width/2) - r.left;
    const cy  = (e.clientY || (e.touches && e.touches[0]?.clientY) || r.top + r.height/2) - r.top;
    const rpl = document.createElement('div');
    rpl.className = 'fb-ripple';
    rpl.style.cssText = `width:80px;height:80px;left:${cx-40}px;top:${cy-40}px;`;
    banner.appendChild(rpl);
    setTimeout(() => rpl.remove(), 900);

    // Boost glow
    if (glowSpriteMat) {
      glowSpriteMat.opacity = 0.75;
      fillLight.intensity   = 5;
      sweepLight.intensity  = 12;
    }
  }

  banner.addEventListener('click',     triggerSpin);
  banner.addEventListener('touchstart', (e) => {
    touchActive = true;
    triggerSpin(e);
  }, { passive: true });

  // ---- Animation Loop ----
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    if (!logo) {
      renderer.render(scene, camera);
      return;
    }

    // Smooth mouse follow
    mouse.x += (mouse.tx - mouse.x) * 0.07;
    mouse.y += (mouse.ty - mouse.y) * 0.07;

    // Idle float
    const floatY = Math.sin(frame * 0.018) * 0.12;
    const floatX = Math.sin(frame * 0.011) * 0.04;

    if (isSpinning) {
      // Full Y-axis flip spin
      spinAngle += 0.07;
      logo.rotation.y = spinAngle;

      // Golden shimmer during spin
      if (glowSpriteMat) {
        glowSpriteMat.opacity = 0.40 + Math.abs(Math.sin(spinAngle)) * 0.40;
      }
      fillLight.intensity = 2.5 + Math.abs(Math.sin(spinAngle)) * 2;

      if (spinAngle >= Math.PI * 2) {
        isSpinning = false;
        spinAngle  = 0;
        logo.rotation.y = 0;
        if (glowSpriteMat) glowSpriteMat.opacity = 0.18;
        fillLight.intensity = 1.8;
      }
    } else {
      // Mouse tilt
      logo.rotation.y = mouse.x * 0.4;
      logo.rotation.x = mouse.y * 0.25;
    }

    // Always apply float
    logo.position.y  = floatY;
    logo.position.x  = floatX;

    // Always animate sweep light — continuously sweeps through the logo (left to right)
    const sweepCycle = (frame * 0.022) % (Math.PI * 2);
    sweepLight.position.x = Math.sin(sweepCycle) * 9;
    sweepLight.position.y = 1.5;
    sweepLight.position.z = 5;
    // Intensity pulses brighter as it crosses centre
    const sweepT = Math.abs(Math.sin(sweepCycle));
    sweepLight.intensity = 4 + sweepT * 8;
    sweepLight.color.setHSL(0.11 + sweepT * 0.03, 1.0, 0.65);

    // Glow pulse
    if (glowSprite && !isSpinning) {
      const pulse = 1 + Math.sin(frame * 0.03) * 0.05;
      glowSprite.scale.set(
        glowSprite.scale.x * 0.98 + pulse * (glowSprite.scale.x / glowSprite.scale.x) * 0.02,
        glowSprite.scale.y,
        1
      );
      glowSpriteMat.opacity = 0.22 + Math.sin(frame * 0.025) * 0.08;
    }

    // Animate fill light orbit
    fillLight.position.x = Math.sin(frame * 0.012) * 5;
    fillLight.position.y = Math.cos(frame * 0.009) * 3;

    renderer.render(scene, camera);
  }

  animate();

})();

// =============================================
// SECTION 4: WHY EXCELLANZ — Card Entrance
// =============================================
(function () {
  const cards = document.querySelectorAll('.why-card, .why-quote-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = (parseInt(card.dataset.index) || 0) * 100;
        setTimeout(() => card.classList.add('why-card-show'), delay);
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => obs.observe(card));
})();


// =============================================
// SECTION 6: ADMISSION PROCESS — Animations
// =============================================
(function () {

  // ── Step tracker fill
  const fill = document.getElementById('admTrackFill');
  const steps = document.querySelectorAll('.adm-step');

  if (fill && steps.length) {
    const trackObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate fill line
          setTimeout(() => fill.classList.add('adm-fill-active'), 200);
          // Stagger step nodes
          steps.forEach((step, i) => {
            setTimeout(() => step.classList.add('adm-step-show'), 200 + i * 160);
          });
          trackObs.disconnect();
        }
      });
    }, { threshold: 0.3 });

    trackObs.observe(document.querySelector('.adm-track-wrap'));
  }

  // ── Step cards entrance
  const cards = document.querySelectorAll('.adm-card');
  if (!cards.length) return;

  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = (parseInt(card.dataset.index) || 0) * 110;
        setTimeout(() => card.classList.add('adm-card-show'), delay);
        cardObs.unobserve(card);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => cardObs.observe(card));

})();



