const canvas = document.getElementById('mouse-trail-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
let mouse = { x: 0, y: 0 };
let isDrawing = false;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  isDrawing = true;
  points.push({
    x: mouse.x,
    y: mouse.y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    time: Date.now()
  });
  if (points.length > 50) points.shift();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    // Animate for organic movement (optional tweak)
    p.x += p.vx * 0.2;
    p.y += p.vy * 0.2;

    let alpha = (1 - i / points.length) * 0.4;
    let radius = 30 + Math.sin((Date.now() - p.time) / 200) * 10;

    let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
    grad.addColorStop(0, `rgba(241, 90, 36, ${alpha})`);
    grad.addColorStop(0.7, `rgba(69, 69, 69, ${alpha * 0.6})`);
    grad.addColorStop(1, 'rgba(69,69,69,0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();