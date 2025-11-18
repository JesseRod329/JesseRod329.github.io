/**
 * Main Application Controller
 */

class SampleMixApp {
  constructor() {
    this.audioProcessor = new AudioProcessor();
    this.waveformRenderer = null;
    this.padController = null;
    this.currentFile = null;
    this.initializeElements();
    this.setupEventListeners();
  }

  async init() {
    const success = await this.audioProcessor.init();
    if (!success) {
      alert('Audio context initialization failed. Please refresh the page.');
      return;
    }

    this.waveformRenderer = new WaveformRenderer(
      document.getElementById('waveformCanvas'),
      document.getElementById('sliceMarkers')
    );

    this.padController = new PadController(this.audioProcessor.audioContext);
    this.padController.createPadGrid(document.getElementById('padsGrid'), 32);
  }

  initializeElements() {
    this.elements = {
      uploadArea: document.getElementById('uploadArea'),
      audioInput: document.getElementById('audioInput'),
      uploadSection: document.getElementById('uploadSection'),
      audioInfo: document.getElementById('audioInfo'),
      waveformSection: document.getElementById('waveformSection'),
      padsSection: document.getElementById('padsSection'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      loadingText: document.getElementById('loadingText'),
      fileName: document.getElementById('fileName'),
      duration: document.getElementById('duration'),
      sampleRate: document.getElementById('sampleRate'),
      sliceCount: document.getElementById('sliceCount'),
      autoChopBtn: document.getElementById('autoChopBtn'),
      clearSlicesBtn: document.getElementById('clearSlicesBtn'),
      sensitivitySlider: document.getElementById('sensitivitySlider'),
      sensitivityValue: document.getElementById('sensitivityValue'),
      minSliceLength: document.getElementById('minSliceLength'),
      minLengthValue: document.getElementById('minLengthValue'),
      masterVolume: document.getElementById('masterVolume'),
      masterVolumeValue: document.getElementById('masterVolumeValue'),
      clearPadsBtn: document.getElementById('clearPadsBtn')
    };
  }

  setupEventListeners() {
    // File upload
    this.elements.uploadArea.addEventListener('click', () => {
      this.elements.audioInput.click();
    });

    this.elements.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.elements.uploadArea.classList.add('dragover');
    });

    this.elements.uploadArea.addEventListener('dragleave', () => {
      this.elements.uploadArea.classList.remove('dragover');
    });

    this.elements.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.elements.uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0]);
      }
    });

    this.elements.audioInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });

    // Controls
    this.elements.autoChopBtn.addEventListener('click', () => this.autoChop());
    this.elements.clearSlicesBtn.addEventListener('click', () => this.clearSlices());
    this.elements.clearPadsBtn.addEventListener('click', () => this.padController?.clearAllPads());

    // Sliders
    this.elements.sensitivitySlider.addEventListener('input', (e) => {
      this.elements.sensitivityValue.textContent = e.target.value;
    });

    this.elements.minSliceLength.addEventListener('input', (e) => {
      this.elements.minLengthValue.textContent = e.target.value + 'ms';
    });

    this.elements.masterVolume.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.elements.masterVolumeValue.textContent = Math.round(volume * 100) + '%';
      this.padController?.setMasterVolume(volume);
    });
  }

  async handleFileUpload(file) {
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file (MP3, WAV, OGG, M4A)');
      return;
    }

    this.currentFile = file;
    this.showLoading('Decoding audio file...');

    try {
      const info = await this.audioProcessor.decodeAudioFile(file);
      
      // Update UI
      this.elements.fileName.textContent = file.name;
      this.elements.duration.textContent = this.formatTime(info.duration);
      this.elements.sampleRate.textContent = info.sampleRate + ' Hz';
      
      // Show sections
      this.elements.uploadSection.style.display = 'none';
      this.elements.audioInfo.style.display = 'grid';
      this.elements.waveformSection.style.display = 'block';
      this.elements.padsSection.style.display = 'block';

      // Render waveform
      this.showLoading('Generating waveform...');
      const waveformData = this.audioProcessor.getWaveformData(2000);
      this.waveformRenderer.setWaveformData(waveformData.map(d => ({
        max: d.max,
        avg: d.avg,
        duration: info.duration / waveformData.length
      })), info.duration);

      this.hideLoading();
    } catch (error) {
      this.hideLoading();
      alert('Error processing audio: ' + error.message);
    }
  }

  async autoChop() {
    if (!this.audioProcessor.audioBuffer) return;

    this.showLoading('Detecting beats and creating slices...');

    try {
      const sensitivity = parseFloat(this.elements.sensitivitySlider.value);
      const minLength = parseFloat(this.elements.minSliceLength.value) / 1000; // Convert to seconds

      // Detect beats
      const beatPositions = this.audioProcessor.detectBeats(sensitivity, minLength);
      
      // Convert sample positions to time positions
      const timePositions = beatPositions.map(pos => pos / this.audioProcessor.sampleRate);
      timePositions.push(this.audioProcessor.audioBuffer.duration);

      // Create slices
      const slices = this.audioProcessor.createSlices(beatPositions);
      
      // Update UI
      this.elements.sliceCount.textContent = slices.length;
      this.waveformRenderer.setSlicePositions(timePositions);

      // Assign to pads
      if (this.padController) {
        this.padController.autoAssignSamples(slices);
      }

      this.hideLoading();
    } catch (error) {
      this.hideLoading();
      alert('Error chopping audio: ' + error.message);
    }
  }

  clearSlices() {
    this.audioProcessor.clearSlices();
    const duration = this.audioProcessor.audioBuffer?.duration || 0;
    this.waveformRenderer.setSlicePositions(duration > 0 ? [0, duration] : []);
    this.elements.sliceCount.textContent = '0';
    this.padController?.clearAllPads();
  }

  showLoading(text = 'Processing...') {
    this.elements.loadingText.textContent = text;
    this.elements.loadingOverlay.style.display = 'flex';
  }

  hideLoading() {
    this.elements.loadingOverlay.style.display = 'none';
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    app = new SampleMixApp();
    await app.init();
  });
} else {
  app = new SampleMixApp();
  app.init();
}

