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
  return moods[moods.length-1];