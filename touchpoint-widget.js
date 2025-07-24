// Mood data
const moods = [
  {
    name: "Flicker",
    description:
      "The spark of beginning, restless and full of possibility — a moment charged with potential.",
    color: "#fef3c7",
    textColor: "#111",
    quotes: [
      { quote: "The beginning is the most important part of the work.", author: "Plato" },
      { quote: "Magic is just science we don’t understand yet.", author: "Arthur C. Clarke (paraphrased)" },
      { quote: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
      { quote: "Even a stopped clock is right twice a day.", author: "Proverb" },
      { quote: "I am not afraid… I was born to do this.", author: "Joan of Arc" },
      { quote: "Life is either a daring adventure or nothing.", author: "Helen Keller" },
    ],
  },
  {
    name: "Stillness",
    description:
      "A calm pause, a quiet center — a sanctuary within to find presence and peace.",
    color: "#1e293b",
    textColor: "#f1f5f9",
    quotes: [
      { quote: "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.", author: "Hermann Hesse" },
      { quote: "Silence is a source of great strength.", author: "Lao Tzu" },
      { quote: "I am so clever that sometimes I don’t understand a single word of what I am saying.", author: "Oscar Wilde" },
      { quote: "Everything you need is already inside.", author: "Proverb" },
      { quote: "I dwell in possibility.", author: "Emily Dickinson" },
      { quote: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
    ],
  },
  {
    name: "Trace",
    description:
      "Echoes of memory and thought, the subtle imprint of what has been — shaping what comes next.",
    color: "linear-gradient(135deg, #3b0764, #7c3aed)",
    textColor: "#f8fafc",
    quotes: [
      { quote: "Memories are the traces of the soul’s journeys.", author: "Carl Jung" },
      { quote: "The past is never dead. It’s not even past.", author: "William Faulkner" },
      { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
      { quote: "Don’t believe everything you think.", author: "Proverb" },
      { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { quote: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
    ],
  },
  {
    name: "Ember",
    description:
      "Warmth that glows beneath the surface — gentle intensity, longing, and resilience.",
    color: "#fb923c",
    textColor: "#111",
    quotes: [
      { quote: "The wound is the place where the light enters you.", author: "Rumi" },
      { quote: "Fire is the test of gold; adversity, of strong men.", author: "Mahatma Gandhi" },
      { quote: "Keep your friends close, and your enemies closer.", author: "Sun Tzu / The Godfather" },
      { quote: "Not all who wander are lost.", author: "J.R.R. Tolkien" },
      { quote: "I am deliberate and afraid of nothing.", author: "Audre Lorde" },
      { quote: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou" },
    ],
  },
  {
    name: "Echo",
    description:
      "Resonance and reflection — moments that ripple outward, shaping us and the world.",
    color: "#e5e7eb",
    textColor: "#111",
    quotes: [
      { quote: "We do not remember days, we remember moments.", author: "Cesare Pavese" },
      { quote: "The past beats inside me like a second heart.", author: "John Banville" },
      { quote: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
      { quote: "Sometimes you have to let the silence echo louder.", author: "Modern proverb" },
      { quote: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
      { quote: "When one door of happiness closes, another opens.", author: "Helen Keller" },
    ],
  },
];

// Mood mapping by hold duration
function getMoodByDuration(duration) {
  if (duration < 1.5) return moods[0]; // Flicker
  if (duration < 3) return moods[1]; // Stillness
  if (duration < 5) return moods[2]; // Trace
  if (duration < 7) return moods[3]; // Ember
  return moods[4]; // Echo
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRipple(x, y, container, color) {
  const ripple = document.createElement("span");
  ripple.className = "touchpoint-ripple";
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x - rect.left - size / 2 + "px";
  ripple.style.top = y - rect.top - size / 2 + "px";
  ripple.style.background = color || "#000";
  container.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function showMoodCard(x, y, mood, container) {
  let card = container.querySelector(".touchpoint-card");
  if (!card) {
    card = document.createElement("div");
    card.className = "touchpoint-card";
    container.appendChild(card);
  }
  // Pick random quote
  const q = randomItem(mood.quotes);

  card.innerHTML = `
    <div class="mood-title">${mood.name}</div>
    <div class="mood-desc">${mood.description}</div>
    <div class="mood-quote">“${q.quote}”</div>
    <div class="mood-author">— ${q.author}</div>
  `;
  card.style.background = mood.color;
  card.style.color = mood.textColor;
  card.style.left = x + "px";
  card.style.top = y + "px";

  // Animate in
  setTimeout(() => card.classList.add("visible"), 10);
  // Hide after 5s
  setTimeout(() => {
    card.classList.remove("visible");
    setTimeout(() => card.remove(), 400);
  }, 5000);
}

function setupTouchpointWidget() {
  const root = document.getElementById("touchpoint-widget-root");
  if (!root) return;
  root.innerHTML = ""; // clear
  const container = document.createElement("div");
  container.className = "touchpoint-widget-container";
  container.textContent = "Press and hold to reveal your mood →";
  root.appendChild(container);

  let startTime = 0;
  let timer = null;

  function startHold(e) {
    e.preventDefault();
    startTime = performance.now();

    let x, y;
    if (e.touches && e.touches.length) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    createRipple(x, y, container, "#bbb");
    timer = { x, y };
  }

  function endHold(e) {
    if (timer) {
      const duration = (performance.now() - startTime) / 1000;
      let x = timer.x, y = timer.y;
      const mood = getMoodByDuration(duration);

      showMoodCard(x, y, mood, container);
      timer = null;
    }
  }

  // Desktop
  container.addEventListener("mousedown", startHold);
  container.addEventListener("mouseup", endHold);
  container.addEventListener("mouseleave", endHold);

  // Mobile
  container.addEventListener("touchstart", startHold, { passive: false });
  container.addEventListener("touchend", endHold);
  container.addEventListener("touchcancel", endHold);
}

// Init on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTouchpointWidget);
} else {
  setupTouchpointWidget();
}