const moods = [
  {
    name: "Flicker",
    description: "The spark of beginning, restless and full of possibility — a moment charged with potential.",
    stops: ["#fef9d7", "#f7e7a4"],
    textColor: "#222",
    bound: 0.33,
    quotes: [
      "The beginning is the most important part of the work. — Plato",
      "Magic is just science we don’t understand yet. — Arthur C. Clarke",
      "You miss 100% of the shots you don’t take. — Wayne Gretzky",
      "Even a stopped clock is right twice a day. — Proverb",
      "I am not afraid… I was born to do this. — Joan of Arc",
      "Life is either a daring adventure or nothing. — Helen Keller"
    ]
  },
  {
    name: "Stillness",
    description: "A calm pause, a quiet center — a sanctuary within to find presence and peace.",
    stops: ["#0f172a", "#334155"],
    textColor: "#fff",
    bound: 0.8,
    quotes: [
      "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself. — Hermann Hesse",
      "Silence is a source of great strength. — Lao Tzu",
      "I am so clever that sometimes I don’t understand a single word of what I am saying. — Oscar Wilde",
      "Everything you need is already inside. — Proverb",
      "I dwell in possibility. — Emily Dickinson",
      "The most courageous act is still to think for yourself. Aloud. — Coco Chanel"
    ]
  },
  {
    name: "Trace",
    description: "Echoes of memory and thought, the subtle imprint of what has been — shaping what comes next.",
    stops: ["#2e1065", "#7c3aed"],
    textColor: "#fff",
    bound: 1.3,
    quotes: [
      "Memories are the traces of the soul’s journeys. — Carl Jung",
      "The past is never dead. It’s not even past. — William Faulkner",
      "In the middle of difficulty lies opportunity. — Albert Einstein",
      "Don’t believe everything you think. — Proverb",
      "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
      "I am not afraid of storms, for I am learning how to sail my ship. — Louisa May Alcott"
    ]
  },
  {
    name: "Ember",
    description: "Warmth that glows beneath the surface — gentle intensity, longing, and resilience.",
    stops: ["#ffb347", "#ff6132"],
    textColor: "#222",
    bound: 2.0,
    quotes: [
      "The wound is the place where the light enters you. — Rumi",
      "Fire is the test of gold; adversity, of strong men. — Mahatma Gandhi",
      "Keep your friends close, and your enemies closer. — Sun Tzu / The Godfather",
      "Not all who wander are lost. — J.R.R. Tolkien",
      "I am deliberate and afraid of nothing. — Audre Lorde",
      "You may not control all the events that happen to you, but you can decide not to be reduced by them. — Maya Angelou"
    ]
  },
  {
    name: "Echo",
    description: "Resonance and reflection — moments that ripple outward, shaping us and the world.",
    stops: ["#e0e7ef", "#cfd9df"],
    textColor: "#222",
    bound: 3.2,
    quotes: [
      "We do not remember days, we remember moments. — Cesare Pavese",
      "The past beats inside me like a second heart. — John Banville",
      "What we achieve inwardly will change outer reality. — Plutarch",
      "Sometimes you have to let the silence echo louder. — Modern proverb",
      "The most difficult thing is the decision to act, the rest is merely tenacity. — Amelia Earhart",
      "When one door of happiness closes, another opens. — Helen Keller"
    ]
  }
];

const FINAL_MOOD_BOUND = 6;
const ROTATE_NUM = 12; // Number of rectangles in circle

