document.addEventListener('DOMContentLoaded', () => {
  // 1. Initializations
  initNetworkCanvas();
  initNavbar();
  initScrollspy();
  initSkillAnimation();
  initModals();
  initContactForm();
  initScrollReveal();
  initTypewriter();
  initStatsCounter();
  initBackToTop();
  initThemeToggle();
  initTiltEffect();
  initMagneticButtons();
  initScrollProgress();
  initMagicCursor();
  initSpotlightEffect();
  initResilienceLab();
});

/* ==========================================
   1. Dynamic Minimalist Network Canvas
   ========================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  
  // Settings
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  const particles = [];
  // Keep particle count low for a minimalist, clean feel
  const maxParticles = Math.min(60, Math.floor((width * height) / 20000)); 
  const connectionDist = 120;
  
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Shockwave burst of particles on click
  window.addEventListener('click', (e) => {
    if (window.innerWidth < 768) return; // Ignore on mobile
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 2.5 + 1.5;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.alpha -= this.decay;
        },
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${this.alpha * 0.5})`;
          ctx.fill();
        }
      });
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1; // Small dots
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on borders
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Interaction with mouse (subtle pull)
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.25)'; // Royal blue particles
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          // Calculate opacity: closer = more visible, but overall very faint
          let alpha = (1 - dist / connectionDist) * 0.07;
          
          // Glow effect if mouse is near the line
          if (mouse.x !== null) {
            const mDx1 = mouse.x - p1.x;
            const mDy1 = mouse.y - p1.y;
            const mDist = Math.sqrt(mDx1 * mDx1 + mDy1 * mDy1);
            if (mDist < mouse.radius) {
              alpha += (1 - mDist / mouse.radius) * 0.08;
            }
          }

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 1.5})`; // Royal blue lines
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw mouse spotlight glow
    if (mouse.x !== null && mouse.y !== null) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
      const isDark = document.body.classList.contains('dark-theme');
      const opacity = isDark ? 0.08 : 0.04;
      gradient.addColorStop(0, `rgba(37, 99, 235, ${opacity})`);
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw connections first (behind particles)
    drawConnections();
    
    // Update and draw particles (regular and temporary shockwave)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.alpha !== undefined) {
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      } else {
        p.update();
        p.draw();
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   2. Navigation Menu & Scroll State
   ========================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav-links a');

  // Sticky header background padding
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  function closeMenu() {
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
  }

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    if (navOverlay) navOverlay.classList.toggle('active', isExpanded);
    toggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking link
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================
   3. Scrollspy (Highlight active link)
   ========================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200; // Offset for header trigger

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================
   4. Skill Progress Bar Scroll Animation
   ========================================== */
