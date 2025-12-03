const platformSelect = document.getElementById('platform');
const likesInput = document.getElementById('likes');
const commentsInput = document.getElementById('comments');
const sharesInput = document.getElementById('shares');
const addBtn = document.getElementById('addBtn');
const historyDiv = document.getElementById('history');

function addEngagement() {
    const platform = platformSelect.value;
    const likes = parseInt(likesInput.value) || 0;
    const comments = parseInt(commentsInput.value) || 0;
    const shares = parseInt(sharesInput.value) || 0;
    
    if (likes === 0 && comments === 0 && shares === 0) {
        alert('Please enter engagement data');
        return;
    }
    
    let engagements = JSON.parse(localStorage.getItem('engagements') || '[]');
    engagements.push({
        id: Date.now(),
        platform,
        likes,
        comments,
        shares,
        total: likes + comments + shares,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('engagements', JSON.stringify(engagements));
    
    likesInput.value = '';
    commentsInput.value = '';
    sharesInput.value = '';
    
    displayHistory();
}

function displayHistory() {
    const engagements = JSON.parse(localStorage.getItem('engagements') || '[]');
    const sorted = engagements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sorted.length === 0) {
        historyDiv.innerHTML = '<p class="empty">No engagement data yet</p>';
        return;
    }
    
    historyDiv.innerHTML = sorted.map(e => `
        <div class="engagement-item">
            <div class="engagement-platform">${e.platform.charAt(0).toUpperCase() + e.platform.slice(1)}</div>
            <div class="engagement-stats">
                <span>👍 ${e.likes}</span>
                <span>💬 ${e.comments}</span>
                <span>🔄 ${e.shares}</span>
                <span class="total">Total: ${e.total}</span>
            </div>
            <div class="engagement-date">${new Date(e.date).toLocaleDateString()}</div>
            <button onclick="deleteEngagement(${e.id})" class="delete-btn">×</button>
        </div>
    `).join('');
}

function deleteEngagement(id) {
    let engagements = JSON.parse(localStorage.getItem('engagements') || '[]');
    engagements = engagements.filter(e => e.id != id);
    localStorage.setItem('engagements', JSON.stringify(engagements));
    displayHistory();
}

addBtn.addEventListener('click', addEngagement);
window.deleteEngagement = deleteEngagement;
displayHistory();