function lerpColor(a, b, t) {
  const ah = a.replace('#', '');
  const bh = b.replace('#', '');
  const ar = parseInt(ah.substring(0,2),16);
  const ag = parseInt(ah.substring(2,4),16);
  const ab = parseInt(ah.substring(4,6),16);
  const br = parseInt(bh.substring(0,2),16);
  const bg = parseInt(bh.substring(2,4),16);
  const bb = parseInt(bh.substring(4,6),16);
  const rr = Math.round(ar + (br-ar)*t);
  const rg = Math.round(ag + (bg-ag)*t);
  const rb = Math.round(ab + (bb-ab)*t);
  return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`;
}

function findMoodBlend(duration) {
  for (let i = 0; i < moods.length - 1; ++i) {
    if (duration < moods[i+1].bound) {
      const lower = (i === 0) ? 0 : moods[i].bound;
      const upper = moods[i+1].bound;
      const t = (duration - lower) / (upper - lower);
      return {from: moods[i], to: moods[i+1], t: Math.max(0, Math.min(1, t))};
    }
  }
  const final = moods[moods.length-1];
  return {from: final, to: final, t: 1};
}

function getMoodByDuration(duration) {
  for (let i = 0; i < moods.length; ++i) {
    if (duration < moods[i].bound) return moods[i];
  }
  return moods[moods.length-1];
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setupTouchpointWidget() {
  const root = document.getElementById("touchpoint-widget-root");
  if (!root) return;
  root.innerHTML = `
    <div class="touchpoint-widget-main">
      <div class="touchpoint-header">
        <h2 class="touchpoint-title">Touchpoint</h2>
        <div class="touchpoint-instruction">Press and hold to reveal your mood →</div>
      </div>
      <div class="touchpoint-animation-space">
        <div class="touchpoint-center-dot"></div>
        <div class="touchpoint-rects-container"></div>
      </div>
      <div class="touchpoint-result">
        <div class="touchpoint-mood-name"></div>
        <div class="touchpoint-mood-description"></div>
        <div class="touchpoint-mood-quote"></div>
      </div>
    </div>
  `;
  const main = root.querySelector('.touchpoint-widget-main');
  const header = root.querySelector('.touchpoint-header');
  const moodName = root.querySelector('.touchpoint-mood-name');
  const moodQuote = root.querySelector('.touchpoint-mood-quote');
  const moodDescription = root.querySelector('.touchpoint-mood-description');
  const instruction = root.querySelector('.touchpoint-instruction');
  const section = document.querySelector('.touchpoint-responsive-section');
  const centerDot = root.querySelector('.touchpoint-center-dot');
  const rectsContainer = root.querySelector('.touchpoint-rects-container');
  const animationSpace = root.querySelector('.touchpoint-animation-space');

  // Layout
  header.style.position = "absolute";
  header.style.top = "32px";
  header.style.left = "32px";
  header.style.zIndex = "2";
  header.style.textAlign = "left";
  header.style.maxWidth = "340px";
  header.style.pointerEvents = "none";

  animationSpace.style.width = "100%";
animationSpace.style.maxWidth = "400px";
animationSpace.style.height = "160px";
animationSpace.style.margin = "56px 0 0 32px";
animationSpace.style.pointerEvents = "auto";
animationSpace.style.display = "flex";
animationSpace.style.justifyContent = "center";
animationSpace.style.alignItems = "center";
animationSpace.style.boxSizing = "border-box";
animationSpace.style.overflow = "visible";
  centerDot.style.position = "absolute";
  centerDot.style.left = "50%";
  centerDot.style.top = "50%";
  centerDot.style.transform = "translate(-50%, -50%)";
  centerDot.style.width = "44px";
  centerDot.style.height = "44px";
  centerDot.style.borderRadius = "50%";
  centerDot.style.background = "#fff";
  centerDot.style.boxShadow = "0 0 32px 1px #fff7";
  centerDot.style.zIndex = "2";
  centerDot.style.border = "none";
  centerDot.style.transition = "background 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s cubic-bezier(.4,0,.2,1)";

  rectsContainer.style.position = "absolute";
  rectsContainer.style.left = "50%";
  rectsContainer.style.top = "50%";
  rectsContainer.style.transform = "translate(-50%, -50%)";
  rectsContainer.style.width = "120px";
  rectsContainer.style.height = "120px";
  rectsContainer.style.zIndex = "1";

  // Result layout
  const result = root.querySelector('.touchpoint-result');
  result.style.marginTop = "4px";
  result.style.display = "flex";
  result.style.flexDirection = "column";
  result.style.alignItems = "flex-start";
  result.style.justifyContent = "flex-start";
  result.style.maxWidth = "500px";
  result.style.marginLeft = "32px";
  moodName.style.fontWeight = "700";
  moodName.style.fontSize = "2.0rem";
  moodName.style.marginBottom = "0.6em";
  moodName.style.textAlign = "left";
  moodDescription.style.fontWeight = "400";
  moodDescription.style.fontSize = "1.18rem";
  moodDescription.style.maxWidth = "400px";
  moodDescription.style.textAlign = "left";
  moodDescription.style.marginBottom = "1.8em";
  moodQuote.style.fontWeight = "500";
  moodQuote.style.fontSize = "1.03rem";
  moodQuote.style.maxWidth = "500px";
  moodQuote.style.textAlign = "left";
  moodQuote.style.marginTop = "2.8em";

  // Initial gradient and text
  section.style.setProperty('--grad1', "#23272b");
  section.style.setProperty('--grad2', "#23272b");
  main.style.color = "#fff";
  moodName.textContent = "";
  moodQuote.textContent = "";
  moodDescription.textContent = "";

  let startTime = 0;
  let animFrame = null;
  let holding = false;
  let lastTextColor = "#fff";
  let rotation = 0;
  let lastRectColor = "#fff";
  let rectsActive = false;

  function updateGradientLive() {
    let elapsed = holding ? (performance.now() - startTime) / 1000 : 0;
    let blend = findMoodBlend(elapsed);

    // Interpolate gradient and dot color
    let grad1, grad2, nextTextColor;
    if (elapsed < 0.18) {
      const t = elapsed / 0.18;
      grad1 = lerpColor("#23272b", moods[0].stops[0], t);
      grad2 = lerpColor("#23272b", moods[0].stops[1], t);
      nextTextColor = "#fff";
      centerDot.style.background = grad1;
    } else {
      grad1 = lerpColor(blend.from.stops[0], blend.to.stops[0], blend.t);
      grad2 = lerpColor(blend.from.stops[1], blend.to.stops[1], blend.t);
      nextTextColor = blend.t < 0.5 ? blend.from.textColor : blend.to.textColor;
      centerDot.style.background = grad1;
    }
    section.style.setProperty('--grad1', grad1);
    section.style.setProperty('--grad2', grad2);

    if (nextTextColor !== lastTextColor) {
      main.style.color = nextTextColor;
      lastTextColor = nextTextColor;
    }

    // Looping rotation for the rectangles (when holding)
    if (holding) {
      rotation += 2.5; // degrees per frame, adjust as needed
      drawRects(rotation, grad1);
      animFrame = requestAnimationFrame(updateGradientLive);
    } else if (rectsActive) {
      // Remove rectangles when not holding
      rectsContainer.innerHTML = "";
      rectsActive = false;
    }
  }

  function drawRects(angleOffset = 0, color = "#fff") {
    rectsActive = true;
    rectsContainer.innerHTML = ""; // Clear previous
    for (let i = 0; i < ROTATE_NUM; i++) {
      const angle = ((i / ROTATE_NUM) * 2 * Math.PI) + (angleOffset * Math.PI / 180);
      const spread = 46;
      const x = 60 + Math.cos(angle) * spread; // center of container is (60,60)
      const y = 60 + Math.sin(angle) * spread;
      const rect = document.createElement('span');
      rect.className = 'touchpoint-rect-spin';
      rect.style.position = 'absolute';
      rect.style.left = `${x - 0.5}px`;
      rect.style.top = `${y - 4}px`;
      rect.style.width = '1px';
      rect.style.height = '8px';
      rect.style.borderRadius = '0.5px';
      rect.style.background = color;
      rect.style.opacity = '0.9';
      rect.style.boxShadow = '0 0 4px 1px #fff9';
      rectsContainer.appendChild(rect);
    }
  }

  function startHold(e) {
    e.preventDefault();
    holding = true;
    moodName.textContent = "";
    moodQuote.textContent = "";
    moodDescription.textContent = "";
    startTime = performance.now();
    rotation = 0;
    updateGradientLive();
    centerDot.style.boxShadow = "0 0 96px 32px #fff7";
  }

  function endHold() {
    holding = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    let duration = (performance.now() - startTime) / 1000;
    let mood = getMoodByDuration(duration);

    // Snap to the mood gradient and text color
    section.style.setProperty('--grad1', mood.stops[0]);
    section.style.setProperty('--grad2', mood.stops[1]);
    main.style.color = mood.textColor;
    centerDot.style.background = mood.stops[0];
    centerDot.style.boxShadow = "0 0 32px 1px #fff7";

    // Remove rectangles
    rectsContainer.innerHTML = "";
    rectsActive = false;

    // Show result
    moodName.textContent = mood.name;
    moodDescription.textContent = mood.description;
    moodQuote.textContent = randomItem(mood.quotes);
    instruction.textContent = "Press and hold to reveal your mood →";
  }

  // Desktop
  animationSpace.addEventListener("mousedown", startHold);
  animationSpace.addEventListener("mouseup", endHold);
  animationSpace.addEventListener("mouseleave", endHold);

  // Mobile
  animationSpace.addEventListener("touchstart", startHold, { passive: false });
  animationSpace.addEventListener("touchend", endHold);
  animationSpace.addEventListener("touchcancel", endHold);
}

// Inject CSS for rectangles and layout
function injectTouchpointCSS() {
  if (document.getElementById('touchpoint-rect-spin-style')) return;
  const style = document.createElement('style');
  style.id = 'touchpoint-rect-spin-style';
  style.innerHTML = `
  .touchpoint-rect-spin {
    position: absolute;
    width: 1px;
    height: 8px;
    border-radius: 0.5px;
    background: #fff;
    opacity: 0.9;
    box-shadow: 0 0 4px 1px #fff9;
    z-index: 9;
  }
  .touchpoint-center-dot {
    cursor: pointer;
  }
  `;
  document.head.appendChild(style);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    injectTouchpointCSS();
    setupTouchpointWidget();
  });
} else {
  injectTouchpointCSS();
  setupTouchpointWidget();
}

