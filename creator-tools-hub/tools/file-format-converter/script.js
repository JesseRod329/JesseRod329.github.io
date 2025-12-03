const fileInput = document.getElementById('fileInput');
const targetFormat = document.getElementById('targetFormat');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const preview = document.getElementById('preview');

function convertFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload a file');
        return;
    }
    
    const format = targetFormat.value;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const mimeType = format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/webp';
                const dataUrl = canvas.toDataURL(mimeType);
                
                preview.innerHTML = `<img src="${dataUrl}" style="max-width: 100%; border-radius: 8px;">`;
                downloadBtn.style.display = 'block';
                
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `converted.${format}`;
                    link.href = dataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        } else {
            preview.innerHTML = `
                <div class="info-message">
                    <p>File conversion for ${format} format</p>
                    <p>Original: ${file.name}</p>
                    <p>Note: Full conversion requires server-side processing</p>
                </div>
            `;
        }
    };
    
    reader.readAsDataURL(file);
}

convertBtn.addEventListener('click', convertFile);

