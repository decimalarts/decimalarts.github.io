const canvas = document.getElementById('mouse-trail-canvas');
const ctx = canvas.getContext('2d');

let w = window.innerWidth, h = window.innerHeight;
canvas.width = w;
canvas.height = h;

window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
});

let trail = [];
const TRAIL_LENGTH = 32;

let lastMoveTime = Date.now();
let lastPos = {x: w/2, y: h/2};
let speed = 0;

// Helper for organic jitter
function jitter(val, amount) {
  return val + (Math.random() - 0.5) * amount;
}

// Helper for lerping
function lerp(a, b, t) {
  return a + (b - a) * t;
}

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    speed = Math.sqrt(dx*dx + dy*dy) / Math.max(1, now - lastMoveTime);
    lastMoveTime = now;
    lastPos = {x: e.clientX, y: e.clientY};
    trail.push({
        x: e.clientX,
        y: e.clientY,
        t: now,
        vx: dx,
        vy: dy,
        // Give each point a random "seed" for organic shape
        seed: Math.random() * 1000
    });
    if (trail.length > TRAIL_LENGTH) trail.shift();
});

function organicBlobPath(cx, cy, r, t, seed) {
    // Draw a wobbly/organic blob using 8 points around a circle, with per-point jitter
    ctx.beginPath();
    for (let i = 0; i < 8; ++i) {
        let angle = (i/8) * Math.PI * 2;
        // Use time and seed for smooth organic motion
        let localR = r + Math.sin(t/400 + angle*2 + seed) * r * 0.2 + (Math.random()-0.5)*r*0.05;
        let px = cx + Math.cos(angle) * localR;
        let py = cy + Math.sin(angle) * localR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0,0,w,h);

    // Fade out trail if idle
    const fade = Math.min(1, (Date.now() - lastMoveTime)/900);
    const trailAlpha = lerp(1, 0, fade);

    for (let i=0; i<trail.length; ++i) {
        const p = trail[i];
        // Trail age (0=latest, 1=oldest)
        const tNorm = i / trail.length;
        // Bigger + more colored at faster speeds, smaller/grey when slow
        const baseR = lerp(16, 60, speed * 1.2) * (1-tNorm*0.5);
        // Color: grey to orange
        const colorStop = speed > 0.6 ? lerp(0.5, 1, speed) : lerp(0.3, 0.5, tNorm);
        const r = Math.round(lerp(69, 241, colorStop));
        const g = Math.round(lerp(69, 90, colorStop));
        const b = Math.round(lerp(69, 36, colorStop));
        // Soft alpha, tapers with trail and with idle
        const alpha = lerp(0.23, 0.73, 1-tNorm) * trailAlpha;
        // Main organic blob
        ctx.save();
        organicBlobPath(
            jitter(p.x, 5 + tNorm*20 + Math.sin(Date.now()/600 + p.seed)*10),
            jitter(p.y, 5 + tNorm*20 + Math.cos(Date.now()/700 + p.seed)*10),
            baseR + Math.sin(Date.now()/300 + p.seed)*baseR*0.15,
            Date.now(),
            p.seed
        );
        // Layered gradients for "grain"
        let grad = ctx.createRadialGradient(p.x, p.y, baseR*0.2, p.x, p.y, baseR);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha*1.1})`);
        grad.addColorStop(0.85, `rgba(${r},${g},${b},${alpha*0.3})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 1;
        ctx.fill();

        // Overdraw a few blurred ellipses for "soft noise"
        for (let k=0;k<3;++k) {
            ctx.beginPath();
            ctx.ellipse(
                jitter(p.x, baseR*0.2),
                jitter(p.y, baseR*0.2),
                baseR * lerp(0.7, 1.2, Math.random()),
                baseR * lerp(0.7, 1.2, Math.random()),
                Math.random()*Math.PI*2,
                0, Math.PI*2
            );
            ctx.closePath();
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha*0.09})`;
            ctx.filter = "blur(6px)";
            ctx.fill();
            ctx.filter = "none";
        }
        ctx.restore();
    }

    // "Noise" layer: sprinkle a few random low-opacity dots for analog feel
    for (let i=0;i<10;++i) {
        ctx.beginPath();
        let x = Math.random()*w, y = Math.random()*h;
        ctx.arc(x, y, Math.random()*1.5+0.5, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.015)";
        ctx.fill();
    }

    requestAnimationFrame(draw);
}
draw();