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
// FORM SUBMIT HANDLER
// =============================================
const form = document.getElementById('enquiryForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate a course was selected
  const selected = document.querySelector('input[name="course"]:checked');
  if (!selected) {
    // Highlight the course section
    const label = document.querySelector('.form-label');
    const courseSection = document.querySelectorAll('.form-label')[3];
    if (courseSection) {
      courseSection.style.color = '#FF6B6B';
      setTimeout(() => courseSection.style.color = '', 2000);
    }
    return;
  }

  // Success state
  submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Thank You! We\'ll Call You Soon';
  submitBtn.disabled = true;
});

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
// HEADER SHADOW ON SCROLL
// =============================================
const header = document.querySelector('.top-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 30px rgba(201, 168, 76, 0.12)';
  } else {
    header.style.boxShadow = 'none';
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
// SECTION 4: USP CARD STAGGERED ENTRANCE
// =============================================
(function () {
  const cards = document.querySelectorAll('.exz-usp-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const index = parseInt(card.dataset.index) || 0;

      setTimeout(() => {
        card.style.transition =
          'opacity 0.6s ease, transform 0.6s cubic-bezier(0.23,1,0.32,1), ' +
          'box-shadow 0.45s ease, border-color 0.35s ease, background 0.35s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);

      observer.unobserve(card);
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
})();


// =============================================
// SECTION 4: CARD MOUSE TILT EFFECT
// =============================================
(function () {
  const cards = document.querySelectorAll('.exz-usp-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform =
        `translateY(-8px) scale(1.01) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
    });
  });
})();