function initSkillAnimation() {
  const skillBars = document.querySelectorAll('.skill-bar-fg');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-val') + '%';
        bar.style.width = targetWidth;
        // Stop observing once animated
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

/* ==========================================
   5. Dynamic Project Modals Detail Handler
   ========================================== */
function initModals() {
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.querySelector('.modal-title');
  const modalSubtitle = document.querySelector('.modal-subtitle');
  const modalContent = document.querySelector('.modal-content');
  
  const cards = document.querySelectorAll('.project-card, .timeline-body');

  // Data content store for click-reveals
  const detailData = {
    // Timeline Details
    'role-resilience': {
      title: 'IT Service Resilience Manager',
      subtitle: 'Datacomm Diangraha (November 2024 - Present)',
      desc: `
        Memimpin strategi ketahanan (resilience) layanan IT untuk memastikan keandalan, ketersediaan tinggi, dan pemulihan cepat pada infrastruktur cloud dan managed services enterprise.
        <ul>
          <li><strong>Optimasi Kapasitas:</strong> Memantau tren performa dan memodelkan kapasitas resource (CPU, Memory, Storage) secara proaktif guna mendukung pertumbuhan bisnis klien tanpa hambatan.</li>
          <li><strong>Penjaminan SLA:</strong> Menjaga kepatuhan SLA layanan cloud dengan mengimplementasikan load balancing, clustering, dan arsitektur redundansi tinggi.</li>
          <li><strong>Business Continuity & DR Plan:</strong> Menyusun taktik pemulihan bencana (Disaster Recovery) yang komprehensif, melakukan simulasi failover berkala, dan mereduksi RTO (Recovery Time Objective) serta RPO (Recovery Point Objective) untuk meningkatkan ketangguhan operasional.</li>
          <li><strong>Manajemen Proteksi Data:</strong> Mengelola siklus backup enterprise, replikasi offsite multi-lokasi, dan prosedur validasi pemulihan data menggunakan teknologi Zerto dan Veeam.</li>
          <li><strong>Pengawasan Backlog & Koordinasi:</strong> Memantau backlog layanan dan berkoordinasi secara aktif dengan tim teknis serta pemangku kepentingan untuk penyelesaian masalah yang tepat waktu.</li>
          <li><strong>Visibilitas Infrastruktur:</strong> Menjaga visibilitas kesehatan infrastruktur dan kinerja layanan melalui pelaporan berkala serta tindakan tindak lanjut yang diperlukan.</li>
        </ul>
      `
    },
    'role-change-problem': {
      title: 'Change & Problem Assistant Manager',
      subtitle: 'Datacomm Diangraha (December 2020 - November 2024)',
      desc: `
        Mengendalikan siklus hidup perubahan infrastruktur dan tata kelola masalah sistem IT untuk meminimalkan gangguan operasional pada sistem produksi.
        <ul>
          <li><strong>Mitigasi Risiko Perubahan:</strong> Memimpin proses evaluasi dampak (impact assessment), perencanaan rollback, dan penjadwalan pemeliharaan sistem kritis guna mencegah terjadinya downtime yang tidak direncanakan.</li>
          <li><strong>Root Cause Analysis (RCA):</strong> Memfasilitasi sesi investigasi mendalam pasca-insiden untuk mengidentifikasi akar penyebab masalah utama, mendokumentasikan error yang diketahui (Known Errors), dan menerapkan perbaikan permanen.</li>
          <li><strong>Kolaborasi Stakeholder:</strong> Bekerja erat dengan tim teknis, manajer layanan, dan pemangku kepentingan untuk memastikan transisi perubahan yang lancar dan komunikasi yang jelas.</li>
          <li><strong>Pelaporan Manajemen:</strong> Menyusun laporan berkala bagi manajemen mengenai efektivitas perubahan, tren insiden, dan kemajuan penyelesaian masalah.</li>
          <li><strong>Kepatuhan Standar ITIL:</strong> Menyelaraskan proses tata kelola insiden, perubahan, dan masalah operasional dengan standar ITIL v4 dan audit kepatuhan ISO internal perusahaan.</li>
        </ul>
      `
    },
    'role-system-engineer': {
      title: 'System Engineer',
      subtitle: 'Datacomm Diangraha (May 2019 - December 2020)',
      desc: `
        Merancang, mengonfigurasi, dan mengelola arsitektur server serta integrasi jaringan inti untuk sistem internal maupun solusi enterprise klien.
        <ul>
          <li><strong>Integrasi Jaringan Inti (DDI):</strong> Membangun dan mengintegrasikan layanan core network penunjang infrastruktur penting seperti DNS Bind9, DHCP ISC Kea, dan IPAM (IP Address Management) untuk operator telekomunikasi skala besar.</li>
          <li><strong>Virtualisasi & Manajemen OS:</strong> Mengelola server berbasis VMware ESXi, melakukan fine-tuning performa kernel Linux (RHEL/CentOS), serta menerapkan patch keamanan berkala untuk meminimalkan kerentanan sistem.</li>
          <li><strong>Arsitektur Sistem:</strong> Merancang dan mengimplementasikan arsitektur sistem untuk mendukung integrasi komponen perangkat keras, perangkat lunak, dan jaringan.</li>
          <li><strong>Kolaborasi Lintas Fungsi:</strong> Berkolaborasi dengan tim lintas fungsi dalam inisiatif peningkatan sistem dan optimalisasi infrastruktur.</li>
          <li><strong>Eskalasi Dukungan L2/L3:</strong> Menangani insiden kompleks tingkat lanjut yang melibatkan anomali sistem operasi, performa penyimpanan (storage bottleneck), dan kegagalan cluster server.</li>
        </ul>
      `
    }
  };

  // Click card to open modal
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const detailId = card.getAttribute('data-detail');
      if (detailId && detailData[detailId]) {
        modalTitle.textContent = detailData[detailId].title;
        modalSubtitle.textContent = detailData[detailId].subtitle;
        modalContent.innerHTML = detailData[detailId].desc;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling behind
      }
    });
  });

  // Close modal functions
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore page scrolling
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  
  // Close with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================
   6. Contact Form Mock Submit Handler & Toast
   ========================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const toast = document.querySelector('.toast-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification helper
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      alert('Semua bidang harus diisi.');
      return;
    }

    // Visual button state feedback during simulation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';

    // Simulate sending message asynchronously
    setTimeout(() => {
      // Clear form inputs
      form.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Trigger success toast notification
      toast.classList.add('show');
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
      
    }, 1500);
  });
}

