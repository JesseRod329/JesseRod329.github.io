// Smart Template Generator
const contentTypeSelect = document.getElementById('contentType');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const colorSchemeSelect = document.getElementById('colorScheme');
const styleSelect = document.getElementById('style');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('templateCanvas');
const ctx = canvas.getContext('2d');

const colorSchemes = {
    vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    minimal: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#424242'],
    dark: ['#1A1A1A', '#2D2D2D', '#404040', '#5C5C5C', '#FFFFFF'],
    pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA'],
    professional: ['#2C3E50', '#34495E', '#3498DB', '#E74C3C', '#FFFFFF']
};

const dimensions = {
    'social-post': { width: 1080, height: 1080 },
    'youtube-thumbnail': { width: 1280, height: 720 },
    'blog-header': { width: 1200, height: 600 },
    'presentation': { width: 1920, height: 1080 },
    'infographic': { width: 1200, height: 1600 },
    'quote-card': { width: 1080, height: 1080 },
    'announcement': { width: 1200, height: 630 },
    'promotion': { width: 1920, height: 400 }
};

function generateTemplate() {
    const contentType = contentTypeSelect.value;
    const title = titleInput.value.trim() || 'Your Title Here';
    const subtitle = subtitleInput.value.trim();
    const colorScheme = colorSchemes[colorSchemeSelect.value];
    const style = styleSelect.value;
    const dims = dimensions[contentType];

    canvas.width = dims.width;
    canvas.height = dims.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground(colorScheme, style);

    // Draw content based on type
    switch(contentType) {
        case 'social-post':
        case 'quote-card':
            drawCenteredContent(title, subtitle, colorScheme, style);
            break;
        case 'youtube-thumbnail':
            drawThumbnailLayout(title, subtitle, colorScheme, style);
            break;
        case 'blog-header':
            drawBlogHeader(title, subtitle, colorScheme, style);
            break;
        case 'presentation':
            drawPresentationSlide(title, subtitle, colorScheme, style);
            break;
        case 'infographic':
            drawInfographicLayout(title, subtitle, colorScheme, style);
            break;
        case 'announcement':
            drawAnnouncement(title, subtitle, colorScheme, style);
            break;
        case 'promotion':
            drawPromotionBanner(title, subtitle, colorScheme, style);
            break;
    }
}

function drawBackground(colors, style) {
    if (style === 'minimal') {
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1] || colors[0]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawCenteredContent(title, subtitle, colors, style) {
    ctx.fillStyle = style === 'dark' ? colors[4] || '#FFFFFF' : colors[3] || '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.font = `bold ${canvas.width / 15}px Arial`;
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - (subtitle ? 40 : 0));

    // Subtitle
    if (subtitle) {
        ctx.font = `${canvas.width / 25}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);
    }
}

function drawThumbnailLayout(title, subtitle, colors, style) {
    // Background pattern
    drawBackground(colors, style);
    
    // Title box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(50, canvas.height - 200, canvas.width - 100, 120);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(title, 70, canvas.height - 150);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 30}px Arial`;
        ctx.fillText(subtitle, 70, canvas.height - 110);
    }
}

function drawBlogHeader(title, subtitle, colors, style) {
    drawBackground(colors, style);
    
    ctx.fillStyle = style === 'dark' ? '#FFFFFF' : '#000000';
    ctx.textAlign = 'left';
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.fillText(title, 80, canvas.height / 2 - 30);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 30}px Arial`;
        ctx.fillText(subtitle, 80, canvas.height / 2 + 30);
    }
}

function drawPresentationSlide(title, subtitle, colors, style) {
    drawBackground(colors, style);
    
    ctx.fillStyle = style === 'dark' ? '#FFFFFF' : '#000000';
    ctx.textAlign = 'center';
    ctx.font = `bold ${canvas.width / 25}px Arial`;
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 35}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);
    }
}

function drawInfographicLayout(title, subtitle, colors, style) {
    drawBackground(colors, style);
    
    // Header section
    ctx.fillStyle = colors[2] || colors[0];
    ctx.fillRect(0, 0, canvas.width, 200);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = `bold ${canvas.width / 25}px Arial`;
    ctx.fillText(title, canvas.width / 2, 100);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 35}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, 150);
    }
}

function drawAnnouncement(title, subtitle, colors, style) {
    drawBackground(colors, style);
    
    ctx.fillStyle = style === 'dark' ? '#FFFFFF' : '#000000';
    ctx.textAlign = 'center';
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 30}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);
    }
}

function drawPromotionBanner(title, subtitle, colors, style) {
    drawBackground(colors, style);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = `bold ${canvas.width / 25}px Arial`;
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);
    
    if (subtitle) {
        ctx.font = `${canvas.width / 40}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);
    }
}

function downloadTemplate() {
    const link = document.createElement('a');
    link.download = `template-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

generateBtn.addEventListener('click', generateTemplate);
downloadBtn.addEventListener('click', downloadTemplate);

// Generate on load with defaults
window.addEventListener('load', () => {
    titleInput.value = 'Sample Title';
    subtitleInput.value = 'Sample Subtitle';
    generateTemplate();
});

