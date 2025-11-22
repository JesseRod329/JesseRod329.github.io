import { sb } from './supabaseClient.js';
import { SCORING, BONUS_KEYS } from './constants.js';
import { CountdownSystem } from './countdown.js';
import { EventScoreSystem } from './scoring.js';

// Simple retry helper with exponential backoff
async function withRetry(fn, { retries = 3, delay = 300 } = {}) {
  let attempt = 0;
  let lastErr;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      const wait = delay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, wait));
      attempt++;
    }
  }
  throw lastErr;
}

export const PredictionSystem = {
  init: () => {
    PredictionSystem.updateSummary();
  },

  updateSummary: () => {
    const matchesPredicted = document.getElementById('matches-predicted');
    const bonusPoints = document.getElementById('bonus-points');
    const maxPoints = document.getElementById('max-points');
    const earnedPoints = document.getElementById('earned-points');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const submitButton = document.getElementById('submitPredictions');

    if (!matchesPredicted) return;

    const predictions = Object.values(window.AppState?.predictions || {});
    const totalMatches = Array.isArray(window.AppState?.currentMatches) ? window.AppState.currentMatches.length : 0;
    let completedMatches = 0;
    let totalBonusPoints = 0;

    predictions.forEach(prediction => {
      if (prediction.winner) completedMatches++;
      if (prediction.bonuses) {
        Object.values(prediction.bonuses).forEach(active => {
          if (active) totalBonusPoints += SCORING.points.bonus;
        });
      }
    });

    // Compute max possible dynamically per match
    let maxPossible = 0;
    if (Array.isArray(window.AppState?.currentMatches)) {
      window.AppState.currentMatches.forEach(m => {
        let extrasCount = SCORING.bonusKeys.length;
        if (Array.isArray(m.allowed_extras)) {
          extrasCount = m.allowed_extras.filter(k => SCORING.bonusKeys.includes(k)).length;
        } else if (m.extras_allowed && typeof m.extras_allowed === 'object') {
          extrasCount = SCORING.bonusKeys.filter(k => !!m.extras_allowed[k]).length;
        }
        maxPossible += (SCORING.points.winner + SCORING.points.method + extrasCount * SCORING.points.bonus);
      });
    }

    matchesPredicted.textContent = `${completedMatches}/${totalMatches}`;
    if (bonusPoints) bonusPoints.textContent = totalBonusPoints;
    if (maxPoints) maxPoints.textContent = maxPossible;

    const denom = totalMatches || 1;
    const progress = Math.round((completedMatches / denom) * 100);
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}% Complete`;

    if (earnedPoints) {
      const earned = (window.AppState?.predictionSummary && typeof window.AppState.predictionSummary.earned === 'number')
        ? window.AppState.predictionSummary.earned
        : 0;
      earnedPoints.textContent = earned;
    }

    if (submitButton) {
      submitButton.disabled = completedMatches === 0;
      submitButton.textContent = completedMatches === 0 ? 'Make Some Predictions First' : 'Submit Predictions';
    }
  },

  submitPredictions: async () => {
    try {
      const sel = document.getElementById('eventSelect');
      const eventId = sel?.value;
      if (!eventId) {
        window.Utils?.showNotification?.('Please select an event.', 'error');
        return;
      }

      if (!window.AppState?.isAuthenticated || !window.AppState?.currentUser) {
        window.Utils?.showNotification?.('Please sign in to submit predictions.', 'error');
        return;
      }

      // Check if event is locked
      const { data: eventData } = await sb
        .from('events')
        .select('lock_time')
        .eq('id', eventId)
        .single();
      if (eventData && eventData.lock_time && new Date(eventData.lock_time) <= new Date()) {
        window.Utils?.showNotification?.('Predictions are closed for this event.', 'error');
        return;
      }

      const picksEntries = Object.entries(window.AppState?.predictions || {});
      if (!picksEntries.length) {
        window.Utils?.showNotification?.('Please make at least one prediction!', 'error');
        return;
      }

      // Build payload for batch RPC
      const payload = picksEntries.map(([match_id, prediction]) => ({
        match_id,
        winner: prediction.winner || null,
        method: prediction.method || null,
        extras: prediction.bonuses || {}
      }));

      const { error } = await withRetry(
        () => sb.rpc('save_picks', { picks: JSON.stringify(payload) })
      );
      if (error) {
        console.error('Prediction save error:', error);
        window.Utils?.showNotification?.('Failed to save predictions.', 'error');
        return;
      }

      // Show saved checkmarks
      picksEntries.forEach(([matchId]) => { window.showSavedCheckmark?.(matchId); });
      window.Utils?.showNotification?.('Predictions saved successfully!', 'success');
    } catch (error) {
      console.error('Prediction submission error:', error);
      window.Utils?.showNotification?.('An error occurred while saving predictions.', 'error');
    }
  },

  renderMatchCards: (matches) => { renderMatchCards(matches); }
};

export function renderMatchCards(matches) {
  const list = document.getElementById('matchList');
  if (!list) return;
  if (!window.AppState) window.AppState = { predictions: {} };
  window.AppState.predictions = {};
  list.innerHTML = matches.map(m => `
    <div class="p-4 rounded-xl border mb-3 relative" data-card data-match-id="${m.id}" data-lock-at="${m.lock_at}">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold">${m.title || ''}</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">locks at ${new Date(m.lock_at).toLocaleTimeString()}</span>
          <div class="saved-badge hidden absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">Saved ✓</div>
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
      <div class="match-feedback hidden mt-2 text-sm"></div>
      <div class="scoring-breakdown hidden mt-3 p-2 bg-gray-800 rounded-lg">
        <div class="flex items-center space-x-2 mb-1">
          <span class="text-xs font-medium text-gray-300">Scoring:</span>
        </div>
        <div class="scoring-details text-xs text-gray-400"></div>
      </div>
    </div>
  `).join('');
}

export function updatePredictionState(matchId, pick) {
  if (!window.AppState) window.AppState = {};
  if (!window.AppState.predictions) window.AppState.predictions = { bonuses: {} };
  if (!window.AppState.predictions[matchId]) {
    window.AppState.predictions[matchId] = { bonuses: {} };
  }
  const state = window.AppState.predictions[matchId];
  if (pick.winner !== undefined) state.winner = pick.winner || null;
  if (pick.method !== undefined) state.method = pick.method || null;
  if (!state.bonuses) state.bonuses = {};
  BONUS_KEYS.forEach(key => {
    if (pick[key] !== undefined) state.bonuses[key] = !!pick[key];
  });
}

export function getPick(card) {
  const selectedBtn = card.querySelector('.pick.ring-2');
  const winner = selectedBtn ? selectedBtn.dataset.winner : null;
  const method = card.querySelector('.method')?.value || null;
  const props = {};
  card.querySelectorAll('.prop').forEach(c => props[c.dataset.prop] = c.checked);
  return { winner, method, ...props };
}

export async function savePick(matchId, pick) {
  if (!window.AppState?.isAuthenticated || !window.AppState?.currentUser) {
    window.Utils?.showNotification?.('Please sign in to save your pick.', 'error');
    return;
  }

  const eventId = document.getElementById('eventSelect')?.value;
  if (eventId) {
    const { data: eventData } = await sb
      .from('events').select('lock_time').eq('id', eventId).single();
    if (eventData && eventData.lock_time && new Date(eventData.lock_time) <= new Date()) {
      window.Utils?.showNotification?.('Predictions are closed for this event.', 'error');
      return;
    }
  }

  const { error } = await sb.from('picks').upsert({
    user_id: window.AppState.currentUser.id,
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
      window.Utils?.showNotification?.('Predictions are closed for this event.', 'error');
    } else {
      window.Utils?.showNotification?.('Failed to save prediction. Please try again.', 'error');
    }
  } else {
    console.log('Pick saved successfully');
    window.showSavedCheckmark?.(matchId);
    window.showSaveConfirmation?.(matchId);
    window.Utils?.showNotification?.('Prediction saved!', 'success');
  }
}

export async function loadEvents() {
  try {
    const { data, error } = await sb
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });
    if (error) {
      console.error('Error loading events:', error);
      window.Utils?.showNotification?.('Failed to load events. Please try again.', 'error');
      return;
    }

    window.AppState.events = data || [];

    // Prediction page dropdown
    const sel = document.getElementById('eventSelect');
    if (sel) {
      sel.innerHTML = '';
      if (window.AppState.events.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No events available';
        option.disabled = true;
        sel.appendChild(option);
      } else {
        window.AppState.events.forEach(event => {
          const option = document.createElement('option');
          option.value = event.id;
          option.textContent = `${event.name} — ${new Date(event.date).toLocaleDateString()}`;
          sel.appendChild(option);
        });
        if (window.AppState.events.length > 0) {
          sel.value = window.AppState.events[0].id;
          await loadCard(window.AppState.events[0].id);
          if (window.AppState.isAuthenticated) {
            await loadUserPicks(window.AppState.events[0].id);
            await window.FantasyWrestling?.PredictionSummarySystem?.updateCurrentEvent();
          }
        }
      }
    }

    // Index page event list
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
      eventsList.innerHTML = '';
      if (window.AppState.events.length === 0) {
        eventsList.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">🎭</div>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">No Events Available</h3>
            <p class="text-gray-400">Check back soon for upcoming wrestling events!</p>
          </div>`;
        return;
      }
      window.AppState.events.forEach(event => {
        const imgSrc = event.poster_url || 'resources/event-poster.jpg';
        const eventDate = new Date(event.date);
        const timeUntilEvent = eventDate - new Date();
        const days = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));
        const countdownText = timeUntilEvent > 0 ? `LIVE IN: ${days}D ${hours}H ${minutes}M` : 'EVENT COMPLETED';
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card p-6 rounded-lg scroll-reveal card-hover';
        eventCard.innerHTML = `
          <div class="bg-gray-800 rounded-lg p-4 mb-4">
            <img src="${imgSrc}" alt="${event.name} poster" class="w-full h-48 object-cover rounded-lg" onerror="this.src='resources/event-poster.jpg'">
          </div>
          <div class="countdown-timer text-center py-2 px-4 rounded-lg mb-4 text-white font-bold">
            <span class="accent-font">${countdownText}</span>
          </div>
          <h3 class="heading-font text-2xl font-bold text-yellow-400 mb-2">${event.name}</h3>
          <p class="text-gray-400 mb-4">${event.description || 'Epic wrestling showdown awaits'}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">${event.venue || 'Location TBD'}</span>
            <button onclick="location.href='predictions.html'" class="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Predict Now</button>
          </div>`;
        eventsList.appendChild(eventCard);
      });
    }
  } catch (error) {
    console.error('Error loading events:', error);
    window.Utils?.showNotification?.('Failed to load events. Please check your connection.', 'error');
  }
}

