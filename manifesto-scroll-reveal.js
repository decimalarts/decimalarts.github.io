document.addEventListener("DOMContentLoaded", function () {
  const points = document.querySelectorAll(".manifesto-point");
  const options = {
    threshold: 0.2
  };

  let delayBase = 0.05;
  const delayStep = 0.13;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        entry.target.style.transitionDelay = `${delayBase + idx * delayStep}s`;
        obs.unobserve(entry.target);
      }
    });
  }, options);

  points.forEach(point => observer.observe(point));
});