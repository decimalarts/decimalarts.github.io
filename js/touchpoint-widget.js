const moods = [
  {
    name: "Flicker",
    gradient: "linear-gradient(120deg, #fef9d7 0%, #f7e7a4 100%)",
    textColor: "#222",
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
    gradient: "linear-gradient(120deg, #0f172a 0%, #334155 100%)",
    textColor: "#fff",
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
    gradient: "linear-gradient(120deg, #2e1065 0%, #7c3aed 100%)",
    textColor: "#fff",
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
    gradient: "linear-gradient(120deg, #ffb347 0%, #ff6132 100%)",
    textColor: "#222",
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
    gradient: "linear-gradient(120deg, #e0e7ef 0%, #cfd9df 100%)",
    textColor: "#222",
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
        <div class="touchpoint-result-label">Mood result</div>
        <div class="touchpoint-mood-name"></div>
        <div class="touchpoint-mood-quote"></div>
      </div>
    </div>
  `;
  const main = root.querySelector('.touchpoint-widget-main');
  const moodName = root.querySelector('.touchpoint-mood-name');
  const moodQuote = root.querySelector('.touchpoint-mood-quote');
  const instruction = root.querySelector('.touchpoint-instruction');
  const resultLabel = root.querySelector('.touchpoint-result-label');
  // The section to set the gradient on:
  const section = document.querySelector('.touchpoint-responsive-section');

  // Set defaults
  let currentMood = moods[0];
  section.style.background = currentMood.gradient;
  main.style.color = currentMood.textColor;
  moodName.textContent = "";
  moodQuote.textContent = "";
  resultLabel.style.opacity = "0.6";

  let startTime = 0;
  let animFrame = null;
  let holding = false;

  function updateGradientLive() {
    if (!holding) return;
    let elapsed = (performance.now() - startTime) / 1000;
    let mood = getMoodByDuration(elapsed);
    if (currentMood !== mood) {
      section.style.transition = 'background 0.6s cubic-bezier(.4,0,.2,1)';
      section.style.background = mood.gradient;
      main.style.color = mood.textColor;
      currentMood = mood;
    }
    animFrame = requestAnimationFrame(updateGradientLive);
  }

  function startHold(e) {
    e.preventDefault();
    holding = true;
    instruction.textContent = "Keep holding…";
    moodName.textContent = "";
    moodQuote.textContent = "";
    resultLabel.style.opacity = "0.3";
    startTime = performance.now();

    // Soft ripple for feedback (on section)
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

    section.style.transition = 'background 0.7s cubic-bezier(.4,0,.2,1)';
    section.style.background = mood.gradient;
    main.style.color = mood.textColor;

    moodName.textContent = mood.name;
    moodQuote.textContent = randomItem(mood.quotes);
    instruction.textContent = "Press and hold to reveal your mood →";
    resultLabel.style.opacity = "1";
    currentMood = mood;
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

// Init on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTouchpointWidget);
} else {
  setupTouchpointWidget();
}