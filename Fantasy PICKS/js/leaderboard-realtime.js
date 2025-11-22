// Real-time leaderboard updates using Supabase Realtime
// This module enhances the leaderboard with live score updates
import { sb } from './supabaseClient.js';

let realtimeSubscription = null;
let leaderboardUpdateCallback = null;

/**
 * Initialize real-time leaderboard updates
 * @param {Function} onUpdate - Callback when leaderboard data changes
 * @returns {Function} Cleanup function to unsubscribe
 */
export function subscribeToLeaderboardUpdates(onUpdate) {
  if (!sb) {
    console.error('[leaderboard-realtime] Supabase not initialized');
    return () => {};
  }

  leaderboardUpdateCallback = onUpdate;

  // Subscribe to picks table changes
  const picksSubscription = sb
    .channel('picks-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'picks',
      },
      (payload) => {
        console.log('[leaderboard-realtime] Picks updated:', payload);
        if (leaderboardUpdateCallback) {
          leaderboardUpdateCallback('picks', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to matches table changes
  const matchesSubscription = sb
    .channel('matches-realtime')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
      },
      (payload) => {
        console.log('[leaderboard-realtime] Match result updated:', payload);
        if (leaderboardUpdateCallback) {
          leaderboardUpdateCallback('matches', payload);
        }
      }
    )
    .subscribe();

  realtimeSubscription = { picksSubscription, matchesSubscription };

  // Return cleanup function
  return () => {
    unsubscribeFromLeaderboardUpdates();
  };
}

/**
 * Unsubscribe from real-time updates
 */
export function unsubscribeFromLeaderboardUpdates() {
  if (realtimeSubscription) {
    try {
      realtimeSubscription.picksSubscription.unsubscribe();
      realtimeSubscription.matchesSubscription.unsubscribe();
      console.log('[leaderboard-realtime] Unsubscribed from live updates');
    } catch (e) {
      console.error('[leaderboard-realtime] Error unsubscribing:', e);
    }
    realtimeSubscription = null;
  }
}

/**
 * Compute live leaderboard with real-time scoring
 * Useful for immediate UI updates before DB materialized views refresh
 * @param {Array} userPicks - User's picks for the current set of matches
 * @param {Array} matchResults - Current match results from database
 * @returns {Object} Calculated scores and accuracy
 */
export function computeLiveLeaderboardEntry(userPicks, matchResults) {
  if (!userPicks || !matchResults) {
    return {
      correctWinners: 0,
      correctMethods: 0,
      correctBonuses: 0,
      totalPoints: 0,
      accuracy: 0,
    };
  }

  let correctWinners = 0;
  let correctMethods = 0;
  let correctBonuses = 0;

  userPicks.forEach((pick) => {
    const match = matchResults.find((m) => m.id === pick.match_id);
    if (!match || !match.winner) return; // Match not yet decided

    // Check winner
    if (pick.prediction?.winner === match.winner) {
      correctWinners += 1;
    }

    // Check method
    if (pick.prediction?.method && pick.prediction.method === match.method) {
      correctMethods += 1;
    }

    // Check bonuses
    const pickedBonuses = pick.prediction?.bonuses || [];
    const actualBonuses = match.bonuses || [];
    const correctBonus = pickedBonuses.filter((b) => actualBonuses.includes(b)).length;
    correctBonuses += correctBonus > 0 ? 1 : 0;
  });

  const totalPoints = correctWinners * 10 + correctMethods * 5 + correctBonuses * 5;
  const totalPossible = userPicks.length * 20; // 10 (winner) + 5 (method) + 5 (bonus)
  const accuracy = totalPossible > 0 ? ((totalPoints / totalPossible) * 100).toFixed(1) : 0;

  return {
    correctWinners,
    correctMethods,
    correctBonuses,
    totalPoints,
    accuracy,
  };
}

/**
 * Batch reload leaderboard data
 * Useful for manual refresh button or periodic updates
 * @param {String} leaderboardView - 'global', 'event', or 'weekly'
 * @param {Object} options - Query options (limit, offset, etc.)
 * @returns {Promise<Array>} Updated leaderboard data
 */
export async function refreshLeaderboardData(leaderboardView = 'global', options = {}) {
  if (!sb) {
    console.error('[leaderboard-realtime] Supabase not initialized');
    return [];
  }

  try {
    const { limit = 50, offset = 0 } = options;

    let viewName = 'leaderboard_global_mv';
    if (leaderboardView === 'event') {
      viewName = 'leaderboard_event_mv';
    } else if (leaderboardView === 'weekly') {
      viewName = 'leaderboard_weekly_mv';
    }

    console.log(`[leaderboard-realtime] Fetching ${viewName}...`);

    const { data, error } = await sb
      .from(viewName)
      .select('*')
      .order('total_points', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    console.log(`[leaderboard-realtime] Loaded ${data.length} leaderboard entries`);
    return data || [];
  } catch (e) {
    console.error('[leaderboard-realtime] Error loading leaderboard:', e);
    return [];
  }
}

/**
 * Listen for new match results and trigger leaderboard refresh
 * Automatically refreshes materialized views when matches are completed
 */
export function subscribeToMatchCompletions() {
  if (!sb) {
    console.error('[leaderboard-realtime] Supabase not initialized');
    return () => {};
  }

  const subscription = sb
    .channel('match-completions')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
        filter: 'winner=not.null', // Only when winner is set
      },
      async (payload) => {
        console.log('[leaderboard-realtime] Match completed:', payload.new);
        
        // Optional: Trigger RPC to refresh materialized views
        if (sb.rpc) {
          try {
            await sb.rpc('refresh_leaderboards');
            console.log('[leaderboard-realtime] Leaderboard MVs refreshed');
          } catch (e) {
            console.warn('[leaderboard-realtime] Could not refresh MVs:', e);
          }
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
    console.log('[leaderboard-realtime] Stopped listening to match completions');
  };
}

/**
 * Initialize all real-time leaderboard features
 * Combines subscriptions and provides unified API
 * @param {Object} config - Configuration
 * @param {Function} config.onUpdate - Callback for updates
 * @param {Boolean} config.autoRefreshMV - Auto-refresh materialized views
 * @returns {Object} Control object with cleanup methods
 */
export function initializeRealtimeLeaderboard(config = {}) {
  const { onUpdate = null, autoRefreshMV = true } = config;

  const cleanups = [];

  // Subscribe to updates
  if (onUpdate) {
    const unsubUpdate = subscribeToLeaderboardUpdates(onUpdate);
    cleanups.push(unsubUpdate);
  }

  // Subscribe to match completions
  if (autoRefreshMV) {
    const unsubCompletion = subscribeToMatchCompletions();
    cleanups.push(unsubCompletion);
  }

  // Return control object
  return {
    cleanup: () => {
      cleanups.forEach((fn) => fn());
      console.log('[leaderboard-realtime] All subscriptions cleaned up');
    },
    refresh: () => refreshLeaderboardData('global', { limit: 100 }),
    computeEntry: computeLiveLeaderboardEntry,
  };
}






