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
    
    // Draw connections first (behind particles)
    drawConnections();
    
    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

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
    const isDark = document.body.classList.toggle('dark-theme');
    document.documentElement.classList.toggle('dark-theme', isDark);
    
    // Persist user selection
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Sync icon visual state
    updateIcon(isDark);
  });
}
