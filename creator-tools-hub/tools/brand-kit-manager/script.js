const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color3 = document.getElementById('color3');
const color4 = document.getElementById('color4');
const fontFamily = document.getElementById('fontFamily');
const brandName = document.getElementById('brandName');
const saveBtn = document.getElementById('saveBtn');
const brandKits = document.getElementById('brandKits');

function saveBrandKit() {
    const name = brandName.value.trim();
    if (!name) {
        alert('Please enter a brand name');
        return;
    }
    
    const kit = {
        id: Date.now(),
        name,
        colors: [color1.value, color2.value, color3.value, color4.value],
        font: fontFamily.value
    };
    
    let kits = JSON.parse(localStorage.getItem('brandKits') || '[]');
    kits.push(kit);
    localStorage.setItem('brandKits', JSON.stringify(kits));
    
    brandName.value = '';
    displayBrandKits();
}

function displayBrandKits() {
    const kits = JSON.parse(localStorage.getItem('brandKits') || '[]');
    
    if (kits.length === 0) {
        brandKits.innerHTML = '<p class="empty">No brand kits saved yet</p>';
        return;
    }
    
    brandKits.innerHTML = kits.map(kit => `
        <div class="brand-kit-item">
            <div class="kit-header">
                <h3>${kit.name}</h3>
                <button onclick="deleteKit(${kit.id})" class="delete-btn">×</button>
            </div>
            <div class="kit-colors">
                ${kit.colors.map(c => `<div class="color-swatch" style="background: ${c}"></div>`).join('')}
            </div>
            <div class="kit-font">Font: ${kit.font}</div>
        </div>
    `).join('');
}

function deleteKit(id) {
    let kits = JSON.parse(localStorage.getItem('brandKits') || '[]');
    kits = kits.filter(k => k.id != id);
    localStorage.setItem('brandKits', JSON.stringify(kits));
    displayBrandKits();
}

saveBtn.addEventListener('click', saveBrandKit);
window.deleteKit = deleteKit;
displayBrandKits();

