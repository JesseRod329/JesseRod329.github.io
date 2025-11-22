# Google OAuth 2.0 Configuration Verification Checklist

## ✅ Code Implementation Status

### Your Code is CORRECT ✅

1. **OAuth Sign-In** (`js/auth-ui.js`):
   ```javascript
   await sb.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: `${window.location.origin}/profile.html` }
   });
   ```
   ✅ Uses correct provider name
   ✅ Dynamic redirect URL (works for dev & production)
   ✅ Proper error handling

2. **PKCE Flow** (`js/init.js`):
   ```javascript
   window.sb = createClient(supabaseUrl, supabaseKey, {
     auth: {
       flowType: 'pkce'  // ✅ Secure OAuth flow
     }
   });
   ```
   ✅ PKCE enabled for security
   ✅ Proper code exchange handling

3. **Session Management**:
   ✅ Session persistence enabled
   ✅ Auto token refresh enabled
   ✅ URL detection for OAuth callbacks

## ⚠️ Dashboard Configuration Required

### Step 1: Supabase Dashboard Configuration

**URL:** https://supabase.com/dashboard/project/bxlgrtlzxqcmhfmvxnmw/auth/providers

1. **Navigate to Authentication → Providers**
2. **Click on Google provider**
3. **Enable Google provider** (toggle ON)
4. **Add Google Credentials:**
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
5. **Verify Callback URL:**
   - Should be: `https://bxlgrtlzxqcmhfmvxnmw.supabase.co/auth/v1/callback`
   - Copy this URL - you'll need it for Google Cloud Console

### Step 2: Google Cloud Console Configuration

**URL:** https://console.cloud.google.com/apis/credentials

#### A. OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. Configure the consent screen:
   - User Type: External (or Internal if using Google Workspace)
   - App name, support email, etc.
3. **Important:** Under **Authorized domains**, add:
   - `bxlgrtlzxqcmhfmvxnmw.supabase.co`
   - (This is your Supabase project domain)
4. Configure scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

#### B. Create OAuth 2.0 Credentials
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth Client ID**
3. Application type: **Web application**
4. **Authorized JavaScript origins:**
   - `https://iwc-fantasy-booking.vercel.app`
   - `http://localhost:8000` (for local dev)
   - `http://localhost:5173` (if using Vite dev server)
5. **Authorized redirect URIs:**
   - `https://bxlgrtlzxqcmhfmvxnmw.supabase.co/auth/v1/callback`
   - (This is the Supabase callback URL from Step 1)
6. **Copy Client ID and Client Secret**
7. **Add to Supabase Dashboard** (from Step 1)

### Step 3: Vercel Environment Variables

**URL:** https://vercel.com/jesserod329s-projects/iwc-fantasy-booking/settings/environment-variables

Verify these are set:
- ✅ `VITE_SUPABASE_URL` = `https://bxlgrtlzxqcmhfmvxnmw.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` = (your anon key)

These get injected into `public/env.js` during build.

## 🔍 Testing Checklist

After configuration:

- [ ] Click "Sign in with Google" button
- [ ] Redirects to Google sign-in page
- [ ] After Google auth, redirects to `/profile.html`
- [ ] User session is created
- [ ] User info displays in header
- [ ] Session persists after page refresh
- [ ] Sign out works correctly

## 🐛 Common Issues & Solutions

### Issue: "redirect_uri_mismatch" error
**Solution:** Ensure the redirect URI in Google Cloud Console exactly matches:
```
https://bxlgrtlzxqcmhfmvxnmw.supabase.co/auth/v1/callback
```

### Issue: "Configuration Missing" banner
**Solution:** Verify Vercel environment variables are set correctly

### Issue: OAuth flow starts but redirects back with error
**Solution:** 
1. Check Google Cloud Console redirect URIs
2. Verify Google provider is enabled in Supabase Dashboard
3. Check browser console for specific error messages

### Issue: Session not persisting
**Solution:** 
- Already handled in your code with `persistSession: true`
- Check browser localStorage for Supabase session

## 📝 Summary

**Your Code:** ✅ **CORRECT** - No changes needed

**Action Required:** Configure dashboards:
1. ✅ Supabase Dashboard → Enable Google provider, add credentials
2. ✅ Google Cloud Console → Create OAuth client, add redirect URIs
3. ✅ Verify Vercel environment variables

The code implementation follows Supabase best practices and should work once the dashboard configurations are complete.





