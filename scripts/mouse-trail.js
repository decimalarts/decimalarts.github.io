// Get the container (should exist in HTML as <div id="mouse-trail"></div>)
const trailContainer = document.getElementById('mouse-trail');

// If not found, create it (safe fallback)
if (!trailContainer) {
  const div = document.createElement('div');
  div.id = 'mouse-trail';
  document.body.appendChild(div);
}

// Parameters
const TRAIL_LENGTH = 18;
const DOT_SIZE = 32; // px
const DOT_BLUR = 10; // px
const DOT_OPACITY = 0.6;
const GREY_RGB = [69, 69, 69];
const ORANGE_RGB = [241, 90, 36];
const IDLE_FADE_MS = 500;

// State
let dots = [];
let lastPos = {x: window.innerWidth/2, y: window.innerHeight/2};
let lastMoveTime = Date.now();
let lastColor = 'rgba(69,69,69,0.6)';
let idleInterval = null;

// Helper: linear interpolation
function lerp(a, b, t) { return a + (b - a) * t; }

// Color function for speed
function colorForSpeed(speed) {
  // Clamp speed 0..1
  speed = Math.min(1, Math.max(0, speed));
  // Interpolate RGB
  const r = Math.round(lerp(GREY_RGB[0], ORANGE_RGB[0], speed));
  const g = Math.round(lerp(GREY_RGB[1], ORANGE_RGB[1], speed));
  const b = Math.round(lerp(GREY_RGB[2], ORANGE_RGB[2], speed));
  const a = lerp(DOT_OPACITY, 1, speed);
  return `rgba(${r},${g},${b},${a})`;
}

// Add a glowing dot
function addDot(x, y, color) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = `${x - DOT_SIZE/2}px`;
  dot.style.top = `${y - DOT_SIZE/2}px`;
  dot.style.width = `${DOT_SIZE}px`;
  dot.style.height = `${DOT_SIZE}px`;
  dot.style.position = 'absolute';
  dot.style.pointerEvents = 'none';
  dot.style.borderRadius = '50%';
  dot.style.opacity = DOT_OPACITY;
  dot.style.filter = `blur(${DOT_BLUR}px)`;
  dot.style.background = `radial-gradient(circle, ${color} 0%, transparent 80%)`;
  dot.style.transition = 'opacity 0.3s linear';
  document.getElementById('mouse-trail').appendChild(dot);
  dots.push(dot);
  // Remove old dots
  if (dots.length > TRAIL_LENGTH) {
    const oldDot = dots.shift();
    oldDot.style.opacity = 0;
    setTimeout(() => oldDot && oldDot.remove(), 300);
  }
}

// Mouse movement handler
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const dt = now - lastMoveTime;
  // Use pixels per ms, normalize to 0...1 (tune denominator for sensitivity)
  let speed = Math.min(1, dist / Math.max(8, dt));
  if (dt > 100) speed = 0; // If mouse stopped, fade back to grey/transparent

  const color = colorForSpeed(speed);
  addDot(e.clientX, e.clientY, color);

  lastPos = {x: e.clientX, y: e.clientY};
  lastMoveTime = now;
  lastColor = color;

  if (idleInterval) clearInterval(idleInterval);
  idleInterval = setInterval(() => {
    // Fade trail to transparent if idle
    if (Date.now() - lastMoveTime > IDLE_FADE_MS) {
      addDot(lastPos.x, lastPos.y, 'rgba(69,69,69,0.08)');
    }
  }, 30);
});

// Initial setup: ensure container is styled
(function injectTrailStyle() {
  if (document.getElementById('mouse-trail-style')) return;
  const style = document.createElement('style');
  style.id = 'mouse-trail-style';
  style.innerHTML = `
    #mouse-trail {
      pointer-events: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 9999;
      overflow: visible;
    }
    .trail-dot {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform, background;
    }
  `;
  document.head.appendChild(style);
})();