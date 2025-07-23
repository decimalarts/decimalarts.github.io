const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');
const h1 = hero.querySelector('h1');
const words = hero.querySelectorAll('.hover-word');
let isWordHovered = false;

// Gradient color switcher
function setGradient(color) {
  switch(color) {
    case 'grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #292929 10%, #555)';
      break;
    case 'light-grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #888, #bbb)';
      break;
    case 'orange':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #ff9900, #ff6600)';
      break;
    default:
      gradient.style.backgroundImage = 'linear-gradient(#292929 10%, #8e8e8eff, #ff6600)';
  }
}

// Snap gradient to mouse position
function snapGradient(e) {
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gradient.style.left = `${x - 325}px`;
  gradient.style.top = `${y - 325}px`;
}

function restoreGradient() {
  setGradient('default');
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
}

// Listen for mousemove ONLY when word is hovered
function enableSnapOnMove() {
  hero.addEventListener('mousemove', snapGradient);
}
function disableSnapOnMove() {
  hero.removeEventListener('mousemove', snapGradient);
}

// Hover logic for each word
words.forEach(word => {
  word.addEventListener('mouseenter', function(e) {
    isWordHovered = true;
    // Remove active from all, add to hovered
    words.forEach(w => w.classList.remove('active'));
    word.classList.add('active');
    h1.classList.add('dimmed');
    h1.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    if (word.classList.contains('nothing')) {
      setGradient('grey');
      h1.classList.add('nothing-hover');
      h1.classList.remove('something-hover', 'story-hover');
    } else if (word.classList.contains('something')) {
      setGradient('light-grey');
      h1.classList.add('something-hover');
      h1.classList.remove('nothing-hover', 'story-hover');
    } else if (word.classList.contains('story')) {
      setGradient('orange');
      h1.classList.add('story-hover');
      h1.classList.remove('nothing-hover', 'something-hover');
    }
    snapGradient(e); // Snap immediately
    enableSnapOnMove();
  });

  word.addEventListener('mouseleave', function(e) {
    isWordHovered = false;
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed', 'nothing-hover', 'something-hover', 'story-hover');
    setGradient('default');
    restoreGradient();
    disableSnapOnMove();
  });
});

// Default gradient follows mouse (dark grey) only when not hovering a word
hero.addEventListener('mousemove', function(e){
  if (!isWordHovered) {
    setGradient('grey'); // dark grey for default
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gradient.style.left = `${x - 325}px`;
    gradient.style.top = `${y - 325}px`;
  }
});

// Reset gradient when mouse leaves hero section
hero.addEventListener('mouseleave', function(){
  isWordHovered = false;
  setGradient('default');
  restoreGradient();
  disableSnapOnMove();
});