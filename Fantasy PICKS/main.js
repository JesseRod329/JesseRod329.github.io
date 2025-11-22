// Fantasy Wrestling Booking - Main JavaScript

// Global state management
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    predictions: {},
    events: [],
    leaderboard: [
        { name: 'WrestlingLegend2024', points: 2847, accuracy: 87, streak: 12 },
        { name: 'RingGeneral', points: 2634, accuracy: 84, streak: 8 },
        { name: 'ChampionshipMind', points: 2521, accuracy: 82, streak: 15 },
        { name: 'ThePredictor', points: 2398, accuracy: 79, streak: 6 },
        { name: 'WrestlingNostradamus', points: 2287, accuracy: 81, streak: 9 },
        { name: 'SmackDownSavant', points: 2156, accuracy: 78, streak: 4 },
        { name: 'RawExpert', points: 2089, accuracy: 76, streak: 11 },
        { name: 'TheOracle', points: 1987, accuracy: 80, streak: 7 },
        { name: 'WrestlingWizard', points: 1923, accuracy: 77, streak: 5 },
        { name: 'TheChairman', points: 1867, accuracy: 75, streak: 3 }
    ]
};

// Utility functions
const Utils = {
    formatTime: (days, hours, minutes, seconds) => {
        return `${days}D ${hours}H ${minutes}M ${seconds}S`;
    },
    
    calculateProgress: (current, total) => {
        return Math.round((current / total) * 100);
    },
    
    animateNumber: (element, start, end, duration = 2000) => {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    showNotification: (message, type = 'success') => {
        console.log('Showing notification:', message, type);
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-600' : 
                       type === 'error' ? 'bg-red-600' : 
                       type === 'info' ? 'bg-blue-600' : 'bg-gray-600';
        
        notification.className = `fixed top-20 right-4 p-4 rounded-lg text-white font-bold z-50 ${bgColor}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateX: [-300, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutQuart'
        });
        
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuart',
                complete: () => notification.remove()
            });
        }, 3000);
    }
};

// Animation controller
const AnimationController = {
    initScrollReveal: () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    },
    
    initTypewriter: () => {
        if (typeof window.Typed === 'undefined') return;
        const target = document.getElementById('typed-title');
        if (!target) return;
        const typed = new Typed('#typed-title', {
            strings: ['FANTASY WRESTLING', 'PREDICT & COMPETE', 'BECOME THE CHAMPION'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    },
    
    animateStats: () => {
        const userCount = document.getElementById('user-count');
        const predictionCount = document.getElementById('prediction-count');
        const eventCount = document.getElementById('event-count');
        
        if (userCount) Utils.animateNumber(userCount, 0, 47892);
        if (predictionCount) Utils.animateNumber(predictionCount, 0, 1234567);
        if (eventCount) Utils.animateNumber(eventCount, 0, 156);
    },
    
    initCountdown: () => {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        let days = 14, hours = 8, minutes = 22, seconds = 15;
        
        setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        hours = 23;
                        days--;
                    }
                }
            }
            
            countdownElement.textContent = Utils.formatTime(days, hours, minutes, seconds);
        }, 1000);
    }
};

// Prediction system
const PredictionSystem = {
    init: () => {
        PredictionSystem.updateSummary();
    },
    
    updateSummary: () => {
        const matchesPredicted = document.getElementById('matches-predicted');
        const bonusPoints = document.getElementById('bonus-points');
        const maxPoints = document.getElementById('max-points');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const submitButton = document.getElementById('submitPredictions');
        
        if (!matchesPredicted) return;
        
        let completedMatches = 0;
        let totalBonusPoints = 0;
        
        Object.values(AppState.predictions).forEach(prediction => {
            if (prediction.winner) completedMatches++;
            if (prediction.method) totalBonusPoints += 5;
            if (prediction.bonuses) {
                Object.values(prediction.bonuses).forEach(active => {
                    if (active) totalBonusPoints += 5;
                });
            }
        });
        
        matchesPredicted.textContent = `${completedMatches}/3`;
        bonusPoints.textContent = totalBonusPoints;
        
        const progress = Utils.calculateProgress(completedMatches, 3);
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}% Complete`;
        
        if (submitButton) {
            submitButton.disabled = completedMatches === 0;
            submitButton.textContent = completedMatches === 0 ? 
                'Make Some Predictions First' : 
                'Submit Predictions';
        }
    },
    
    submitPredictions: async () => {
        try {
            const sel = document.getElementById('eventSelect');
            const eventId = sel?.value;
            if (!eventId) {
                Utils.showNotification('Please select an event.', 'error');
                return;
            }

            if (!AppState.isAuthenticated || !AppState.currentUser) {
                Utils.showNotification('Please sign in to submit predictions.', 'error');
                return;
            }

            // Check if event is locked
            const { data: eventData } = await sb
                .from('events')
                .select('lock_time')
                .eq('id', eventId)
                .single();
            
            if (eventData && eventData.lock_time && new Date(eventData.lock_time) <= new Date()) {
                Utils.showNotification('Predictions are closed for this event.', 'error');
                return;
            }

            const picks = Object.entries(AppState.predictions);
            if (!picks.length) {
            Utils.showNotification('Please make at least one prediction!', 'error');
            return;
        }
        
            for (const [matchId, prediction] of picks) {
                const { error } = await sb.from('picks').upsert({
                    user_id: AppState.currentUser.id,
                    event_id: eventId,
                    match_id: matchId,
                    winner: prediction.winner || null,
                    method: prediction.method || null,
                    extras: prediction.bonuses || {}
                }, { onConflict: ['user_id','match_id'] });

                if (error) {
                    console.error('Prediction save error:', error);
                    Utils.showNotification('Failed to save some predictions.', 'error');
                    return;
                }
            }

            // Show saved checkmarks for all matches
            picks.forEach(([matchId]) => {
                showSavedCheckmark(matchId);
            });

            Utils.showNotification('Predictions saved successfully!', 'success');

        } catch (error) {
            console.error('Prediction submission error:', error);
            Utils.showNotification('An error occurred while saving predictions.', 'error');
        }
    },

    renderMatchCards: (matches) => {
        renderMatchCards(matches);
    }
};
async function loadEvents() {
  try {
    const { data, error } = await sb.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true });
    if (error) {
      console.error('Error loading events:', error);
      Utils.showNotification('Failed to load events. Please try again.', 'error');
      return;
    }
    
    AppState.events = data || [];
    
    // Handle events dropdown (for predictions page)
    const sel = document.getElementById('eventSelect');
    if (sel) {
      sel.innerHTML = '';
      if (AppState.events.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No events available';
        option.disabled = true;
        sel.appendChild(option);
      } else {
        AppState.events.forEach(event => {
          const option = document.createElement('option');
          option.value = event.id;
          option.textContent = `${event.name} — ${new Date(event.date).toLocaleDateString()}`;
          sel.appendChild(option);
        });
        
        if (AppState.events.length > 0) {
          sel.value = AppState.events[0].id;
          await loadCard(AppState.events[0].id);
          if (AppState.isAuthenticated) {
            await loadUserPicks(AppState.events[0].id);
            await PredictionSummarySystem.updateCurrentEvent();
          }
        }
      }
    }
    
    // Handle events list (for index page)
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
      eventsList.innerHTML = '';
      
      if (AppState.events.length === 0) {
        eventsList.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">🎭</div>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">No Events Available</h3>
            <p class="text-gray-400">Check back soon for upcoming wrestling events!</p>
          </div>
        `;
        return;
      }
      
      AppState.events.forEach(event => {
        const imgSrc = event.poster_url || 'resources/event-poster.jpg';
        const eventDate = new Date(event.date);
        const timeUntilEvent = eventDate - new Date();
        const days = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));
        
        const countdownText = timeUntilEvent > 0 
          ? `LIVE IN: ${days}D ${hours}H ${minutes}M`
          : 'EVENT COMPLETED';
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card p-6 rounded-lg scroll-reveal card-hover';
        eventCard.innerHTML = `
          <div class="bg-gray-800 rounded-lg p-4 mb-4">
            <img src="${imgSrc}" alt="${event.name} poster" class="w-full h-48 object-cover rounded-lg" 
                 onerror="this.src='resources/event-poster.jpg'">
          </div>
          <div class="countdown-timer text-center py-2 px-4 rounded-lg mb-4 text-white font-bold">
            <span class="accent-font">${countdownText}</span>
          </div>
          <h3 class="heading-font text-2xl font-bold text-yellow-400 mb-2">${event.name}</h3>
          <p class="text-gray-400 mb-4">${event.description || 'Epic wrestling showdown awaits'}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">${event.venue || 'Location TBD'}</span>
            <button onclick="location.href='predictions.html'" class="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
              Predict Now
            </button>
          </div>
        `;
        eventsList.appendChild(eventCard);
      });
    }
  } catch (error) {
    console.error('Error loading events:', error);
    Utils.showNotification('Failed to load events. Please check your connection.', 'error');
  }
}

async function loadCard(eventId) {
  // Load matches with results
  const { data: matches, error } = await sb
    .from('matches')
    .select('*')
    .eq('event_id', eventId)
    .order('match_order');
  
  if (error) return console.error(error);
  
  // Store matches for scoring calculations
  AppState.currentMatches = matches || [];
  
  renderMatchCards(matches);
  await loadUserPicks(eventId);
  
  // Load event data for countdown
  const { data: eventData, error: eventError } = await sb
    .from('events')
    .select('id, name, date, lock_time, status')
    .eq('id', eventId)
    .single();
  
  if (eventError) {
    console.error('Error loading event data:', eventError);
    return;
  }
  
  // Debug logging
  console.log('Event data loaded:', eventData);
  console.log('Event lock_time:', eventData.lock_time);
  console.log('Matches loaded:', matches);
  
  // Start countdown for this event
  CountdownSystem.start(eventData);
  
  // Calculate and display scoring if user is authenticated
  if (AppState.isAuthenticated) {
    await calculateAndDisplayScoring();
    // Also hydrate event scores from event_scores table
    await EventScoreSystem.hydrate(AppState.currentUser.id, eventId);
  }
}

const BONUS_KEYS = ['interference','titleChange','blood','table','surpriseReturn'];

// Scoring system for predictions
const ScoringSystem = {
    // Calculate points for a single prediction
    calculateMatchPoints: (prediction, match) => {
        if (!match.winner || !match.method) {
            return { points: 0, status: 'pending', details: [] };
        }
        
        let points = 0;
        let details = [];
        
        // Winner prediction (10 points)
        if (prediction.winner === match.winner) {
            points += 10;
            details.push({ type: 'winner', correct: true, points: 10 });
        } else {
            details.push({ type: 'winner', correct: false, points: 0 });
        }
        
        // Method prediction (5 points)
        if (prediction.method === match.method) {
            points += 5;
            details.push({ type: 'method', correct: true, points: 5 });
        } else {
            details.push({ type: 'method', correct: false, points: 0 });
        }
        
        // Bonus predictions (5 points each)
        const bonusProps = ['interference', 'titleChange', 'blood', 'table', 'surpriseReturn'];
        bonusProps.forEach(prop => {
            const predicted = prediction[prop] || false;
            const actual = match[`result_${prop}`] || false;
            
            if (predicted === actual && actual === true) {
                points += 5;
                details.push({ type: prop, correct: true, points: 5 });
            } else {
                details.push({ type: prop, correct: false, points: 0 });
            }
        });
        
        return { points, status: 'scored', details };
    },
    
    // Calculate total scoring for all predictions
    calculateTotalScoring: (predictions, matches) => {
        let totalPoints = 0;
        let correctMatches = 0;
        let totalMatches = 0;
        const matchScores = {};
        
        matches.forEach(match => {
            const prediction = predictions[match.id];
            if (!prediction) return;
            
            totalMatches++;
            const matchScore = ScoringSystem.calculateMatchPoints(prediction, match);
            matchScores[match.id] = matchScore;
            
            if (matchScore.status === 'scored') {
                totalPoints += matchScore.points;
                if (matchScore.points > 0) correctMatches++;
            }
        });
        
        const accuracy = totalMatches > 0 ? (correctMatches / totalMatches) * 100 : 0;
        
        return {
            totalPoints,
            correctMatches,
            totalMatches,
            accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal place
            matchScores
        };
    },
    
    // Display scoring summary
    displayScoringSummary: (scoring) => {
        const scoringSummary = document.getElementById('scoringSummary');
        const totalPoints = document.getElementById('totalPoints');
        const accuracyPercent = document.getElementById('accuracyPercent');
        const correctMatches = document.getElementById('correctMatches');
        
        if (!scoringSummary || !totalPoints || !accuracyPercent || !correctMatches) return;
        
        // Show scoring summary if there are any scored matches
        const hasScoredMatches = Object.values(scoring.matchScores).some(score => score.status === 'scored');
        
        if (hasScoredMatches) {
            scoringSummary.classList.remove('hidden');
            totalPoints.textContent = scoring.totalPoints;
            accuracyPercent.textContent = `${scoring.accuracy}%`;
            correctMatches.textContent = `${scoring.correctMatches}/${scoring.totalMatches}`;
        } else {
            scoringSummary.classList.add('hidden');
        }
    },
    
    // Add visual feedback to match cards
    addMatchFeedback: (matchId, matchScore) => {
        const matchCard = document.querySelector(`[data-match-id="${matchId}"]`);
        if (!matchCard) return;
        
        // Remove existing feedback
        const existingFeedback = matchCard.querySelector('.scoring-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (matchScore.status === 'pending') {
            // Add pending state
            const feedback = document.createElement('div');
            feedback.className = 'scoring-feedback mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-center';
            feedback.innerHTML = '<span class="text-yellow-400 font-semibold">⏳ Pending</span>';
            matchCard.appendChild(feedback);
        } else if (matchScore.status === 'scored') {
            // Add scored state with points
            const feedback = document.createElement('div');
            feedback.className = 'scoring-feedback mt-2 p-2 rounded text-center';
            
            const isCorrect = matchScore.points > 0;
            const bgColor = isCorrect ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30';
            const textColor = isCorrect ? 'text-green-400' : 'text-red-400';
            const icon = isCorrect ? '✅' : '❌';
            
            feedback.className += ` ${bgColor} border`;
            feedback.innerHTML = `
                <div class="flex items-center justify-center space-x-2">
                    <span class="text-lg">${icon}</span>
                    <span class="${textColor} font-bold text-lg">+${matchScore.points}</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    ${matchScore.details.filter(d => d.correct).length}/${matchScore.details.length} correct
                </div>
            `;
            matchCard.appendChild(feedback);
        }
    }
};

// Calculate and display scoring for current event
async function calculateAndDisplayScoring() {
    if (!AppState.isAuthenticated || !AppState.currentUser || !AppState.currentMatches) {
        return;
    }
    
    console.log('Calculating scoring for current matches:', AppState.currentMatches);
    console.log('Current predictions:', AppState.predictions);
    
    const scoring = ScoringSystem.calculateTotalScoring(AppState.predictions, AppState.currentMatches);
    console.log('Calculated scoring:', scoring);
    
    // Display summary
    ScoringSystem.displayScoringSummary(scoring);
    
    // Add feedback to each match card
    AppState.currentMatches.forEach(match => {
        const matchScore = scoring.matchScores[match.id];
        if (matchScore) {
            ScoringSystem.addMatchFeedback(match.id, matchScore);
        }
    });
}

// Event score hydration system
const EventScoreSystem = {
    // Hydrate event scores from event_scores table
    hydrate: async (userId, eventId) => {
        if (!userId || !eventId) {
            console.log('EventScoreSystem.hydrate: Missing userId or eventId');
            return;
        }
        
        try {
            console.log('Fetching event scores for user:', userId, 'event:', eventId);
            const { data, error } = await sb
                .from('event_scores')
                .select('*')
                .eq('user_id', userId)
                .eq('event_id', eventId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows found - show pending state
                    console.log('No event scores found, showing pending state');
                    EventScoreSystem.showPendingState();
                } else {
                    console.error('Error fetching event scores:', error);
                    Utils.showNotification('Failed to load event scores', 'error');
                }
                return;
            }
            
            console.log('Event scores loaded:', data);
            EventScoreSystem.displayEventScore(data);
            
        } catch (error) {
            console.error('Error in EventScoreSystem.hydrate:', error);
            Utils.showNotification('Failed to load event scores', 'error');
        }
    },
    
    // Display event score summary
    displayEventScore: (scoreData) => {
        const eventScoreSummary = document.getElementById('eventScoreSummary');
        const eventScoreContent = document.getElementById('eventScoreContent');
        
        if (!eventScoreSummary || !eventScoreContent) {
            console.log('Event score elements not found');
            return;
        }
        
        const totalPoints = scoreData.total_points || 0;
        const correctWinners = scoreData.correct_winners || 0;
        const totalPredictions = scoreData.total_predictions || 0;
        const accuracy = totalPredictions > 0 ? ((correctWinners / totalPredictions) * 100).toFixed(1) : '0.0';
        
        // Hide if no scoring yet
        if (totalPoints === 0 && totalPredictions === 0) {
            eventScoreSummary.classList.add('hidden');
            return;
        }
        
        // Show the summary bar
        eventScoreSummary.classList.remove('hidden');
        
        // Add green styling when points > 0
        if (totalPoints > 0) {
            eventScoreSummary.classList.add('bg-green-900/20', 'border-green-500/30', 'border');
        }
        
        // Populate content with the requested format
        eventScoreContent.innerHTML = `
            <div class="text-lg font-semibold text-green-400">
                You earned ${totalPoints} points · ${correctWinners}/${totalPredictions} correct (${accuracy}%)
            </div>
        `;
        
        console.log('Event score displayed:', { totalPoints, correctWinners, totalPredictions, accuracy });
    },
    
    // Show pending state
    showPendingState: () => {
        const eventScoreSummary = document.getElementById('eventScoreSummary');
        const eventScoreContent = document.getElementById('eventScoreContent');
        
        if (!eventScoreSummary || !eventScoreContent) {
            return;
        }
        
        // Show the summary bar
        eventScoreSummary.classList.remove('hidden');
        eventScoreSummary.classList.add('bg-yellow-900/20', 'border-yellow-500/30', 'border');
        
        // Show pending content
        eventScoreContent.innerHTML = `
            <div class="text-lg font-semibold text-yellow-400">
                ⏳ Scoring Pending
            </div>
            <div class="text-sm text-gray-400">
                Results will appear after matches are scored
            </div>
        `;
    },
    
    // Hide event score summary
    hide: () => {
        const eventScoreSummary = document.getElementById('eventScoreSummary');
        if (eventScoreSummary) {
            eventScoreSummary.classList.add('hidden');
        }
    }
};

function updatePredictionState(matchId, pick) {
  if (!AppState.predictions[matchId]) {
    AppState.predictions[matchId] = { bonuses: {} };
  }
  const state = AppState.predictions[matchId];
  if (pick.winner !== undefined) {
    state.winner = pick.winner || null;
  }
  if (pick.method !== undefined) {
    state.method = pick.method || null;
  }
  if (!state.bonuses) state.bonuses = {};
  BONUS_KEYS.forEach(key => {
    if (pick[key] !== undefined) {
      state.bonuses[key] = !!pick[key];
                    }
                });
            }

function renderMatchCards(matches) {
  const list = document.getElementById('matchList');
  if (!list) return;
  AppState.predictions = {};
  list.innerHTML = matches.map(m => `
    <div class="p-4 rounded-xl border mb-3 relative" data-card data-match-id="${m.id}" data-lock-at="${m.lock_at}">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold">${m.title || ''}</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">locks at ${new Date(m.lock_at).toLocaleTimeString()}</span>
          <div class="saved-badge hidden absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Saved ✓
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-2">
        <button class="pick h-12 rounded-xl border" data-winner="${m.wrestler_a}">${m.wrestler_a}</button>
        <button class="pick h-12 rounded-xl border" data-winner="${m.wrestler_b}">${m.wrestler_b}</button>
      </div>
      <label class="block text-sm mb-1">Method</label>
      <select class="method bg-gray-900 text-white border border-gray-700 rounded-md px-2 py-1 w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none">
        <option value="">Select…</option>
        <option>pinfall</option>
        <option>submission</option>
        <option>DQ</option>
        <option>countout</option>
      </select>
      <div class="grid grid-cols-3 gap-2 text-sm">
        <label><input type="checkbox" class="prop" data-prop="interference"> Interference</label>
        <label><input type="checkbox" class="prop" data-prop="titleChange"> Title Change</label>
        <label><input type="checkbox" class="prop" data-prop="blood"> Blood</label>
        <label><input type="checkbox" class="prop" data-prop="table"> Table</label>
        <label><input type="checkbox" class="prop" data-prop="surpriseReturn"> Surprise Return</label>
      </div>
      <div class="match-feedback hidden mt-2 text-sm">
        <!-- Per-match correctness feedback will be added here -->
      </div>
      <div class="scoring-breakdown hidden mt-3 p-2 bg-gray-800 rounded-lg">
        <div class="flex items-center space-x-2 mb-1">
          <span class="text-xs font-medium text-gray-300">Scoring:</span>
        </div>
        <div class="scoring-details text-xs text-gray-400">
          <!-- Scoring details will be populated here -->
        </div>
      </div>
    </div>
  `).join('');
}

function isLocked(lockAt) {
  return new Date(lockAt).getTime() <= Date.now();
}

// Show saved checkmark on match card
function showSavedCheckmark(matchId) {
  const card = document.querySelector(`[data-card][data-match-id="${matchId}"]`);
  if (!card) return;
  
  const savedBadge = card.querySelector('.saved-badge');
  if (!savedBadge) return;
  
  // Show the badge
  savedBadge.classList.remove('hidden');
  
  // Add green ring to card
  card.classList.add('ring-2', 'ring-green-500');
  
  // Fade out after 1.5 seconds
  setTimeout(() => {
    savedBadge.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    setTimeout(() => {
      savedBadge.classList.add('hidden');
      savedBadge.classList.remove('opacity-0', 'transition-opacity');
      card.classList.remove('ring-2', 'ring-green-500');
    }, 500);
  }, 1500);
}

// Show save confirmation with green ring animation (enhanced version)
function showSaveConfirmation(matchId) {
  const card = document.querySelector(`[data-card][data-match-id="${matchId}"]`);
  if (!card) return;
  
  // Add enhanced green ring animation
  card.classList.add('ring-2', 'ring-green-400', 'transition-shadow', 'duration-300');
  
  setTimeout(() => {
    card.classList.remove('ring-2', 'ring-green-400', 'transition-shadow');
  }, 2000);
}

// Extras key mapping for display
const EXTRAS_LABELS = {
  interference: "Interference",
  titleChange: "Title Change", 
  blood: "Blood",
  table: "Table",
  surpriseReturn: "Surprise Return"
};

// Add scoring feedback to match card
async function addScoringFeedback(matchId, match) {
  if (!AppState.isAuthenticated || !AppState.currentUser) return;
  
  const card = document.querySelector(`[data-card][data-match-id="${matchId}"]`);
  if (!card) return;
  
  // Check if match has results
  if (!match.winner || !match.method) {
    return; // No results yet
  }
  
  // Get user's pick for this match
  const userPick = await getUserPickForMatch(matchId);
  if (!userPick) return;
  
  // Calculate scoring
  const scoring = calculateMatchScoring(userPick, match);
  
  // Update scoring breakdown
  updateScoringBreakdown(card, scoring);
}

// Get user's pick for a specific match
async function getUserPickForMatch(matchId) {
  if (!AppState.isAuthenticated || !AppState.currentUser) return null;
  
  const { data, error } = await window.sb
    .from('picks')
    .select('*')
    .eq('user_id', AppState.currentUser.id)
    .eq('match_id', matchId)
    .single();
  
  if (error || !data) return null;
  return data;
}

// Calculate scoring for a match
function calculateMatchScoring(pick, match) {
  const scoring = {
    winner: { correct: false, points: 0 },
    method: { correct: false, points: 0 },
    extras: { correct: [], points: 0, total: 0 }
  };
  
  // Winner scoring (10 points)
  if (pick.winner === match.winner) {
    scoring.winner.correct = true;
    scoring.winner.points = 10;
  }
  
  // Method scoring (5 points)
  if (pick.method === match.method) {
    scoring.method.correct = true;
    scoring.method.points = 5;
  }
  
  // Extras scoring (2 points each)
  const matchExtras = match.extras || {};
  const pickExtras = pick.extras || {};
  
  Object.keys(EXTRAS_LABELS).forEach(key => {
    if (matchExtras[key] && pickExtras[key]) {
      scoring.extras.correct.push(key);
      scoring.extras.points += 2;
    }
    if (matchExtras[key]) {
      scoring.extras.total++;
    }
  });
  
  return scoring;
}

// Update scoring breakdown display
function updateScoringBreakdown(card, scoring) {
  const breakdown = card.querySelector('.scoring-breakdown');
  const details = card.querySelector('.scoring-details');
  
  if (!breakdown || !details) return;
  
  const totalPoints = scoring.winner.points + scoring.method.points + scoring.extras.points;
  
  let html = '';
  
  // Winner
  const winnerIcon = scoring.winner.correct ? '✓' : '✗';
  const winnerColor = scoring.winner.correct ? 'text-green-400' : 'text-red-400';
  html += `<div class="flex items-center space-x-1"><span class="${winnerColor}">${winnerIcon}</span><span>+${scoring.winner.points} Winner</span></div>`;
  
  // Method
  const methodIcon = scoring.method.correct ? '✓' : '✗';
  const methodColor = scoring.method.correct ? 'text-green-400' : 'text-red-400';
  html += `<div class="flex items-center space-x-1"><span class="${methodColor}">${methodIcon}</span><span>+${scoring.method.points} Method</span></div>`;
  
  // Extras
  if (scoring.extras.total > 0) {
    html += `<div class="flex items-center space-x-1"><span class="text-gray-400">+${scoring.extras.points} Extras</span></div>`;
    
    // Show individual extras
    scoring.extras.correct.forEach(key => {
      const label = EXTRAS_LABELS[key];
      html += `<div class="ml-4 text-xs text-green-400">+2 ${label}</div>`;
    });
  }
  
  // Total points
  html += `<div class="mt-1 pt-1 border-t border-gray-600 font-medium text-yellow-400">Total: +${totalPoints} points</div>`;
  
  details.innerHTML = html;
  breakdown.classList.remove('hidden');
}

// Add per-match correctness feedback
function addMatchCorrectnessFeedback(matchId, prediction, match) {
  const card = document.querySelector(`[data-card][data-match-id="${matchId}"]`);
  if (!card) return;
  
  const feedbackDiv = card.querySelector('.match-feedback');
  if (!feedbackDiv) return;
  
  // Clear existing feedback
  feedbackDiv.innerHTML = '';
  feedbackDiv.classList.add('hidden');
  
  // Check if match has results
  if (!match.winner || !match.method) {
    const pendingDiv = document.createElement('div');
    pendingDiv.className = 'flex items-center space-x-2 text-yellow-400';
    pendingDiv.innerHTML = `
      <span>⏳</span>
      <span>Pending</span>
    `;
    feedbackDiv.appendChild(pendingDiv);
    feedbackDiv.classList.remove('hidden');
    return;
  }
  
  // Calculate correctness
  const winnerCorrect = prediction.winner === match.winner;
  const methodCorrect = prediction.method === match.method;
  
  // Check bonus props
  const extras = match.extras || {};
  const predictionExtras = {};
  Object.keys(extras).forEach(key => {
    predictionExtras[key] = prediction[key] || false;
  });
  
  const extrasCorrect = Object.keys(extras).every(key => 
    predictionExtras[key] === extras[key]
  );
  
  // Calculate points
  let points = 0;
  if (winnerCorrect) points += 10;
  if (methodCorrect) points += 5;
  if (extrasCorrect && Object.keys(extras).length > 0) points += 5;
  
  // Create feedback element
  const feedbackElement = document.createElement('div');
  feedbackElement.className = `flex items-center space-x-2 ${points > 0 ? 'text-green-400' : 'text-red-400'}`;
  
  const icon = points > 0 ? '✅' : '❌';
  const pointsText = points > 0 ? `+${points} points` : '0 points';
  
  feedbackElement.innerHTML = `
    <span>${icon}</span>
    <span>${pointsText}</span>
  `;
  
  feedbackDiv.appendChild(feedbackElement);
  feedbackDiv.classList.remove('hidden');
}

function getPick(card) {
  const selectedBtn = card.querySelector('.pick.ring-2');
  const winner = selectedBtn ? selectedBtn.dataset.winner : null;
  const method = card.querySelector('.method')?.value || null;
  const props = {};
  card.querySelectorAll('.prop').forEach(c => props[c.dataset.prop] = c.checked);
  return { winner, method, ...props };
}

async function savePick(matchId, pick) {
  if (!AppState.isAuthenticated || !AppState.currentUser) {
    Utils.showNotification('Please sign in to save your pick.', 'error');
    return;
  }

  // Check if event is locked using event lock_time
  const eventId = document.getElementById('eventSelect')?.value;
  if (eventId) {
    const { data: eventData } = await sb
      .from('events')
      .select('lock_time')
      .eq('id', eventId)
      .single();
    
    if (eventData && eventData.lock_time && new Date(eventData.lock_time) <= new Date()) {
      Utils.showNotification('Predictions are closed for this event.', 'error');
      return;
    }
  }

  const { error } = await sb.from('picks').upsert({
    user_id: AppState.currentUser.id,
    event_id: eventId,
    match_id: matchId,
    winner: pick.winner || null,
    method: pick.method || null,
    extras: {
      interference: !!pick.interference,
      titleChange: !!pick.titleChange,
      blood: !!pick.blood,
      table: !!pick.table,
      surpriseReturn: !!pick.surpriseReturn,
    }
  }, { onConflict: ['user_id','match_id'] });

  if (error) {
    console.error('Error saving pick:', error);
    if (error.message && error.message.includes('lock')) {
      Utils.showNotification('Predictions are closed for this event.', 'error');
    } else {
      Utils.showNotification('Failed to save prediction. Please try again.', 'error');
    }
  } else {
    console.log('Pick saved successfully');
    showSavedCheckmark(matchId);
    showSaveConfirmation(matchId);
    Utils.showNotification('Prediction saved!', 'success');
  }
}

async function loadUserPicks(eventId) {
  if (!AppState.isAuthenticated || !AppState.currentUser) return;
  const matchesRes = await sb.from('matches').select('id').eq('event_id', eventId);
  if (matchesRes.error) return console.error(matchesRes.error);
  const matchIds = (matchesRes.data || []).map(m => m.id);
  if (!matchIds.length) return;
  const { data } = await sb.from('picks')
    .select('match_id, winner, method, extras')
    .in('match_id', matchIds);
  (data || []).forEach(p => {
    const card = document.querySelector(`[data-card][data-match-id="${p.match_id}"]`);
    if (!card) return;
    const stored = { winner: p.winner || null, method: p.method || null };
    BONUS_KEYS.forEach(key => {
      stored[key] = p.extras ? !!p.extras[key] : false;
    });
    updatePredictionState(p.match_id, stored);
    if (stored.winner) {
      card.querySelectorAll('.pick').forEach(b => {
        b.classList.remove('ring-2','ring-yellow-400');
        if (b.dataset.winner === stored.winner) b.classList.add('ring-2','ring-yellow-400');
      });
    }
    const methodSel = card.querySelector('.method');
    if (methodSel && stored.method) methodSel.value = stored.method;
    card.querySelectorAll('.prop').forEach(c => {
      c.checked = stored[c.dataset.prop];
    });
    
    // Add per-match correctness feedback
    const match = AppState.currentMatches?.find(m => m.id === p.match_id);
    if (match) {
      addMatchCorrectnessFeedback(p.match_id, stored, match);
      addScoringFeedback(p.match_id, match);
    }
  });
  
  // Calculate and display scoring after loading predictions
  await calculateAndDisplayScoring();
}

// Leaderboard system
const LeaderboardSystem = {
    state: {
        currentTab: 'event',
        userEmail: null,
        events: [],
        currentEventId: null,
        weeklyWeek: null
    },

    init: async () => {
        console.log('LeaderboardSystem.init() called');
        console.log('Current URL:', window.location.href);
        
        if (!document.getElementById('leaderboardTabs')) {
            console.log('leaderboardTabs element not found, returning');
            return;
        }
        
        console.log('Leaderboard tabs found, proceeding with initialization');
        await LeaderboardSystem.loadCurrentUser();
        await LeaderboardSystem.loadEvents();
        LeaderboardSystem.bindTabEvents();
        LeaderboardSystem.bindEventFilter();
        await LeaderboardSystem.fetchAndRender();
    },

    loadCurrentUser: async () => {
        if (AppState.isAuthenticated && AppState.currentUser?.email) {
            LeaderboardSystem.state.userEmail = AppState.currentUser.email;
        }
    },

    loadEvents: async () => {
        const eventSelect = document.getElementById('eventFilter');
        if (!eventSelect) return;
        try {
            const { data, error } = await sb
                .from('events')
                .select('id,name,date')
                .order('date', { ascending: false });
            if (error) throw error;
            LeaderboardSystem.state.events = data || [];
            eventSelect.innerHTML = '';
            LeaderboardSystem.state.events.forEach((event, index) => {
                const option = document.createElement('option');
                option.value = event.id;
                option.textContent = `${event.name} — ${new Date(event.date).toLocaleDateString()}`;
                if (index === 0) {
                    option.selected = true;
                    LeaderboardSystem.state.currentEventId = event.id;
                }
                eventSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Load events error:', error);
        }
    },

    bindTabEvents: () => {
        document
            .querySelectorAll('#leaderboardTabs .tab-button')
            .forEach(button => {
                button.addEventListener('click', async (e) => {
                    const tabs = document.querySelectorAll('#leaderboardTabs .tab-button');
                    tabs.forEach(btn => btn.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    LeaderboardSystem.state.currentTab = e.currentTarget.dataset.tab;
                    LeaderboardSystem.toggleEventSelector();
                    await LeaderboardSystem.fetchAndRender();
                });
            });
        LeaderboardSystem.toggleEventSelector();
    },

    bindEventFilter: () => {
        const eventSelect = document.getElementById('eventFilter');
        if (!eventSelect) return;
        eventSelect.addEventListener('change', async (e) => {
            LeaderboardSystem.state.currentEventId = e.target.value;
            if (LeaderboardSystem.state.currentTab === 'event') {
                await LeaderboardSystem.fetchAndRender();
            }
        });
    },
    
    toggleEventSelector: () => {
        const selector = document.getElementById('eventSelector');
        if (!selector) return;
        selector.classList.toggle('hidden', LeaderboardSystem.state.currentTab !== 'event');
    },

    fetchAndRender: async () => {
        console.log('LeaderboardSystem.fetchAndRender() called');
        console.log('Current tab:', LeaderboardSystem.state.currentTab);
        
        try {
            LeaderboardSystem.toggleLoading(true);
            const tab = LeaderboardSystem.state.currentTab;
            let rows = [];

            if (tab === 'event') {
                console.log('Loading event leaderboard from leaderboard view');
                await LeaderboardSystem.ensureEventSelected();
                const eventId = LeaderboardSystem.state.currentEventId;
                console.log('Event ID:', eventId);
                if (!eventId) {
                    LeaderboardSystem.renderError('No events available.');
                    return;
                }
                const { data, error } = await sb
                    .from('leaderboard')
                    .select('*')
                    .eq('event_id', eventId)
                    .order('total_points', { ascending: false })
                    .limit(20);
                if (error) throw error;
                rows = data || [];
                console.log(`Event leaderboard data: ${rows.length} rows returned`);
            } else if (tab === 'global') {
                console.log('Loading global leaderboard from leaderboard_global view');
                const { data, error } = await sb
                    .from('leaderboard_global')
                    .select('*')
                    .order('total_points', { ascending: false })
                    .limit(20);
                if (error) throw error;
                rows = data || [];
                console.log(`Global leaderboard data: ${rows.length} rows returned`);
            } else {
                console.log('Loading weekly leaderboard from leaderboard_weekly view');
                const { data, error } = await sb
                    .from('leaderboard_weekly')
                    .select('*')
                    .order('week', { ascending: false })
                    .order('total_points', { ascending: false })
                    .limit(20);
                if (error) throw error;
                rows = data || [];
                LeaderboardSystem.state.weeklyWeek = rows[0]?.week || null;
                console.log(`Weekly leaderboard data: ${rows.length} rows returned`);
            }

            console.log(`Rendering table with ${rows.length} rows`);
            
            // Defensive check for empty data
            if (!rows || rows.length === 0) {
                console.log('No leaderboard data returned');
                LeaderboardSystem.renderTable([]);
            } else {
                LeaderboardSystem.renderTable(rows);
            }
        } catch (error) {
            console.error('Leaderboard load error:', error);
            console.error('Error details:', error.message, error.code);
            
            // Show user-friendly error message
            const errorMessage = error.message?.includes('relation') 
                ? 'Leaderboard views not found. Please contact support.'
                : 'Failed to load leaderboard data. Please try again.';
            
            LeaderboardSystem.renderError(errorMessage);
            Utils.showNotification('Failed to load leaderboard data', 'error');
        } finally {
            LeaderboardSystem.toggleLoading(false);
        }
    },

    ensureEventSelected: async () => {
        if (!LeaderboardSystem.state.currentEventId) {
            if (!LeaderboardSystem.state.events.length) {
                await LeaderboardSystem.loadEvents();
            }
            LeaderboardSystem.state.currentEventId = LeaderboardSystem.state.events[0]?.id || null;
        }
    },

    toggleLoading: (show) => {
        const loader = document.getElementById('leaderboardLoader');
        const tables = document.getElementById('leaderboardTables');
        if (!loader || !tables) return;
        loader.classList.toggle('hidden', !show);
        tables.classList.toggle('hidden', show);
    },

    renderTable: (rows) => {
        console.log('LeaderboardSystem.renderTable() called with', rows.length, 'rows');
        
        const tbody = document.getElementById('leaderboardRows');
        const heading = document.getElementById('leaderboardHeading');
        const weeklyInfo = document.getElementById('weeklyInfo');
        const weeklyHeading = document.getElementById('weeklyHeading');
        const tab = LeaderboardSystem.state.currentTab;

        console.log('Table elements found:', {
            tbody: !!tbody,
            heading: !!heading,
            weeklyInfo: !!weeklyInfo,
            weeklyHeading: !!weeklyHeading
        });

        if (!tbody || !heading) {
            console.log('Missing required table elements, returning');
            return;
        }

        weeklyInfo?.classList.toggle('hidden', tab !== 'weekly');
        if (tab === 'weekly' && weeklyHeading) {
            weeklyHeading.textContent = LeaderboardSystem.state.weeklyWeek
                ? `Week of ${new Date(LeaderboardSystem.state.weeklyWeek).toLocaleDateString()}`
                : 'Current Week';
        }

        heading.textContent = tab === 'event'
            ? 'Event Leaderboard'
            : tab === 'global'
                ? 'All-Time Leaderboard'
                : 'Weekly Leaderboard';

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-8 py-12 text-center">
                        <div class="flex flex-col items-center space-y-4">
                            <div class="text-6xl">📊</div>
                            <div class="text-lg font-semibold text-gray-300">No data yet—check back after results.</div>
                            <div class="text-sm text-gray-400 max-w-md">Leaderboards will appear once matches have been scored!</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const tableHTML = rows.map((row, index) => {
            // Map event_scores-backed view columns
            const totalPoints = row.total_points ?? 0;
            const correctWinners = row.correct_winners ?? 0;
            const totalPredictions = row.total_predictions ?? 0;
            const accuracy = totalPredictions > 0 ? ((correctWinners / totalPredictions) * 100).toFixed(1) : '0.0';
            const user = row.email || row.user_email || 'Unknown';
            const highlight = LeaderboardSystem.state.userEmail && user === LeaderboardSystem.state.userEmail;
            
            // Top 3 medal and styling
            let medal = '';
            let rankClass = '';
            let rankDisplay = `${index + 1}`;
            
            if (index === 0) {
                medal = '🥇';
                rankClass = 'rank-gold';
                rankDisplay = '🥇';
            } else if (index === 1) {
                medal = '🥈';
                rankClass = 'rank-silver';
                rankDisplay = '🥈';
            } else if (index === 2) {
                medal = '🥉';
                rankClass = 'rank-bronze';
                rankDisplay = '🥉';
            }
            
            return `
                <tr class="${highlight ? 'highlight' : ''} ${rankClass} transition-all duration-200 hover:scale-[1.01]">
                    <td class="px-4 py-4 font-bold text-center">
                        <span class="text-lg">${rankDisplay}</span>
                    </td>
                    <td class="px-4 py-4 font-medium">${user}</td>
                    <td class="px-4 py-4 font-semibold text-center text-green-400">${totalPoints}</td>
                    <td class="px-4 py-4 font-semibold text-center text-yellow-300">${correctWinners}</td>
                    <td class="px-4 py-4 text-center text-gray-400">${totalPredictions}</td>
                    <td class="px-4 py-4 font-semibold text-center text-blue-400">${accuracy}%</td>
                </tr>
            `;
        }).join('');
        
        console.log('Generated table HTML:', tableHTML.substring(0, 200) + '...');
        tbody.innerHTML = tableHTML;
        console.log('Table rendered successfully');
    },

    renderError: (message) => {
        const tbody = document.getElementById('leaderboardRows');
        if (!tbody) return;
        tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-red-400">${message}</td></tr>`;
    }
};

