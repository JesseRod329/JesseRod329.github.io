const fileInput = document.getElementById('fileInput');
const qualityInput = document.getElementById('quality');
const optimizeBtn = document.getElementById('optimizeBtn');
const resultsDiv = document.getElementById('results');

function optimizeImages() {
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
        alert('Please select images');
        return;
    }
    
    const quality = parseInt(qualityInput.value) / 100;
    resultsDiv.innerHTML = '<p>Optimizing images...</p>';
    
    const optimized = [];
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
                const originalSize = file.size;
                const optimizedSize = Math.round(optimizedDataUrl.length * 0.75);
                const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
                
                optimized.push({
                    name: file.name,
                    originalSize,
                    optimizedSize,
                    savings,
                    dataUrl: optimizedDataUrl
                });
                
                if (optimized.length === files.length) {
                    displayResults(optimized);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function displayResults(optimized) {
    resultsDiv.innerHTML = optimized.map((img, i) => `
        <div class="result-item">
            <div class="result-info">
                <div class="result-name">${img.name}</div>
                <div class="result-stats">
                    <span>Original: ${(img.originalSize / 1024).toFixed(2)} KB</span>
                    <span>•</span>
                    <span>Optimized: ${(img.optimizedSize / 1024).toFixed(2)} KB</span>
                    <span>•</span>
                    <span class="savings">Saved: ${img.savings}%</span>
                </div>
            </div>
            <button onclick="downloadImage('${img.dataUrl}', '${img.name}')" class="btn-download">Download</button>
        </div>
    `).join('');
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = 'optimized_' + filename;
    link.href = dataUrl;
    link.click();
}

optimizeBtn.addEventListener('click', optimizeImages);
window.downloadImage = downloadImage;

