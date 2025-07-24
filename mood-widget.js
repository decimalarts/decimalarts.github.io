class MoodWidget {
  constructor(container) {
    this.container = container;
    this.isPressed = false;
    this.startTime = null;
    this.currentCard = null;
    
    // Mood data with descriptions, quotes, and styling
    this.moods = {
      flicker: {
        name: 'Flicker',
        description: 'A quick spark of connection',
        quotes: [
          { text: 'In the briefest moment, a universe can unfold.', author: 'Anonymous' },
          { text: 'Sometimes the smallest gestures carry the most weight.', author: 'Maya Angelou' },
          { text: 'A spark is enough to light the darkness.', author: 'Rumi' }
        ],
        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
        textColor: '#000',
        duration: [0, 1500]
      },
      stillness: {
        name: 'Stillness',
        description: 'A calm pause in the flow of time',
        quotes: [
          { text: 'In stillness, the world unfolds.', author: 'Lao Tzu' },
          { text: 'Quiet minds cannot be perplexed or frightened.', author: 'Robert Louis Stevenson' },
          { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha' }
        ],
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        textColor: '#fff',
        duration: [1500, 3000]
      },
      trace: {
        name: 'Trace',
        description: 'A thoughtful linger between moments',
        quotes: [
          { text: 'The longest journey is the journey inward.', author: 'Dag Hammarskjöld' },
          { text: 'We are not going in circles, we are going upwards.', author: 'Hermann Hesse' },
          { text: 'Time is the most valuable thing we can spend.', author: 'Theophrastus' }
        ],
        background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        textColor: '#000',
        duration: [3000, 5000]
      },
      ember: {
        name: 'Ember',
        description: 'A glowing emotion burning bright',
        quotes: [
          { text: 'What lies behind us and what lies before us are tiny matters.', author: 'Ralph Waldo Emerson' },
          { text: 'The heart that loves is always young.', author: 'Greek Proverb' },
          { text: 'Passion is energy. Feel the power that comes from focusing.', author: 'Oprah Winfrey' }
        ],
        background: 'linear-gradient(135deg, #fa709a, #fee140)',
        textColor: '#000',
        duration: [5000, 7000]
      },
      echo: {
        name: 'Echo',
        description: 'A long reflection that resonates deep',
        quotes: [
          { text: 'The unexamined life is not worth living.', author: 'Socrates' },
          { text: 'We are what we repeatedly do.', author: 'Aristotle' },
          { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' }
        ],
        background: 'linear-gradient(135deg, #434343, #000000)',
        textColor: '#fff',
        duration: [7000, Infinity]
      }
    };
    
    this.init();
  }
  
  init() {
    this.createWidget();
    this.bindEvents();
  }
  
  createWidget() {
    // Create the touchpoint element
    this.touchpoint = document.createElement('div');
    this.touchpoint.className = 'mood-touchpoint';
    this.touchpoint.innerHTML = '<span class="touchpoint-label">0.5</span>';
    
    // Create card container for mood cards
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'mood-card-container';
    
    this.container.appendChild(this.touchpoint);
    this.container.appendChild(this.cardContainer);
  }
  
  bindEvents() {
    // Mouse events for desktop
    this.touchpoint.addEventListener('mousedown', (e) => this.handleStart(e));
    document.addEventListener('mouseup', (e) => this.handleEnd(e));
    document.addEventListener('mouseleave', (e) => this.handleEnd(e));
    
    // Touch events for mobile
    this.touchpoint.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    document.addEventListener('touchend', (e) => this.handleEnd(e));
    document.addEventListener('touchcancel', (e) => this.handleEnd(e));
    
    // Prevent context menu on long press
    this.touchpoint.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  handleStart(e) {
    e.preventDefault();
    
    if (this.isPressed) return;
    
    this.isPressed = true;
    this.startTime = Date.now();
    
    // Get coordinates for ripple and card positioning
    const rect = this.touchpoint.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);
    
    // Create ripple effect
    this.createRipple(x, y);
    
    // Add pressed state
    this.touchpoint.classList.add('pressed');
  }
  
  handleEnd(e) {
    if (!this.isPressed) return;
    
    const duration = Date.now() - this.startTime;
    const mood = this.getMoodFromDuration(duration);
    
    // Get coordinates for card positioning
    const rect = this.touchpoint.getBoundingClientRect();
    const x = e.clientX || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : rect.left + rect.width / 2);
    const y = e.clientY || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : rect.top + rect.height / 2);
    
    // Show mood card
    this.showMoodCard(mood, x, y);
    
    // Reset state
    this.isPressed = false;
    this.startTime = null;
    this.touchpoint.classList.remove('pressed');
  }
  
  getMoodFromDuration(duration) {
    for (const [key, mood] of Object.entries(this.moods)) {
      if (duration >= mood.duration[0] && duration < mood.duration[1]) {
        return mood;
      }
    }
    return this.moods.echo; // fallback for very long durations
  }
  
  createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'mood-ripple';
    
    // Position ripple at click/touch point
    const rect = this.container.getBoundingClientRect();
    ripple.style.left = (x - rect.left) + 'px';
    ripple.style.top = (y - rect.top) + 'px';
    
    this.container.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  showMoodCard(mood, x, y) {
    // Remove existing card
    if (this.currentCard) {
      this.currentCard.remove();
    }
    
    // Get random quote
    const quote = mood.quotes[Math.floor(Math.random() * mood.quotes.length)];
    
    // Create card
    const card = document.createElement('div');
    card.className = 'mood-card';
    card.style.background = mood.background;
    card.style.color = mood.textColor;
    
    card.innerHTML = `
      <div class="mood-card-content">
        <h3 class="mood-name">${mood.name}</h3>
        <p class="mood-description">${mood.description}</p>
        <blockquote class="mood-quote">
          <p>"${quote.text}"</p>
          <cite>— ${quote.author}</cite>
        </blockquote>
        <button class="mood-close" aria-label="Close">×</button>
      </div>
    `;
    
    // Position card near the interaction point but keep it on screen
    const rect = this.container.getBoundingClientRect();
    const cardX = Math.min(Math.max(x - rect.left - 150, 20), window.innerWidth - 320);
    const cardY = Math.min(Math.max(y - rect.top - 100, 20), window.innerHeight - 250);
    
    card.style.left = cardX + 'px';
    card.style.top = cardY + 'px';
    
    this.cardContainer.appendChild(card);
    this.currentCard = card;
    
    // Animate in
    setTimeout(() => card.classList.add('visible'), 10);
    
    // Close button functionality
    const closeBtn = card.querySelector('.mood-close');
    closeBtn.addEventListener('click', () => this.closeMoodCard());
    
    // Auto-close after 8 seconds
    setTimeout(() => this.closeMoodCard(), 8000);
  }
  
  closeMoodCard() {
    if (this.currentCard) {
      this.currentCard.classList.remove('visible');
      setTimeout(() => {
        if (this.currentCard && this.currentCard.parentNode) {
          this.currentCard.parentNode.removeChild(this.currentCard);
        }
        this.currentCard = null;
      }, 300);
    }
  }
}

// Initialize the widget when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const widgetContainer = document.querySelector('.mood-widget-container');
  if (widgetContainer) {
    new MoodWidget(widgetContainer);
  }
});