export const AdminSystem = {
  ALLOWED_ADMINS: ['jesse.rodriguez89@gmail.com'],
  currentEventId: null,
  matches: [],

  init: async () => {
    console.log('AdminSystem.init() called');
    console.log('Current URL:', window.location.href);
    console.log('AppState.isAuthenticated:', window.AppState?.isAuthenticated);
    console.log('AppState.currentUser:', window.AppState?.currentUser);

    if (!document.getElementById('adminContent')) {
      console.log('adminContent element not found, returning');
      return;
    }

    if (!window.AppState?.isAuthenticated || !window.AppState?.currentUser) {
      console.log('User not authenticated, showing access denied');
      AdminSystem.showAccessDenied('Please sign in to access admin panel.');
      return;
    }

    console.log('User email:', window.AppState.currentUser.email);
    console.log('Allowed admins:', AdminSystem.ALLOWED_ADMINS);

    if (!AdminSystem.ALLOWED_ADMINS.includes(window.AppState.currentUser.email)) {
      console.log('User not in admin list, showing access denied');
      AdminSystem.showAccessDenied('You do not have admin privileges.');
      return;
    }

    console.log('User is admin, showing admin content');
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
    if (adminContent) adminContent.classList.add('hidden');
  },

  showAdminContent: () => {
    console.log('AdminSystem.showAdminContent() called');
    const accessDenied = document.getElementById('accessDenied');
    const adminContent = document.getElementById('adminContent');
    if (accessDenied) accessDenied.classList.add('hidden');
    if (adminContent) adminContent.classList.remove('hidden');
  },

  loadEvents: async () => {
    console.log('AdminSystem.loadEvents() called');
    try {
      const { data, error } = await window.sb.from('events').select('*').order('date', { ascending: false });
      if (error) throw error;
      console.log('Events loaded:', data);
      const eventSelect = document.getElementById('eventSelect');
      if (!eventSelect) return;
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
      window.Utils?.showNotification?.('Failed to load events.', 'error');
    }
  },

  bindEventListeners: () => {
    console.log('AdminSystem.bindEventListeners() called');
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) {
      eventSelect.addEventListener('change', async (e) => {
        console.log('Event select changed to:', e.target.value);
        AdminSystem.currentEventId = e.target.value;
        if (e.target.value) await AdminSystem.loadMatches(e.target.value);
        else AdminSystem.clearMatches();
      });
    }
    const saveAllButton = document.getElementById('saveAllResults');
    if (saveAllButton) {
      saveAllButton.addEventListener('click', () => { AdminSystem.saveAllResults(); });
    }
  },

  loadMatches: async (eventId) => {
    console.log('AdminSystem.loadMatches() called with eventId:', eventId);
    try {
      const { data, error } = await window.sb.from('matches')
        .select('*').eq('event_id', eventId).order('match_order');
      if (error) throw error;
      console.log('Matches loaded:', data);
      AdminSystem.matches = data || [];
      AdminSystem.renderMatches();
      AdminSystem.showResultsSummary();
    } catch (error) {
      console.error('Error loading matches:', error);
      window.Utils?.showNotification?.('Failed to load matches.', 'error');
    }
  },

  renderMatches: () => {
    const container = document.getElementById('matchesContainer');
    const noMatches = document.getElementById('noMatches');
    if (!container) return;
    if ((AdminSystem.matches || []).length === 0) {
      container.innerHTML = '';
      if (noMatches) noMatches.classList.remove('hidden');
      return;
    }
    if (noMatches) noMatches.classList.add('hidden');

    container.innerHTML = AdminSystem.matches.map(match => {
      const isScored = match.winner && match.method;
      const statusText = isScored ? 'Scored ✓' : 'Pending';
      const statusClass = isScored ? 'bg-green-500/20 text-green-400 border border-green-400/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50';
      return `
        <div class="match-card bg-gray-800 border border-gray-700 rounded-lg p-6" data-match-id="${match.id}">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-yellow-200">${match.title || 'Untitled Match'}</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-400">Match ${match.match_order || 1}</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>
              <div class="save-status hidden"><svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>
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
              ${['interference','titleChange','blood','table','surpriseReturn'].map(key => `
                <label class=\"flex items-center space-x-2 text-sm\">
                  <input type=\"checkbox\" class=\"extra-checkbox\" data-extra=\"${key}\" ${match.extras?.[key] ? 'checked' : ''}>
                  <span>${key === 'titleChange' ? 'Title Change' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </label>`).join('')}
            </div>
          </div>
          <div class="flex justify-end">
            <button class="save-button bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-2 rounded-lg font-bold transition-all duration-200">Save Result</button>
          </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.save-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const matchCard = e.target.closest('.match-card');
        AdminSystem.saveMatchResult(matchCard);
      });
    });
  },

  clearMatches: () => {
    const container = document.getElementById('matchesContainer');
    const noMatches = document.getElementById('noMatches');
    if (container) container.innerHTML = '';
    if (noMatches) noMatches.classList.remove('hidden');
  },

  saveMatchResult: async (matchCard) => {
    if (!matchCard) return;
    const matchId = matchCard.getAttribute('data-match-id');
    const winner = matchCard.querySelector('.winner-select')?.value || null;
    const method = matchCard.querySelector('.method-select')?.value || null;
    const extras = {
      interference:  !!matchCard.querySelector('[data-extra="interference"]')?.checked,
      titleChange:   !!matchCard.querySelector('[data-extra="titleChange"]')?.checked,
      blood:         !!matchCard.querySelector('[data-extra="blood"]')?.checked,
      table:         !!matchCard.querySelector('[data-extra="table"]')?.checked,
      surpriseReturn:!!matchCard.querySelector('[data-extra="surpriseReturn"]')?.checked
    };

    const saveButton = matchCard.querySelector('.save-button');
    const statusPill = matchCard.querySelector('.px-2.py-1');
    // retry helper
    async function withRetry(fn, { retries = 3, delay = 300 } = {}) {
      let attempt = 0; let lastErr;
      while (attempt <= retries) {
        try { return await fn(); }
        catch (err) { lastErr = err; if (attempt === retries) break; await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt))); attempt++; }
      }
      throw lastErr;
    }

    try {
      saveButton.disabled = true; saveButton.textContent = 'Saving...';
      const { error } = await withRetry(() => window.sb.rpc('admin_upsert_match_result', {
        match_id: matchId,
        winner,
        method,
        extras
      }));
      if (error) throw error;

      matchCard.classList.add('saved');
      matchCard.classList.remove('error');
      saveButton.classList.add('saved');
      saveButton.disabled = false; saveButton.textContent = 'Save Result';
      if (statusPill) {
        statusPill.textContent = 'Scored ✓';
        statusPill.className = 'px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white';
      }
      window.Utils?.showNotification?.('Match result saved successfully!', 'success');
      AdminSystem.updateResultsSummary();
      setTimeout(() => { AdminSystem.refreshLeaderboards(); }, 1000);
    } catch (error) {
      console.error('Error saving match result:', error);
      matchCard.classList.add('error');
      matchCard.classList.remove('saved');
      saveButton.classList.remove('saved');
      saveButton.disabled = false; saveButton.textContent = 'Save Result';
      window.Utils?.showNotification?.(`Failed to save match result: ${error.message}`, 'error');
    }
  },

  refreshLeaderboards: () => { console.log('Leaderboards will be refreshed automatically via database views'); },

  updateResultsSummary: () => {
    const resultsSummary = document.getElementById('resultsSummary');
    const resultsCount = document.getElementById('resultsCount');
    const resultsProgress = document.getElementById('resultsProgress');
    if (!resultsSummary || !resultsCount || !resultsProgress) return;
    const totalMatches = AdminSystem.matches.length;
    const scoredMatches = AdminSystem.matches.filter(m => m.winner && m.method).length;
    const percentage = totalMatches > 0 ? (scoredMatches / totalMatches) * 100 : 0;
    resultsCount.textContent = `${scoredMatches}/${totalMatches} matches scored`;
    resultsProgress.style.width = `${percentage}%`;
  },

  showBulkSaveControls: () => { document.getElementById('bulkSaveControls')?.classList.remove('hidden'); },
  hideBulkSaveControls: () => { document.getElementById('bulkSaveControls')?.classList.add('hidden'); },
  showResultsSummary: () => { document.getElementById('resultsSummary')?.classList.remove('hidden'); },
  hideResultsSummary: () => { document.getElementById('resultsSummary')?.classList.add('hidden'); },

  saveAllResults: async () => {
    console.log('AdminSystem.saveAllResults() called');
    try {
      AdminSystem.setSaving(true);
      const payload = AdminSystem.collectAllResults();
      if (!payload.length) { window.Utils?.showNotification?.('No changes to save', 'info'); return; }
      console.log(`Saving ${payload.length} match results`);
      const { error } = await withRetry(() => window.sb.rpc('admin_upsert_matches', { updates: JSON.stringify(payload) }));
      if (error) { console.error('Bulk save error:', error); window.Utils?.showNotification?.('Save failed: ' + error.message, 'error'); }
      else { window.Utils?.showNotification?.('All results saved ✓', 'success'); await AdminSystem.refreshMatches(); }
    } finally { AdminSystem.setSaving(false); }
  },

  setSaving: (isSaving) => {
    const saveAllButton = document.getElementById('saveAllResults');
    const savingIndicator = document.getElementById('saving-indicator');
    const bulkSaveStatus = document.getElementById('bulkSaveStatus');
    if (saveAllButton) {
      saveAllButton.disabled = isSaving;
      saveAllButton.innerHTML = isSaving
        ? `<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Saving...</span>`
        : `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg><span>Save All Results</span>`;
    }
    if (savingIndicator) savingIndicator.style.display = isSaving ? 'block' : 'none';
    if (bulkSaveStatus && isSaving) { bulkSaveStatus.textContent = 'Validating and saving all results...'; bulkSaveStatus.className = 'text-sm text-gray-400'; }
  },

  collectAllResults: () => {
    const matchUpdates = [];
    const errors = [];
    (AdminSystem.matches || []).forEach(match => {
      const matchCard = document.querySelector(`[data-match-id="${match.id}"]`);
      if (!matchCard) return;
      const winner = matchCard.querySelector('.winner-select')?.value;
      const method = matchCard.querySelector('.method-select')?.value;
      const extras = {
        titleChange:   !!matchCard.querySelector('[data-extra="titleChange"]')?.checked,
        interference:  !!matchCard.querySelector('[data-extra="interference"]')?.checked,
        blood:         !!matchCard.querySelector('[data-extra="blood"]')?.checked,
        table:         !!matchCard.querySelector('[data-extra="table"]')?.checked,
        surpriseReturn:!!matchCard.querySelector('[data-extra="surpriseReturn"]')?.checked
      };
      if (winner || method) {
        if (!winner || !method) { errors.push(`Match ${match.match_order || 1}: Both winner and method are required`); return; }
        matchUpdates.push({ id: match.id, winner, method, extras });
      }
    });
    if (errors.length > 0) throw new Error(errors[0]);
    console.log(`Collected ${matchUpdates.length} match updates`);
    return matchUpdates;
  },

  refreshMatches: async () => {
    if (!AdminSystem.currentEventId) return;
    try { await AdminSystem.loadMatches(AdminSystem.currentEventId); } catch (e) { console.error('Error refreshing matches:', e); window.Utils?.showNotification?.('Failed to refresh matches', 'error'); }
  }
};
