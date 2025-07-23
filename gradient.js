const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');
const h1 = hero.querySelector('h1');
const words = hero.querySelectorAll('.hover-word');

let sparksInterval = null;

// Helper: trigger word animation
function triggerWordEnter(word, event) {
  words.forEach(w => w.classList.remove('active'));
  word.classList.add('active');
  h1.classList.add('dimmed');
  hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
  gradient.classList.remove('pulse');

  if (sparksInterval) {
    clearInterval(sparksInterval);
    sparksInterval = null;
  }

  if (word.classList.contains('nothing')) {
    setGradient('grey');
    hero.classList.add('nothing-hover');
    createDustParticles();
  } else if (word.classList.contains('something')) {
    setGradient('light-grey');
    hero.classList.add('something-hover');
    gradient.classList.add('pulse');
  } else if (word.classList.contains('story')) {
    setGradient('orange');
    hero.classList.add('story-hover');
    sparksInterval = setInterval(createSparks, 120);
  }
  moveGradient(event);
}

function triggerWordLeave(event) {
  words.forEach(w => w.classList.remove('active'));
  h1.classList.remove('dimmed');
  hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
  gradient.classList.remove('pulse');
  setGradient('default');
  moveGradient(event);

  if (sparksInterval) {
    clearInterval(sparksInterval);
    sparksInterval = null;
  }
}

// Attach listeners: hover for desktop, tap/click for mobile to select and hold state
words.forEach(word => {
  // Desktop
  word.addEventListener('mouseenter', e => triggerWordEnter(word, e));
  word.addEventListener('mouseleave', e => triggerWordLeave(e));

  // Mobile: Tap to select and hold state
  word.addEventListener('touchend', function(e) {
    e.preventDefault();
    triggerWordEnter(word, e.changedTouches[0] || e);
  }, {passive: false});
  word.addEventListener('click', function(e) {
    triggerWordEnter(word, e);
  });

  word.addEventListener('mouseenter', () => word.classList.remove('prompting'));
  word.addEventListener('touchend', () => word.classList.remove('prompting'));
  word.addEventListener('click', () => word.classList.remove('prompting'));
});

// Sequential nudge animation for words
function promptWordsSequentially() {
  const wordsArr = Array.from(document.querySelectorAll('.hover-word'));
  setInterval(() => {
    wordsArr.forEach((word, i) => {
      setTimeout(() => {
        word.classList.add('prompting');
        setTimeout(() => word.classList.remove('prompting'), 1500);
      }, i * 1000);
    });
  }, wordsArr.length * 1000 + 2500);
}
promptWordsSequentially();

// Gradient always visible and follows pointer/tap
function setGradient(color) {
  switch(color) {
    case 'grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #1f1834ff 10%, #272a62ff)';
      break;
    case 'light-grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #888, #bbb)';
      break;
    case 'orange':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #ff9900, #F15A24 80%)';
      break;
    default:
      gradient.style.backgroundImage = 'linear-gradient(#ff9900, #793000ff 10%, #313031ff)';
  }
}

function moveGradient(e) {
  const rect = hero.getBoundingClientRect();
  const x = (e.clientX || e.pageX) - rect.left;
  const y = (e.clientY || e.pageY) - rect.top;
  const size = gradient.offsetWidth;
  gradient.style.left = `${x - size/2}px`;
  gradient.style.top = `${y - size/2}px`;
}

// Always follow mouse/tap within hero
hero.addEventListener('mousemove', function(e){
  moveGradient(e);
});
hero.addEventListener('touchmove', function(e){
  if (e.touches && e.touches[0]) moveGradient(e.touches[0]);
});

// On page load, center gradient and remove any active word
window.addEventListener('DOMContentLoaded', function() {
  words.forEach(w => w.classList.remove('active'));
  const size = gradient.offsetWidth;
  gradient.style.left = `calc(50% - ${size/2}px)`;
  gradient.style.top = `calc(50% - ${size/2}px)`;
  setGradient('default');
});

// When mouse leaves hero, center gradient and reset color/sparks
hero.addEventListener('mouseleave', function(){
  setGradient('default');
  hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
  const size = gradient.offsetWidth;
  gradient.style.left = `calc(50% - ${size/2}px)`;
  gradient.style.top = `calc(50% - ${size/2}px)`;
  if (sparksInterval) {
    clearInterval(sparksInterval);
    sparksInterval = null;
  }
});

