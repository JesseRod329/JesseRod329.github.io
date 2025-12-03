const assetNameInput = document.getElementById('assetName');
const assetTypeSelect = document.getElementById('assetType');
const categoryInput = document.getElementById('category');
const tagsInput = document.getElementById('tags');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('search');
const filterTypeSelect = document.getElementById('filterType');
const assetsDiv = document.getElementById('assets');

function addAsset() {
    const name = assetNameInput.value.trim();
    const type = assetTypeSelect.value;
    const category = categoryInput.value.trim();
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    
    if (!name) {
        alert('Please enter asset name');
        return;
    }
    
    let assets = JSON.parse(localStorage.getItem('contentAssets') || '[]');
    assets.push({
        id: Date.now(),
        name,
        type,
        category,
        tags,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('contentAssets', JSON.stringify(assets));
    
    assetNameInput.value = '';
    categoryInput.value = '';
    tagsInput.value = '';
    
    displayAssets();
}

function displayAssets() {
    const assets = JSON.parse(localStorage.getItem('contentAssets') || '[]');
    const search = searchInput.value.toLowerCase();
    const filterType = filterTypeSelect.value;
    
    let filtered = assets;
    
    if (search) {
        filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(search) ||
            a.category.toLowerCase().includes(search) ||
            a.tags.some(t => t.toLowerCase().includes(search))
        );
    }
    
    if (filterType !== 'all') {
        filtered = filtered.filter(a => a.type === filterType);
    }
    
    const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (sorted.length === 0) {
        assetsDiv.innerHTML = '<p class="empty">No assets found</p>';
        return;
    }
    
    assetsDiv.innerHTML = sorted.map(asset => `
        <div class="asset-item">
            <div class="asset-icon">${getAssetIcon(asset.type)}</div>
            <div class="asset-info">
                <div class="asset-name">${asset.name}</div>
                <div class="asset-meta">
                    <span class="type-badge ${asset.type}">${asset.type}</span>
                    ${asset.category ? `<span>• ${asset.category}</span>` : ''}
                </div>
                ${asset.tags.length > 0 ? `<div class="asset-tags">${asset.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            </div>
            <button onclick="deleteAsset(${asset.id})" class="delete-btn">×</button>
        </div>
    `).join('');
}

function getAssetIcon(type) {
    const icons = {
        image: '🖼️',
        video: '🎬',
        template: '📄',
        audio: '🎵',
        other: '📦'
    };
    return icons[type] || '📦';
}

function deleteAsset(id) {
    let assets = JSON.parse(localStorage.getItem('contentAssets') || '[]');
    assets = assets.filter(a => a.id != id);
    localStorage.setItem('contentAssets', JSON.stringify(assets));
    displayAssets();
}

addBtn.addEventListener('click', addAsset);
searchInput.addEventListener('input', displayAssets);
filterTypeSelect.addEventListener('change', displayAssets);
window.deleteAsset = deleteAsset;
displayAssets();

