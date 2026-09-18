/* ==========================================================================
   ISA HERNANDEZ | PHOTO & MAKE UP
   Core Navigation, Hero Slideshow & Scroll Animation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. Mobile Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  if (mobileToggle && mobileDrawer && mobileOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    const mobileClose = document.querySelector('.mobile-drawer-close');
    if (mobileClose) {
      mobileClose.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  // 3. Active Link Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && href !== currentPath) {
      link.classList.remove('active');
    }
  });

  // 4. HERO BACKGROUND SLIDESHOW (Smooth Crossfade)
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentSlideIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  }

  function nextSlide() {
    if (heroSlides.length === 0) return;
    const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    showSlide(nextIndex);
  }

  if (heroSlides.length > 1) {
    slideInterval = setInterval(nextSlide, 5000);

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(idx);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });

    const heroContainer = document.querySelector('.hero-editorial');
    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroContainer.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
  }

  // 5. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});

// 6. Direct Email Dispatcher for Contact Form
function sendContactEmail(e) {
  if (e) e.preventDefault();
  const name = (document.getElementById('contactName')?.value || '').trim();
  const email = (document.getElementById('contactEmail')?.value || '').trim();
  const phone = (document.getElementById('contactPhone')?.value || '').trim();
  const service = document.getElementById('contactService')?.value || 'Consulta General';
  const msg = (document.getElementById('contactMsg')?.value || '').trim();

  const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');

  const subject = encodeURIComponent(
    isEn ? `Website Inquiry: ${name || 'Client'} - ${service}` : `Consulta Web: ${name || 'Cliente'} - ${service}`
  );

  const body = encodeURIComponent(
    isEn
      ? `Hello Isa,\n\nI am contacting you through your official website:\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Phone: ${phone}\n` +
        `• Service of interest: ${service}\n\n` +
        `Message / Tentative Date / Notes:\n${msg || 'I would like to inquire about availability and details.'}\n\n` +
        `--\nIsa Hernandez Photo & Makeup LLC (Phoenix, AZ)`
      : `Hola Isa,\n\nTe contacto a través de tu sitio web oficial:\n\n` +
        `• Nombre: ${name}\n` +
        `• Correo: ${email}\n` +
        `• Teléfono: ${phone}\n` +
        `• Servicio de interés: ${service}\n\n` +
        `Mensaje / Fecha tentativa / Detalles:\n${msg || 'Me gustaría consultar disponibilidad y detalles.'}\n\n` +
        `--\nIsa Hernandez Photo & Makeup LLC (Phoenix, AZ)`
  );

  window.location.href = `mailto:Isavision21@gmail.com?subject=${subject}&body=${body}`;
}
