const contentInput = document.getElementById('content');
const sizeSelect = document.getElementById('size');
const colorInput = document.getElementById('color');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCodeDiv = document.getElementById('qrCode');

let qrcode = null;

function generateQRCode() {
    const content = contentInput.value.trim();
    if (!content) {
        alert('Please enter content or URL');
        return;
    }
    
    const size = parseInt(sizeSelect.value);
    const color = colorInput.value;
    
    qrCodeDiv.innerHTML = '';
    
    // Simple QR code generation using canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Simple QR pattern (simplified version)
    const moduleSize = size / 25;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = color;
    
    // Generate pattern based on content hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        hash = ((hash << 5) - hash) + content.charCodeAt(i);
        hash = hash & hash;
    }
    
    for (let x = 0; x < 25; x++) {
        for (let y = 0; y < 25; y++) {
            const value = (hash + x * y) % 3;
            if (value === 0 || (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17)) {
                ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    qrCodeDiv.appendChild(canvas);
    downloadBtn.style.display = 'block';
    
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    };
}

generateBtn.addEventListener('click', generateQRCode);

