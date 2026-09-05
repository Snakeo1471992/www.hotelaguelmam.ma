// Menu mobile
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  // Navbar scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Marquer le lien actif
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Galerie chambres (carousel)
  document.querySelectorAll('.room-gallery').forEach(g => {
    const imgs = g.querySelectorAll('.room-gallery-main img');
    const thumbs = g.querySelectorAll('.room-thumbs img');
    let i = 0;
    const show = (n) => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((el, k) => el.classList.toggle('active', k === i));
      thumbs.forEach((el, k) => el.classList.toggle('active', k === i));
    };
    g.querySelector('.prev')?.addEventListener('click', () => show(i - 1));
    g.querySelector('.next')?.addEventListener('click', () => show(i + 1));
    thumbs.forEach((t, k) => t.addEventListener('click', () => show(k)));
  });

  // Lightbox galerie
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
      if (!lb || !lbImg) return;
      lbImg.src = img.src;
      lb.classList.add('open');
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', () => lb?.classList.remove('open'));
  lb?.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });

  // Menu scroll animations
  const menuCards = document.querySelectorAll('.menu-card');
  if (menuCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    menuCards.forEach(card => observer.observe(card));
  }

  // Menu search functionality
  const searchInput = document.getElementById('menu-search');
  const noResults = document.getElementById('search-no-results');
  if (searchInput && noResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const menuCards = document.querySelectorAll('.menu-card');
      let hasResults = false;

      menuCards.forEach(card => {
        const items = card.querySelectorAll('.menu-item');
        const tableRows = card.querySelectorAll('.menu-table-row');
        let cardHasMatch = false;

        items.forEach(item => {
          const dishName = item.querySelector('span:first-child').textContent.toLowerCase();
          if (query === '' || dishName.includes(query)) {
            item.style.display = 'flex';
            cardHasMatch = true;
          } else {
            item.style.display = 'none';
          }
        });

        tableRows.forEach(row => {
          const dishName = row.querySelector('span:first-child').textContent.toLowerCase();
          if (query === '' || dishName.includes(query)) {
            row.style.display = 'grid';
            cardHasMatch = true;
          } else {
            row.style.display = 'none';
          }
        });

        if (query === '' || cardHasMatch) {
          card.style.display = 'block';
          if (cardHasMatch) hasResults = true;
        } else {
          card.style.display = 'none';
        }
      });

      noResults.style.display = (query !== '' && !hasResults) ? 'block' : 'none';
    });
  }

  // Menu navigation active state and smooth scroll
  const menuNavLinks = document.querySelectorAll('.menu-nav-link');
  const menuNavInner = document.querySelector('.menu-nav-inner');
  if (menuNavLinks.length > 0 && menuNavInner) {
    // Function to center active link in navigation
    const centerActiveLink = (activeLink) => {
      const navWidth = menuNavInner.clientWidth;
      const linkLeft = activeLink.offsetLeft;
      const linkWidth = activeLink.offsetWidth;
      const scrollLeft = linkLeft - (navWidth / 2) + (linkWidth / 2);
      menuNavInner.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    };

    // Click behavior with smooth scroll and centering
    menuNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        menuNavLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Center the clicked link
        centerActiveLink(link);
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navHeight = document.querySelector('.menu-nav').offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Scroll Spy using Intersection Observer
    const sections = document.querySelectorAll('.menu-card');
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          
          // Remove active类 from all links
          menuNavLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to corresponding link
          const activeLink = document.querySelector(`.menu-nav-link[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
            centerActiveLink(activeLink);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
});
