/* ============================================================
   RISKAURA — Scroll-triggered Animations
   Intersection Observer based reveal system
   ============================================================ */

(function () {
  // --- Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, stop observing for performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: reveal everything immediately for older browsers
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // --- Parallax Glow Effect on Scroll ---
  const glows = document.querySelectorAll('.hero-glow');
  
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    glows.forEach(function (glow, index) {
      const speed = (index + 1) * 0.1;
      glow.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }, { passive: true });

})();
