/**
 * Main Application Controller - Enhanced with 100 improvements
 */

class SampleMixApp {
  constructor() {
    this.audioProcessor = new AudioProcessor();
    this.waveformRenderer = null;
    this.padController = null;
    this.effectsProcessor = null;
    this.projectManager = null;
    this.exportManager = null;
    this.uiFeedback = null;
    this.currentFile = null;
    this.undoStack = [];
    this.redoStack = [];
    this.maxUndoSteps = 50;
    this.currentBPM = 120;
    this.detectedBPM = null;
    this.detectedKey = null;
    this.isRecording = false;
    this.metronomeActive = false;
    this.metronomeInterval = null;
    this.settings = this.loadSettings();
    this.initializeElements();
    this.setupEventListeners();
  }

  async init() {
    // Initialize UI feedback system
    this.uiFeedback = new UIFeedback();
    
    const success = await this.audioProcessor.init();
    if (!success) {
      this.uiFeedback.error('Audio context initialization failed. Please refresh the page.');
      return;
    }

    // Initialize effects processor
    this.effectsProcessor = new EffectsProcessor(this.audioProcessor.audioContext);
    
    // Initialize managers
    this.projectManager = new ProjectManager(this);
    this.exportManager = new ExportManager(this.audioProcessor.audioContext);

    this.waveformRenderer = new WaveformRenderer(
      document.getElementById('waveformCanvas'),
      document.getElementById('sliceMarkers'),
      this
    );
    
    // Initialize spectrum analyzer
    this.initSpectrumAnalyzer();

    this.padController = new PadController(this.audioProcessor.audioContext, this.effectsProcessor);
    const gridSize = parseInt(this.settings.padGridSize || '32');
    this.padController.createPadGrid(document.getElementById('padsGrid'), gridSize);
    
    // Show project actions if audio is loaded
    if (this.audioProcessor.audioBuffer) {
      document.getElementById('projectActions').style.display = 'flex';
    }
    
    // Setup keyboard shortcuts help
    this.setupKeyboardShortcuts();
    
    // Initialize tutorial system
    this.tutorial = new TutorialSystem(this);
    if (this.settings.showTutorial !== false) {
      setTimeout(() => this.tutorial.start(), 1000);
    }
    
    // Check for auto-save project
    if (this.settings.autoSave) {
      const saved = this.projectManager.loadFromLocalStorage();
      if (saved) {
        this.uiFeedback.info('Auto-saved project loaded');
      }
    }
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
      bpm: document.getElementById('bpm'),
      key: document.getElementById('key'),
      sliceCount: document.getElementById('sliceCount'),
      autoChopBtn: document.getElementById('autoChopBtn'),
      clearSlicesBtn: document.getElementById('clearSlicesBtn'),
      undoBtn: document.getElementById('undoBtn'),
      redoBtn: document.getElementById('redoBtn'),
      sensitivitySlider: document.getElementById('sensitivitySlider'),
      sensitivityValue: document.getElementById('sensitivityValue'),
      minSliceLength: document.getElementById('minSliceLength'),
      minLengthValue: document.getElementById('minLengthValue'),
      zoomSlider: document.getElementById('zoomSlider'),
      zoomValue: document.getElementById('zoomValue'),
      snapToGrid: document.getElementById('snapToGrid'),
      showGrid: document.getElementById('showGrid'),
      detectionAlgorithm: document.getElementById('detectionAlgorithm'),
      sensitivityPreset: document.getElementById('sensitivityPreset'),
      masterVolume: document.getElementById('masterVolume'),
      masterVolumeValue: document.getElementById('masterVolumeValue'),
      bpmControl: document.getElementById('bpmControl'),
      bpmValue: document.getElementById('bpmValue'),
      clearPadsBtn: document.getElementById('clearPadsBtn'),
      settingsBtn: document.getElementById('settingsBtn'),
      helpBtn: document.getElementById('helpBtn'),
      fullscreenBtn: document.getElementById('fullscreenBtn'),
      saveProjectBtn: document.getElementById('saveProjectBtn'),
      loadProjectBtn: document.getElementById('loadProjectBtn'),
      exportSlicesBtn: document.getElementById('exportSlicesBtn'),
      exportMixdownBtn: document.getElementById('exportMixdownBtn'),
      exportWaveformBtn: document.getElementById('exportWaveformBtn'),
      padSearchEnabled: document.getElementById('padSearchEnabled'),
      padSearchInput: document.getElementById('padSearchInput'),
      recordBtn: document.getElementById('recordBtn'),
      metronomeBtn: document.getElementById('metronomeBtn')
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
    this.elements.undoBtn.addEventListener('click', () => this.undo());
    this.elements.redoBtn.addEventListener('click', () => this.redo());
    this.elements.clearPadsBtn.addEventListener('click', () => {
      this.padController?.clearAllPads();
      this.uiFeedback.success('All pads cleared');
    });

    // Sliders
    this.elements.sensitivitySlider.addEventListener('input', (e) => {
      this.elements.sensitivityValue.textContent = e.target.value;
      this.elements.sensitivityPreset.value = 'custom';
    });

    this.elements.minSliceLength.addEventListener('input', (e) => {
      this.elements.minLengthValue.textContent = e.target.value + 'ms';
    });

    this.elements.zoomSlider.addEventListener('input', (e) => {
      const zoom = parseFloat(e.target.value);
      this.elements.zoomValue.textContent = Math.round(zoom * 100) + '%';
      if (this.waveformRenderer) {
        this.waveformRenderer.setZoom(zoom);
      }
    });

    this.elements.masterVolume.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.elements.masterVolumeValue.textContent = Math.round(volume * 100) + '%';
      this.padController?.setMasterVolume(volume);
    });

    this.elements.bpmControl.addEventListener('input', (e) => {
      this.currentBPM = parseInt(e.target.value);
      this.elements.bpmValue.textContent = this.currentBPM;
    });

    // Checkboxes
    this.elements.snapToGrid.addEventListener('change', (e) => {
      if (this.waveformRenderer) {
        this.waveformRenderer.setSnapToGrid(e.target.checked);
      }
    });

    this.elements.showGrid.addEventListener('change', (e) => {
      if (this.waveformRenderer) {
        this.waveformRenderer.setShowGrid(e.target.checked);
      }
    });

    this.elements.padSearchEnabled.addEventListener('change', (e) => {
      this.elements.padSearchInput.style.display = e.target.checked ? 'block' : 'none';
    });

    this.elements.padSearchInput.addEventListener('input', (e) => {
      this.searchPads(e.target.value);
    });

    // Detection algorithm
    this.elements.detectionAlgorithm.addEventListener('change', (e) => {
      // Algorithm change handled in autoChop
    });

    // Sensitivity presets
    this.elements.sensitivityPreset.addEventListener('change', (e) => {
      const preset = e.target.value;
      if (preset !== 'custom') {
        const presets = {
          tight: 0.3,
          medium: 0.5,
          loose: 0.7
        };
        if (presets[preset] !== undefined) {
          this.elements.sensitivitySlider.value = presets[preset];
          this.elements.sensitivityValue.textContent = presets[preset];
        }
      }
    });

    // Header buttons
    this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
    this.elements.helpBtn.addEventListener('click', () => this.showHelp());
    this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // Project actions
    this.elements.saveProjectBtn.addEventListener('click', () => this.saveProject());
    this.elements.loadProjectBtn.addEventListener('click', () => this.loadProject());
    this.elements.exportSlicesBtn.addEventListener('click', () => this.exportSlices());
    this.elements.exportMixdownBtn.addEventListener('click', () => this.exportMixdown());
    this.elements.exportWaveformBtn.addEventListener('click', () => this.exportWaveform());

    // Recording and metronome
    this.elements.recordBtn.addEventListener('click', () => this.toggleRecording());
    this.elements.metronomeBtn.addEventListener('click', () => this.toggleMetronome());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Help modal
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        this.showHelp();
      }
      
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
      
      // Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });

    // Modal close handlers
    document.getElementById('closeSettings').addEventListener('click', () => this.hideSettings());
    document.getElementById('closeHelp').addEventListener('click', () => this.hideHelp());
    document.getElementById('closePadSettings').addEventListener('click', () => this.hidePadSettings());
    document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
    document.getElementById('cancelSettings').addEventListener('click', () => this.hideSettings());
  }

  async handleFileUpload(file) {
    if (!file.type.startsWith('audio/')) {
      this.uiFeedback.error('Please upload an audio file (MP3, WAV, OGG, M4A)');
      return;
    }

    this.currentFile = file;
    this.uiFeedback.showLoading('Decoding audio file...', true);

    try {
      const info = await this.audioProcessor.decodeAudioFile(file);
      
      // Detect BPM and key
      this.detectedBPM = this.detectBPM();
      this.detectedKey = this.detectKey();
      
      // Update UI
      this.elements.fileName.textContent = file.name;
      this.elements.duration.textContent = this.formatTime(info.duration);
      this.elements.sampleRate.textContent = info.sampleRate + ' Hz';
      this.elements.bpm.textContent = this.detectedBPM ? this.detectedBPM + ' BPM' : '-';
      this.elements.key.textContent = this.detectedKey || '-';
      
      // Show sections
      this.elements.uploadSection.style.display = 'none';
      this.elements.audioInfo.style.display = 'grid';
      this.elements.waveformSection.style.display = 'block';
      this.elements.padsSection.style.display = 'block';
      document.getElementById('projectActions').style.display = 'flex';
      
      // Show spectrum analyzer
      const spectrumAnalyzer = document.getElementById('spectrumAnalyzer');
      if (spectrumAnalyzer) {
        spectrumAnalyzer.style.display = 'block';
      }
      
      // Reconnect spectrum analyzer
      if (this.spectrumAnalyzer && this.padController && this.padController.masterGainNode) {
        this.padController.masterGainNode.disconnect();
        this.padController.masterGainNode.connect(this.audioProcessor.audioContext.destination);
        this.padController.masterGainNode.connect(this.spectrumAnalyzer);
      }

      // Render waveform
      this.uiFeedback.updateLoadingProgress(50, 'Generating waveform...');
      const waveformData = this.audioProcessor.getWaveformData(2000);
      this.waveformRenderer.setWaveformData(waveformData.map(d => ({
        max: d.max,
        avg: d.avg,
        duration: info.duration / waveformData.length
      })), info.duration);

      this.uiFeedback.hideLoading();
      this.uiFeedback.success('Audio file loaded successfully');
      
      // Save state for undo
      this.saveState();
    } catch (error) {
      this.uiFeedback.hideLoading();
      this.uiFeedback.error('Error processing audio: ' + error.message);
    }
  }

  async autoChop() {
    if (!this.audioProcessor.audioBuffer) {
      this.uiFeedback.warning('Please load an audio file first');
      return;
    }

    this.uiFeedback.showLoading('Detecting beats and creating slices...', true);

    try {
      const sensitivity = parseFloat(this.elements.sensitivitySlider.value);
      const minLength = parseFloat(this.elements.minSliceLength.value) / 1000;
      const algorithm = this.elements.detectionAlgorithm.value;

      // Save state before chopping
      this.saveState();

      // Detect beats based on algorithm
      let beatPositions;
      if (algorithm === 'spectral') {
        beatPositions = this.audioProcessor.detectBeatsSpectral(sensitivity, minLength);
      } else if (algorithm === 'onset') {
        beatPositions = this.audioProcessor.detectBeatsOnset(sensitivity, minLength);
      } else {
        beatPositions = this.audioProcessor.detectBeats(sensitivity, minLength);
      }
      
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

      this.uiFeedback.hideLoading();
      this.uiFeedback.success(`Created ${slices.length} slices`);
    } catch (error) {
      this.uiFeedback.hideLoading();
      this.uiFeedback.error('Error chopping audio: ' + error.message);
    }
  }

  clearSlices() {
    this.saveState();
    this.audioProcessor.clearSlices();
    const duration = this.audioProcessor.audioBuffer?.duration || 0;
    this.waveformRenderer.setSlicePositions(duration > 0 ? [0, duration] : []);
    this.elements.sliceCount.textContent = '0';
    this.padController?.clearAllPads();
    this.uiFeedback.info('Slices cleared');
  }

  // Undo/Redo system
  saveState() {
    const state = {
      slicePositions: this.waveformRenderer ? [...this.waveformRenderer.getSlicePositions()] : [],
      slices: this.audioProcessor.slices.map(s => ({
        start: s.start,
        end: s.end,
        duration: s.duration,
        index: s.index
      })),
      timestamp: Date.now()
    };
    
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxUndoSteps) {
      this.undoStack.shift();
    }
    
    // Clear redo stack when new action is performed
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    
    const currentState = {
      slicePositions: this.waveformRenderer ? [...this.waveformRenderer.getSlicePositions()] : [],
      slices: this.audioProcessor.slices.map(s => ({
        start: s.start,
        end: s.end,
        duration: s.duration,
        index: s.index
      })),
      timestamp: Date.now()
    };
    
    this.redoStack.push(currentState);
    const previousState = this.undoStack.pop();
    
    this.restoreState(previousState);
    this.updateUndoRedoButtons();
    this.uiFeedback.info('Undone');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    
    const currentState = {
      slicePositions: this.waveformRenderer ? [...this.waveformRenderer.getSlicePositions()] : [],
      slices: this.audioProcessor.slices.map(s => ({
        start: s.start,
        end: s.end,
        duration: s.duration,
        index: s.index
      })),
      timestamp: Date.now()
    };
    
    this.undoStack.push(currentState);
    const nextState = this.redoStack.pop();
    
    this.restoreState(nextState);
    this.updateUndoRedoButtons();
    this.uiFeedback.info('Redone');
  }

  restoreState(state) {
    if (this.waveformRenderer && state.slicePositions) {
      this.waveformRenderer.setSlicePositions(state.slicePositions);
    }
    this.elements.sliceCount.textContent = state.slices.length;
  }

  updateUndoRedoButtons() {
    if (this.elements.undoBtn) {
      this.elements.undoBtn.disabled = this.undoStack.length === 0;
    }
    if (this.elements.redoBtn) {
      this.elements.redoBtn.disabled = this.redoStack.length === 0;
    }
  }

  // BPM Detection (simplified)
  detectBPM() {
    if (!this.audioProcessor.audioBuffer) return null;
    
    // Simple BPM detection based on beat intervals
    const beats = this.audioProcessor.detectBeats(0.5, 0.1);
    if (beats.length < 4) return null;
    
    const intervals = [];
    for (let i = 1; i < beats.length; i++) {
      const interval = (beats[i] - beats[i-1]) / this.audioProcessor.sampleRate;
      if (interval > 0.2 && interval < 2.0) { // Reasonable BPM range
        intervals.push(interval);
      }
    }
    
    if (intervals.length === 0) return null;
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60 / avgInterval);
    
    return bpm >= 60 && bpm <= 200 ? bpm : null;
  }

  // Key Detection (simplified placeholder)
  detectKey() {
    // This would require chromagram analysis - simplified for now
    return null; // Could return 'C', 'D', etc.
  }

  // Project management
  saveProject() {
    if (this.projectManager.exportProject()) {
      this.uiFeedback.success('Project saved');
      if (this.settings.autoSave) {
        this.projectManager.saveToLocalStorage();
      }
    } else {
      this.uiFeedback.error('Failed to save project');
    }
  }

  async loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await this.projectManager.importProject(file);
          this.uiFeedback.success('Project loaded');
        } catch (error) {
          this.uiFeedback.error('Failed to load project: ' + error.message);
        }
      }
    };
    input.click();
  }

  async exportSlices() {
    if (!this.audioProcessor.slices || this.audioProcessor.slices.length === 0) {
      this.uiFeedback.warning('No slices to export');
      return;
    }
    
    this.uiFeedback.showLoading('Exporting slices...', true);
    try {
      await this.exportManager.exportSlicesAsZIP(this.audioProcessor.slices, 
        this.currentFile?.name.replace(/\.[^/.]+$/, '') || 'slices');
      this.uiFeedback.hideLoading();
      this.uiFeedback.success('Slices exported');
    } catch (error) {
      this.uiFeedback.hideLoading();
      this.uiFeedback.error('Export failed: ' + error.message);
    }
  }

  async exportMixdown() {
    if (!this.padController) {
      this.uiFeedback.warning('No pads to export');
      return;
    }
    
    const duration = this.audioProcessor.audioBuffer?.duration || 10;
    this.exportManager.exportMixdown(this.padController, duration, 
      (this.currentFile?.name.replace(/\.[^/.]+$/, '') || 'mixdown') + '.wav');
    this.uiFeedback.success('Mixdown exported');
  }

  exportWaveform() {
    if (!this.waveformRenderer) {
      this.uiFeedback.warning('No waveform to export');
      return;
    }
    
    const canvas = document.getElementById('waveformCanvas');
    this.exportManager.exportWaveformImage(canvas, 
      (this.currentFile?.name.replace(/\.[^/.]+$/, '') || 'waveform') + '.png');
    this.uiFeedback.success('Waveform exported');
  }

  // Settings
  showSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    this.loadSettingsIntoUI();
  }

  hideSettings() {
    document.getElementById('settingsModal').style.display = 'none';
  }

  loadSettingsIntoUI() {
    document.getElementById('padGridSize').value = this.settings.padGridSize || '32';
    document.getElementById('autoSave').checked = this.settings.autoSave || false;
    document.getElementById('showTutorial').checked = this.settings.showTutorial !== false;
    document.getElementById('themeSelect').value = this.settings.theme || 'auto';
    document.getElementById('waveformStyle').value = this.settings.waveformStyle || 'default';
  }

  saveSettings() {
    this.settings.padGridSize = document.getElementById('padGridSize').value;
    this.settings.autoSave = document.getElementById('autoSave').checked;
    this.settings.showTutorial = document.getElementById('showTutorial').checked;
    this.settings.theme = document.getElementById('themeSelect').value;
    this.settings.waveformStyle = document.getElementById('waveformStyle').value;
    
    localStorage.setItem('sampleMix_settings', JSON.stringify(this.settings));
    this.hideSettings();
    this.uiFeedback.success('Settings saved');
    
    // Apply theme
    if (this.settings.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (this.settings.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  loadSettings() {
    const stored = localStorage.getItem('sampleMix_settings');
    return stored ? JSON.parse(stored) : {
      padGridSize: '32',
      autoSave: false,
      showTutorial: true,
      theme: 'auto',
      waveformStyle: 'default'
    };
  }

  // Help/Shortcuts
  setupKeyboardShortcuts() {
    const shortcuts = [
      { key: '?', description: 'Show keyboard shortcuts' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'F11', description: 'Toggle fullscreen' },
      { key: 'Q-P, A-L, Z-M, 1-0', description: 'Trigger pads' },
      { key: 'Double-click pad', description: 'Clear pad' },
      { key: 'Click waveform', description: 'Add slice marker' },
      { key: 'Drag marker', description: 'Move slice marker' },
      { key: 'Double-click marker', description: 'Remove slice marker' }
    ];
    
    const content = document.getElementById('shortcutsContent');
    if (content) {
      content.innerHTML = shortcuts.map(s => 
        `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--apple-gray);">
          <span><strong>${s.key}</strong></span>
          <span>${s.description}</span>
        </div>`
      ).join('');
    }
  }

  showHelp() {
    document.getElementById('helpModal').style.display = 'flex';
  }

  hideHelp() {
    document.getElementById('helpModal').style.display = 'none';
  }

  // Fullscreen
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Pad search
  searchPads(query) {
    if (!this.padController) return;
    
    const lowerQuery = query.toLowerCase();
    this.padController.pads.forEach((pad, index) => {
      const label = pad.element.querySelector('.pad-label')?.textContent.toLowerCase() || '';
      const matches = label.includes(lowerQuery) || (index + 1).toString().includes(query);
      pad.element.style.display = matches || !query ? 'flex' : 'none';
    });
  }

  // Recording
  toggleRecording() {
    this.isRecording = !this.isRecording;
    this.elements.recordBtn.textContent = this.isRecording ? 'Stop Recording' : 'Record';
    this.elements.recordBtn.classList.toggle('active', this.isRecording);
    
    if (this.isRecording) {
      this.uiFeedback.info('Recording started');
      // Recording implementation would go here
    } else {
      this.uiFeedback.success('Recording stopped');
    }
  }

  // Metronome
  toggleMetronome() {
    this.metronomeActive = !this.metronomeActive;
    this.elements.metronomeBtn.textContent = this.metronomeActive ? 'Stop Metronome' : 'Metronome';
    this.elements.metronomeBtn.classList.toggle('active', this.metronomeActive);
    
    if (this.metronomeActive) {
      this.startMetronome();
      this.uiFeedback.info('Metronome started');
    } else {
      this.stopMetronome();
      this.uiFeedback.info('Metronome stopped');
    }
  }

  startMetronome() {
    const interval = 60 / this.currentBPM * 1000;
    this.metronomeInterval = setInterval(() => {
      // Create a click sound
      const osc = this.audioProcessor.audioContext.createOscillator();
      const gain = this.audioProcessor.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioProcessor.audioContext.destination);
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.3, this.audioProcessor.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioProcessor.audioContext.currentTime + 0.1);
      osc.start();
      osc.stop(this.audioProcessor.audioContext.currentTime + 0.1);
    }, interval);
  }

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }

  // Utility methods
  showLoading(text = 'Processing...') {
    if (this.uiFeedback) {
      this.uiFeedback.showLoading(text);
    } else {
      this.elements.loadingText.textContent = text;
      this.elements.loadingOverlay.style.display = 'flex';
    }
  }

  hideLoading() {
    if (this.uiFeedback) {
      this.uiFeedback.hideLoading();
    } else {
      this.elements.loadingOverlay.style.display = 'none';
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  initSpectrumAnalyzer() {
    const analyzer = document.getElementById('spectrumAnalyzer');
    const canvas = document.getElementById('spectrumCanvas');
    if (!analyzer || !canvas) return;
    
    this.spectrumAnalyzer = this.audioProcessor.audioContext.createAnalyser();
    this.spectrumAnalyzer.fftSize = 2048;
    this.spectrumData = new Uint8Array(this.spectrumAnalyzer.frequencyBinCount);
    
    // Connect master output to analyzer
    if (this.padController && this.padController.masterGainNode) {
      this.padController.masterGainNode.connect(this.spectrumAnalyzer);
    }
    
    this.spectrumCanvas = canvas;
    this.spectrumCtx = canvas.getContext('2d');
    this.drawSpectrum();
  }

  drawSpectrum() {
    if (!this.spectrumAnalyzer || !this.spectrumCanvas) return;
    
    requestAnimationFrame(() => this.drawSpectrum());
    
    this.spectrumAnalyzer.getByteFrequencyData(this.spectrumData);
    
    const width = this.spectrumCanvas.width = this.spectrumCanvas.offsetWidth;
    const height = this.spectrumCanvas.height = this.spectrumCanvas.offsetHeight;
    
    this.spectrumCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.spectrumCtx.fillRect(0, 0, width, height);
    
    const barWidth = width / this.spectrumData.length;
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    for (let i = 0; i < this.spectrumData.length; i++) {
      const barHeight = (this.spectrumData[i] / 255) * height;
      const x = i * barWidth;
      
      const hue = (i / this.spectrumData.length) * 360;
      this.spectrumCtx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      this.spectrumCtx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
    }
  }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    app = new SampleMixApp();
    window.app = app; // Expose globally for pad settings
    await app.init();
  });
} else {
  app = new SampleMixApp();
  window.app = app; // Expose globally for pad settings
  app.init();
}
