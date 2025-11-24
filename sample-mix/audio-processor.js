/**
 * Audio Processor - Handles audio decoding, slicing, and beat detection
 */

class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.slices = [];
    this.sampleRate = 44100;
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return true;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      return false;
    }
  }

  async decodeAudioFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sampleRate = this.audioBuffer.sampleRate;
      return {
        duration: this.audioBuffer.duration,
        sampleRate: this.sampleRate,
        channels: this.audioBuffer.numberOfChannels,
        length: this.audioBuffer.length
      };
    } catch (error) {
      console.error('Failed to decode audio:', error);
      throw new Error('Failed to decode audio file. Please try a different format.');
    }
  }

  /**
   * Detect beats/transients using amplitude analysis
   */
  detectBeats(sensitivity = 0.5, minSliceLength = 0.1) {
    if (!this.audioBuffer) return [];

    const channelData = this.audioBuffer.getChannelData(0);
    const sampleRate = this.audioBuffer.sampleRate;
    const minSamples = Math.floor(minSliceLength * sampleRate);
    
    // Calculate amplitude envelope
    const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
    const envelope = [];
    
    for (let i = 0; i < channelData.length; i += windowSize) {
      let sum = 0;
      for (let j = 0; j < windowSize && i + j < channelData.length; j++) {
        sum += Math.abs(channelData[i + j]);
      }
      envelope.push(sum / windowSize);
    }

    // Find peaks (beats)
    const threshold = Math.max(...envelope) * sensitivity;
    const peaks = [];
    let lastPeak = -minSamples;

    for (let i = 1; i < envelope.length - 1; i++) {
      const sampleIndex = i * windowSize;
      
      // Check if enough time has passed since last peak
      if (sampleIndex - lastPeak < minSamples) continue;

      // Check if this is a peak
      if (envelope[i] > threshold && 
          envelope[i] > envelope[i - 1] && 
          envelope[i] > envelope[i + 1]) {
        peaks.push(sampleIndex);
        lastPeak = sampleIndex;
      }
    }

    // Always include start and end
    if (peaks.length === 0 || peaks[0] > minSamples) {
      peaks.unshift(0);
    }
    if (peaks[peaks.length - 1] < channelData.length - minSamples) {
      peaks.push(channelData.length);
    }

    return peaks;
  }

  /**
   * Detect beats using spectral analysis
   */
  detectBeatsSpectral(sensitivity = 0.5, minSliceLength = 0.1) {
    if (!this.audioBuffer) return [];
    
    const channelData = this.audioBuffer.getChannelData(0);
    const sampleRate = this.audioBuffer.sampleRate;
    const fftSize = 2048;
    const hopSize = Math.floor(fftSize / 4);
    const minSamples = Math.floor(minSliceLength * sampleRate);
    
    // Calculate spectral flux
    const spectralFlux = [];
    let previousSpectrum = new Float32Array(fftSize / 2);
    
    for (let i = 0; i < channelData.length - fftSize; i += hopSize) {
      const frame = channelData.subarray(i, i + fftSize);
      const spectrum = this.computeFFT(frame);
      
      let flux = 0;
      for (let j = 0; j < spectrum.length; j++) {
        const diff = spectrum[j] - previousSpectrum[j];
        if (diff > 0) flux += diff;
      }
      
      spectralFlux.push({ index: i, flux });
      previousSpectrum = spectrum;
    }
    
    // Find peaks in spectral flux
    const maxFlux = Math.max(...spectralFlux.map(s => s.flux));
    const threshold = maxFlux * sensitivity;
    const peaks = [];
    let lastPeak = -minSamples;
    
    for (let i = 1; i < spectralFlux.length - 1; i++) {
      const sampleIndex = spectralFlux[i].index;
      
      if (sampleIndex - lastPeak < minSamples) continue;
      
      if (spectralFlux[i].flux > threshold &&
          spectralFlux[i].flux > spectralFlux[i - 1].flux &&
          spectralFlux[i].flux > spectralFlux[i + 1].flux) {
        peaks.push(sampleIndex);
        lastPeak = sampleIndex;
      }
    }
    
    if (peaks.length === 0 || peaks[0] > minSamples) {
      peaks.unshift(0);
    }
    if (peaks[peaks.length - 1] < channelData.length - minSamples) {
      peaks.push(channelData.length);
    }
    
    return peaks;
  }

  /**
   * Detect beats using onset detection
   */
  detectBeatsOnset(sensitivity = 0.5, minSliceLength = 0.1) {
    if (!this.audioBuffer) return [];
    
    const channelData = this.audioBuffer.getChannelData(0);
    const sampleRate = this.audioBuffer.sampleRate;
    const minSamples = Math.floor(minSliceLength * sampleRate);
    
    // High-frequency emphasis filter
    const filtered = new Float32Array(channelData.length);
    for (let i = 1; i < channelData.length; i++) {
      filtered[i] = channelData[i] - 0.95 * channelData[i - 1];
    }
    
    // Calculate energy
    const windowSize = Math.floor(sampleRate * 0.01);
    const energy = [];
    
    for (let i = 0; i < filtered.length; i += windowSize) {
      let sum = 0;
      for (let j = 0; j < windowSize && i + j < filtered.length; j++) {
        sum += filtered[i + j] * filtered[i + j];
      }
      energy.push({ index: i, value: sum / windowSize });
    }
    
    // Detect onsets
    const maxEnergy = Math.max(...energy.map(e => e.value));
    const threshold = maxEnergy * sensitivity;
    const peaks = [];
    let lastPeak = -minSamples;
    
    for (let i = 1; i < energy.length - 1; i++) {
      const sampleIndex = energy[i].index;
      
      if (sampleIndex - lastPeak < minSamples) continue;
      
      if (energy[i].value > threshold &&
          energy[i].value > energy[i - 1].value &&
          energy[i].value > energy[i + 1].value) {
        peaks.push(sampleIndex);
        lastPeak = sampleIndex;
      }
    }
    
    if (peaks.length === 0 || peaks[0] > minSamples) {
      peaks.unshift(0);
    }
    if (peaks[peaks.length - 1] < channelData.length - minSamples) {
      peaks.push(channelData.length);
    }
    
    return peaks;
  }

  /**
   * Simple FFT computation (simplified)
   */
  computeFFT(frame) {
    // Simplified FFT - in production would use proper FFT
    const N = frame.length;
    const spectrum = new Float32Array(N / 2);
    
    for (let k = 0; k < N / 2; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += frame[n] * Math.cos(angle);
        imag += frame[n] * Math.sin(angle);
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return spectrum;
  }

  /**
   * Create slices from detected beat positions
   */
  createSlices(beatPositions) {
    if (!this.audioBuffer || beatPositions.length < 2) return [];

    this.slices = [];
    const sampleRate = this.audioBuffer.sampleRate;
    const channels = this.audioBuffer.numberOfChannels;

    for (let i = 0; i < beatPositions.length - 1; i++) {
      const start = beatPositions[i];
      const end = beatPositions[i + 1];
      const length = end - start;

      // Create new AudioBuffer for this slice
      const sliceBuffer = this.audioContext.createBuffer(
        channels,
        length,
        sampleRate
      );

      // Copy audio data
      for (let channel = 0; channel < channels; channel++) {
        const inputData = this.audioBuffer.getChannelData(channel);
        const outputData = sliceBuffer.getChannelData(channel);
        
        for (let j = 0; j < length; j++) {
          outputData[j] = inputData[start + j];
        }
      }

      this.slices.push({
        buffer: sliceBuffer,
        start: start / sampleRate,
        end: end / sampleRate,
        duration: length / sampleRate,
        index: i
      });
    }

    return this.slices;
  }

  /**
   * Get waveform data for visualization
   */
  getWaveformData(width = 1000) {
    if (!this.audioBuffer) return null;

    const channelData = this.audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.floor(channelData.length / width);
    const waveform = [];

    for (let i = 0; i < width; i++) {
      const start = i * samplesPerPixel;
      let sum = 0;
      let max = 0;

      for (let j = 0; j < samplesPerPixel && start + j < channelData.length; j++) {
        const value = Math.abs(channelData[start + j]);
        sum += value;
        max = Math.max(max, value);
      }

      waveform.push({
        avg: sum / samplesPerPixel,
        max: max
      });
    }

    return waveform;
  }

  /**
   * Get slice at index
   */
  getSlice(index) {
    return this.slices[index] || null;
  }

  /**
   * Clear all slices
   */
  clearSlices() {
    this.slices = [];
  }
}
