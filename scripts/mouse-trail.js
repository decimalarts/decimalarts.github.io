const trailContainer = document.getElementById('mouse-trail');
const trailLength = 18; // Number of dots in the trail
const dots = [];
let lastPos = {x: window.innerWidth/2, y: window.innerHeight/2};
let lastMoveTime = Date.now();
let lastColor = 'rgba(69,69,69,0.6)';
let lastSpeed = 0;

function lerp(a, b, t) { return a + (b - a) * t; }

function colorForSpeed(speed) {
  // Speed 0 = grey, speed > 1 = orange
  // Clamp speed 0..1
  speed = Math.min(1, Math.max(0, speed));
  // RGBA for #454545 and #F15A24
  const grey = [69, 69, 69];
  const orange = [241, 90, 36];
  const r = Math.round(lerp(grey[0], orange[0], speed));
  const g = Math.round(lerp(grey[1], orange[1], speed));
  const b = Math.round(lerp(grey[2], orange[2], speed));
  const a = lerp(0.6, 1, speed); // Optional: more intensity at higher speed
  return `rgba(${r},${g},${b},${a})`;
}

function addDot(x, y, color) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = `${x - 16}px`;
  dot.style.top = `${y - 16}px`;
  dot.style.width = '32px';
  dot.style.height = '32px';
  dot.style.background = `radial-gradient(circle, ${color} 0%, transparent 80%)`;
  trailContainer.appendChild(dot);
  dots.push(dot);
  if (dots.length > trailLength) {
    const oldDot = dots.shift();
    oldDot.style.opacity = 0;
    setTimeout(() => oldDot.remove(), 300);
  }
}

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const dt = now - lastMoveTime;
  // pixels per ms, mapped to 0..1
  let speed = Math.min(1, dist / Math.max(10, dt)); // tune denominator for sensitivity
  if (dt > 100) speed = 0; // If mouse stopped, fade back to grey/transparent

  const color = colorForSpeed(speed);
  addDot(e.clientX, e.clientY, color);

  lastPos = {x: e.clientX, y: e.clientY};
  lastMoveTime = now;
  lastColor = color;
  lastSpeed = speed;
});

// Fade back to transparent when idle
setInterval(() => {
  const now = Date.now();
  if (now - lastMoveTime > 60) {
    // Gradually fade to transparent if idle
    addDot(lastPos.x, lastPos.y, 'rgba(69,69,69,0.1)');
  }
}, 30);