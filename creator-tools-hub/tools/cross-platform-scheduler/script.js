const contentTextarea = document.getElementById('content');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const scheduleBtn = document.getElementById('scheduleBtn');
const scheduledPostsDiv = document.getElementById('scheduledPosts');

// Set default date to today
dateInput.valueAsDate = new Date();

function schedulePosts() {
    const content = contentTextarea.value.trim();
    if (!content) {
        alert('Please enter post content');
        return;
    }
    
    const selectedPlatforms = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }
    
    const date = dateInput.value;
    const time = timeInput.value;
    const datetime = new Date(`${date}T${time}`);
    
    // Load existing posts
    let posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    
    // Add new posts
    selectedPlatforms.forEach(platform => {
        posts.push({
            id: Date.now() + Math.random(),
            content,
            platform,
            datetime: datetime.toISOString(),
            status: 'scheduled'
        });
    });
    
    // Save and display
    localStorage.setItem('scheduledPosts', JSON.stringify(posts));
    displayScheduledPosts();
    
    alert(`Scheduled ${selectedPlatforms.length} post(s) for ${datetime.toLocaleString()}`);
    contentTextarea.value = '';
}

function displayScheduledPosts() {
    const posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    const sortedPosts = posts.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    if (sortedPosts.length === 0) {
        scheduledPostsDiv.innerHTML = '<p class="empty">No scheduled posts</p>';
        return;
    }
    
    scheduledPostsDiv.innerHTML = sortedPosts.map(post => {
        const postDate = new Date(post.datetime);
        const isPast = postDate < new Date();
        return `
            <div class="post-item ${isPast ? 'past' : ''}">
                <div class="post-platform">${getPlatformIcon(post.platform)} ${post.platform}</div>
                <div class="post-content">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</div>
                <div class="post-datetime">${postDate.toLocaleString()}</div>
                <button onclick="deletePost('${post.id}')" class="delete-btn">Delete</button>
            </div>
        `;
    }).join('');
}

function deletePost(id) {
    let posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    posts = posts.filter(p => p.id != id);
    localStorage.setItem('scheduledPosts', JSON.stringify(posts));
    displayScheduledPosts();
}

function getPlatformIcon(platform) {
    const icons = {
        twitter: '🐦',
        instagram: '📷',
        facebook: '👥',
        linkedin: '💼',
        tiktok: '🎵',
        youtube: '▶️'
    };
    return icons[platform] || '📱';
}

scheduleBtn.addEventListener('click', schedulePosts);
window.deletePost = deletePost;
displayScheduledPosts();

