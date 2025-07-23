const hero = document.querySelector('.hero');
const gradient = document.querySelector('.gradient');

hero.addEventListener('mousemove', function(e){
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gradient.style.left = `${x - 325}px`; // center the gradient (650/2)
  gradient.style.top = `${y - 325}px`;
});