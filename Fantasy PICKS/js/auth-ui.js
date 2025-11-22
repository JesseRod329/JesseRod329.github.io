import { sb } from './supabaseClient.js';

let wired = false;

export function setupAuthUI() {
  if (wired) return; wired = true;
  if (!sb) {
    console.error('[auth-ui] Supabase not initialized');
    return;
  }

  const signInButtons = [
    document.getElementById('btnSignIn'),
    document.getElementById('btnSignInMobile'),
    document.getElementById('loginBtn')
  ].filter(Boolean);

  const signOutButtons = [
    document.getElementById('btnSignOut'),
    document.getElementById('btnSignOutMobile')
  ].filter(Boolean);

  signInButtons.forEach(btn => btn.addEventListener('click', async () => {
    try {
      await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/profile.html` }
      });
    } catch (e) {
      console.error('[auth-ui] Sign in error:', e);
    }
  }));

  signOutButtons.forEach(btn => btn.addEventListener('click', async () => {
    try {
      await sb.auth.signOut();
      window.location.reload();
    } catch (e) {
      console.error('[auth-ui] Sign out error:', e);
    }
  }));

  const userChip = document.getElementById('userChip');
  const userChipMobile = document.getElementById('userChipMobile');
  const userAvatar = document.getElementById('userAvatar');
  const userAvatarMobile = document.getElementById('userAvatarMobile');
  const userHandle = document.getElementById('userHandle');
  const userHandleMobile = document.getElementById('userHandleMobile');

  function emailPrefix(email) {
    if (!email) return '';
    const i = email.indexOf('@');
    return i > 0 ? email.slice(0, i) : email;
  }

  function setHeaderSignInVisible(visible) {
    const headerBtn = document.getElementById('btnSignIn');
    if (!headerBtn) return;
    if (visible) {
      headerBtn.classList.remove('hidden');
      if (!headerBtn.classList.contains('md:inline-flex')) headerBtn.classList.add('md:inline-flex');
    } else {
      headerBtn.classList.add('hidden');
      headerBtn.classList.remove('md:inline-flex');
    }
  }

  async function updateUI(session) {
    const signedIn = !!session?.user;
    const heroLoginBtn = document.getElementById('loginBtn');
    setHeaderSignInVisible(!signedIn);
    document.getElementById('btnSignInMobile')?.classList.toggle('hidden', signedIn);
    if (heroLoginBtn) heroLoginBtn.classList.toggle('hidden', signedIn);
    userChip?.classList.toggle('hidden', !signedIn);
    userChipMobile?.classList.toggle('hidden', !signedIn);
    if (signedIn) {
      const userId = session.user.id;
      let username = '';
      let displayName = '';
      let avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '';
      try {
        const { data } = await sb
          .from('users')
          .select('username, username_root, username_discriminator, display_name, avatar_url')
          .eq('id', userId)
          .single();
        if (data) {
          username = data.username_root || (data.username ? String(data.username).split('#')[0] : '');
          displayName = data.display_name || '';
          if (data.avatar_url) {
            if (String(data.avatar_url).startsWith('http')) {
              avatar = data.avatar_url;
            } else {
              try {
                const { data: signed } = await sb.storage.from('avatars').createSignedUrl(data.avatar_url, 60);
                avatar = signed?.signedUrl || avatar;
              } catch (e) {
                console.warn('[auth-ui] failed to sign avatar url:', e);
              }
            }
          }
        }
      } catch (e) {
        console.warn('[auth-ui] Failed fetching profile:', e);
      }

      const label = username
        ? `@${username}`
        : (displayName || emailPrefix(session.user.email || ''));

      if (userAvatar) userAvatar.src = avatar;
      if (userAvatarMobile) userAvatarMobile.src = avatar;
      if (userHandle) userHandle.textContent = label;
      if (userHandleMobile) userHandleMobile.textContent = label;
    }
  }

  sb.auth.getSession().then(({ data }) => updateUI(data?.session || null));
  sb.auth.onAuthStateChange((_e, session) => updateUI(session));
}


