/**
 * Waveform Visualization - Enhanced with zoom, playhead, grid, minimap, etc.
 */

class WaveformRenderer {
  constructor(canvas, markersContainer, app = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.markersContainer = markersContainer;
    this.app = app;
    this.waveformData = null;
    this.totalDuration = 0;
    this.slicePositions = [];
    this.width = 0;
    this.height = 0;
    this.pixelRatio = window.devicePixelRatio || 1;
    this.zoom = 1;
    this.scrollX = 0;
    this.snapToGrid = false;
    this.showGrid = false;
    this.playheadPosition = null;
    this.hoverTime = null;
    this.selectedSlices = new Set();
    
    this.setupCanvas();
    this.setupEventListeners();
    this.setupMinimap();
  }

  setupCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    this.draw();
    this.updateMinimap();
  }

  setupEventListeners() {
    let isDragging = false;
    let dragMarker = null;
    let isPanning = false;
    let lastPanX = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickPos = this.sampleToTime(x);

      // Check if clicking near a marker
      const marker = this.findNearestMarker(clickPos);
      if (marker && Math.abs(marker - clickPos) < 0.05) {
        isDragging = true;
        dragMarker = marker;
      } else if (e.shiftKey) {
        // Multi-select
        this.toggleSliceSelection(clickPos);
      } else if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
        // Middle mouse or Ctrl+Left = pan
        isPanning = true;
        lastPanX = e.clientX;
      } else {
        // Add new marker
        if (this.snapToGrid) {
          clickPos = this.snapToBeatGrid(clickPos);
        }
        this.addSliceMarker(clickPos);
        if (this.app) this.app.saveState();
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const time = this.sampleToTime(x);
      
      // Update hover time display
      this.hoverTime = time;
      this.updateTimeDisplay(x, time);
      
      if (isDragging && dragMarker !== null) {
        let newPos = time;
        if (this.snapToGrid) {
          newPos = this.snapToBeatGrid(time);
        }
        this.updateSliceMarker(dragMarker, newPos);
        dragMarker = newPos;
      } else if (isPanning) {
        const deltaX = e.clientX - lastPanX;
        this.scrollX -= deltaX / this.zoom;
        this.scrollX = Math.max(0, Math.min(this.scrollX, this.getMaxScroll()));
        lastPanX = e.clientX;
        this.draw();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
      dragMarker = null;
      isPanning = false;
      if (this.app && isDragging) this.app.saveState();
    });

    this.canvas.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.setZoom(this.zoom * delta, mouseX);
      } else {
        e.preventDefault();
        this.scrollX += e.deltaY;
        this.scrollX = Math.max(0, Math.min(this.scrollX, this.getMaxScroll()));
        this.draw();
      }
    });

    // Double click to remove marker
    this.canvas.addEventListener('dblclick', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickPos = this.sampleToTime(x);
      this.removeSliceMarker(clickPos);
      if (this.app) this.app.saveState();
    });

    // Right click for context menu
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickPos = this.sampleToTime(x);
      this.showSliceContextMenu(e.clientX, e.clientY, clickPos);
    });

    // Mouse leave - hide time display
    this.canvas.addEventListener('mouseleave', () => {
      this.hoverTime = null;
      const timeDisplay = document.getElementById('timeDisplay');
      if (timeDisplay) timeDisplay.style.display = 'none';
    });
  }

  setupMinimap() {
    const minimapCanvas = document.getElementById('minimapCanvas');
    const minimapViewport = document.getElementById('minimapViewport');
    if (!minimapCanvas || !minimapViewport) return;
    
    this.minimapCanvas = minimapCanvas;
    this.minimapCtx = minimapCanvas.getContext('2d');
    this.minimapViewport = minimapViewport;
    
    minimapCanvas.addEventListener('click', (e) => {
      const rect = minimapCanvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      this.scrollX = x * this.getMaxScroll();
      this.draw();
    });
  }

  setZoom(zoom, centerX = null) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(0.1, Math.min(10, zoom));
    
    if (centerX !== null && oldZoom !== this.zoom) {
      const timeAtCenter = this.sampleToTime(centerX);
      const newCenterX = this.timeToSample(timeAtCenter);
      const deltaX = centerX - newCenterX;
      this.scrollX += deltaX / this.zoom;
    }
    
    this.scrollX = Math.max(0, Math.min(this.scrollX, this.getMaxScroll()));
    this.draw();
    this.updateMinimap();
  }

  setSnapToGrid(enabled) {
    this.snapToGrid = enabled;
  }

  setShowGrid(enabled) {
    this.showGrid = enabled;
    const gridOverlay = document.getElementById('gridOverlay');
    if (gridOverlay) {
      gridOverlay.classList.toggle('show', enabled);
      if (enabled) this.drawGrid();
    }
  }

  snapToBeatGrid(time) {
    if (!this.app || !this.app.currentBPM) return time;
    const beatInterval = 60 / this.app.currentBPM;
    return Math.round(time / beatInterval) * beatInterval;
  }

  getMaxScroll() {
    const zoomedWidth = this.width * this.zoom;
    return Math.max(0, zoomedWidth - this.width);
  }

  setWaveformData(data, duration) {
    this.waveformData = data;
    this.totalDuration = duration || (data.length > 0 ? data.reduce((sum, d) => sum + (d.duration || 0), 0) : 0);
    this.draw();
    this.updateMinimap();
  }

  setSlicePositions(positions) {
    this.slicePositions = positions;
    this.updateMarkers();
    this.draw();
  }

  setPlayheadPosition(time) {
    this.playheadPosition = time;
    this.updatePlayhead();
  }

  sampleToTime(x) {
    if (this.totalDuration === 0) return 0;
    const visibleStart = this.scrollX / this.zoom;
    const visibleDuration = this.totalDuration / this.zoom;
    return visibleStart + (x / this.width) * visibleDuration;
  }

  timeToSample(time) {
    if (this.totalDuration === 0) return 0;
    const visibleStart = this.scrollX / this.zoom;
    const visibleDuration = this.totalDuration / this.zoom;
    return ((time - visibleStart) / visibleDuration) * this.width;
  }

  findNearestMarker(time) {
    if (this.slicePositions.length === 0) return null;
    let nearest = this.slicePositions[0];
    let minDist = Math.abs(nearest - time);
    
    for (const pos of this.slicePositions) {
      const dist = Math.abs(pos - time);
      if (dist < minDist) {
        minDist = dist;
        nearest = pos;
      }
    }
    
    return minDist < 0.05 ? nearest : null;
  }

  toggleSliceSelection(time) {
    const marker = this.findNearestMarker(time);
    if (marker) {
      if (this.selectedSlices.has(marker)) {
        this.selectedSlices.delete(marker);
      } else {
        this.selectedSlices.add(marker);
      }
      this.updateMarkers();
    }
  }

  draw() {
    if (!this.waveformData || this.waveformData.length === 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const centerY = this.height / 2;
    const amplitudes = this.waveformData.map(d => d.max).filter(a => !isNaN(a) && isFinite(a));
    if (amplitudes.length === 0) return;
    
    const maxAmplitude = Math.max(...amplitudes);
    if (maxAmplitude === 0) return;
    
    // Get computed color for waveform
    const computedStyle = getComputedStyle(document.documentElement);
    const appleBlue = computedStyle.getPropertyValue('--apple-blue') || '#0071e3';
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appleBlueValue = isDark ? '#0a84ff' : '#0071e3';
    
    // Calculate visible range
    const visibleStart = this.scrollX / this.zoom;
    const visibleDuration = this.totalDuration / this.zoom;
    const startIndex = Math.floor((visibleStart / this.totalDuration) * this.waveformData.length);
    const endIndex = Math.ceil(((visibleStart + visibleDuration) / this.totalDuration) * this.waveformData.length);
    
    // Draw waveform
    this.ctx.strokeStyle = appleBlueValue;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    for (let i = startIndex; i < endIndex && i < this.waveformData.length; i++) {
      const x = this.timeToSample((i / this.waveformData.length) * this.totalDuration);
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY;
      
      if (i === startIndex) {
        this.ctx.moveTo(x, centerY - amplitude);
      } else {
        this.ctx.lineTo(x, centerY - amplitude);
      }
    }

    for (let i = endIndex - 1; i >= startIndex && i >= 0; i--) {
      const x = this.timeToSample((i / this.waveformData.length) * this.totalDuration);
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY;
      this.ctx.lineTo(x, centerY + amplitude);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = isDark ? 'rgba(10, 132, 255, 0.3)' : 'rgba(0, 113, 227, 0.3)';
    this.ctx.fill();
    this.ctx.stroke();

    // Draw grid if enabled
    if (this.showGrid) {
      this.drawGrid();
    }

    // Draw playhead
    if (this.playheadPosition !== null) {
      const playheadX = this.timeToSample(this.playheadPosition);
      this.ctx.strokeStyle = '#ff3b30';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(playheadX, 0);
      this.ctx.lineTo(playheadX, this.height);
      this.ctx.stroke();
    }

    // Draw center line
    this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(this.width, centerY);
    this.ctx.stroke();
  }

  drawGrid() {
    if (!this.app || !this.app.currentBPM) return;
    
    const beatInterval = 60 / this.app.currentBPM;
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    
    const visibleStart = this.scrollX / this.zoom;
    const visibleDuration = this.totalDuration / this.zoom;
    const startBeat = Math.floor(visibleStart / beatInterval);
    const endBeat = Math.ceil((visibleStart + visibleDuration) / beatInterval);
    
    for (let beat = startBeat; beat <= endBeat; beat++) {
      const time = beat * beatInterval;
      const x = this.timeToSample(time);
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
  }

  updatePlayhead() {
    const playhead = document.getElementById('playhead');
    if (playhead && this.playheadPosition !== null) {
      const x = this.timeToSample(this.playheadPosition);
      playhead.style.left = x + 'px';
      playhead.style.display = 'block';
    } else if (playhead) {
      playhead.style.display = 'none';
    }
  }

  updateTimeDisplay(x, time) {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
      timeDisplay.textContent = this.formatTime(time);
      timeDisplay.style.left = x + 'px';
      timeDisplay.style.display = 'block';
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  }

  updateMarkers() {
    this.markersContainer.innerHTML = '';
    
    for (let i = 0; i < this.slicePositions.length; i++) {
      const position = this.slicePositions[i];
      const marker = document.createElement('div');
      marker.className = 'slice-marker';
      marker.dataset.index = i;
      marker.style.left = `${this.timeToSample(position)}px`;
      
      if (this.selectedSlices.has(position)) {
        marker.classList.add('selected');
      }
      
      // Add slice number label
      const label = document.createElement('div');
      label.className = 'slice-label';
      label.textContent = i + 1;
      marker.appendChild(label);
      
      this.markersContainer.appendChild(marker);
    }
  }

  addSliceMarker(time) {
    if (!this.slicePositions.includes(time)) {
      this.slicePositions.push(time);
      this.slicePositions.sort((a, b) => a - b);
      this.updateMarkers();
      this.draw();
      return true;
    }
    return false;
  }

  updateSliceMarker(oldTime, newTime) {
    const index = this.slicePositions.indexOf(oldTime);
    if (index !== -1) {
      this.slicePositions[index] = newTime;
      this.slicePositions.sort((a, b) => a - b);
      this.updateMarkers();
      this.draw();
      return true;
    }
    return false;
  }

  removeSliceMarker(time) {
    const index = this.slicePositions.indexOf(time);
    if (index !== -1 && this.slicePositions.length > 2) {
      this.slicePositions.splice(index, 1);
      this.selectedSlices.delete(time);
      this.updateMarkers();
      this.draw();
      return true;
    }
    return false;
  }

  showSliceContextMenu(x, y, time) {
    // Context menu implementation would go here
    // For now, just preview the slice
    this.previewSlice(time);
  }

  previewSlice(time) {
    // Find slice containing this time
    for (let i = 0; i < this.slicePositions.length - 1; i++) {
      if (time >= this.slicePositions[i] && time < this.slicePositions[i + 1]) {
        const slice = this.app?.audioProcessor?.getSlice(i);
        if (slice && this.app?.padController) {
          // Play slice preview
          const source = this.app.audioProcessor.audioContext.createBufferSource();
          source.buffer = slice.buffer;
          source.connect(this.app.audioProcessor.audioContext.destination);
          source.start();
          source.stop(this.app.audioProcessor.audioContext.currentTime + slice.duration);
        }
        break;
      }
    }
  }

  updateMinimap() {
    if (!this.minimapCanvas || !this.waveformData) return;
    
    const rect = this.minimapCanvas.getBoundingClientRect();
    this.minimapCanvas.width = rect.width * this.pixelRatio;
    this.minimapCanvas.height = rect.height * this.pixelRatio;
    this.minimapCtx.scale(this.pixelRatio, this.pixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    
    this.minimapCtx.clearRect(0, 0, width, height);
    
    const maxAmplitude = Math.max(...this.waveformData.map(d => d.max));
    if (maxAmplitude === 0) return;
    
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.minimapCtx.strokeStyle = isDark ? '#0a84ff' : '#0071e3';
    this.minimapCtx.lineWidth = 1;
    this.minimapCtx.beginPath();
    
    for (let i = 0; i < this.waveformData.length; i++) {
      const x = (i / this.waveformData.length) * width;
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY * 0.5;
      if (i === 0) {
        this.minimapCtx.moveTo(x, centerY - amplitude);
      } else {
        this.minimapCtx.lineTo(x, centerY - amplitude);
      }
    }
    
    for (let i = this.waveformData.length - 1; i >= 0; i--) {
      const x = (i / this.waveformData.length) * width;
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY * 0.5;
      this.minimapCtx.lineTo(x, centerY + amplitude);
    }
    
    this.minimapCtx.closePath();
    this.minimapCtx.fillStyle = isDark ? 'rgba(10, 132, 255, 0.3)' : 'rgba(0, 113, 227, 0.3)';
    this.minimapCtx.fill();
    this.minimapCtx.stroke();
    
    // Update viewport indicator
    const viewportStart = this.scrollX / this.getMaxScroll();
    const viewportWidth = (this.width / (this.width * this.zoom));
    this.minimapViewport.style.left = (viewportStart * width) + 'px';
    this.minimapViewport.style.width = (viewportWidth * width) + 'px';
  }

  getSlicePositions() {
    return [...this.slicePositions];
  }
}
