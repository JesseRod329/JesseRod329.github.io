// Countdown system for prediction locks
export const CountdownSystem = {
  intervalId: null,
  currentEvent: null,

  init: () => {
    console.log('CountdownSystem.init() called');
    // Countdown will be started when an event is selected
  },

  start: (event) => {
    console.log('CountdownSystem.start() called with event:', event);
    CountdownSystem.stop(); // Stop any existing countdown
    CountdownSystem.currentEvent = event;

    if (!event || !event.lock_time) {
      console.log('No event or lock_time, hiding countdown');
      CountdownSystem.hideCountdown();
      return;
    }

    const lockTime = new Date(event.lock_time);
    const now = new Date();

    if (lockTime <= now) {
      console.log('Event is already locked');
      CountdownSystem.showLockBanner();
      CountdownSystem.disablePredictionUI();
      return;
    }

    console.log('Starting countdown for event:', event.name);
    CountdownSystem.showCountdown();
    CountdownSystem.updateCountdown(lockTime);

    // Update every second
    CountdownSystem.intervalId = setInterval(() => {
      CountdownSystem.updateCountdown(lockTime);
    }, 1000);
  },

  stop: () => {
    if (CountdownSystem.intervalId) {
      clearInterval(CountdownSystem.intervalId);
      CountdownSystem.intervalId = null;
    }
  },

  updateCountdown: (lockTime) => {
    const now = new Date();
    const timeLeft = lockTime - now;

    // Debug logging
    console.log('Event lock_time:', lockTime);
    console.log('Remaining seconds:', Math.floor(timeLeft / 1000));

    if (timeLeft <= 0) {
      console.log('Countdown reached zero, locking predictions');
      CountdownSystem.showLockBanner();
      CountdownSystem.disablePredictionUI();
      CountdownSystem.stop();
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('lockCountdown');
    if (countdownElement) {
      countdownElement.textContent = `Time remaining: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  },

  showCountdown: () => {
    const lockCountdown = document.getElementById('lockCountdown');
    const lockBanner = document.getElementById('lockBanner');

    if (lockCountdown) lockCountdown.classList.remove('hidden');
    if (lockBanner) lockBanner.classList.add('hidden');
  },

  hideCountdown: () => {
    const lockCountdown = document.getElementById('lockCountdown');
    const lockBanner = document.getElementById('lockBanner');

    if (lockCountdown) lockCountdown.classList.add('hidden');
    if (lockBanner) lockBanner.classList.add('hidden');
  },

  showLockBanner: () => {
    const lockCountdown = document.getElementById('lockCountdown');
    const lockBanner = document.getElementById('lockBanner');

    if (lockCountdown) lockCountdown.classList.add('hidden');
    if (lockBanner) lockBanner.classList.remove('hidden');
  },

  disablePredictionUI: () => {
    console.log('Disabling prediction UI due to lock');

    // Disable all prediction inputs
    const inputs = document.querySelectorAll('#matchList input, #matchList select, #matchList button');
    inputs.forEach(input => {
      input.disabled = true;
      input.classList.add('opacity-50', 'cursor-not-allowed');
    });

    // Disable submit button
    const submitBtn = document.getElementById('submitPredictions');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.textContent = 'Predictions Locked';
    }

    // Disable event selector
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) {
      eventSelect.disabled = true;
      eventSelect.classList.add('opacity-50', 'cursor-not-allowed');
    }
  },

  enablePredictionUI: () => {
    console.log('Enabling prediction UI');

    // Enable all prediction inputs
    const inputs = document.querySelectorAll('#matchList input, #matchList select, #matchList button');
    inputs.forEach(input => {
      input.disabled = false;
      input.classList.remove('opacity-50', 'cursor-not-allowed');
    });

    // Enable submit button
    const submitBtn = document.getElementById('submitPredictions');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtn.textContent = 'Submit Predictions';
    }

    // Enable event selector
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) {
      eventSelect.disabled = false;
      eventSelect.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
};