// Countdown system for prediction locks
const CountdownSystem = {
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

// Navigation system
const NavigationSystem = {
    init: () => {
        NavigationSystem.bindEvents();
        NavigationSystem.updateActiveState();
    },
    
    bindEvents: () => {
        // Mobile menu toggle (if needed)
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    updateActiveState: () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('text-yellow-400');
                link.classList.remove('text-white');
            }
        });
    }
};

// Event handlers
const EventHandlers = {
    init: () => {
        EventHandlers.bindButtonClicks();
        EventHandlers.bindFormSubmissions();
    },
    
    bindButtonClicks: () => {
        // Generic button click handler with animation
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!e.target.closest('#submitPredictions')) {
                    anime({
                        targets: e.target,
                        scale: [1, 0.95, 1],
                        duration: 200,
                        easing: 'easeInOutQuad'
                    });
                }
            });
        });
        
        // Event card buttons
        document.querySelectorAll('.event-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.showNotification('Redirecting to predictions page...', 'success');
                setTimeout(() => {
                    window.location.href = 'predictions.html';
                }, 1000);
            });
        });
    },
    
    bindFormSubmissions: () => {
        // Newsletter signup (if exists)
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('Thanks for subscribing!', 'success');
                newsletterForm.reset();
            });
        }
    }
};

