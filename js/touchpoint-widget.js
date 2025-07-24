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
  const preFinal = moods[moods.length-2];
  const final = moods[moods.length-1];
  const lower = final.bound;
  const upper = FINAL_MOOD_BOUND;
  const t = Math.max(0, Math.min(1, (duration - lower) / (upper - lower)));
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

function createSoftRipple(container, x, y) {
  const ripple = document.createElement("span");
  ripple.className = "touchpoint-soft-ripple";
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 0.65;
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (x - rect.left - size / 2) + "px";
  ripple.style.top = (y - rect.top - size / 2) + "px";
  container.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function setupTouchpointWidget() {
  const root = document.getElementById("touchpoint-widget-root");
  if (!root) return;
  root.innerHTML = `
    <div class="touchpoint-widget-main">
      <h2 class="touchpoint-title">Touchpoint</h2>
      <p class="touchpoint-instruction">Press and hold to reveal your mood →</p>
      <div class="touchpoint-result">
        <div class="touchpoint-mood-name"></div>
        <div class="touchpoint-mood-description"></div>
        <div class="touchpoint-mood-quote"></div>
      </div>
    </div>
  `;
  const main = root.querySelector('.touchpoint-widget-main');
  const moodName = root.querySelector('.touchpoint-mood-name');
  const moodQuote = root.querySelector('.touchpoint-mood-quote');
  const moodDescription = root.querySelector('.touchpoint-mood-description');
  const instruction = root.querySelector('.touchpoint-instruction');
  const section = document.querySelector('.touchpoint-responsive-section');

  // Set starting gradient to dark grey, and text to white
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

  function updateGradientLive() {
    if (!holding) return;
    let elapsed = (performance.now() - startTime) / 1000;
    let blend = findMoodBlend(elapsed);

    // For initial gradient, blend from dark grey to first mood for first 0.18s
    if (elapsed < 0.18) {
      const t = elapsed / 0.18;
      section.style.setProperty('--grad1', lerpColor("#23272b", moods[0].stops[0], t));
      section.style.setProperty('--grad2', lerpColor("#23272b", moods[0].stops[1], t));
      main.style.color = "#fff";
      lastTextColor = "#fff";
    } else {
      // Interpolate between mood gradients
      const grad1 = lerpColor(blend.from.stops[0], blend.to.stops[0], blend.t);
      const grad2 = lerpColor(blend.from.stops[1], blend.to.stops[1], blend.t);

      section.style.setProperty('--grad1', grad1);
      section.style.setProperty('--grad2', grad2);

      // Jump to closest text color
      const nextTextColor = blend.t < 0.5 ? blend.from.textColor : blend.to.textColor;
      if (nextTextColor !== lastTextColor) {
        main.style.color = nextTextColor;
        lastTextColor = nextTextColor;
      }
    }

    animFrame = requestAnimationFrame(updateGradientLive);
  }

  function startHold(e) {
    e.preventDefault();
    holding = true;
    moodName.textContent = "";
    moodQuote.textContent = "";
    moodDescription.textContent = "";
    startTime = performance.now();

    let x, y;
    if (e.touches && e.touches.length) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    createSoftRipple(section, x, y);

    animFrame = requestAnimationFrame(updateGradientLive);
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

    moodName.textContent = mood.name;
    moodDescription.textContent = mood.description;
    moodQuote.textContent = randomItem(mood.quotes);
    instruction.textContent = "Tap, hold, interact. →";
    lastTextColor = mood.textColor;
  }

  // Desktop
  section.addEventListener("mousedown", startHold);
  section.addEventListener("mouseup", endHold);
  section.addEventListener("mouseleave", endHold);

  // Mobile
  section.addEventListener("touchstart", startHold, { passive: false });
  section.addEventListener("touchend", endHold);
  section.addEventListener("touchcancel", endHold);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTouchpointWidget);
} else {
  setupTouchpointWidget();
}