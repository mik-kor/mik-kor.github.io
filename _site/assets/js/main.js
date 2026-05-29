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

// Theme switch with simple spring animation
const themeSwitch = document.getElementById('theme-switch');
const root = document.documentElement;

function applyTheme(isLight) {
  if (isLight) {
    root.classList.add('light-theme');
    themeSwitch.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('light-theme');
    themeSwitch.setAttribute('aria-pressed', 'false');
  }
}

// Init from localStorage or system preference
const stored = localStorage.getItem('site-theme');
let isLight = stored ? stored === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches;
if (themeSwitch) applyTheme(isLight);

// Spring animation state
let anim = null;
function springToggle(targetLight) {
  cancelAnimationFrame(anim);
  const duration = 420;
  const start = performance.now();
  const from = Number(themeSwitch.getAttribute('aria-pressed') === 'true');
  const to = targetLight ? 1 : 0;

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    // easeOutElastic-like approximation
    const p = t === 0 ? 0 : t === 1 ? 1 : (Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1);
    const cur = from + (to - from) * p;
    // update visual position via transform on .switch-face
    const face = themeSwitch.querySelector('.switch-face');
    if (face) {
      const x = 4 + cur * 8; // translateX from 4px to 12px
      const rot = -6 * cur; // rotate
      face.style.transform = `translateY(${(1 - cur) * 2}px) rotate(${rot}deg) translateX(${x}px)`;
    }
    if (t < 1) anim = requestAnimationFrame(step);
    else {
      applyTheme(targetLight);
      localStorage.setItem('site-theme', targetLight ? 'light' : 'dark');
    }
  }
  anim = requestAnimationFrame(step);
}

if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    const currentlyLight = root.classList.contains('light-theme');
    springToggle(!currentlyLight);
  });
}

// On load, set switch face to correct position
document.addEventListener('DOMContentLoaded', () => {
  const face = themeSwitch?.querySelector('.switch-face');
  if (!face) return;
  const pressed = themeSwitch.getAttribute('aria-pressed') === 'true';
  const cur = pressed ? 1 : 0;
  const x = 4 + cur * 8;
  const rot = -6 * cur;
  face.style.transform = `translateY(${(1 - cur) * 2}px) rotate(${rot}deg) translateX(${x}px)`;
});