// Authentication state management
const AuthManager = {
    async init() {
        console.log('AuthManager.init() called');
        if (!window.sb) {
            console.error('Supabase client not initialized');
            return;
        }
        console.log('Supabase client found, proceeding with auth setup');
        
        // Check for existing session on page load
        await AuthManager.checkExistingSession();
        
        // Set up auth state change listener
        window.sb.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            await AuthManager.handleAuthStateChange(event, session);
        });
    },
    
    async checkExistingSession() {
        try {
            const { data: { session }, error } = await window.sb.auth.getSession();
            if (error) {
                console.error('Error checking session:', error);
                return;
            }
            
            if (session) {
                await AuthManager.setAuthenticatedUser(session.user);
            } else {
                AuthManager.setUnauthenticatedUser();
            }
        } catch (error) {
            console.error('Error checking existing session:', error);
            AuthManager.setUnauthenticatedUser();
        }
    },
    
    async handleAuthStateChange(event, session) {
        if (event === 'SIGNED_IN' && session?.user) {
            await AuthManager.setAuthenticatedUser(session.user);
        } else if (event === 'SIGNED_OUT') {
            AuthManager.setUnauthenticatedUser();
        }
    },
    
    async setAuthenticatedUser(user) {
        AppState.currentUser = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
            avatar: user.user_metadata?.picture || user.user_metadata?.avatar_url || null
        };
        AppState.isAuthenticated = true;
        
        // Update UI
        AuthManager.updateAuthUI(true);
        
        // Ensure user profile exists in database
        await AuthManager.ensureUserProfile(user);
        
        // Also call the new ensureProfile helper for additional safety
        await ApiHelpers.ensureProfile();
        
        // Load user-specific data if on relevant pages
        if (location.pathname.includes('predictions') || location.pathname === '/' || location.pathname.includes('index.html')) {
            await loadEvents();
        }
        if (location.pathname.includes('leaderboard')) {
            await LeaderboardSystem.loadCurrentUser();
            await LeaderboardSystem.fetchAndRender();
        }
    },
    
    setUnauthenticatedUser() {
        AppState.currentUser = null;
        AppState.isAuthenticated = false;
        AuthManager.updateAuthUI(false);
    },
    
    updateAuthUI(isAuthenticated) {
        const btnSignIn = document.getElementById('btnSignIn');
        const userChip = document.getElementById('userChip');
        const avatar = document.getElementById('userAvatar');
        const handle = document.getElementById('userHandle');
        
        if (btnSignIn && userChip) {
            btnSignIn.classList.toggle('hidden', isAuthenticated);
            userChip.classList.toggle('hidden', !isAuthenticated);
        }
        
        if (isAuthenticated && AppState.currentUser) {
            if (avatar) avatar.src = AppState.currentUser.avatar || '';
            if (handle) handle.textContent = AppState.currentUser.name || 'You';
        }
    },
    
    async ensureUserProfile(user) {
        try {
            console.log('Ensuring user profile for:', user.email);
            
            // Check if profile already exists
            const { data: me } = await window.sb
                .from('users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();
            
            if (!me) {
                console.log('Profile not found, creating new profile');
                // Will pass RLS: id must equal auth.uid()
                const { error } = await window.sb.from('users').insert({
                    id: user.id,
                    email: user.email ?? null,
                    display_name: user.user_metadata?.full_name ?? null,
                    avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url || null
                });
                
                if (error) {
                    throw error; // Let the catch block handle the error
                }
                
                console.log('User profile created successfully ✓');
            } else {
                console.log('User profile already exists ✓');
            }
        } catch (error) {
            console.error('Error in ensureUserProfile:', error);
            Utils.showNotification('Profile verification failed', 'error');
        }
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb) {
        console.error('Supabase client not initialized');
        return;
    }

    // Initialize authentication first
    await AuthManager.init();

    // Initialize all systems
    AnimationController.initScrollReveal();
    AnimationController.initTypewriter();
    AnimationController.animateStats();
    AnimationController.initCountdown();
    
    PredictionSystem.init();
    CountdownSystem.init();
    NavigationSystem.init();
    EventHandlers.init();
    
    // Add loading animation
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuart'
    });
    
    console.log('Fantasy Wrestling Booking initialized successfully!');

    // ---- Auth functions ----
    async function signIn() {
      console.log('Sign in button clicked');
      try {
        console.log('Attempting Google OAuth sign in...');
        console.log('Current URL:', window.location.href);
        console.log('Supabase client:', window.sb);
        
        // Check if we're running from file:// protocol
        if (window.location.protocol === 'file:') {
          Utils.showNotification('Please run this from a web server (not file://). Try: python -m http.server 8000', 'error');
          return;
        }
        
        const { data, error } = await window.sb.auth.signInWithOAuth({ 
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        
        console.log('OAuth response:', { data, error });
        
        if (error) {
          console.error('Sign in error:', error);
          Utils.showNotification(`Sign in failed: ${error.message}`, 'error');
        } else {
          console.log('OAuth redirect initiated');
          Utils.showNotification('Redirecting to Google...', 'info');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        Utils.showNotification(`Sign in failed: ${error.message}`, 'error');
      }
    }

    async function signOut() {
      try {
        await window.sb.auth.signOut();
        // AuthManager will handle the UI update via onAuthStateChange
      } catch (error) {
        console.error('Sign out error:', error);
        Utils.showNotification('Sign out failed. Please try again.', 'error');
      }
    }

    document.addEventListener('click', async (e) => {
      console.log('Click detected on:', e.target?.id, e.target?.className);
      
      if (e.target?.classList?.contains('pick')) {
        const card = e.target.closest('[data-card]');
        if (!card) return;
        const matchId = card.dataset.matchId;
        const pick = getPick(card);
        pick.winner = e.target.dataset.winner;
        await savePick(matchId, pick);
        card.querySelectorAll('.pick').forEach(b => b.classList.remove('ring-2','ring-yellow-400'));
        e.target.classList.add('ring-2','ring-yellow-400');
        updatePredictionState(matchId, pick);
        PredictionSystem.updateSummary();
      }

      if (e.target?.id === 'btnSignIn' || e.target?.id === 'loginBtn') {
        console.log('Sign in button clicked, calling signIn()');
        signIn();
      }
      if (e.target?.id === 'btnSignOut') {
        console.log('Sign out button clicked, calling signOut()');
        signOut();
      }
    });

    document.addEventListener('change', async (e) => {
      // Handle event selection change
      if (e.target.id === 'eventSelect') {
        const eventId = e.target.value;
        if (eventId) {
          await loadCard(eventId);
          if (AppState.isAuthenticated) {
            await loadUserPicks(eventId);
            await PredictionSummarySystem.updateCurrentEvent();
          }
        }
        return;
      }

      // Handle match prediction changes
      const card = e.target.closest('[data-card]');
      if (!card) return;
      const matchId = card.dataset.matchId;
      const pick = getPick(card);
      if (e.target.classList.contains('method')) pick.method = e.target.value;
      if (e.target.classList.contains('prop')) pick[e.target.dataset.prop] = e.target.checked;
      updatePredictionState(matchId, pick);
      await savePick(matchId, pick);
      PredictionSystem.updateSummary();
      
      // Update prediction summary after saving pick
      if (AppState.isAuthenticated) {
        await PredictionSummarySystem.updateCurrentEvent();
      }
    });

    // Initialize page-specific functionality
    if (location.pathname.includes('predictions')) {
      const sel = document.getElementById('eventSelect');
      if (sel) {
        sel.addEventListener('change', async () => {
          await loadCard(sel.value);
          if (AppState.isAuthenticated) {
            await loadUserPicks(sel.value);
          }
        });
      }
      document.getElementById('submitPredictions')?.addEventListener('click', PredictionSystem.submitPredictions);
    }
    
    if (location.pathname.includes('leaderboard')) {
      await LeaderboardSystem.init();
    }
    
    if (location.pathname.includes('admin')) {
      await AdminSystem.init();
    }
});

// Admin system
const AdminSystem = {
    ALLOWED_ADMINS: ['jesse.rodriguez89@gmail.com'],
    currentEventId: null,
    matches: [],

    init: async () => {
        console.log('AdminSystem.init() called');
        console.log('Current URL:', window.location.href);
        console.log('AppState.isAuthenticated:', AppState.isAuthenticated);
        console.log('AppState.currentUser:', AppState.currentUser);
        
        if (!document.getElementById('adminContent')) {
            console.log('adminContent element not found, returning');
            return;
        }
        
        // Check if user is authenticated and is admin
        if (!AppState.isAuthenticated || !AppState.currentUser) {
            console.log('User not authenticated, showing access denied');
            AdminSystem.showAccessDenied('Please sign in to access admin panel.');
            return;
        }
        
        console.log('User email:', AppState.currentUser.email);
        console.log('Allowed admins:', AdminSystem.ALLOWED_ADMINS);
        
        if (!AdminSystem.ALLOWED_ADMINS.includes(AppState.currentUser.email)) {
            console.log('User not in admin list, showing access denied');
            AdminSystem.showAccessDenied('You do not have admin privileges.');
            return;
        }
        
        console.log('User is admin, showing admin content');
        // Show admin content and load events
        AdminSystem.showAdminContent();
        await AdminSystem.loadEvents();
        AdminSystem.bindEventListeners();
    },

    showAccessDenied: (message) => {
        const accessDenied = document.getElementById('accessDenied');
        const adminContent = document.getElementById('adminContent');
        
        if (accessDenied) {
            accessDenied.querySelector('p').textContent = message;
            accessDenied.classList.remove('hidden');
        }
        if (adminContent) {
            adminContent.classList.add('hidden');
        }
    },

    showAdminContent: () => {
        console.log('AdminSystem.showAdminContent() called');
        const accessDenied = document.getElementById('accessDenied');
        const adminContent = document.getElementById('adminContent');
        
        console.log('accessDenied element:', accessDenied);
        console.log('adminContent element:', adminContent);
        
        if (accessDenied) {
            accessDenied.classList.add('hidden');
            console.log('Hidden access denied message');
        }
        if (adminContent) {
            adminContent.classList.remove('hidden');
            console.log('Showed admin content');
        }
    },

    loadEvents: async () => {
        console.log('AdminSystem.loadEvents() called');
        try {
            const { data, error } = await window.sb.from('events')
                .select('*')
                .order('date', { ascending: false });
            
            if (error) throw error;
            
            console.log('Events loaded:', data);
            
            const eventSelect = document.getElementById('eventSelect');
            if (!eventSelect) {
                console.log('eventSelect element not found');
                return;
            }
            
            eventSelect.innerHTML = '<option value="">Choose an event...</option>';
            (data || []).forEach(event => {
                const option = document.createElement('option');
                option.value = event.id;
                option.textContent = `${event.name} — ${new Date(event.date).toLocaleDateString()}`;
                eventSelect.appendChild(option);
            });
            
            console.log('Events populated in dropdown');
        } catch (error) {
            console.error('Error loading events:', error);
            Utils.showNotification('Failed to load events.', 'error');
        }
    },

    bindEventListeners: () => {
        console.log('AdminSystem.bindEventListeners() called');
        const eventSelect = document.getElementById('eventSelect');
        if (eventSelect) {
            console.log('Event select element found, adding listener');
            eventSelect.addEventListener('change', async (e) => {
                console.log('Event select changed to:', e.target.value);
                AdminSystem.currentEventId = e.target.value;
                if (e.target.value) {
                    await AdminSystem.loadMatches(e.target.value);
                } else {
                    AdminSystem.clearMatches();
                }
            });
        } else {
            console.log('Event select element not found');
        }
        
        // Bulk save button
        const saveAllButton = document.getElementById('saveAllResults');
        if (saveAllButton) {
            saveAllButton.addEventListener('click', () => {
                AdminSystem.saveAllResults();
            });
            console.log('Bulk save button event listener bound');
        } else {
            console.log('Bulk save button not found');
        }
    },

    loadMatches: async (eventId) => {
        console.log('AdminSystem.loadMatches() called with eventId:', eventId);
        try {
            const { data, error } = await window.sb.from('matches')
                .select('*')
                .eq('event_id', eventId)
                .order('match_order');
            
            if (error) throw error;
            
            console.log('Matches loaded:', data);
            AdminSystem.matches = data || [];
            AdminSystem.renderMatches();
            AdminSystem.showResultsSummary();
        } catch (error) {
            console.error('Error loading matches:', error);
            Utils.showNotification('Failed to load matches.', 'error');
        }
    },

    renderMatches: () => {
        console.log('AdminSystem.renderMatches() called');
        console.log('Number of matches:', AdminSystem.matches.length);
        
        const container = document.getElementById('matchesContainer');
        const noMatches = document.getElementById('noMatches');
        
        console.log('Container element:', container);
        console.log('No matches element:', noMatches);
        
        if (!container) {
            console.log('Container not found, returning');
            return;
        }
        
        if (AdminSystem.matches.length === 0) {
            console.log('No matches, showing no matches message');
            container.innerHTML = '';
            if (noMatches) noMatches.classList.remove('hidden');
            return;
        }
        
        if (noMatches) noMatches.classList.add('hidden');
        
        container.innerHTML = AdminSystem.matches.map(match => {
            // Determine match status
            const isScored = match.winner && match.method;
            const statusText = isScored ? 'Scored ✓' : 'Pending';
            const statusClass = isScored ? 
                'bg-green-500/20 text-green-400 border border-green-400/50' : 
                'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50';
            
            return `
            <div class="match-card bg-gray-800 border border-gray-700 rounded-lg p-6" data-match-id="${match.id}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-yellow-200">${match.title || 'Untitled Match'}</h3>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-400">Match ${match.match_order || 1}</span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                            ${statusText}
                        </span>
                        <div class="save-status hidden">
                            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Winner</label>
                        <select class="winner-select w-full bg-black/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-300">
                            <option value="">Select winner...</option>
                            <option value="${match.wrestler_a}" ${match.winner === match.wrestler_a ? 'selected' : ''}>${match.wrestler_a}</option>
                            <option value="${match.wrestler_b}" ${match.winner === match.wrestler_b ? 'selected' : ''}>${match.wrestler_b}</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Method</label>
                        <select class="method-select w-full bg-black/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-300">
                            <option value="">Select method...</option>
                            <option value="pinfall" ${match.method === 'pinfall' ? 'selected' : ''}>Pinfall</option>
                            <option value="submission" ${match.method === 'submission' ? 'selected' : ''}>Submission</option>
                            <option value="dq" ${match.method === 'dq' ? 'selected' : ''}>DQ</option>
                            <option value="countout" ${match.method === 'countout' ? 'selected' : ''}>Countout</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Extras</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <label class="flex items-center space-x-2 text-sm">
                            <input type="checkbox" class="extra-checkbox" data-extra="interference" ${match.extras?.interference ? 'checked' : ''}>
                            <span>Interference</span>
                        </label>
                        <label class="flex items-center space-x-2 text-sm">
                            <input type="checkbox" class="extra-checkbox" data-extra="titleChange" ${match.extras?.titleChange ? 'checked' : ''}>
                            <span>Title Change</span>
                        </label>
                        <label class="flex items-center space-x-2 text-sm">
                            <input type="checkbox" class="extra-checkbox" data-extra="blood" ${match.extras?.blood ? 'checked' : ''}>
                            <span>Blood</span>
                        </label>
                        <label class="flex items-center space-x-2 text-sm">
                            <input type="checkbox" class="extra-checkbox" data-extra="table" ${match.extras?.table ? 'checked' : ''}>
                            <span>Table</span>
                        </label>
                        <label class="flex items-center space-x-2 text-sm">
                            <input type="checkbox" class="extra-checkbox" data-extra="surpriseReturn" ${match.extras?.surpriseReturn ? 'checked' : ''}>
                            <span>Surprise Return</span>
                        </label>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <button class="save-button bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-2 rounded-lg font-bold transition-all duration-200">
                        Save Result
                    </button>
                </div>
            </div>
            `;
        }).join('');
        
        // Bind save button events
        container.querySelectorAll('.save-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const matchCard = e.target.closest('.match-card');
                AdminSystem.saveMatchResult(matchCard);
            });
        });
        
        // Update results summary and show bulk save controls
        AdminSystem.updateResultsSummary();
        AdminSystem.showBulkSaveControls();
        
        console.log('Match cards rendered and event listeners bound');
    },

    clearMatches: () => {
        const container = document.getElementById('matchesContainer');
        const noMatches = document.getElementById('noMatches');
        
        if (container) container.innerHTML = '';
        if (noMatches) noMatches.classList.add('hidden');
        
        AdminSystem.hideBulkSaveControls();
        AdminSystem.hideResultsSummary();
    },

    saveMatchResult: async (matchCard) => {
        const matchId = matchCard.dataset.matchId;
        const saveButton = matchCard.querySelector('.save-button');
        const saveStatus = matchCard.querySelector('.save-status');
        
        // Get form data
        const winner = matchCard.querySelector('.winner-select').value;
        const method = matchCard.querySelector('.method-select').value;
        
        // Build extras as proper JSON object from checkboxes
        const extras = {
            titleChange:   !!matchCard.querySelector('[data-extra="titleChange"]')?.checked,
            interference:  !!matchCard.querySelector('[data-extra="interference"]')?.checked,
            blood:         !!matchCard.querySelector('[data-extra="blood"]')?.checked,
            table:         !!matchCard.querySelector('[data-extra="table"]')?.checked,
            surpriseReturn:!!matchCard.querySelector('[data-extra="surpriseReturn"]')?.checked
        };
        
        // Validate required fields
        if (!winner) {
            Utils.showNotification('Please select a winner.', 'error');
            return;
        }
        
        if (!method) {
            Utils.showNotification('Please select a method.', 'error');
            return;
        }
        
        // Disable button and show loading
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        matchCard.classList.remove('error');
        
        try {
            const { error } = await window.sb.from('matches')
                .update({
                    winner,
                    method,
                    extras
                })
                .eq('id', matchId);
            
            if (error) throw error;
            
            // Success state
            matchCard.classList.add('saved');
            matchCard.classList.remove('error');
            saveButton.classList.add('saved');
            saveButton.textContent = 'Saved ✓';
            if (saveStatus) saveStatus.classList.remove('hidden');
            
            // Add green "Scored ✓" pill to the card header
            const statusPill = matchCard.querySelector('.px-2.py-1.rounded-full');
            if (statusPill) {
                statusPill.textContent = 'Scored ✓';
                statusPill.className = 'px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white';
            }
            
            Utils.showNotification('Match result saved successfully!', 'success');
            
            // Refresh results summary
            AdminSystem.updateResultsSummary();
            
            // Refresh leaderboards after a short delay
            setTimeout(() => {
                AdminSystem.refreshLeaderboards();
            }, 1000);
            
        } catch (error) {
            console.error('Error saving match result:', error);
            
            // Error state
            matchCard.classList.add('error');
            matchCard.classList.remove('saved');
            saveButton.classList.remove('saved');
            saveButton.disabled = false;
            saveButton.textContent = 'Save Result';
            
            Utils.showNotification(`Failed to save match result: ${error.message}`, 'error');
        }
    },

    refreshLeaderboards: () => {
        // This would trigger a refresh of leaderboard views
        // In a real implementation, you might want to trigger a re-fetch
        console.log('Leaderboards will be refreshed automatically via database views');
    },

    // Update results completeness summary
    updateResultsSummary: () => {
        const resultsSummary = document.getElementById('resultsSummary');
        const resultsCount = document.getElementById('resultsCount');
        const resultsProgress = document.getElementById('resultsProgress');
        
        if (!resultsSummary || !resultsCount || !resultsProgress) {
            console.log('Results summary elements not found');
            return;
        }
        
        const totalMatches = AdminSystem.matches.length;
        const scoredMatches = AdminSystem.matches.filter(match => 
            match.winner && match.method
        ).length;
        
        const percentage = totalMatches > 0 ? (scoredMatches / totalMatches) * 100 : 0;
        
        resultsCount.textContent = `${scoredMatches}/${totalMatches} matches scored`;
        resultsProgress.style.width = `${percentage}%`;
        
        console.log(`Results summary: ${scoredMatches}/${totalMatches} (${percentage.toFixed(1)}%)`);
    },

    // Show bulk save controls
    showBulkSaveControls: () => {
        const bulkSaveControls = document.getElementById('bulkSaveControls');
        if (bulkSaveControls) {
            bulkSaveControls.classList.remove('hidden');
        }
    },

    // Hide bulk save controls
    hideBulkSaveControls: () => {
        const bulkSaveControls = document.getElementById('bulkSaveControls');
        if (bulkSaveControls) {
            bulkSaveControls.classList.add('hidden');
        }
    },

    // Show results summary
    showResultsSummary: () => {
        const resultsSummary = document.getElementById('resultsSummary');
        if (resultsSummary) {
            resultsSummary.classList.remove('hidden');
        }
    },

    // Hide results summary
    hideResultsSummary: () => {
        const resultsSummary = document.getElementById('resultsSummary');
        if (resultsSummary) {
            resultsSummary.classList.add('hidden');
        }
    },

    // Bulk save all results
    saveAllResults: async () => {
        console.log('AdminSystem.saveAllResults() called');
        
        try {
            AdminSystem.setSaving(true); // show spinner
            
            const payload = AdminSystem.collectAllResults(); // gather match form data
            if (!payload.length) {
                Utils.showNotification('No changes to save', 'info');
                return;
            }
            
            console.log(`Saving ${payload.length} match results`);
            
            const { error } = await window.sb
                .from('matches')
                .upsert(payload, { onConflict: 'id' });
            
            if (error) {
                console.error('Bulk save error:', error);
                Utils.showNotification('Save failed: ' + error.message, 'error');
            } else {
                Utils.showNotification('All results saved ✓', 'success');
                await AdminSystem.refreshMatches(); // re-render match list
            }
        } finally {
            AdminSystem.setSaving(false); // always reset spinner
        }
    },
    
    // Helper method to manage saving state
    setSaving: (isSaving) => {
        console.log('AdminSystem.setSaving() called with:', isSaving);
        
        const saveAllButton = document.getElementById('saveAllResults');
        const savingIndicator = document.getElementById('saving-indicator');
        const bulkSaveStatus = document.getElementById('bulkSaveStatus');
        
        if (saveAllButton) {
            saveAllButton.disabled = isSaving;
            if (isSaving) {
                saveAllButton.innerHTML = `
                    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                `;
            } else {
                saveAllButton.innerHTML = `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Save All Results</span>
                `;
            }
        }
        
        if (savingIndicator) {
            savingIndicator.style.display = isSaving ? 'block' : 'none';
        }
        
        if (bulkSaveStatus && isSaving) {
            bulkSaveStatus.textContent = 'Validating and saving all results...';
            bulkSaveStatus.className = 'text-sm text-gray-400';
        }
    },
    
    // Helper method to collect all match results from forms
    collectAllResults: () => {
        console.log('AdminSystem.collectAllResults() called');
        
        const matchUpdates = [];
        const errors = [];
        
        AdminSystem.matches.forEach(match => {
            const matchCard = document.querySelector(`[data-match-id="${match.id}"]`);
            if (!matchCard) return;
            
            const winner = matchCard.querySelector('.winner-select')?.value;
            const method = matchCard.querySelector('.method-select')?.value;
            
            // Build extras as proper JSON object from checkboxes
            const extras = {
                titleChange:   !!matchCard.querySelector('[data-extra="titleChange"]')?.checked,
                interference:  !!matchCard.querySelector('[data-extra="interference"]')?.checked,
                blood:         !!matchCard.querySelector('[data-extra="blood"]')?.checked,
                table:         !!matchCard.querySelector('[data-extra="table"]')?.checked,
                surpriseReturn:!!matchCard.querySelector('[data-extra="surpriseReturn"]')?.checked
            };
            
            // Validate if any field is set
            if (winner || method) {
                if (!winner || !method) {
                    errors.push(`Match ${match.match_order || 1}: Both winner and method are required`);
                    return;
                }
                
                matchUpdates.push({
                    id: match.id,
                    winner,
                    method,
                    extras
                });
            }
        });
        
        if (errors.length > 0) {
            throw new Error(errors[0]); // Show first error
        }
        
        console.log(`Collected ${matchUpdates.length} match updates`);
        return matchUpdates;
    },
    
    // Helper method to refresh matches after save
    refreshMatches: async () => {
        console.log('AdminSystem.refreshMatches() called');
        
        if (!AdminSystem.currentEventId) {
            console.log('No current event ID, cannot refresh matches');
            return;
        }
        
        try {
            await AdminSystem.loadMatches(AdminSystem.currentEventId);
            console.log('Matches refreshed successfully');
        } catch (error) {
            console.error('Error refreshing matches:', error);
            Utils.showNotification('Failed to refresh matches', 'error');
        }
    }
};

