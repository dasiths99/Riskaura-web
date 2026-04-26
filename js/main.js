/* ============================================================
   RISKAURA — Main JavaScript
   Navigation, tabs, form handling, scroll effects
   ============================================================ */

(function () {
  // ---- DOM Elements ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');
  const allNavLinks = document.querySelectorAll('.nav-links a');
  const domainTabs = document.querySelectorAll('.domain-tab');
  const domainContents = document.querySelectorAll('.domain-content');
  const sections = document.querySelectorAll('section[id]');

  // ---- Mobile Menu Toggle ----
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu when a link is clicked
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // ---- Navbar Scroll Effect ----
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active nav link highlighting
    highlightNavLink();
  }, { passive: true });

  // ---- Active Section Highlighting ----
  function highlightNavLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---- Scroll to Top ----
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Domain Tabs ----
  domainTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Remove active from all tabs
      domainTabs.forEach(function (t) { t.classList.remove('active'); });
      domainContents.forEach(function (c) { c.classList.remove('active'); });

      // Activate clicked tab
      this.classList.add('active');
      var targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // ---- Smooth Scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 72; // nav height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Contact Form ----
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate send (frontend only)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ---- Notification Toast ----
  function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = '<span>' + (type === 'success' ? '✅' : '⚠️') + '</span> ' + message;

    // Styling
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      padding: '14px 28px',
      background: type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
      border: '1px solid ' + (type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'),
      borderRadius: '12px',
      color: '#f1f5f9',
      fontSize: '0.9rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: '2000',
      opacity: '0',
      transition: 'all 0.4s ease',
      maxWidth: '90%',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after 4 seconds
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  }

  // ---- Keyboard accessibility for tabs ----
  domainTabs.forEach(function (tab, index) {
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        var next = domainTabs[(index + 1) % domainTabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = domainTabs[(index - 1 + domainTabs.length) % domainTabs.length];
        prev.focus();
        prev.click();
      }
    });
  });

  // ---- Initial highlight ----
  highlightNavLink();

})();
