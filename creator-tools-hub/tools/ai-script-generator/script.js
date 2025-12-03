// AI Script Generator
const topicInput = document.getElementById('topic');
const platformSelect = document.getElementById('platform');
const lengthInput = document.getElementById('length');
const toneSelect = document.getElementById('tone');
const keyPointsInput = document.getElementById('keyPoints');
const generateBtn = document.getElementById('generateBtn');
const scriptOutput = document.getElementById('scriptOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statsDiv = document.getElementById('stats');

const platformConfigs = {
    youtube: { wordsPerMin: 150, hookLength: 15, outroLength: 20 },
    tiktok: { wordsPerMin: 200, hookLength: 5, outroLength: 5 },
    instagram: { wordsPerMin: 180, hookLength: 10, outroLength: 10 },
    podcast: { wordsPerMin: 140, hookLength: 30, outroLength: 30 },
    twitter: { wordsPerMin: 250, hookLength: 10, outroLength: 5 },
    linkedin: { wordsPerMin: 160, hookLength: 15, outroLength: 15 }
};

const toneStyles = {
    professional: { greeting: 'Welcome', transitions: ['Furthermore', 'Additionally', 'In conclusion'], emojis: false },
    casual: { greeting: 'Hey there', transitions: ['So', 'Also', 'Anyway'], emojis: true },
    humorous: { greeting: 'What\'s up', transitions: ['But wait', 'Plot twist', 'Here\'s the thing'], emojis: true },
    educational: { greeting: 'Today we\'ll explore', transitions: ['Let\'s examine', 'Consider this', 'To summarize'], emojis: false },
    inspirational: { greeting: 'Imagine', transitions: ['Remember', 'Think about', 'In the end'], emojis: true },
    conversational: { greeting: 'So', transitions: ['You know', 'I mean', 'Right?'], emojis: true }
};

function generateScript() {
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('Please enter a topic');
        return;
    }

    const platform = platformSelect.value;
    const length = parseInt(lengthInput.value);
    const tone = toneSelect.value;
    const keyPoints = keyPointsInput.value.split('\n').filter(p => p.trim()).map(p => p.trim());

    const config = platformConfigs[platform];
    const style = toneStyles[tone];
    const totalWords = config.wordsPerMin * length;
    
    // Generate script structure
    let script = generateScriptContent(topic, platform, tone, keyPoints, config, style, totalWords);
    
    // Display script
    scriptOutput.innerHTML = `<pre>${script}</pre>`;
    
    // Calculate stats
    const wordCount = script.split(/\s+/).length;
    const estimatedTime = (wordCount / config.wordsPerMin).toFixed(1);
    statsDiv.innerHTML = `
        <div class="stat-item"><strong>Words:</strong> ${wordCount}</div>
        <div class="stat-item"><strong>Estimated Time:</strong> ${estimatedTime} min</div>
        <div class="stat-item"><strong>Platform:</strong> ${platformSelect.options[platformSelect.selectedIndex].text}</div>
    `;
}

function generateScriptContent(topic, platform, tone, keyPoints, config, style, totalWords) {
    let script = '';
    
    // Hook
    const hooks = [
        `Have you ever wondered about ${topic}?`,
        `Today, I'm going to show you everything you need to know about ${topic}.`,
        `${topic} - it's simpler than you think.`,
        `Let me break down ${topic} in a way that actually makes sense.`,
        `If you're struggling with ${topic}, this is for you.`
    ];
    script += `[HOOK]\n${hooks[Math.floor(Math.random() * hooks.length)]}\n\n`;
    
    // Introduction
    script += `[INTRODUCTION]\n`;
    script += `${style.greeting}! ${style.emojis ? '👋 ' : ''}Today we're diving into ${topic}.\n\n`;
    
    // Main content
    script += `[MAIN CONTENT]\n`;
    if (keyPoints.length > 0) {
        keyPoints.forEach((point, index) => {
            script += `${index + 1}. ${point}\n`;
            script += generateParagraphForPoint(point, style, config.wordsPerMin / 3);
            script += '\n';
        });
    } else {
        // Generate default structure
        script += `Let's start by understanding the basics of ${topic}.\n\n`;
        script += `First, it's important to know that ${topic} involves several key components.\n\n`;
        script += `Here's what you need to understand: the fundamentals matter most.\n\n`;
    }
    
    // Transitions
    if (keyPoints.length > 1) {
        script += `[TRANSITION]\n`;
        script += `${style.transitions[Math.floor(Math.random() * style.transitions.length)]}, let's move on to the next point.\n\n`;
    }
    
    // Call to action
    script += `[CALL TO ACTION]\n`;
    const ctas = [
        `If you found this helpful, make sure to like and subscribe!`,
        `What are your thoughts on ${topic}? Let me know in the comments!`,
        `Try this out and let me know how it goes!`,
        `Share this with someone who needs to hear it!`
    ];
    script += ctas[Math.floor(Math.random() * ctas.length)] + (style.emojis ? ' 🎯' : '') + '\n\n';
    
    // Outro
    script += `[OUTRO]\n`;
    script += `That's a wrap on ${topic}! Thanks for watching, and I'll see you in the next one.`;
    if (style.emojis) script += ' ✨';
    
    return script;
}

function generateParagraphForPoint(point, style, targetWords) {
    const sentences = [
        `This is a crucial aspect because it directly impacts your results.`,
        `Understanding this will help you avoid common mistakes.`,
        `Many people overlook this, but it's actually essential.`,
        `Let me explain why this matters and how to implement it.`,
        `Here's the practical approach that works best.`
    ];
    
    let paragraph = sentences[Math.floor(Math.random() * sentences.length)];
    if (style.emojis && Math.random() > 0.5) {
        paragraph += ' 💡';
    }
    return paragraph + '\n';
}

function copyScript() {
    const text = scriptOutput.querySelector('pre')?.textContent || '';
    if (!text || text.includes('Your generated script')) {
        alert('No script to copy');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

function downloadScript() {
    const text = scriptOutput.querySelector('pre')?.textContent || '';
    if (!text || text.includes('Your generated script')) {
        alert('No script to download');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${topicInput.value.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

generateBtn.addEventListener('click', generateScript);
copyBtn.addEventListener('click', copyScript);
downloadBtn.addEventListener('click', downloadScript);

// Allow Enter key to generate
topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) generateScript();
});