// API Helper Functions for Scoring Compatibility Layer
const ApiHelpers = {
    // Legacy API call - calls the wrapper RPC for backward compatibility
    async apiLeaderboard(eventId, extras = {}) {
        try {
            console.log('Calling legacy leaderboard API:', eventId, extras);
            const { data, error } = await window.sb.rpc('leaderboard', {
                event_id: eventId,
                extras: extras
            });
            
            if (error) {
                console.error('Error calling leaderboard API:', error);
                throw error;
            }
            
            console.log('Leaderboard API response:', data);
            return data;
        } catch (error) {
            console.error('Error in apiLeaderboard:', error);
            throw error;
        }
    },
    
    // New preferred API call - calls the stable event_scores RPC
    async apiEventScores(eventId) {
        try {
            console.log('Calling event_scores API:', eventId);
            const { data, error } = await window.sb.rpc('event_scores', {
                event_id: eventId
            });
            
            if (error) {
                console.error('Error calling event_scores API:', error);
                throw error;
            }
            
            console.log('Event scores API response:', data);
            return data;
        } catch (error) {
            console.error('Error in apiEventScores:', error);
            throw error;
        }
    },
    
    // Helper to get leaderboard data with fallback
    async getLeaderboardData(eventId, useLegacy = false) {
        try {
            if (useLegacy) {
                return await this.apiLeaderboard(eventId);
            } else {
                return await this.apiEventScores(eventId);
            }
        } catch (error) {
            console.error('Error getting leaderboard data:', error);
            // Fallback to legacy API if new API fails
            if (!useLegacy) {
                console.log('Falling back to legacy API...');
                return await this.apiLeaderboard(eventId);
            }
            throw error;
        }
    },
    
    // Profile Bootstrap Helpers
    
    // ensureProfile(): call once after sign-in
    async ensureProfile(sb = window.sb) {
        try {
            const { data: { user }, error: uerr } = await sb.auth.getUser();
            if (uerr || !user) {
                console.log('No authenticated user for profile creation');
                return;
            }
            
            console.log('Ensuring profile for user:', user.email);
            
            // Auto-fill display_name with sensible defaults
            const displayName = user.user_metadata?.full_name 
                ?? (user.email ? user.email.split('@')[0] : null);
            
            const { error } = await sb.from('users').upsert({ 
                id: user.id, 
                email: user.email ?? null,
                display_name: displayName
            });
            
            if (error) {
                throw error; // Let the catch block handle the error
            }
            
            console.log("User profile created/updated ✓");
            if (displayName) {
                console.log(`Display name set to: ${displayName}`);
            }
        } catch (error) {
            console.error("Failed to create user profile:", error);
        }
    },
    
    // getDemoCard(): fetch event + matches so UI can render
    async getDemoCard(sb = window.sb) {
        try {
            console.log('Fetching demo card data...');
            const { data: evs, error: e1 } = await sb
                .from('events').select('id,name,date,lock_time').eq('name','Demo PPV').limit(1);
            if (e1) throw e1;
            const ev = evs?.[0]; 
            if (!ev) {
                console.log('No demo event found');
                return null;
            }

            const { data: ms, error: e2 } = await sb
                .from('matches').select('id,title,winner,method,extras').eq('event_id', ev.id);
            if (e2) throw e2;

            console.log('Demo card data loaded:', { event: ev, matches: ms?.length || 0 });
            return { event: ev, matches: ms ?? [] };
        } catch (error) {
            console.error('Error in getDemoCard:', error);
            throw error;
        }
    },
    
    // savePick(): uses the unique (user_id, match_id) key; mirrors your upsert flow
    async savePick(sb = window.sb, { eventId, matchId, winner, method, extras }) {
        try {
            const { data: { user } } = await sb.auth.getUser();
            if (!user) throw new Error('Not signed in');
            
            console.log('Saving pick:', { eventId, matchId, winner, method, extras });
            const payload = { 
                user_id: user.id, 
                event_id: eventId, 
                match_id: matchId, 
                winner, 
                method, 
                extras: extras ?? null 
            };
            const { error } = await sb.from('picks').upsert(payload, { onConflict: 'user_id,match_id' });
            if (error) throw error;
            
            console.log('Pick saved successfully');
            return true;
        } catch (error) {
            console.error('Error in savePick:', error);
            throw error;
        }
    },
    
    // loadLeaderboard(): read from your view
    async loadLeaderboard(sb = window.sb, eventId) {
        try {
            console.log('Loading leaderboard for event:', eventId);
            const { data, error } = await sb.from('leaderboard')
                .select('event_id,email,total_points,correct,total,accuracy')
                .eq('event_id', eventId)
                .order('total_points', { ascending: false });
            if (error) throw error;
            
            console.log('Leaderboard loaded:', data?.length || 0, 'entries');
            return data ?? [];
        } catch (error) {
            console.error('Error in loadLeaderboard:', error);
            throw error;
        }
    }
};

