// Interactive Walking Duck
(function() {
  // Wait for contact section to exist
  const contactSection = document.querySelector('#contact .contact-grid');
  if (!contactSection) {
    console.log('Contact section not found, skipping duck');
    return;
  }

  // If a GIF-based duck is present, skip the pixel-art duck to avoid duplication
  if (document.querySelector('.walking-duck-gif')) {
    return;
  }

  const duck = document.createElement('div');
  duck.id = 'walking-duck';
  duck.innerHTML = `
    <div class="duck-pixel-art">
      <!-- Head -->
      <div class="pixel p-row-0"></div><div class="pixel p-row-0"></div><div class="pixel p-row-0"></div><div class="pixel p-row-0"></div>
      <div class="pixel p-row-1"></div><div class="pixel p-row-1"></div><div class="pixel p-row-1"></div><div class="pixel p-row-1"></div><div class="pixel p-row-1"></div>
      <div class="pixel p-row-2"></div><div class="pixel p-row-2"></div><div class="pixel p-row-2 eye"></div><div class="pixel p-row-2"></div><div class="pixel p-row-2"></div><div class="pixel p-row-2"></div>
      <!-- Body -->
      <div class="pixel p-row-3"></div><div class="pixel p-row-3"></div><div class="pixel p-row-3"></div><div class="pixel p-row-3"></div><div class="pixel p-row-3"></div><div class="pixel p-row-3"></div><div class="pixel p-row-3"></div>
      <div class="pixel p-row-4"></div><div class="pixel p-row-4"></div><div class="pixel p-row-4"></div><div class="pixel p-row-4"></div><div class="pixel p-row-4"></div><div class="pixel p-row-4"></div>
      <!-- Legs -->
      <div class="pixel p-row-5"></div><div class="pixel p-row-5"></div><div class="pixel p-row-5"></div><div class="pixel p-row-5"></div>
    </div>
  `;
  
  // Insert duck after contact section
  contactSection.parentElement.appendChild(duck);

  let legOffset = 0;
  let x = 0;
  let directionX = 1;
  let speed = 0.5;
  let walkingCounter = 0;
  let pauseCounter = 0;
  let isPaused = false;
  let isFrozen = false;
  let frozenUntil = 0;

  function playQuackSound() {
    const audio = new Audio('/assets/sounds/duck-quack.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => {
      try {
        createQuackSound();
      } catch (e) {
        console.log('Audio playback not available');
      }
    });
  }

  function createQuackSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create the main quack tone
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const gain2 = audioContext.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Quack pitch - starts high, drops down
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    osc2.frequency.setValueAtTime(250, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.15);

    // Volume envelope
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.05, now + 0.15);

    osc1.connect(gain);
    osc2.connect(gain2);
    gain.connect(audioContext.destination);
    gain2.connect(audioContext.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);

    osc2.start(now);
    osc2.stop(now + 0.2);
  }

  duck.addEventListener('click', function(e) {
    e.stopPropagation();
    playQuackSound();
    
    // Freeze duck for 800ms
    isFrozen = true;
    frozenUntil = Date.now() + 800;
    duck.style.opacity = '0.7';
  });

  function update() {
    // Check if frozen
    if (isFrozen && Date.now() < frozenUntil) {
      // Stay frozen, just slight opacity change
      duck.style.opacity = '0.7';
    } else {
      // Unfrozen
      isFrozen = false;
      duck.style.opacity = '1';
      
      // Get container bounds
      const container = duck.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const maxX = rect.width - 120; // Account for duck width
        const minX = 0;
        
        // Handle pausing behavior
        if (pauseCounter > 0) {
          pauseCounter--;
        } else if (Math.random() < 0.02) {
          // Randomly pause for 20-60 frames
          pauseCounter = 20 + Math.floor(Math.random() * 40);
        }
        
        if (pauseCounter === 0) {
          // Walking behavior
          x += directionX * speed;
          
          // Bounce off edges
          if (x <= minX) {
            x = minX;
            directionX = 1;
          } else if (x >= maxX) {
            x = maxX;
            directionX = -1;
          }
          
          walkingCounter++;
        }
        
        // Apply horizontal position and direction flip
        duck.style.transform = directionX < 0 ? `translateX(${x}px) scaleX(-1)` : `translateX(${x}px) scaleX(1)`;
      }
    }

    requestAnimationFrame(update);
  }

  // Start animation when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
