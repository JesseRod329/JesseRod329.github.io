const followersInput = document.getElementById('followers');
const likesInput = document.getElementById('likes');
const commentsInput = document.getElementById('comments');
const sharesInput = document.getElementById('shares');
const calculateBtn = document.getElementById('calculateBtn');
const engagementRate = document.getElementById('engagementRate');
const breakdown = document.getElementById('breakdown');

function calculateRate() {
    const followers = parseInt(followersInput.value) || 0;
    const likes = parseInt(likesInput.value) || 0;
    const comments = parseInt(commentsInput.value) || 0;
    const shares = parseInt(sharesInput.value) || 0;
    
    if (followers === 0) {
        alert('Please enter follower count');
        return;
    }
    
    const totalEngagement = likes + comments + shares;
    const rate = (totalEngagement / followers) * 100;
    
    engagementRate.textContent = rate.toFixed(2) + '%';
    engagementRate.parentElement.className = `result-card ${rate >= 3 ? 'high' : rate >= 1 ? 'medium' : 'low'}`;
    
    breakdown.innerHTML = `
        <div class="breakdown-item">
            <div class="breakdown-label">Total Engagement</div>
            <div class="breakdown-value">${totalEngagement.toLocaleString()}</div>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">Likes</div>
            <div class="breakdown-value">${likes.toLocaleString()}</div>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">Comments</div>
            <div class="breakdown-value">${comments.toLocaleString()}</div>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">Shares</div>
            <div class="breakdown-value">${shares.toLocaleString()}</div>
        </div>
    `;
}

calculateBtn.addEventListener('click', calculateRate);

