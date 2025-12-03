const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const keywordsInput = document.getElementById('keywords');
const saveBtn = document.getElementById('saveBtn');
const preview = document.getElementById('preview');
const metadataDiv = document.getElementById('metadata');

function saveMetadata() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload an image');
        return;
    }
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(k => k);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 8px;">`;
        
        metadataDiv.innerHTML = `
            <div class="metadata-card">
                <h3>Metadata Information</h3>
                <div class="metadata-item">
                    <strong>Title:</strong> ${title || 'Not set'}
                </div>
                <div class="metadata-item">
                    <strong>Description:</strong> ${description || 'Not set'}
                </div>
                <div class="metadata-item">
                    <strong>Keywords:</strong> ${keywords.length > 0 ? keywords.join(', ') : 'Not set'}
                </div>
                <div class="metadata-item">
                    <strong>File Name:</strong> ${file.name}
                </div>
                <div class="metadata-item">
                    <strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB
                </div>
                <div class="metadata-item">
                    <strong>File Type:</strong> ${file.type}
                </div>
                <p class="note">Note: Full EXIF editing requires server-side processing</p>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

saveBtn.addEventListener('click', saveMetadata);

