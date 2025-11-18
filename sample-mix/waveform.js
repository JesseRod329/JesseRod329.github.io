/**
 * Waveform Visualization
 */

class WaveformRenderer {
  constructor(canvas, markersContainer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.markersContainer = markersContainer;
    this.waveformData = null;
    this.totalDuration = 0;
    this.slicePositions = [];
    this.width = 0;
    this.height = 0;
    this.pixelRatio = window.devicePixelRatio || 1;
    
    this.setupCanvas();
    this.setupEventListeners();
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
  }

  setupEventListeners() {
    let isDragging = false;
    let dragMarker = null;

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickPos = this.sampleToTime(x);

      // Check if clicking near a marker
      const marker = this.findNearestMarker(clickPos);
      if (marker && Math.abs(marker - clickPos) < 0.05) {
        isDragging = true;
        dragMarker = marker;
      } else {
        // Add new marker
        this.addSliceMarker(clickPos);
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging && dragMarker !== null) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newPos = this.sampleToTime(x);
        this.updateSliceMarker(dragMarker, newPos);
        dragMarker = newPos;
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
      dragMarker = null;
    });

    // Double click to remove marker
    this.canvas.addEventListener('dblclick', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickPos = this.sampleToTime(x);
      this.removeSliceMarker(clickPos);
    });
  }

  setWaveformData(data, duration) {
    this.waveformData = data;
    this.totalDuration = duration || (data.length > 0 ? data.reduce((sum, d) => sum + (d.duration || 0), 0) : 0);
    this.draw();
  }

  setSlicePositions(positions) {
    this.slicePositions = positions;
    this.updateMarkers();
  }

  sampleToTime(x) {
    if (this.totalDuration === 0) return 0;
    return (x / this.width) * this.totalDuration;
  }

  timeToSample(time) {
    if (this.totalDuration === 0) return 0;
    return (time / this.totalDuration) * this.width;
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
    
    // Draw waveform
    this.ctx.strokeStyle = appleBlueValue;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    for (let i = 0; i < this.waveformData.length; i++) {
      const x = (i / this.waveformData.length) * this.width;
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY;
      
      if (i === 0) {
        this.ctx.moveTo(x, centerY - amplitude);
      } else {
        this.ctx.lineTo(x, centerY - amplitude);
      }
    }

    for (let i = this.waveformData.length - 1; i >= 0; i--) {
      const x = (i / this.waveformData.length) * this.width;
      const amplitude = (this.waveformData[i].max / maxAmplitude) * centerY;
      this.ctx.lineTo(x, centerY + amplitude);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = isDark ? 'rgba(10, 132, 255, 0.3)' : 'rgba(0, 113, 227, 0.3)';
    this.ctx.fill();
    this.ctx.stroke();

    // Draw center line
    this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(this.width, centerY);
    this.ctx.stroke();
  }

  updateMarkers() {
    this.markersContainer.innerHTML = '';
    
    for (const position of this.slicePositions) {
      const marker = document.createElement('div');
      marker.className = 'slice-marker';
      marker.style.left = `${this.timeToSample(position)}px`;
      this.markersContainer.appendChild(marker);
    }
  }

  addSliceMarker(time) {
    if (!this.slicePositions.includes(time)) {
      this.slicePositions.push(time);
      this.slicePositions.sort((a, b) => a - b);
      this.updateMarkers();
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
      return true;
    }
    return false;
  }

  removeSliceMarker(time) {
    const index = this.slicePositions.indexOf(time);
    if (index !== -1 && this.slicePositions.length > 2) {
      this.slicePositions.splice(index, 1);
      this.updateMarkers();
      return true;
    }
    return false;
  }

  getSlicePositions() {
    return [...this.slicePositions];
  }
}
