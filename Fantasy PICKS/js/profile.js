// Profile page functionality
import { sb } from './supabaseClient.js';

let currentUser = null;
let usernameCheckTimeout = null;

export function setupProfilePage() {
  // DOM elements
  const signInPrompt = document.getElementById('signInPrompt');
  const profileContent = document.getElementById('profileContent');
  const profileForm = document.getElementById('profileForm');
  const displayNameInput = document.getElementById('displayName');
  const usernameInput = document.getElementById('username');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const promptSignIn = document.getElementById('promptSignIn');
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarStatus = document.getElementById('avatarStatus');
  const bioInput = document.getElementById('bio');
  const bioCount = document.getElementById('bioCount');
  const favoritePromotion = document.getElementById('favoritePromotion');
  const timezoneSelect = document.getElementById('timezone');
  const notifyResults = document.getElementById('notifyResults');
  const marketingOptIn = document.getElementById('marketingOptIn');

  // Status message elements
  const statusMessage = document.getElementById('statusMessage');
  const displayNameError = document.getElementById('displayNameError');
  const usernameError = document.getElementById('usernameError');
  const usernameSuccess = document.getElementById('usernameSuccess');
  const fullHandleEl = document.getElementById('fullHandle');

  // Setup auth state listener
  setupAuthStateListener();

  // Event listeners
  if (promptSignIn) {
    promptSignIn.addEventListener('click', () => {
      signInWithGoogle();
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', handleFormSubmit);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      loadUserData();
    });
  }

  if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
      // Clear errors on input
      usernameError.textContent = '';
      usernameSuccess.textContent = '';

      // Debounce username availability check
      clearTimeout(usernameCheckTimeout);
      usernameCheckTimeout = setTimeout(() => {
        checkUsernameAvailability(e.target.value);
      }, 500);
    });
  }

  if (bioInput && bioCount) {
    const updateCount = () => { bioCount.textContent = String(bioInput.value.length); };
    bioInput.addEventListener('input', updateCount); updateCount();
  }

  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async () => {
      const file = avatarInput.files?.[0];
      if (!file) return;

      console.log('[profile] Starting avatar upload for user:', currentUser?.id);
      console.log('[profile] File size:', file.size, 'bytes');
      console.log('[profile] File type:', file.type);

      try {
        avatarStatus.textContent = 'Uploading…';

        // Check if storage is available
        if (!sb?.storage) {
          throw new Error('Storage not available');
        }

        // Proceed directly to upload; bucket listing requires admin privileges

        // Use proper file extension based on file type
        const fileExtension = file.type === 'image/png' ? 'png' : 'jpg';
        const filePath = `${currentUser.id}/avatar.${fileExtension}`;
        console.log('[profile] Upload path:', filePath);
        console.log('[profile] File MIME type:', file.type);

        // Upload file to storage with timeout
        console.log('[profile] Starting storage upload...');
        console.log('[profile] File size:', file.size, 'bytes (', Math.round(file.size / 1024 / 1024 * 100) / 100, 'MB )');

        // Check file size (Supabase has 50MB limit, but let's be safe)
        if (file.size > 10 * 1024 * 1024) { // 10MB limit for safety
          throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB. Maximum allowed is 10MB.`);
        }

        console.log('[profile] Creating upload promise...');
        const uploadPromise = sb.storage.from('avatars').upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        }).then(res => { console.log('[profile] upload() resolved:', res); return res; })
          .catch(err => { console.error('[profile] upload() rejected:', err); throw err; });

        // Add timeout to prevent hanging
        console.log('[profile] Creating timeout promise...');
        const timeoutPromise = new Promise((_, reject) => {
          console.log('[profile] Setting timeout for 15 seconds...');
          setTimeout(() => {
            console.log('[profile] Timeout reached! Upload taking too long.');
            reject(new Error('Upload timeout after 15 seconds'));
          }, 15000);
        });

        console.log('[profile] Starting Promise.race...');
        let uploadResult;
        try {
          uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
          console.log('[profile] Promise.race completed with result:', uploadResult);
        } catch (error) {
          console.error('[profile] Promise.race failed with error:', error);
          throw error;
        }

        // Handle the result
        if (uploadResult.error) {
          console.error('[profile] Upload error in result:', uploadResult.error);
          console.error('[profile] Error details:', JSON.stringify(uploadResult.error, null, 2));
          throw uploadResult.error;
        }

        if (!uploadResult.data) {
          throw new Error('Upload completed but no data returned');
        }

        console.log('[profile] Upload successful:', uploadResult.data);

        // Create signed URL for immediate display
        const { data: signed } = await sb.storage.from('avatars').createSignedUrl(filePath, 60);
        const signedUrl = signed?.signedUrl || '';

        // Update user profile with storage path (not public URL)
        const { error: updateErr } = await sb.from('users').update({ avatar_url: filePath }).eq('id', currentUser.id);

        if (updateErr) {
          console.error('[profile] Database update error:', updateErr);
          throw updateErr;
        }

        console.log('[profile] Database updated successfully');

        // Update avatar in UI with cache busting
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
          profileAvatar.src = signedUrl ? `${signedUrl}&t=${Date.now()}` : '';
        }

        avatarStatus.textContent = 'Saved ✓';
        console.log('[profile] Avatar upload completed successfully');
      } catch (e) {
        console.error('[profile] avatar upload error:', e);
        avatarStatus.textContent = `Upload failed: ${e.message || 'Unknown error'}`;
      }
    });
  }

  // Populate timezone select
  if (timezoneSelect && Intl?.DateTimeFormat?.supportedLocalesOf) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const zones = [tz, 'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'];
      timezoneSelect.innerHTML = '';
      zones.forEach(z => { const o = document.createElement('option'); o.value = z; o.textContent = z; timezoneSelect.appendChild(o); });
    } catch {}
  }

  async function loadStats() {
    try {
      const { data: s } = await sb.from('user_stats_v').select('*').eq('user_id', currentUser.id).single();
      const statCorrect = document.getElementById('statCorrect');
      if (statCorrect) statCorrect.textContent = s?.correct ?? 0;
      const statPredictions = document.getElementById('statPredictions');
      if (statPredictions) statPredictions.textContent = s?.total_predictions ?? 0;
      const statAccuracy = document.getElementById('statAccuracy');
      if (statAccuracy) statAccuracy.textContent = s?.accuracy ? `${Number(s.accuracy * 100).toFixed(0)}%` : '0%';
      const statEvents = document.getElementById('statEvents');
      if (statEvents) statEvents.textContent = s?.events_predicted ?? 0;

      const { data: recent } = await sb.from('user_recent_events_v').select('*').eq('user_id', currentUser.id).order('event_date', { ascending: false }).limit(5);
      const tbody = document.getElementById('recentEvents');
      if (tbody) {
        tbody.innerHTML = (recent || []).map(r => `<tr><td>${r.event_name}</td><td>${new Date(r.event_date).toLocaleDateString()}</td><td>${r.correct}/${r.total}</td></tr>`).join('');
      }
    } catch (e) { console.warn('[profile] stats load error:', e); }
  }

  function setupAuthStateListener() {
    if (!sb) {
      // Wait for global client to be ready, then retry
      window.addEventListener('supabase:initialized', () => {
        try { setupAuthStateListener(); } catch (e) { console.error('[profile] late init failed', e); }
      }, { once: true });
      return;
    }

    const apply = async (session) => {
      if (session?.user) {
        currentUser = session.user;
        profileContent.classList.remove('hidden');
        signInPrompt.classList.add('hidden');
        await loadUserData();
        await loadStats();
      } else {
        currentUser = null;
        profileContent.classList.add('hidden');
        signInPrompt.classList.remove('hidden');
      }
    };

    sb.auth.onAuthStateChange(async (_event, session) => { await apply(session); });
    sb.auth.getSession().then(({ data }) => apply(data?.session || null));
  }

  async function loadUserData() {
    if (!currentUser || !sb) return;

    try {
      // Fetch user profile
      const { data, error } = await sb
        .from('users')
        .select('display_name, username, username_root, username_discriminator, avatar_url, email, bio, timezone, marketing_opt_in, notify_results, favorite_promotion')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      // Populate form
      displayNameInput.value = data.display_name || '';
      usernameInput.value = data.username_root || (data.username ? String(data.username).split('#')[0] : '');

      // Load avatar (supports both legacy public URL and private storage path)
      const profileAvatar = document.getElementById('profileAvatar');
      if (profileAvatar) {
        if (!data.avatar_url) {
          profileAvatar.src = '';
        } else if (String(data.avatar_url).startsWith('http')) {
          profileAvatar.src = `${data.avatar_url}?t=${Date.now()}`;
        } else {
          try {
            const { data: signed } = await sb.storage.from('avatars').createSignedUrl(data.avatar_url, 60);
            profileAvatar.src = signed?.signedUrl ? `${signed.signedUrl}&t=${Date.now()}` : '';
          } catch (e) {
            console.warn('[profile] failed to create signed url:', e);
            profileAvatar.src = '';
          }
        }
      }

      document.getElementById('profileEmail').textContent = data.email || '';
      const full = data.username || (data.username_root ? `${data.username_root}#${String(data.username_discriminator || 0).padStart(4,'0')}` : '');
      if (fullHandleEl) fullHandleEl.textContent = full ? `@${full}` : '@—';
      if (bioInput) bioInput.value = data.bio || '';
      if (favoritePromotion) favoritePromotion.value = data.favorite_promotion || '';
      if (timezoneSelect && data.timezone) timezoneSelect.value = data.timezone;
      if (notifyResults) notifyResults.checked = !!data.notify_results;
      if (marketingOptIn) marketingOptIn.checked = !!data.marketing_opt_in;

      // Clear errors
      statusMessage.classList.remove('show', 'status-success', 'status-error');
      displayNameError.textContent = '';
      usernameError.textContent = '';
      usernameSuccess.textContent = '';
    } catch (e) {
      console.error('[profile] Error loading user data:', e);
      showStatus('Failed to load profile', 'error');
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (!currentUser || !sb) {
      showStatus('Not signed in', 'error');
      return;
    }

    const displayName = displayNameInput.value.trim();
    const username = usernameInput.value.trim().toLowerCase();

    // Validate inputs
    if (!displayName) {
      displayNameError.textContent = 'Display name is required';
      return;
    }

    if (!username) {
      usernameError.textContent = 'Username is required';
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      usernameError.textContent = 'Username can only contain lowercase letters, numbers, and underscores';
      return;
    }

    // Disable button and show spinner
    saveBtn.disabled = true;
    document.getElementById('saveBtnText').style.display = 'none';
    document.getElementById('saveBtnSpinner').style.display = 'inline-block';

    try {
      // 1) Set username root via RPC (server assigns discriminator)
      const { data: uname, error: unameErr } = await sb.rpc('set_username_root', { new_root: username });
      if (unameErr) {
        if (String(unameErr.message || '').includes('invalid_username_root')) {
          usernameError.textContent = 'Only lowercase letters, numbers, and underscores are allowed';
          return;
        }
        showStatus('Failed to set username. Please try another.', 'error');
        throw unameErr;
      }

      // 2) Update additional profile fields
      const updatePayload = {
        display_name: displayName,
        bio: bioInput?.value?.trim() || null,
        favorite_promotion: favoritePromotion?.value || null,
        timezone: timezoneSelect?.value || null,
        notify_results: notifyResults?.checked || false,
        marketing_opt_in: marketingOptIn?.checked || false,
      };

      const { error: dispErr } = await sb
        .from('users')
        .update(updatePayload)
        .eq('id', currentUser.id);
      if (dispErr) throw dispErr;

      showStatus('Profile updated successfully!', 'success');
      await loadUserData();
      // refresh header
      const evt = new Event('supabase:initialized');
      window.dispatchEvent(evt);
    } catch (e) {
      console.error('[profile] Error updating profile:', e);
      showStatus('Failed to update profile. Please try again.', 'error');
    } finally {
      // Re-enable button and hide spinner
      saveBtn.disabled = false;
      document.getElementById('saveBtnText').style.display = 'inline';
      document.getElementById('saveBtnSpinner').style.display = 'none';
    }
  }

  async function checkUsernameAvailability(username) {
    if (!username || !/^[a-z0-9_]+$/.test(username) || !sb) {
      return;
    }

    try {
      // Root availability (not strict uniqueness due to discriminator)
      const { count } = await sb
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('username_root', username.toLowerCase());

      if (!count || count === 0) {
        usernameSuccess.textContent = '✓ Available';
        usernameError.textContent = '';
      } else {
        usernameSuccess.textContent = 'Taken; you’ll get an automatic #ID';
        usernameError.textContent = '';
      }
    } catch (e) {
      console.error('[profile] Error checking username:', e);
    }
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.classList.add('show', type === 'success' ? 'status-success' : 'status-error');

    if (type === 'success') {
      setTimeout(() => {
        statusMessage.classList.remove('show');
      }, 3000);
    }
  }

  document.getElementById('globalSignOutBtn')?.addEventListener('click', async () => {
    try {
      await sb.auth.signOut({ scope: 'global' });
      window.location.reload();
    } catch (e) { console.error('[profile] global signout error:', e); }
  });
}

async function signInWithGoogle() {
  if (!sb) {
    console.error('[profile] Supabase not initialized');
    return;
  }

  try {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile.html`,
      },
    });

    if (error) throw error;
  } catch (e) {
    console.error('[profile] Sign in error:', e);
  }
}