// ---- Sparks / Logo Sparks ----
function createSparks() {
  const sparkCount = 4;
  const gradientRect = gradient.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();

  const gradientLeft = gradientRect.left - heroRect.left;
  const gradientTop = gradientRect.top - heroRect.top;
  const gradientWidth = gradient.offsetWidth;
  const gradientHeight = gradient.offsetHeight;

  for (let i = 0; i < sparkCount; i++) {
    const useLogo = Math.random() < 0.1;
    const spark = document.createElement('div');
    spark.className = useLogo ? 'spark logo-spark' : 'spark';

    const randX = gradientLeft + Math.random() * gradientWidth;
    const randY = gradientTop + Math.random() * gradientHeight;

    spark.style.left = `${randX}px`;
    spark.style.top = `${randY}px`;

    const dirX = Math.random() * 60 - 30;
    spark.style.setProperty('--spark-x', `${dirX}px`);

    const rot = Math.random() * 80 - 40;
    spark.style.setProperty('--spark-rot', `${rot}deg`);

    if (useLogo) {
      const img = document.createElement('img');
      img.src = 'images/DA_Pictorial.svg';
      img.alt = 'Logo Spark';
      img.style.height = '18px';
      img.style.width = 'auto';
      img.style.display = 'block';
      spark.appendChild(img);
    }

    spark.addEventListener('animationend', () => spark.remove());
    hero.appendChild(spark);
  }
}

// ---- Dust Effect ----
function createDustParticles() {
  const numParticles = 18;
  const heroWidth = hero.offsetWidth;
  const heroHeight = hero.offsetHeight;
  const nothingWord = hero.querySelector('.hover-word.nothing');
  if (!nothingWord) return;

  const wordRect = nothingWord.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();
  const wordX = wordRect.left + wordRect.width / 2 - heroRect.left;
  const wordY = wordRect.top + wordRect.height / 2 - heroRect.top;

  const pastelColors = [
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 220, 180, 0.32)',
    'rgba(180, 220, 255, 0.21)',
    'rgba(240, 200, 255, 0.29)',
    'rgba(255, 255, 180, 0.18)',
    'rgba(220, 255, 220, 0.13)',
    'rgba(220, 255, 255, 0.15)'
  ];

  for (let i = 0; i < numParticles; i++) {
    const fromLeft = i % 2 === 0;
    const edgeX = fromLeft ? 0 : heroWidth;
    const edgeY = Math.random() * heroHeight;
    const dx = wordX - edgeX;
    const dy = wordY - edgeY;
    const offsetX = dx + (Math.random() - 0.5) * 40;
    const offsetY = dy + (Math.random() - 0.5) * 12;

    const dust = document.createElement('div');
    dust.className = 'dust';
    dust.style.left = `${edgeX}px`;
    dust.style.top = `${edgeY}px`;
    dust.style.setProperty('--dust-x', `${offsetX}px`);
    dust.style.setProperty('--dust-y', `${offsetY}px`);

    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    const size = 10 + Math.random() * 18;
    const blur = 6 + Math.random() * 16;
    dust.style.width = `${size}px`;
    dust.style.height = `${size}px`;
    dust.style.background = `radial-gradient(circle, ${color} 0%, transparent 80%)`;
    dust.style.filter = `blur(${blur}px)`;

    dust.addEventListener('animationend', () => dust.remove());
    hero.appendChild(dust);
  }
}
// Helper to check if an event target is a hover-word
function isHoverWord(target) {
  return target.classList && target.classList.contains('hover-word');
}

// Listen for taps/clicks on the document
document.addEventListener('touchend', function(e) {
  // If the tap is not on a hover-word, reset
  if (!isHoverWord(e.target)) {
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed');
    hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    gradient.classList.remove('pulse');
    setGradient('default');
  }
}, {passive: true});

document.addEventListener('click', function(e) {
  if (!isHoverWord(e.target)) {
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed');
    hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    gradient.classList.remove('pulse');
    setGradient('default');
  }
});