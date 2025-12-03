const nicheInput = document.getElementById('niche');
const platformSelect = document.getElementById('platform');
const followerRangeSelect = document.getElementById('followerRange');
const findBtn = document.getElementById('findBtn');
const collaboratorsDiv = document.getElementById('collaborators');

const sampleCreators = [
    { name: 'TechGuru', niche: 'tech reviews', followers: '125K', engagement: '4.2%' },
    { name: 'CodeMaster', niche: 'programming', followers: '89K', engagement: '5.1%' },
    { name: 'DesignPro', niche: 'design tips', followers: '156K', engagement: '3.8%' },
    { name: 'CreatorHub', niche: 'content creation', followers: '98K', engagement: '4.5%' }
];

function findCollaborators() {
    const niche = nicheInput.value.trim().toLowerCase();
    if (!niche) {
        alert('Please enter your niche');
        return;
    }
    
    const platform = platformSelect.value;
    const range = followerRangeSelect.value;
    
    // Filter and display creators
    const filtered = sampleCreators.filter(c => 
        c.niche.includes(niche) || niche.includes(c.niche.split(' ')[0])
    );
    
    if (filtered.length === 0) {
        collaboratorsDiv.innerHTML = '<p class="empty">No matching creators found. Try a different niche.</p>';
        return;
    }
    
    collaboratorsDiv.innerHTML = filtered.map(c => `
        <div class="collaborator-item">
            <div class="collaborator-info">
                <div class="collaborator-name">${c.name}</div>
                <div class="collaborator-details">
                    <span>${c.followers} followers</span>
                    <span>•</span>
                    <span>${c.engagement} engagement</span>
                    <span>•</span>
                    <span>${c.niche}</span>
                </div>
            </div>
            <button class="connect-btn">Connect</button>
        </div>
    `).join('');
}

findBtn.addEventListener('click', findCollaborators);

