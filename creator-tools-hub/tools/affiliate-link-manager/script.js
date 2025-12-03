const linkNameInput = document.getElementById('linkName');
const affiliateUrlInput = document.getElementById('affiliateUrl');
const categorySelect = document.getElementById('category');
const addBtn = document.getElementById('addBtn');
const linksDiv = document.getElementById('links');

function addLink() {
    const name = linkNameInput.value.trim();
    const url = affiliateUrlInput.value.trim();
    const category = categorySelect.value;
    
    if (!name || !url) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        new URL(url);
    } catch {
        alert('Please enter a valid URL');
        return;
    }
    
    let links = JSON.parse(localStorage.getItem('affiliateLinks') || '[]');
    links.push({
        id: Date.now(),
        name,
        url,
        category,
        clicks: 0,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('affiliateLinks', JSON.stringify(links));
    
    linkNameInput.value = '';
    affiliateUrlInput.value = '';
    
    displayLinks();
}

function displayLinks() {
    const links = JSON.parse(localStorage.getItem('affiliateLinks') || '[]');
    const sorted = links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (sorted.length === 0) {
        linksDiv.innerHTML = '<p class="empty">No affiliate links yet</p>';
        return;
    }
    
    linksDiv.innerHTML = sorted.map(link => `
        <div class="link-item">
            <div class="link-info">
                <div class="link-name">${link.name}</div>
                <div class="link-url">${link.url}</div>
                <div class="link-meta">
                    <span class="category-badge ${link.category}">${link.category}</span>
                    <span>•</span>
                    <span>${link.clicks} clicks</span>
                </div>
            </div>
            <div class="link-actions">
                <button onclick="copyLink('${link.url}')" class="btn-copy">Copy</button>
                <button onclick="deleteLink(${link.id})" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied!');
    });
}

function deleteLink(id) {
    let links = JSON.parse(localStorage.getItem('affiliateLinks') || '[]');
    links = links.filter(l => l.id != id);
    localStorage.setItem('affiliateLinks', JSON.stringify(links));
    displayLinks();
}

addBtn.addEventListener('click', addLink);
window.copyLink = copyLink;
window.deleteLink = deleteLink;
displayLinks();