/* ==========================================
   7. Scroll Reveal Entrance Animations
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================
   8. Hero Typewriter Effect
   ========================================== */
function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  
  const text = el.getAttribute('data-text');
  if (!text) return;
  
  el.textContent = '';
  el.style.width = 'auto';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      // Keep cursor blinking for 2s then remove
      setTimeout(() => {
        el.classList.add('done');
      }, 2000);
    }
  }
  
  // Start after a small delay for page load
  setTimeout(type, 800);
}

/* ==========================================
   9. Animated Stats Counter
   ========================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = String(target).includes('.');
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          
          if (isDecimal) {
            el.textContent = current.toFixed(1) + suffix;
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
          }
        }
        
        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================
   10. Back to Top Button
   ========================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================
   11. Theme Dark / Light Toggle Handler
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;
  
  const icon = toggleBtn.querySelector('i');
  
  // Helper to sync icon classes
  function updateIcon(isDark) {
    if (isDark) {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  // Initial sync state based on preloaded body class
  const isDarkInitial = document.body.classList.contains('dark-theme');
  updateIcon(isDarkInitial);

  // Toggle listener
  toggleBtn.addEventListener('click', () => {
    document.body.classList.add('theme-transitioning');
    
    const isDark = document.body.classList.toggle('dark-theme');
    document.documentElement.classList.toggle('dark-theme', isDark);
    
    // Persist user selection
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Sync icon visual state
    updateIcon(isDark);
    
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 800);
  });
}

/* ==========================================
   12. 3D Parallax Tilt Effect for Cards
   ========================================== */
function initTiltEffect() {
  // Apply tilt to all feature cards
  const cards = document.querySelectorAll('.highlight-card, .skill-category, .cert-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      // Calculate rotation angles (max 8 degrees tilt to keep it subtle)
      const angleX = (yc - y) / yc * 8;
      const angleY = (x - xc) / xc * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================
   13. Magnetic Pull Effect for Interactive Elements
   ========================================== */
function initMagneticButtons() {
  const elements = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn, .theme-toggle, .mobile-toggle, .back-to-top');
  
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move element slightly towards cursor (max 8px)
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ==========================================
   14. Smooth Scroll Progress Bar
   ========================================== */
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progress.style.width = scrolled + '%';
  });
}

/* ==========================================
   15. Interactive Custom Magic Cursor
   ========================================== */
function initMagicCursor() {
  const dot = document.getElementById('magic-cursor-dot');
  const ring = document.getElementById('magic-cursor-ring');
  if (!dot || !ring) return;

  // Only run custom cursor on devices with pointer/mouse
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  document.body.classList.add('use-custom-cursor');

  let ringX = 0, ringY = 0;
  let targetX = 0, targetY = 0;
  let cursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    if (!cursorVisible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      cursorVisible = true;
    }
    
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
  });

  window.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    cursorVisible = true;
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    cursorVisible = false;
  });

  function updateRing() {
    ringX += (targetX - ringX) * 0.15;
    ringY += (targetY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateRing);
  }
  requestAnimationFrame(updateRing);

  // Selector list to scale visual hover cursor states
  const hoverables = 'a, button, .timeline-body, .cert-card, .highlight-card, .skill-category, .lab-btn';
  
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) {
      document.body.classList.add('cursor-hovering');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    if (!e.target.closest(hoverables)) {
      document.body.classList.remove('cursor-hovering');
    }
  });
}

