// Lightweight error monitoring with optional Sentry support
const ENV_DSN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || undefined;
const DSN = (typeof window !== 'undefined' && window.SENTRY_DSN) || ENV_DSN;

async function initSentry(dsn) {
  try {
    await import('https://browser.sentry-cdn.com/7.114.0/bundle.tracing.min.js');
    // eslint-disable-next-line no-undef
    Sentry.init({ dsn, integrations: [new Sentry.BrowserTracing()], tracesSampleRate: 0.1 });
    console.log('[monitoring] Sentry initialized');
  } catch (e) {
    console.warn('[monitoring] Failed to load Sentry SDK:', e);
  }
}

if (DSN) {
  initSentry(DSN);
}

// Always add basic window listeners
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    console.error('[global error]', e.message, e.error);
    if (window.Sentry) {
      // eslint-disable-next-line no-undef
      Sentry.captureException(e.error || new Error(e.message));
    }
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[unhandled rejection]', e.reason);
    if (window.Sentry) {
      // eslint-disable-next-line no-undef
      Sentry.captureException(e.reason || new Error('unhandledrejection'));
    }
  });
}
