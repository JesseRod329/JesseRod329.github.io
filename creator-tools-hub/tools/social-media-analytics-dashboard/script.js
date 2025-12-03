const loadBtn = document.getElementById('loadBtn');
const totalFollowers = document.getElementById('totalFollowers');
const totalEngagement = document.getElementById('totalEngagement');
const avgEngagement = document.getElementById('avgEngagement');
const totalPosts = document.getElementById('totalPosts');
const platformBreakdown = document.getElementById('platformBreakdown');

const platformData = {
    instagram: { followers: 12500, engagement: 850, posts: 120 },
    twitter: { followers: 8900, engagement: 420, posts: 340 },
    youtube: { followers: 15200, engagement: 1200, posts: 45 },
    tiktok: { followers: 18900, engagement: 2100, posts: 89 }
};

function loadAnalytics() {
    const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selected.length === 0) {
        alert('Please select at least one platform');
        return;
    }
    
    let totalF = 0, totalE = 0, totalP = 0;
    const breakdown = [];
    
    selected.forEach(platform => {
        const data = platformData[platform];
        totalF += data.followers;
        totalE += data.engagement;
        totalP += data.posts;
        breakdown.push({ platform, ...data });
    });
    
    totalFollowers.textContent = totalF.toLocaleString();
    totalEngagement.textContent = totalE.toLocaleString();
    avgEngagement.textContent = ((totalE / totalF) * 100).toFixed(2) + '%';
    totalPosts.textContent = totalP.toLocaleString();
    
    platformBreakdown.innerHTML = breakdown.map(b => `
        <div class="platform-item">
            <div class="platform-name">${b.platform.charAt(0).toUpperCase() + b.platform.slice(1)}</div>
            <div class="platform-stats">
                <span>${b.followers.toLocaleString()} followers</span>
                <span>•</span>
                <span>${b.engagement.toLocaleString()} engagement</span>
                <span>•</span>
                <span>${b.posts} posts</span>
            </div>
        </div>
    `).join('');
}

loadBtn.addEventListener('click', loadAnalytics);
loadAnalytics(); // Load on page load