/* ==========================================
   16. CSS Spotlight Shine Hover Coordinates tracker
   ========================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.highlight-card, .skill-category, .cert-card, .timeline-body, .education-card, .lab-monitor, .lab-terminal');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================
   17. Interactive Resilience & Automation Lab Console
   ========================================== */
function initResilienceLab() {
  const btnOutage = document.getElementById('btn-simulate-outage');
  const btnZerto = document.getElementById('btn-run-zerto');
  const btnN8n = document.getElementById('btn-run-n8n');
  const btnAi = document.getElementById('btn-run-ai');
  const btnReset = document.getElementById('btn-reset-lab');
  const consoleLogs = document.getElementById('console-logs');
  const slaValue = document.getElementById('sla-value');
  
  // LED node indicators
  const ledVmware = document.getElementById('led-vmware');
  const statusVmware = document.getElementById('status-vmware');
  const ledDb = document.getElementById('led-db');
  const statusDb = document.getElementById('status-db');
  const ledN8n = document.getElementById('led-n8n');
  const statusn8n = document.getElementById('status-n8n');
  const ledAi = document.getElementById('led-ai');
  const statusAi = document.getElementById('status-ai');
  
  const valRep = document.getElementById('val-rep');
  const valRto = document.getElementById('val-rto');
  
  if (!btnOutage) return;

  let sla = 99.98;
  let slaInterval = null;
  let simulationActive = false;

  function writeLog(text, type = 'system') {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logLine = document.createElement('div');
    logLine.className = `log-line ${type}-log`;
    
    let prefix = '> ';
    if (type === 'warn') prefix = '[WARN] ';
    if (type === 'critical') prefix = '[CRITICAL] ';
    if (type === 'success') prefix = '[SUCCESS] ';
    if (type === 'ai') prefix = '[AI OPS] ';
    
    logLine.textContent = `${prefix}${time} - ${text}`;
    consoleLogs.appendChild(logLine);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  btnOutage.addEventListener('click', () => {
    if (simulationActive) return;
    simulationActive = true;
    
    writeLog('Database node synchronization link down.', 'warn');
    
    setTimeout(() => {
      ledDb.className = 'node-led led-red';
      statusDb.textContent = 'CRITICAL';
      statusDb.className = 'node-status status-critical';
      
      ledVmware.className = 'node-led led-yellow';
      statusVmware.textContent = 'HIGH CPU LOAD';
      statusVmware.className = 'node-status status-warning';
      
      valRto.textContent = 'Outage Active';
      valRto.style.color = '#ef4444';
      
      writeLog('Primary Hypervisor host CPU capacity spike: 98% utilization.', 'critical');
      writeLog('Production DB Cluster: heartbeat timed out. Status: CRITICAL.', 'critical');
      
      // Screen shake animation simulation
      const labGrid = document.querySelector('.lab-grid');
      labGrid.classList.add('outage-flash');
      setTimeout(() => labGrid.classList.remove('outage-flash'), 1000);
      
      // SLA depletion interval
      slaInterval = setInterval(() => {
        sla -= (Math.random() * 0.01 + 0.005);
        slaValue.textContent = sla.toFixed(4) + '%';
        if (sla <= 99.1) clearInterval(slaInterval);
      }, 300);
      
      writeLog('Continuity policy violated. SLA degradation active...', 'critical');
      
      btnOutage.disabled = true;
      btnZerto.disabled = false;
      btnN8n.disabled = false;
      btnAi.disabled = false;
      
    }, 800);
  });

  btnZerto.addEventListener('click', () => {
    disableActionButtons();
    clearInterval(slaInterval);
    
    writeLog('Zerto Recovery Protocol triggered. Processing hot failover sequence.', 'system');
    
    setTimeout(() => writeLog('Verifying replica synchronization markers (RPO: 0.8s)...', 'system'), 400);
    setTimeout(() => writeLog('Mounting datastores on secondary cluster recovery host...', 'system'), 800);
    setTimeout(() => writeLog('Re-binding Active-Active network paths via BGP updates...', 'system'), 1200);
    
    setTimeout(() => {
      ledDb.className = 'node-led led-blue';
      statusDb.textContent = 'RECOVERED (DR)';
      statusDb.className = 'node-status status-dr';
      
      ledVmware.className = 'node-led led-green';
      statusVmware.textContent = 'Online';
      statusVmware.className = 'node-status status-online';
      
      valRto.textContent = '3.2s RTO (Secured)';
      valRto.style.color = 'var(--accent-teal)';
      
      writeLog('Production database traffic safely failed over to standby DC.', 'success');
      writeLog('System SLA stabilized. Continuity fully restored. Duration: 3.2s.', 'success');
    }, 1600);
  });

  btnN8n.addEventListener('click', () => {
    disableActionButtons();
    clearInterval(slaInterval);
    
    writeLog('n8n Healing webhook triggered. Scanning target processes...', 'system');
    
    setTimeout(() => writeLog('Container crash signature found inside db_prod daemon...', 'system'), 400);
    setTimeout(() => writeLog('Executing auto-recovery instruction: docker restart db_prod...', 'system'), 800);
    setTimeout(() => writeLog('Clearing locked virtual memory tables and swap partitions...', 'system'), 1200);
    
    setTimeout(() => {
      ledDb.className = 'node-led led-green';
      statusDb.textContent = 'Online';
      statusDb.className = 'node-status status-online';
      
      ledVmware.className = 'node-led led-green';
      statusVmware.textContent = 'Online';
      statusVmware.className = 'node-status status-online';
      
      valRto.textContent = '2.1s RTO (Auto-Healed)';
      valRto.style.color = 'var(--accent-emerald)';
      
      writeLog('PostgreSQL service responded nominal on host port 5432.', 'success');
      writeLog('n8n self-healing workflow completed service check. Duration: 2.1s.', 'success');
    }, 1600);
  });

  btnAi.addEventListener('click', () => {
    disableActionButtons();
    clearInterval(slaInterval);
    
    writeLog('AI Operations Agent initialized. Telemetry scan active...', 'ai');
    
    setTimeout(() => writeLog('AI Agent: Root cause identified as VM memory balloon conflict.', 'ai'), 400);
    setTimeout(() => writeLog('AI Agent: Hot-adding 8GB physical memory allocation to host...', 'ai'), 800);
    setTimeout(() => writeLog('Sending hot_expand_ram API call directly to ESXi endpoint...', 'ai'), 1200);
    
    setTimeout(() => {
      ledDb.className = 'node-led led-teal';
      statusDb.textContent = 'OPTIMIZED (AI)';
      statusDb.className = 'node-status status-online';
      
      ledVmware.className = 'node-led led-green';
      statusVmware.textContent = 'Online';
      statusVmware.className = 'node-status status-online';
      
      valRto.textContent = '1.7s RTO (AI Managed)';
      valRto.style.color = 'var(--accent-cyan)';
      
      writeLog('Host memory leaks resolved. Performance indicators nominal.', 'success');
      writeLog('AI Auto-Mitigation confirmed recovery under strict SLAs. Duration: 1.7s.', 'success');
    }, 1600);
  });

  btnReset.addEventListener('click', () => {
    resetSimulator();
  });

  function disableActionButtons() {
    btnZerto.disabled = true;
    btnN8n.disabled = true;
    btnAi.disabled = true;
  }

  function resetSimulator() {
    clearInterval(slaInterval);
    simulationActive = false;
    sla = 99.98;
    slaValue.textContent = '99.98%';
    
    ledDb.className = 'node-led led-green';
    statusDb.textContent = 'Online';
    statusDb.className = 'node-status status-online';
    
    ledVmware.className = 'node-led led-green';
    statusVmware.textContent = 'Online';
    statusVmware.className = 'node-status status-online';
    
    valRto.textContent = 'Nominal (Standby)';
    valRto.style.color = '';
    
    consoleLogs.innerHTML = '';
    writeLog('Resilience simulator initialized. System status: NOMINAL.', 'system');
    writeLog('Monitoring replication pipelines, backup status, and host health...', 'system');
    
    btnOutage.disabled = false;
    btnZerto.disabled = true;
    btnN8n.disabled = true;
    btnAi.disabled = true;
  }
}
