// Profile Bootstrap Test Script
// Run this in the browser console after signing in to test the profile system

async function testProfileBootstrap() {
    console.log('🧪 Starting Profile Bootstrap Tests...');
    
    if (!window.sb) {
        console.error('❌ Supabase client not found');
        return;
    }
    
    try {
        // Test 1: Check if user is authenticated
        const { data: { user }, error: userError } = await window.sb.auth.getUser();
        if (userError || !user) {
            console.error('❌ User not authenticated:', userError);
            return;
        }
        console.log('✅ User authenticated:', user.email);
        
        // Test 2: Check if profile exists
        const { data: profile, error: profileError } = await window.sb
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
        
        if (profileError) {
            console.error('❌ Error fetching profile:', profileError);
            return;
        }
        
        if (!profile) {
            console.log('⚠️ Profile not found, testing ensureProfile...');
            // Test the ensureProfile function
            await testEnsureProfile(user);
        } else {
            console.log('✅ Profile found:', profile);
        }
        
        // Test 3: Test RLS - should only see own profile
        const { data: allProfiles, error: allError } = await window.sb
            .from('users')
            .select('id, email, display_name');
        
        if (allError) {
            console.error('❌ Error fetching all profiles:', allError);
            return;
        }
        
        console.log('✅ RLS Test - Profiles visible:', allProfiles.length);
        console.log('📊 Profiles data:', allProfiles);
        
        if (allProfiles.length === 1 && allProfiles[0].id === user.id) {
            console.log('✅ RLS working correctly - only own profile visible');
        } else {
            console.warn('⚠️ RLS may not be working correctly');
        }
        
        // Test 4: Test profile update
        const { error: updateError } = await window.sb
            .from('users')
            .update({ display_name: 'Test User Updated' })
            .eq('id', user.id);
        
        if (updateError) {
            console.error('❌ Error updating profile:', updateError);
        } else {
            console.log('✅ Profile update successful');
        }
        
        // Test 5: Test profile creation (should work for own ID)
        const { error: insertError } = await window.sb
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                display_name: 'Test User Upsert'
            });
        
        if (insertError) {
            console.error('❌ Error upserting profile:', insertError);
        } else {
            console.log('✅ Profile upsert successful');
        }
        
        console.log('🎉 All profile bootstrap tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

async function testEnsureProfile(user) {
    console.log('🔧 Testing ensureProfile function...');
    
    try {
        // Simulate the ensureProfile logic
        const { data: me } = await window.sb
            .from('users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();
        
        if (!me) {
            console.log('📝 Creating new profile...');
            const { error } = await window.sb.from('users').insert({
                id: user.id,
                email: user.email ?? null,
                display_name: user.user_metadata?.full_name ?? null,
                avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url || null
            });
            
            if (error) {
                console.error('❌ Error creating profile:', error);
            } else {
                console.log('✅ Profile created successfully');
            }
        } else {
            console.log('✅ Profile already exists');
        }
    } catch (error) {
        console.error('❌ ensureProfile test failed:', error);
    }
}

// Test RLS by trying to access other users' data
async function testRLS() {
    console.log('🔒 Testing RLS (Row Level Security)...');
    
    try {
        // This should fail if RLS is working correctly
        const { data, error } = await window.sb
            .from('users')
            .select('id, email')
            .neq('id', (await window.sb.auth.getUser()).data.user.id);
        
        if (error) {
            console.log('✅ RLS working - access denied:', error.message);
        } else if (data && data.length === 0) {
            console.log('✅ RLS working - no other users visible');
        } else {
            console.warn('⚠️ RLS may not be working - other users visible:', data);
        }
    } catch (error) {
        console.log('✅ RLS working - access denied:', error.message);
    }
}

// Export functions for manual testing
window.testProfileBootstrap = testProfileBootstrap;
window.testEnsureProfile = testEnsureProfile;
window.testRLS = testRLS;

console.log('🧪 Profile Bootstrap Test Functions Loaded:');
console.log('- testProfileBootstrap() - Run all tests');
console.log('- testEnsureProfile(user) - Test profile creation');
console.log('- testRLS() - Test Row Level Security');
console.log('');
console.log('Run testProfileBootstrap() to start testing...');
