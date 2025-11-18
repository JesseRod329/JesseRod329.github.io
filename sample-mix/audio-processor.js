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
