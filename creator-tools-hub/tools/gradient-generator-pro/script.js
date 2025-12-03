const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const direction = document.getElementById('direction');
const animation = document.getElementById('animation');
const generateBtn = document.getElementById('generateBtn');
const gradientPreview = document.getElementById('gradientPreview');
const cssCode = document.getElementById('cssCode');
const copyBtn = document.getElementById('copyBtn');

function generateGradient() {
    const c1 = color1.value;
    const c2 = color2.value;
    const dir = direction.value;
    
    const gradient = `linear-gradient(${dir}, ${c1}, ${c2})`;
    gradientPreview.style.background = gradient;
    
    let css = `background: ${gradient};`;
    if (animation.value !== 'none') {
        css += `\nanimation: ${animation.value} 3s ease-in-out infinite;`;
    }
    
    cssCode.value = css;
    
    // Apply animation
    gradientPreview.className = `gradient-preview ${animation.value}`;
}

function copyCSS() {
    cssCode.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy CSS', 2000);
}

color1.addEventListener('input', generateGradient);
color2.addEventListener('input', generateGradient);
direction.addEventListener('change', generateGradient);
animation.addEventListener('change', generateGradient);
generateBtn.addEventListener('click', generateGradient);
copyBtn.addEventListener('click', copyCSS);

generateGradient();

