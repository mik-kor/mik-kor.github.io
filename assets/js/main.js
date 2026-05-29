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
  
  const switchEl = document.querySelector('.theme-switch');

  // init from localStorage (default: dark)
  const stored = localStorage.getItem('theme');
  if (stored === 'light') root.classList.add('light-theme');

  // aria-pressed = true => dark (matches your CSS)
  const applySwitchState = () => {
    const isLight = root.classList.contains('light-theme');
    if (switchEl) switchEl.setAttribute('aria-pressed', String(!isLight));
  };
  applySwitchState();

  if (switchEl) {
    switchEl.addEventListener('click', () => {
      root.classList.toggle('light-theme');
      const isLight = root.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      applySwitchState();
    });
  }
});

// --- Theme Cord Pull Switch with Physics ---
const cordPull = document.getElementById('theme-cord');
const cord = cordPull?.querySelector('.cord');
const pullKnob = cordPull?.querySelector('.pull-knob');
let isAnimating = false;
let isDarkTheme = !root.classList.contains('light-theme');

// Physics constants
const CORD_LENGTH = 40;
const MAX_PULL = 35;
const SPRING_STIFFNESS = 0.12;
const DAMPING = 0.85;
const GRAVITY = 0.3;

let cordY = 0; // current pull distance
let cordVelocity = 0; // velocity
let mouseDown = false;
let startY = 0;

function updateCord() {
  // Apply spring force (pull back toward 0)
  const springForce = -cordY * SPRING_STIFFNESS;
  
  // Apply gravity when not dragging
  const gravityForce = !mouseDown ? GRAVITY : 0;
  
  // Update velocity with forces and damping
  cordVelocity = (cordVelocity + springForce + gravityForce) * DAMPING;
  
  // Update position
  cordY += cordVelocity;
  
  // Clamp to max pull
  cordY = Math.max(-MAX_PULL, Math.min(0, cordY));
  
  // Apply transforms
  if (cord) {
    const angle = (cordY / MAX_PULL) * 15; // Max 15deg rotation
    cord.style.transform = `scaleY(${1 + Math.abs(cordY) / CORD_LENGTH * 0.15}) rotateZ(${angle}deg)`;
  }
  
  if (pullKnob) {
    pullKnob.style.transform = `translateX(-50%) translateY(${cordY}px)`;
  }
}

function animatePhysics() {
  updateCord();
  if (Math.abs(cordVelocity) > 0.01 || mouseDown) {
    requestAnimationFrame(animatePhysics);
  }
}

if (cordPull) {
  // Mouse down - start dragging
  cordPull.addEventListener('mousedown', (e) => {
    mouseDown = true;
    startY = e.clientY;
    cordVelocity = 0;
    animatePhysics();
  });

  // Mouse move - pull the cord
  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    const deltaY = e.clientY - startY;
    cordY = Math.max(-MAX_PULL, Math.min(0, deltaY));
  });

  // Mouse up - release and check if pulled enough
  document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    
    // If pulled more than 60% of max, toggle theme
    if (Math.abs(cordY) > MAX_PULL * 0.6) {
      toggleTheme();
    }
    
    cordVelocity = cordY * 0.2; // Give it a bounce back
    animatePhysics();
  });

  // Touch support
  cordPull.addEventListener('touchstart', (e) => {
    mouseDown = true;
    startY = e.touches[0].clientY;
    cordVelocity = 0;
    animatePhysics();
  });

  document.addEventListener('touchmove', (e) => {
    if (!mouseDown) return;
    const deltaY = e.touches[0].clientY - startY;
    cordY = Math.max(-MAX_PULL, Math.min(0, deltaY));
  });

  document.addEventListener('touchend', () => {
    if (!mouseDown) return;
    mouseDown = false;
    if (Math.abs(cordY) > MAX_PULL * 0.6) {
      toggleTheme();
    }
    cordVelocity = cordY * 0.2;
    animatePhysics();
  });
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  root.classList.toggle('light-theme');
  cordPull?.classList.add('active');
  setTimeout(() => cordPull?.classList.remove('active'), 300);
  localStorage.setItem('site-theme', isDarkTheme ? 'dark' : 'light');
}

// Init theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('site-theme');
  isDarkTheme = stored !== 'light';
  if (!isDarkTheme) {
    root.classList.add('light-theme');
  }
  animatePhysics();
});