// === Prediction Summary System ===
const PredictionSummarySystem = {
    /**
     * Load prediction summary data from Supabase
     * @param {Object} supabase - Supabase client
     * @param {string} eventId - Event ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Summary data
     */
    loadPredictionSummary: async (supabase, eventId, userId) => {
        try {
            // Total matches for this event
            const { data: mRows, error: mErr } = await supabase
                .from("matches")
                .select("id", { count: "exact" })
                .eq("event_id", eventId);
            if (mErr) throw mErr;
            const matchIds = (mRows ?? []).map(r => r.id);
            const total = matchIds.length;

            // Predicted picks by this user for these matches
            const { count: predicted, error: pErr } = await supabase
                .from("picks")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .in("match_id", matchIds);
            if (pErr) throw pErr;

            // Earned + bonus: prefer event_scores; fallback to scores
            let earned = 0;
            let bonusPoints = 0;

            // Try event_scores first
            const { data: esRows, error: esErr } = await supabase
                .from("event_scores")
                .select("*")
                .eq("user_id", userId)
                .eq("event_id", eventId);

            if (!esErr && Array.isArray(esRows) && esRows.length) {
                const sum = (arr, key) => arr.reduce((s, r) => s + (Number(r[key]) || 0), 0);
                earned = sum(esRows, "total_points") || sum(esRows, "points_total") || 0;
                bonusPoints = sum(esRows, "bonus_points") || sum(esRows, "points_bonus") || 0;
            } else {
                // Fallback: scores view
                const { data: scRows } = await supabase
                    .from("scores")
                    .select("*")
                    .eq("user_id", userId)
                    .eq("event_id", eventId);
                if (Array.isArray(scRows) && scRows.length) {
                    const sum = (arr, key) => arr.reduce((s, r) => s + (Number(r[key]) || 0), 0);
                    earned = sum(scRows, "total_points") || sum(scRows, "points_total") || 0;
                    bonusPoints = sum(scRows, "bonus_points") || sum(scRows, "points_bonus") || 0;
                }
            }

            // Set per-match max according to your rules.
            // Your UI shows Max Possible = 156 with 6 matches → PER_MATCH_MAX = 26
            const PER_MATCH_MAX = 26;
            const maxPossible = total * PER_MATCH_MAX;

            return { predicted: predicted || 0, total, bonusPoints, maxPossible, earned };
        } catch (error) {
            console.error('Error loading prediction summary:', error);
            return { predicted: 0, total: 0, bonusPoints: 0, maxPossible: 0, earned: 0 };
        }
    },

    /**
     * Render prediction summary component
     * @param {Object} data - Summary data
     * @param {string} containerId - Container element ID
     */
    render: (data, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { predicted = 0, total = 0, bonusPoints = 0, maxPossible = 0, earned = 0 } = data;
        const percent = maxPossible > 0
            ? Math.max(0, Math.min(100, Math.round((Number(earned) / Number(maxPossible)) * 100)))
            : 0;

        // Debug logging to verify numbers
        console.log('[PredictionSummary props]', {
            predicted, total, bonusPoints, maxPossible, earned, percent
        });

        container.innerHTML = `
            <div class="bg-gray-900 text-white rounded-2xl p-4 shadow-md w-full">
                <h3 class="text-lg font-bold mb-3 text-yellow-400">Prediction Summary</h3>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-300">Matches Predicted</span>
                    <span class="font-semibold">${predicted} / ${total}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-300">Points Earned</span>
                    <span class="font-semibold text-green-400">${earned}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-300">Bonus Points</span>
                    <span class="font-semibold text-yellow-400">${bonusPoints}</span>
                </div>

                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm text-gray-300">Max Possible</span>
                    <span class="font-semibold text-blue-400">${maxPossible}</span>
                </div>

                <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        class="bg-gradient-to-r from-yellow-500 to-green-500 h-3 transition-all duration-300"
                        style="width: ${percent}%"
                    />
                </div>
                <p class="text-xs text-gray-400 mt-1 text-right">${percent}% Complete</p>
            </div>
        `;
    },

    /**
     * Update prediction summary for current event
     */
    updateCurrentEvent: async () => {
        if (!AppState.isAuthenticated || !AppState.currentUser) return;
        
        const eventId = document.getElementById('eventSelect')?.value;
        if (!eventId) return;

        try {
            const summaryData = await PredictionSummarySystem.loadPredictionSummary(
                window.sb, 
                eventId, 
                AppState.currentUser.id
            );
            
            // Additional validation: ensure predicted <= total
            if (summaryData.predicted > summaryData.total) {
                console.warn('Predicted count exceeds total matches:', summaryData);
                summaryData.predicted = summaryData.total;
            }
            
            PredictionSummarySystem.render(summaryData, 'predictionSummary');
        } catch (error) {
            console.error('Error updating prediction summary:', error);
        }
    }
};

