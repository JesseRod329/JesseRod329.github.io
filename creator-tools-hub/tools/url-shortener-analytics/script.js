const urlInput = document.getElementById('url');
const customSlugInput = document.getElementById('customSlug');
const shortenBtn = document.getElementById('shortenBtn');
const urlsListDiv = document.getElementById('urlsList');

function shortenURL() {
    const longUrl = urlInput.value.trim();
    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }
    
    try {
        new URL(longUrl);
    } catch {
        alert('Please enter a valid URL');
        return;
    }
    
    let urls = JSON.parse(localStorage.getItem('shortUrls') || '[]');
    const slug = customSlugInput.value.trim() || generateSlug();
    const shortUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/r/${slug}`;
    
    urls.push({
        id: Date.now(),
        longUrl,
        shortUrl,
        slug,
        clicks: 0,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('shortUrls', JSON.stringify(urls));
    urlInput.value = '';
    customSlugInput.value = '';
    displayURLs();
    
    // Copy to clipboard
    navigator.clipboard.writeText(shortUrl).then(() => {
        alert(`Short URL copied to clipboard!\n${shortUrl}`);
    });
}

function generateSlug() {
    return Math.random().toString(36).substring(2, 8);
}

function displayURLs() {
    const urls = JSON.parse(localStorage.getItem('shortUrls') || '[]');
    const sorted = urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (sorted.length === 0) {
        urlsListDiv.innerHTML = '<p class="empty">No shortened URLs yet</p>';
        return;
    }
    
    urlsListDiv.innerHTML = sorted.map(u => `
        <div class="url-item">
            <div class="url-info">
                <div class="url-short">${u.shortUrl}</div>
                <div class="url-long">${u.longUrl}</div>
                <div class="url-stats">
                    <span>${u.clicks} clicks</span>
                    <span>•</span>
                    <span>Created: ${new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="url-actions">
                <button onclick="copyUrl('${u.shortUrl}')" class="btn-copy">Copy</button>
                <button onclick="deleteUrl(${u.id})" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
    });
}

function deleteUrl(id) {
    let urls = JSON.parse(localStorage.getItem('shortUrls') || '[]');
    urls = urls.filter(u => u.id != id);
    localStorage.setItem('shortUrls', JSON.stringify(urls));
    displayURLs();
}

shortenBtn.addEventListener('click', shortenURL);
window.copyUrl = copyUrl;
window.deleteUrl = deleteUrl;
displayURLs();

