// Application initialization with environment-based Supabase setup
import { sb } from './supabaseClient.js';

export async function initializeApp() {
  try {
    // Load Supabase SDK from CDN
    await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

    const supabaseUrl = window.__SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = window.__SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      showMissingConfigBanner();
      console.warn('[init] Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return false;
    }

    // Initialize Supabase client on window
    const { createClient } = window.supabase;
    if (!createClient) {
      console.error('[init] Supabase library not loaded');
      showMissingConfigBanner();
      return false;
    }

    window.sb = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    // If returning from OAuth (code in URL), exchange it for a session before proceeding
    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        const { error } = await window.sb.auth.exchangeCodeForSession(code);
        if (error) throw error;
        const cleanUrl = url.origin + url.pathname + (url.hash || '');
        history.replaceState(null, '', cleanUrl);
        console.log('[init] OAuth code exchanged and URL cleaned');
      }
    } catch (ex) {
      console.warn('[init] exchangeCodeForSession warning:', ex);
    }
    console.log('[init] Supabase initialized successfully from environment variables');
    // Notify listeners that sb is ready
    window.dispatchEvent(new Event('supabase:initialized'));
    return true;
  } catch (e) {
    console.error('[init] Failed to initialize application:', e);
    showMissingConfigBanner();
    return false;
  }
}

function showMissingConfigBanner() {
  // Create banner if not already present
  if (document.getElementById('config-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'config-banner';
  banner.className =
    'fixed top-16 left-0 right-0 bg-red-900/90 text-yellow-200 px-4 py-3 text-center z-40 flex items-center justify-center gap-4';
  banner.innerHTML = `
    <div class="flex-1">
      <strong>⚠️ Configuration Missing:</strong> Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable predictions and leaderboards.
    </div>
    <button id="dismiss-banner" class="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm">×</button>
  `;

  document.body.insertBefore(banner, document.body.firstChild);

  document.getElementById('dismiss-banner').addEventListener('click', () => {
    banner.remove();
  });
}


