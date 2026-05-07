/* Infix Solutions — Premium interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Navbar scroll state ===== */
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== Mobile menu toggle ===== */
  const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.innerHTML = navLinks.classList.contains('open') ? '&times;' : '&#9776;';
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }

  /* ===== Active link based on current page ===== */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
    else a.classList.remove('active');
  });

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== Animated counters ===== */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ===== Smooth hero background parallax (mouse + scroll, lerped) ===== */
  const parallaxEl = document.querySelector('[data-parallax]');
  const heroEl = document.querySelector('.hero');
  if (parallaxEl && heroEl) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 820px)').matches;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let scrollOffset = 0;

    if (isDesktop && !reduceMotion) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = px * -30;
        targetY = py * -22;
      });
      heroEl.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });
    }

    const onHeroScroll = () => {
      scrollOffset = Math.min(window.scrollY * 0.25, 220);
    };
    onHeroScroll();
    window.addEventListener('scroll', onHeroScroll, { passive: true });

    if (!reduceMotion) {
      const tick = () => {
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;
        parallaxEl.style.transform =
          `translate3d(${currentX.toFixed(2)}px, ${(currentY + scrollOffset).toFixed(2)}px, 0)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ===== Subtle parallax on hero orbs ===== */
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length && window.matchMedia('(min-width: 820px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.15;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

  /* ===== Product inquiry → WhatsApp ===== */
  document.querySelectorAll('.btn-inquire').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || 'a product';
      const phone = '6791234567';
      const msg = encodeURIComponent(`Hi Infix Solutions, I'd like to inquire about: ${product}`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    });
  });

  /* ===== Quote / contact form handlers ===== */
  ['quoteForm', 'contactForm'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successId = id === 'quoteForm' ? 'formSuccess' : 'contactSuccess';
      const success = document.getElementById(successId);
      if (success) {
        success.classList.add('active');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => success.classList.remove('active'), 6000);
      }
      form.reset();
    });
  });

  /* ===== Filter tabs (products / projects / blog) ===== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterableItems = document.querySelectorAll('[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterableItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });

});