// Export for potential external use
window.FantasyWrestling = {
    AppState,
    AuthManager,
    Utils,
    AnimationController,
    PredictionSystem,
    LeaderboardSystem,
    NavigationSystem,
    EventHandlers,
    AdminSystem,
    ApiHelpers,
    PredictionSummarySystem
};

/* === Patch: ensure REST calls to event_scores include Supabase headers === */
(function patchEventScoresFetch(){
    try {
        const SB_URL =
            (typeof window !== 'undefined' && (window.ENV?.SUPABASE_URL || window.SUPABASE_URL)) ||
            (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
            '';
        const SB_ANON =
            (typeof window !== 'undefined' && (window.ENV?.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY)) ||
            (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
            '';
        if (!SB_URL || !SB_ANON || typeof window === 'undefined' || typeof window.fetch !== 'function') {
            console.warn('[patch] Skipping event_scores fetch patch (missing env or fetch).');
            return;
        }
        const origFetch = window.fetch.bind(window);
        window.fetch = async (input, init = {}) => {
            const url = typeof input === 'string' ? input : (input?.url || '');
            if (url.includes('/rest/v1/event_scores')) {
                const headers = Object.assign(
                    {
                        'apikey': SB_ANON,
                        'Authorization': `Bearer ${SB_ANON}`,
                        'Accept': 'application/json'
                    },
                    (init && init.headers) || {}
                );
                init = Object.assign({}, init, { headers });
            }
            return origFetch(input, init);
        };
        console.log('[patch] event_scores header injection active');
    } catch (e) {
        console.warn('[patch] Failed to patch fetch for event_scores:', e);
    }
})();