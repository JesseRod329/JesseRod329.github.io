const imageInput = document.getElementById('imageInput');
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const preview = document.getElementById('preview');
const platformBtns = document.querySelectorAll('.platform-btn');

let selectedSize = null;
let currentImage = null;

platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        platformBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size.split('x').map(Number);
    });
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImage = event.target.result;
            preview.innerHTML = `<img src="${currentImage}" id="originalImage" style="max-width: 100%; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    }
});

function resizeImage() {
    if (!currentImage || !selectedSize) {
        alert('Please upload an image and select a platform');
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = selectedSize[0];
        canvas.height = selectedSize[1];
        
        // Smart cropping - center crop
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (img.width * scale - canvas.width) / 2;
        const y = (img.height * scale - canvas.height) / 2;
        
        ctx.drawImage(img, -x, -y, img.width * scale, img.height * scale);
        
        const resizedDataUrl = canvas.toDataURL('image/png');
        preview.innerHTML = `<img src="${resizedDataUrl}" style="max-width: 100%; border-radius: 8px;">`;
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `resized-${selectedSize[0]}x${selectedSize[1]}.png`;
            link.href = resizedDataUrl;
            link.click();
        };
    };
    img.src = currentImage;
}

resizeBtn.addEventListener('click', resizeImage);

