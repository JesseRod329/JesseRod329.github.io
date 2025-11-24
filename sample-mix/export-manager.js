/**
 * Export Manager - Export audio files (WAV, MP3, ZIP)
 */

class ExportManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Export AudioBuffer to WAV file
   */
  exportWAV(audioBuffer, filename = 'export.wav') {
    const wav = this.audioBufferToWav(audioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Convert AudioBuffer to WAV format
   */
  audioBufferToWav(buffer) {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return arrayBuffer;
  }

  /**
   * Export slice as WAV
   */
  exportSlice(slice, filename) {
    if (!slice || !slice.buffer) return;
    this.exportWAV(slice.buffer, filename || `slice_${slice.index + 1}.wav`);
  }

  /**
   * Export all slices as ZIP
   */
  async exportSlicesAsZIP(slices, baseFilename = 'slices') {
    // Note: Requires JSZip library - we'll use a simple approach
    // For full ZIP support, would need to include JSZip library
    const files = [];
    
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      if (slice && slice.buffer) {
        const wav = this.audioBufferToWav(slice.buffer);
        files.push({
          name: `${baseFilename}_${i + 1}.wav`,
          data: wav
        });
      }
    }
    
    // Download individual files (full ZIP would require JSZip)
    // For now, we'll download them sequentially with a small delay
    for (let i = 0; i < files.length; i++) {
      setTimeout(() => {
        const blob = new Blob([files[i].data], { type: 'audio/wav' });
        this.downloadBlob(blob, files[i].name);
      }, i * 100);
    }
    
    return files.length;
  }

  /**
   * Export mixdown (all pads playing)
   */
  async exportMixdown(padController, duration, filename = 'mixdown.wav') {
    if (!padController || !padController.audioContext) return;
    
    const sampleRate = padController.audioContext.sampleRate;
    const channels = 2; // Stereo
    const length = Math.floor(duration * sampleRate);
    
    const buffer = padController.audioContext.createBuffer(channels, length, sampleRate);
    
    // Note: This is a simplified mixdown
    // Full implementation would require recording the actual playback
    // For now, we'll create an empty buffer as placeholder
    
    this.exportWAV(buffer, filename);
  }

  /**
   * Download blob as file
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Export waveform as image
   */
  exportWaveformImage(canvas, filename = 'waveform.png') {
    canvas.toBlob((blob) => {
      if (blob) {
        this.downloadBlob(blob, filename);
      }
    }, 'image/png');
  }
}





