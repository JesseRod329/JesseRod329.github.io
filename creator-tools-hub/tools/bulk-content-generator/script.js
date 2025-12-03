const baseContent = document.getElementById('baseContent');
const variationsInput = document.getElementById('variations');
const variationType = document.getElementById('variationType');
const generateBtn = document.getElementById('generateBtn');
const variationsList = document.getElementById('variationsList');

const variations = {
    headlines: ['Ultimate', 'Complete', 'Best', 'Top', 'Essential', 'Proven', 'Expert', 'Advanced'],
    descriptions: ['Discover', 'Learn', 'Master', 'Explore', 'Unlock', 'Transform', 'Elevate', 'Achieve'],
    cta: ['Get Started', 'Learn More', 'Try Now', 'Join Today', 'Start Free', 'Explore', 'Discover', 'Begin'],
    full: ['comprehensive', 'detailed', 'in-depth', 'complete', 'thorough', 'extensive', 'full', 'ultimate']
};

function generateVariations() {
    const content = baseContent.value.trim();
    const count = parseInt(variationsInput.value);
    const type = variationType.value;
    
    if (!content) {
        alert('Please enter base content');
        return;
    }
    
    const generated = [];
    const words = content.split(/\s+/);
    
    for (let i = 0; i < count; i++) {
        let variation = content;
        
        if (type === 'headlines') {
            const prefix = variations.headlines[i % variations.headlines.length];
            variation = `${prefix} ${content}`;
        } else if (type === 'descriptions') {
            const action = variations.descriptions[i % variations.descriptions.length];
            variation = `${action} ${content.toLowerCase()}`;
        } else if (type === 'cta') {
            variation = `${content} - ${variations.cta[i % variations.cta.length]}`;
        } else {
            const modifier = variations.full[i % variations.full.length];
            variation = `A ${modifier} guide to ${content.toLowerCase()}`;
        }
        
        generated.push(variation);
    }
    
    variationsList.innerHTML = generated.map((v, i) => `
        <div class="variation-item">
            <div class="variation-number">Variation ${i + 1}</div>
            <div class="variation-content">${v}</div>
            <button onclick="copyVariation(${i})" class="copy-btn">Copy</button>
        </div>
    `).join('');
    
    window.generatedVariations = generated;
}

function copyVariation(index) {
    navigator.clipboard.writeText(window.generatedVariations[index]).then(() => {
        alert('Copied to clipboard!');
    });
}

generateBtn.addEventListener('click', generateVariations);
window.copyVariation = copyVariation;

