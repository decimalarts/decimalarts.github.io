const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');
const h1 = hero.querySelector('h1');
const words = hero.querySelectorAll('.hover-word');

let sparksInterval = null; // Track the interval for sparks

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

    // Stop sparks unless story is hovered
    if (sparksInterval) {
      clearInterval(sparksInterval);
      sparksInterval = null;
    }

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
      if (sparksInterval) clearInterval(sparksInterval);
      sparksInterval = setInterval(createSparks, 120); // lots of sparks
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

    // Stop sparks whenever mouse leaves any word
    if (sparksInterval) {
      clearInterval(sparksInterval);
      sparksInterval = null;
    }
  });
});

// On page load, center gradient (optional)
window.addEventListener('DOMContentLoaded', function() {
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
  setGradient('default');
});

// When mouse leaves hero, center gradient and reset color/sparks
hero.addEventListener('mouseleave', function(){
  setGradient('default');
  hero.classList.remove('nothing-hover', 'something-hover', 'story-hover');
  gradient.style.left = `calc(50% - 325px)`;
  gradient.style.top = `calc(50% - 325px)`;
  if (sparksInterval) {
    clearInterval(sparksInterval);
    sparksInterval = null;
  }
});

function createSparks() {
  const sparkCount = 4; // adjust as needed

  // Get gradient position relative to hero (parent)
  const gradientRect = gradient.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();

  // Calculate gradient area within hero coordinate system
  const gradientLeft = gradientRect.left - heroRect.left;
  const gradientTop = gradientRect.top - heroRect.top;
  const gradientWidth = gradient.offsetWidth;
  const gradientHeight = gradient.offsetHeight;

  // Offset for navbar (80px)
  const navbarOffset = 80;

  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    // Position randomly within the gradient area, but Y is at least 80px from page top
    let randY = gradientTop + Math.random() * gradientHeight;

    // If hero is not at top of page, add page offset
    const pageOffset = heroRect.top;
    randY = Math.max(randY, navbarOffset - pageOffset);

    const randX = gradientLeft + Math.random() * gradientWidth;

    spark.style.left = `${randX}px`;
    spark.style.top = `${randY}px`;

    // Random float direction (left/right drift)
    const dirX = Math.random() * 60 - 30;
    spark.style.setProperty('--spark-x', `${dirX}px`);

    // Random rotation for variety
    const rot = Math.random() * 80 - 40;
    spark.style.setProperty('--spark-rot', `${rot}deg`);

    spark.addEventListener('animationend', () => spark.remove());

    hero.appendChild(spark);
  }
}