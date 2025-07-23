const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');
const h1 = hero.querySelector('h1');
const words = hero.querySelectorAll('.hover-word');

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
      gradient.style.backgroundImage = 'linear-gradient(#ff9900, #793000ff 10%, #313031ff)';
  }
}

function moveGradient(e) {
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gradient.style.left = `${x - 325}px`;
  gradient.style.top = `${y - 325}px`;
}

// Always follow mouse within hero
hero.addEventListener('mousemove', function(e){
  moveGradient(e);
});

words.forEach(word => {
  word.addEventListener('mouseenter', function(e) {
    words.forEach(w => w.classList.remove('active'));
    word.classList.add('active');
    h1.classList.add('dimmed');
    hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    gradient.classList.remove('pulse'); // always remove before setting

    if (word.classList.contains('nothing')) {
      setGradient('grey');
      hero.classList.add('nothing-hover');
    } else if (word.classList.contains('something')) {
      setGradient('light-grey'); // initial color
      hero.classList.add('something-hover');
      gradient.classList.add('pulse');
    } else if (word.classList.contains('story')) {
      setGradient('orange');
      hero.classList.add('story-hover');
    }
    moveGradient(e);
  });

  word.addEventListener('mouseleave', function(e) {
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed');
    hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    gradient.classList.remove('pulse');
    setGradient('default');
    moveGradient(e);
  });
});

  word.addEventListener('mouseleave', function(e) {
    words.forEach(w => w.classList.remove('active'));
    h1.classList.remove('dimmed');
    hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
    setGradient('default');
    moveGradient(e);
  });

// On page load, center gradient (optional)
window.addEventListener('DOMContentLoaded', function() {
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
  setGradient('default');
});

// When mouse leaves hero, center gradient and reset color
hero.addEventListener('mouseleave', function(){
  setGradient('default');
  hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
});