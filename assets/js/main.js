// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks_list = document.querySelectorAll('.nav-links a');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Update nav links
      navLinks_list.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(entry.target.id)) {
          link.classList.add('active');
        }
      });
      
      // Update sidebar links
      sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(entry.target.id)) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));
