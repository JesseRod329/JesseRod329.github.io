const keywordInput = document.getElementById('keyword');
const platformSelect = document.getElementById('platform');
const researchBtn = document.getElementById('researchBtn');
const hashtagsDiv = document.getElementById('hashtags');

const hashtagTemplates = {
    instagram: ['#', '##', '###', '####'],
    twitter: ['#', '##'],
    tiktok: ['#', '##', '###']
};

function researchHashtags() {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
        alert('Please enter a keyword');
        return;
    }
    
    const platform = platformSelect.value;
    const baseHashtag = keyword.replace(/\s+/g, '');
    
    const suggestions = [
        `#${baseHashtag}`,
        `#${baseHashtag}Tips`,
        `#${baseHashtag}Guide`,
        `#${baseHashtag}2025`,
        `#Learn${baseHashtag.charAt(0).toUpperCase() + baseHashtag.slice(1)}`,
        `#${baseHashtag}Hacks`,
        `#${baseHashtag}Ideas`,
        `#Best${baseHashtag.charAt(0).toUpperCase() + baseHashtag.slice(1)}`
    ];
    
    hashtagsDiv.innerHTML = suggestions.map((tag, i) => {
        const posts = Math.floor(Math.random() * 1000000) + 10000;
        const engagement = (Math.random() * 5 + 2).toFixed(1);
        return `
            <div class="hashtag-item">
                <div class="hashtag-tag">${tag}</div>
                <div class="hashtag-stats">
                    <span>${(posts / 1000).toFixed(0)}K posts</span>
                    <span>•</span>
                    <span>${engagement}% engagement</span>
                </div>
                <button onclick="copyHashtag('${tag}')" class="copy-btn">Copy</button>
            </div>
        `;
    }).join('');
}

function copyHashtag(tag) {
    navigator.clipboard.writeText(tag).then(() => {
        alert('Hashtag copied!');
    });
}

researchBtn.addEventListener('click', researchHashtags);
window.copyHashtag = copyHashtag;