export async function loadCard(eventId) {
  const { data: matches, error } = await sb.from('matches').select('*').eq('event_id', eventId).order('match_order');
  if (error) return console.error(error);
  window.AppState.currentMatches = matches || [];
  renderMatchCards(matches);
  await loadUserPicks(eventId);
  const { data: eventData, error: eventError } = await sb.from('events').select('id, name, date, lock_time, status').eq('id', eventId).single();
  if (eventError) { console.error('Error loading event data:', eventError); return; }
  CountdownSystem.start(eventData);
  if (window.AppState.isAuthenticated) {
    await window.FantasyWrestling?.calculateAndDisplayScoring?.();
    const es = await EventScoreSystem.hydrate(window.AppState.currentUser.id, eventId);
    if (es) window.FantasyWrestling?.EventScoreUI?.display(es);
    else window.FantasyWrestling?.EventScoreUI?.showPending();
  }
}

export async function loadUserPicks(eventId) {
  if (!window.AppState?.isAuthenticated || !window.AppState?.currentUser) return;
  const matchesRes = await sb.from('matches').select('id').eq('event_id', eventId);
  if (matchesRes.error) return console.error(matchesRes.error);
  const matchIds = (matchesRes.data || []).map(m => m.id);
  if (!matchIds.length) return;
  const { data } = await sb.from('picks').select('match_id, winner, method, extras').in('match_id', matchIds);
  (data || []).forEach(p => {
    const card = document.querySelector(`[data-card][data-match-id="${p.match_id}"]`);
    if (!card) return;
    const stored = { winner: p.winner || null, method: p.method || null };
    BONUS_KEYS.forEach(key => { stored[key] = p.extras ? !!p.extras[key] : false; });
    updatePredictionState(p.match_id, stored);
    if (stored.winner) {
      card.querySelectorAll('.pick').forEach(b => {
        b.classList.remove('ring-2','ring-yellow-400');
        if (b.dataset.winner === stored.winner) b.classList.add('ring-2','ring-yellow-400');
      });
    }
    const methodSel = card.querySelector('.method');
    if (methodSel && stored.method) methodSel.value = stored.method;
    card.querySelectorAll('.prop').forEach(c => { c.checked = stored[c.dataset.prop]; });
    const match = window.AppState.currentMatches?.find(m => m.id === p.match_id);
    if (match) {
      window.FantasyWrestling?.addMatchCorrectnessFeedback?.(p.match_id, stored, match);
      window.FantasyWrestling?.addScoringFeedback?.(p.match_id, match);
    }
  });
  await window.FantasyWrestling?.calculateAndDisplayScoring?.();
  window.FantasyWrestling?.PredictionSystem?.updateSummary?.();
}

