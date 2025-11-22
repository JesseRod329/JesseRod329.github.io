// Supabase client initialization with environment variables
// This module handles initialization and provides the Supabase client instance

const initSupabase = () => {
  // Get credentials from environment variables
  const supabaseUrl = window.__SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = window.__SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      '[supabaseInit] Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
    return null;
  }

  try {
    const { createClient } = window.supabase || {};
    if (!createClient) {
      console.error('[supabaseInit] Supabase client library not loaded');
      return null;
    }

    const client = createClient(supabaseUrl, supabaseKey);
    console.log('[supabaseInit] Supabase client initialized successfully');
    return client;
  } catch (e) {
    console.error('[supabaseInit] Failed to initialize Supabase:', e);
    return null;
  }
};

// Export a getter that always returns the most current client
export function getSb() {
  return window.sb || initSupabase();
}

// For backwards compatibility, export sb as an alias
export const sb = new Proxy({}, {
  get(_target, prop) {
    const client = window.sb || initSupabase();
    return client?.[prop];
  }
});

