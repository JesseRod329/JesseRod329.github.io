/**
 * MIDI Pad Controller - Handles pad grid and sample playback
 */

class PadController {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.pads = [];
    this.masterVolume = 0.8;
    this.masterGainNode = null;
    this.activeSources = new Map();
    this.keyMap = {};
    this.setupMasterVolume();
    this.setupKeyboard();
  }

  setupMasterVolume() {
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.value = this.masterVolume;
  }

  setupKeyboard() {
    // Q-P row (pads 0-9)
    const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    // A-L row (pads 10-19)
    const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    // Z-M row (pads 20-29)
    const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    // Number row (pads 30-39)
    const row4 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    [...row1, ...row2, ...row3, ...row4].forEach((key, index) => {
      this.keyMap[key.toLowerCase()] = index;
    });

    document.addEventListener('keydown', (e) => {
      const padIndex = this.keyMap[e.key.toLowerCase()];
      if (padIndex !== undefined && padIndex < this.pads.length) {
        e.preventDefault();
        this.triggerPad(padIndex);
      }
    });
  }

  createPadGrid(container, numPads = 32) {
    container.innerHTML = '';
    this.pads = [];

    for (let i = 0; i < numPads; i++) {
      const pad = document.createElement('div');
      pad.className = 'pad empty';
      pad.dataset.index = i;
      
      const number = document.createElement('div');
      number.className = 'pad-number';
      number.textContent = i + 1;
      
      const label = document.createElement('div');
      label.className = 'pad-label';
      label.textContent = 'Empty';
      
      pad.appendChild(number);
      pad.appendChild(label);
      
      pad.addEventListener('click', () => this.triggerPad(i));
      pad.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerPad(i);
      });

      container.appendChild(pad);
      this.pads.push({
        element: pad,
        sample: null,
        index: i
      });
    }
  }

  assignSampleToPad(padIndex, sampleBuffer, label = '') {
    if (padIndex < 0 || padIndex >= this.pads.length) return false;

    const pad = this.pads[padIndex];
    pad.sample = sampleBuffer;
    pad.element.classList.remove('empty');
    pad.element.querySelector('.pad-label').textContent = label || `Sample ${padIndex + 1}`;
    
    return true;
  }

  triggerPad(padIndex) {
    if (padIndex < 0 || padIndex >= this.pads.length) return;
    
    const pad = this.pads[padIndex];
    if (!pad.sample) return;

    // Stop ALL currently playing pads
    this.stopAll();

    // Create a 1-second buffer from the sample
    const sampleBuffer = pad.sample.buffer;
    const sampleRate = sampleBuffer.sampleRate;
    const oneSecondSamples = Math.floor(sampleRate * 1.0); // Exactly 1 second
    const playLength = Math.min(oneSecondSamples, sampleBuffer.length);
    
    // Create 1-second buffer
    const oneSecondBuffer = this.audioContext.createBuffer(
      sampleBuffer.numberOfChannels,
      playLength,
      sampleRate
    );

    // Copy up to 1 second of audio data
    for (let channel = 0; channel < sampleBuffer.numberOfChannels; channel++) {
      const inputData = sampleBuffer.getChannelData(channel);
      const outputData = oneSecondBuffer.getChannelData(channel);
      
      for (let i = 0; i < playLength; i++) {
        outputData[i] = inputData[i];
      }
    }

    // Create new source with 1-second buffer
    const source = this.audioContext.createBufferSource();
    source.buffer = oneSecondBuffer;
    source.connect(this.masterGainNode);
    source.start(0);

    // Store source for potential stopping
    this.activeSources.set(padIndex, source);

    // Visual feedback
    pad.element.classList.add('active');
    setTimeout(() => pad.element.classList.remove('active'), 100);
    pad.element.classList.add('playing');
    
    source.onended = () => {
      pad.element.classList.remove('playing');
      this.activeSources.delete(padIndex);
    };
  }

  stopPad(padIndex) {
    const source = this.activeSources.get(padIndex);
    if (source) {
      try {
        source.stop();
      } catch (e) {
        // Source may have already ended
      }
      this.activeSources.delete(padIndex);
    }
    
    if (padIndex < this.pads.length) {
      this.pads[padIndex].element.classList.remove('playing');
    }
  }

  stopAll() {
    this.activeSources.forEach((source, index) => {
      try {
        source.stop();
      } catch (e) {}
      if (index < this.pads.length) {
        this.pads[index].element.classList.remove('playing');
      }
    });
    this.activeSources.clear();
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = volume;
    }
  }

  clearAllPads() {
    this.stopAll();
    this.pads.forEach(pad => {
      pad.sample = null;
      pad.element.classList.add('empty');
      pad.element.querySelector('.pad-label').textContent = 'Empty';
    });
  }

  autoAssignSamples(slices) {
    this.clearAllPads();
    slices.forEach((slice, index) => {
      if (index < this.pads.length) {
        this.assignSampleToPad(index, slice, `Slice ${index + 1}`);
      }
    });
  }
}