// Bind UI interactions for the predictions page (idempotent)
let predictionsBound = false;
export function bindPredictionUI() {
  if (predictionsBound) return; predictionsBound = true;

  document.addEventListener('click', async (e) => {
    // Pick winner buttons
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

    // Submit predictions button
    if (e.target?.id === 'submitPredictions') {
      e.preventDefault();
      await PredictionSystem.submitPredictions();
    }
  });

  document.addEventListener('change', async (e) => {
    // Event selection change
    if (e.target?.id === 'eventSelect') {
      const eventId = e.target.value;
      if (eventId) {
        await loadCard(eventId);
        if (window.AppState?.isAuthenticated) {
          await loadUserPicks(eventId);
          await window.FantasyWrestling?.PredictionSummarySystem?.updateCurrentEvent();
        }
      }
      return;
    }

    // Per-card controls
    const card = e.target.closest?.('[data-card]');
    if (!card) return;
    const matchId = card.dataset.matchId;
    const pick = getPick(card);
    if (e.target.classList.contains('method')) pick.method = e.target.value;
    if (e.target.classList.contains('prop')) pick[e.target.dataset.prop] = e.target.checked;
    updatePredictionState(matchId, pick);
    await savePick(matchId, pick);
    PredictionSystem.updateSummary();
    if (window.AppState?.isAuthenticated) {
      await window.FantasyWrestling?.PredictionSummarySystem?.updateCurrentEvent();
    }
  });
}
