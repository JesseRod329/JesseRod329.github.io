const videoInput = document.getElementById('videoInput');
const quality = document.getElementById('quality');
const optimizeBtn = document.getElementById('optimizeBtn');
const info = document.getElementById('info');
const preview = document.getElementById('preview');

function optimizeVideo() {
    const file = videoInput.files[0];
    if (!file) {
        alert('Please upload a video');
        return;
    }
    
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const qualityLevel = quality.value;
    
    let estimatedSize = fileSizeMB;
    let compression = 0;
    
    if (qualityLevel === 'high') {
        compression = 20;
        estimatedSize = (fileSizeMB * 0.8).toFixed(2);
    } else if (qualityLevel === 'medium') {
        compression = 40;
        estimatedSize = (fileSizeMB * 0.6).toFixed(2);
    } else {
        compression = 60;
        estimatedSize = (fileSizeMB * 0.4).toFixed(2);
    }
    
    info.innerHTML = `
        <div class="info-card">
            <div class="info-item">
                <strong>Original Size:</strong> ${fileSizeMB} MB
            </div>
            <div class="info-item">
                <strong>Estimated Size:</strong> ${estimatedSize} MB
            </div>
            <div class="info-item">
                <strong>Compression:</strong> ${compression}%
            </div>
            <div class="info-item">
                <strong>Quality:</strong> ${qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1)}
            </div>
        </div>
    `;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `
            <video controls style="width: 100%; border-radius: 8px;">
                <source src="${e.target.result}" type="${file.type}">
            </video>
            <p style="text-align: center; margin-top: 10px; color: #666;">
                Note: Actual compression requires server-side processing. This is a preview.
            </p>
        `;
    };
    reader.readAsDataURL(file);
}

optimizeBtn.addEventListener('click', optimizeVideo);

