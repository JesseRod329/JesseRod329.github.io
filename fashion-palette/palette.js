import ColorThief from 'https://unpkg.com/colorthief@2.4.0/dist/color-thief.mjs';

class PaletteGenerator {
    constructor() {
        this.colorThief = new ColorThief();
        this.imageUpload = document.getElementById('imageUpload');
        this.uploadSection = document.getElementById('upload-section');
        this.imageDisplay = document.getElementById('imageDisplay');
        this.generatePaletteBtn = document.getElementById('generatePaletteBtn');
        this.paletteGrid = document.getElementById('paletteGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.message = document.getElementById('message');
        this.uploadedImage = null;

        this.addEventListeners();
    }

    addEventListeners() {
        this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
        this.generatePaletteBtn.addEventListener('click', this.extractPalette.bind(this));

        // Drag and drop functionality
        this.uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadSection.classList.add('drag-over');
        });

        this.uploadSection.addEventListener('dragleave', () => {
            this.uploadSection.classList.remove('drag-over');
        });

        this.uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadSection.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.imageUpload.files = files;
                this.handleImageUpload();
            }
        });
    }

    handleImageUpload() {
        const file = this.imageUpload.files[0];
        if (file) {
            this.message.textContent = '';
            this.paletteGrid.innerHTML = '';
            const reader = new FileReader();

            reader.onload = (e) => {
                this.uploadedImage = new Image();
                this.uploadedImage.onload = () => {
                    this.imageDisplay.innerHTML = '';
                    this.imageDisplay.appendChild(this.uploadedImage);
                    this.generatePaletteBtn.style.display = 'block'; // Show generate button after image upload
                };
                this.uploadedImage.onerror = () => {
                    this.message.textContent = 'Error loading image.';
                    this.generatePaletteBtn.style.display = 'none';
                };
                this.uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async extractPalette() {
        if (!this.uploadedImage) {
            this.message.textContent = 'Please upload an image first.';
            return;
        }

        this.loadingSpinner.style.display = 'block';
        this.message.textContent = 'Extracting palette...';
        this.paletteGrid.innerHTML = '';

        try {
            // Use a smaller image for ColorThief to prevent CORS issues and improve performance
            // For a real application, consider a backend proxy or proper CORS setup
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = this.uploadedImage;

            const MAX_SIZE = 300; // Max width/height for processing
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const resizedImage = new Image();
            resizedImage.src = canvas.toDataURL();

            resizedImage.onload = async () => {
                const colorPalette = await this.colorThief.getPalette(resizedImage, 8); // Get 8 colors
                this.displayPalette(colorPalette);
                this.message.textContent = 'Palette generated!';
            };

        } catch (error) {
            console.error('Error extracting palette:', error);
            this.message.textContent = 'Error: Could not extract palette. Please try another image.';
        } finally {
            this.loadingSpinner.style.display = 'none';
        }
    }

    displayPalette(colorPalette) {
        this.paletteGrid.innerHTML = '';
        colorPalette.forEach(color => {
            const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            const hex = this.rgbToHex(color[0], color[1], color[2]);

            const colorSwatch = document.createElement('div');
            colorSwatch.classList.add('color-swatch');
            colorSwatch.style.backgroundColor = rgb;
            colorSwatch.title = `Click to copy: ${hex}`;
            colorSwatch.innerHTML = `<span>${hex}</span>`;

            colorSwatch.addEventListener('click', () => this.copyToClipboard(hex));
            this.paletteGrid.appendChild(colorSwatch);
        });
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.message.textContent = `${text} copied to clipboard!`;
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.message.textContent = 'Failed to copy color.';
        });
    }
}

new PaletteGenerator();