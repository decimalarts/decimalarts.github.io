const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');
const h1 = hero.querySelector('h1');
const words = hero.querySelectorAll('.hover-word');

let currentMode = 'default'; // tracks which word is hovered

function setGradient(color) {
  switch(color) {
    case 'grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #1f1834ff 10%, #272a62ff)';
      break;
    case 'light-grey':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #888, #bbb)';
      break;
    case 'orange':
      gradient.style.backgroundImage = 'linear-gradient(90deg, #ff9900, #ff6600)';
      break;
    default:
      gradient.style.backgroundImage = 'linear-gradient( #ff9900, #ff6600 10%, #313031ff)';
  }
}

function moveGradient(e) {
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gradient.style.left = `${x - 325}px`;
  gradient.style.top = `${y - 325}px`;
}

hero.addEventListener('mousemove', function(e){
  moveGradient(e);
});

// Word hover logic
words.forEach(word => {
  word.addEventListener('mouseenter', function(e) {
    words.forEach(w => w.classList.remove('active'));
    word.classList.add('active');
    h1.classList.add('dimmed');
    h1.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    if (word.classList.contains('nothing')) {
      setGradient('grey');
      h1.classList.add('nothing-hover');
      currentMode = 'nothing';
    } else if (word.classList.contains('something')) {
      setGradient('light-grey');
      h1.classList.add('something-hover');
      currentMode = 'something';
    } else if (word.classList.contains('story')) {
      setGradient('orange');
      h1.classList.add('story-hover');
      currentMode = 'story';
    }
    moveGradient(e); // Snap immediately
  });

  word.addEventListener('mouseleave', function(e) {
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed', 'nothing-hover', 'something-hover', 'story-hover');
    setGradient('default');
    currentMode = 'default';
    moveGradient(e);
  });
});

// On page load, center the gradient (optional)
window.addEventListener('DOMContentLoaded', function() {
  // Could center or leave as is; your mousemove will reposition it anyway
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
});

hero.addEventListener('mouseleave', function(){
  setGradient('default');
  currentMode = 'default';
  // Optional: center gradient when leaving hero section
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
});