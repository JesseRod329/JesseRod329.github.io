const sourceContent = document.getElementById('sourceContent');
const sourcePlatform = document.getElementById('sourcePlatform');
const targetPlatform = document.getElementById('targetPlatform');
const repurposeBtn = document.getElementById('repurposeBtn');
const copyBtn = document.getElementById('copyBtn');
const output = document.getElementById('output');

const platformRules = {
    tiktok: { maxLength: 300, hookLength: 50, style: 'casual', emojis: true },
    instagram: { maxLength: 500, hookLength: 100, style: 'engaging', emojis: true },
    twitter: { maxLength: 280, hookLength: 50, style: 'conversational', emojis: true },
    linkedin: { maxLength: 1000, hookLength: 150, style: 'professional', emojis: false },
    'youtube-shorts': { maxLength: 200, hookLength: 60, style: 'energetic', emojis: true }
};

function repurposeContent() {
    const content = sourceContent.value.trim();
    if (!content) {
        alert('Please enter content to repurpose');
        return;
    }
    
    const target = targetPlatform.value;
    const rules = platformRules[target];
    const words = content.split(/\s+/);
    
    let repurposed = '';
    
    // Create hook
    const hookWords = words.slice(0, Math.min(15, words.length));
    repurposed += hookWords.join(' ') + (rules.emojis ? ' 🔥\n\n' : '\n\n');
    
    // Main content - adapt length
    const targetWords = Math.floor(rules.maxLength / 5); // Approximate word count
    const mainContent = words.slice(0, Math.min(targetWords, words.length)).join(' ');
    
    // Add platform-specific formatting
    if (target === 'twitter') {
        repurposed += mainContent + '\n\n';
        // Add thread markers if content is long
        if (words.length > 20) {
            repurposed += '🧵 Thread continues...';
        }
    } else if (target === 'instagram') {
        repurposed += mainContent + '\n\n';
        repurposed += rules.emojis ? '#content #creator #tips' : '';
    } else if (target === 'tiktok') {
        repurposed += mainContent + '\n\n';
        repurposed += rules.emojis ? '💡 #fyp #viral #tips' : '';
    } else {
        repurposed += mainContent;
    }
    
    output.textContent = repurposed;
}

function copyContent() {
    const text = output.textContent;
    if (!text) {
        alert('No content to copy');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

repurposeBtn.addEventListener('click', repurposeContent);
copyBtn.addEventListener('click', copyContent);

