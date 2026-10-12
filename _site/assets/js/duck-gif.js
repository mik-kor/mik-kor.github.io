// Insert a GIF duck under the contact address and control its animation
(function() {
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function() {
    const contactGrid = document.querySelector('#contact .contact-grid');
    if (!contactGrid) return;

    // Ensure container is positioned
    contactGrid.style.position = contactGrid.style.position || 'relative';

    // Create the image element (prefer GIF, fallback to PNG)
    const img = document.createElement('img');
    img.className = 'walking-duck-gif';
    img.alt = 'duck';
    img.src = '/assets/images/duck.gif';
    img.onerror = () => { if (!img.src.endsWith('.png')) img.src = '/assets/images/duck.png'; };

    contactGrid.appendChild(img);

    // Sound
    function playQuack() {
      const a = new Audio('/assets/sounds/duck-quack.mp3');
      a.volume = 0.6;
      a.play().catch(()=>{});
    }

    // Random pause logic
    let pauseTimeout = null;
    function maybePause() {
      if (Math.random() < 0.06) {
        img.classList.add('paused');
        const ms = 800 + Math.floor(Math.random() * 2200);
        pauseTimeout = setTimeout(() => img.classList.remove('paused'), ms);
      }
    }
    const pauseInterval = setInterval(maybePause, 1000);

    // Click -> freeze and quack
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      // freeze briefly
      img.classList.add('paused');
      img.classList.add('frozen');
      playQuack();
      clearTimeout(pauseTimeout);
      setTimeout(() => {
        img.classList.remove('paused');
        img.classList.remove('frozen');
      }, 200);
    });

    // Clean up when unloading
    window.addEventListener('beforeunload', () => {
      clearInterval(pauseInterval);
    });
  });
})();
