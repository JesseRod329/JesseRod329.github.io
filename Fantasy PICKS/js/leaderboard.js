import { sb } from './supabaseClient.js';

export const LeaderboardSystem = {
  state: {
      currentTab: 'event',
      userEmail: null,
      events: [],
      currentEventId: null,
      weeklyWeek: null,
      page: 1,
      pageSize: 20
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

    // Bind refresh button for admins only
    const btn = document.getElementById('refreshLeaderboardsBtn');
    if (btn) {
      const email = window.AppState?.currentUser?.email;
      const admins = (window.FantasyWrestling?.AdminSystem?.ALLOWED_ADMINS) || [];
      const canRefresh = !!email && admins.includes(email);
      btn.classList.toggle('hidden', !canRefresh);
      if (canRefresh) {
        btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = 'Refreshing…';
          try {
            const { error } = await sb.rpc('refresh_leaderboards');
            if (error) throw error;
            await LeaderboardSystem.fetchAndRender();
            window.Utils?.showNotification?.('Leaderboards refreshed', 'success');
          } catch (e) {
            console.error('Refresh leaderboards error:', e);
            window.Utils?.showNotification?.('Failed to refresh leaderboards', 'error');
          } finally {
            btn.disabled = false; btn.textContent = 'Refresh Leaderboards';
          }
        });
      }
    }

    // Bind pagination controls
    LeaderboardSystem.bindPagination();
  },

  loadCurrentUser: async () => {
    const AppState = window.AppState;
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

      const from = (LeaderboardSystem.state.page - 1) * LeaderboardSystem.state.pageSize;
      const to = from + LeaderboardSystem.state.pageSize - 1;

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
          .from('leaderboard_mv')
          .select('*')
          .eq('event_id', eventId)
          .order('correct', { ascending: false })
          .range(from, to);
        if (error) throw error;
        rows = data || [];
        console.log(`Event leaderboard data: ${rows.length} rows returned`);
      } else if (tab === 'global') {
        console.log('Loading global leaderboard from leaderboard_global view');
        const { data, error } = await sb
          .from('leaderboard_global_mv')
          .select('*')
          .order('correct', { ascending: false })
          .range(from, to);
        if (error) throw error;
        rows = data || [];
        console.log(`Global leaderboard data: ${rows.length} rows returned`);
      } else {
        console.log('Loading weekly leaderboard from leaderboard_weekly view');
        const { data, error } = await sb
          .from('leaderboard_weekly_mv')
          .select('*')
          .order('week', { ascending: false })
          .order('correct', { ascending: false })
          .range(from, to);
        if (error) throw error;
        rows = data || [];
        LeaderboardSystem.state.weeklyWeek = rows[0]?.week || rows[0]?.week_start || null;
        console.log(`Weekly leaderboard data: ${rows.length} rows returned`);
      }

      console.log(`Rendering table with ${rows.length} rows`);

      if (!rows || rows.length === 0) {
        console.log('No leaderboard data returned');
        LeaderboardSystem.renderTable([]);
      } else {
        LeaderboardSystem.renderTable(rows);
      }
      LeaderboardSystem.updatePaginationControls(rows.length);
    } catch (error) {
      console.error('Leaderboard load error:', error);
      console.error('Error details:', error.message, error.code);

      const errorMessage = error.message?.includes('relation')
        ? 'Leaderboard views not found. Please contact support.'
        : 'Failed to load leaderboard data. Please try again.';

      LeaderboardSystem.renderError(errorMessage);
      window.Utils?.showNotification?.('Failed to load leaderboard data', 'error');
    } finally {
      LeaderboardSystem.toggleLoading(false);
    }
  },

  bindPagination: () => {
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if (prev) prev.addEventListener('click', async () => {
      if (LeaderboardSystem.state.page > 1) {
        LeaderboardSystem.state.page--;
        await LeaderboardSystem.fetchAndRender();
      }
    });
    if (next) next.addEventListener('click', async () => {
      LeaderboardSystem.state.page++;
      await LeaderboardSystem.fetchAndRender();
    });
  },

  updatePaginationControls: (returned) => {
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    const info = document.getElementById('pageInfo');
    if (prev) prev.disabled = LeaderboardSystem.state.page <= 1;
    if (next) next.disabled = returned < LeaderboardSystem.state.pageSize;
    if (info) info.textContent = `Page ${LeaderboardSystem.state.page}`;
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
      const correctValue = row.correct_winners ?? row.correct ?? 0;
      const totalPredictions = row.total_predictions ?? row.total ?? 0;
      const accuracy = totalPredictions > 0 ? ((correctValue / totalPredictions) * 100).toFixed(1) : '0.0';
      const user = row.email || row.user_email || 'Unknown';
      const highlight = LeaderboardSystem.state.userEmail && user === LeaderboardSystem.state.userEmail;

      let rankClass = '';
      let rankDisplay = `${index + 1}`;
      if (index === 0) { rankClass = 'rank-gold'; rankDisplay = '🥇'; }
      else if (index === 1) { rankClass = 'rank-silver'; rankDisplay = '🥈'; }
      else if (index === 2) { rankClass = 'rank-bronze'; rankDisplay = '🥉'; }

      return `
        <tr class="${highlight ? 'highlight' : ''} ${rankClass} transition-all duration-200 hover:scale-[1.01]">
          <td class="px-4 py-4 font-bold text-center"><span class="text-lg">${rankDisplay}</span></td>
          <td class="px-4 py-4 font-medium">${user}</td>
          <td class="px-4 py-4 font-semibold text-center text-green-400">${correctValue}</td>
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
