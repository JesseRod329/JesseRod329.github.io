/**
 * MIDI Pad Controller - Enhanced with effects, ADSR, pitch shifting, etc.
 */

class PadController {
  constructor(audioContext, effectsProcessor = null) {
    this.audioContext = audioContext;
    this.effectsProcessor = effectsProcessor;
    this.pads = [];
    this.masterVolume = 0.8;
    this.masterGainNode = null;
    this.activeSources = new Map();
    this.keyMap = {};
    this.currentPadSettings = null;
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
      
      // Click to trigger
      pad.addEventListener('click', () => this.triggerPad(i));
      
      // Double-click to clear
      pad.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.clearPad(i);
      });
      
      // Right-click for settings
      pad.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.showPadSettings(i);
      });
      
      pad.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerPad(i);
      });

      container.appendChild(pad);
      this.pads.push({
        element: pad,
        sample: null,
        index: i,
        settings: {
          volume: 1,
          pan: 0,
          pitch: 0,
          reverse: false,
          loop: false,
          oneshot: false,
          attack: 0.01,
          decay: 0.1,
          sustain: 0.7,
          release: 0.2,
          lowpass: 20000,
          highpass: 20,
          reverb: 0,
          delay: 0,
          distortion: 0,
          eqLow: 0,
          eqMid: 0,
          eqHigh: 0,
          mute: false,
          solo: false
        },
        effectsChain: null
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
    if (!pad.sample || pad.settings.mute) return;
    
    // Check solo mode
    const hasSolo = this.pads.some(p => p.settings.solo);
    if (hasSolo && !pad.settings.solo) return;

    // Stop pad if already playing (for one-shot)
    if (pad.settings.oneshot) {
      this.stopPad(padIndex);
    }

    // Create source
    const source = this.audioContext.createBufferSource();
    let buffer = pad.sample.buffer || pad.sample;
    
    // Apply pitch shifting
    if (pad.settings.pitch !== 0) {
      source.playbackRate.value = Math.pow(2, pad.settings.pitch / 12);
    }
    
    // Apply reverse
    if (pad.settings.reverse) {
      buffer = this.reverseBuffer(buffer);
    }
    
    source.buffer = buffer;
    
    // Build effects chain
    const chain = this.buildEffectsChain(padIndex, pad.settings);
    source.connect(chain.input);
    chain.connect(this.masterGainNode);
    
    // Apply ADSR envelope
    const adsr = this.effectsProcessor?.createADSR(
      pad.settings.attack,
      pad.settings.decay,
      pad.settings.sustain,
      pad.settings.release
    );
    
    if (adsr) {
      const envelope = adsr.trigger();
      chain.connect(adsr.node);
      adsr.node.connect(this.masterGainNode);
      source.connect(adsr.node);
    }
    
    // Apply volume and pan
    const volumeGain = this.audioContext.createGain();
    volumeGain.gain.value = pad.settings.volume;
    
    const panner = this.audioContext.createStereoPanner();
    panner.pan.value = pad.settings.pan;
    
    if (adsr) {
      adsr.node.connect(volumeGain);
    } else {
      chain.connect(volumeGain);
    }
    volumeGain.connect(panner);
    panner.connect(this.masterGainNode);
    
    // Start playback
    if (pad.settings.loop) {
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = buffer.duration;
    }
    
    source.start(0);
    
    // Store source
    this.activeSources.set(padIndex, { source, envelope: adsr ? envelope : null });

    // Visual feedback
    pad.element.classList.add('active');
    setTimeout(() => pad.element.classList.remove('active'), 100);
    pad.element.classList.add('playing');
    
    source.onended = () => {
      pad.element.classList.remove('playing');
      this.activeSources.delete(padIndex);
    };
  }

  buildEffectsChain(padIndex, settings) {
    if (!this.effectsProcessor) {
      const gain = this.audioContext.createGain();
      gain.gain.value = 1;
      return { input: gain, connect: (dest) => gain.connect(dest), disconnect: () => gain.disconnect() };
    }
    
    const chain = [];
    
    // Low-pass filter
    if (settings.lowpass < 20000) {
      const lowpass = this.effectsProcessor.createLowPass(settings.lowpass);
      chain.push(lowpass);
    }
    
    // High-pass filter
    if (settings.highpass > 20) {
      const highpass = this.effectsProcessor.createHighPass(settings.highpass);
      chain.push(highpass);
    }
    
    // EQ
    if (settings.eqLow !== 0 || settings.eqMid !== 0 || settings.eqHigh !== 0) {
      const eq = this.effectsProcessor.createEQ(settings.eqLow, settings.eqMid, settings.eqHigh);
      chain.push(eq);
    }
    
    // Distortion
    if (settings.distortion > 0) {
      const distortion = this.effectsProcessor.createDistortion(settings.distortion);
      chain.push(distortion);
    }
    
    // Delay
    if (settings.delay > 0) {
      const delay = this.effectsProcessor.createDelay(0.3, 0.3, settings.delay);
      chain.push(delay);
    }
    
    // Reverb
    if (settings.reverb > 0) {
      const reverb = this.effectsProcessor.createReverb(0.5, 0.5);
      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = settings.reverb;
      chain.push({ input: reverbGain, reverb, connect: (dest) => {
        reverbGain.connect(reverb);
        reverb.connect(dest);
      }, disconnect: () => {
        reverbGain.disconnect();
        reverb.disconnect();
      }});
    }
    
    // Connect chain
    let input = chain[0]?.input || this.audioContext.createGain();
    for (let i = 0; i < chain.length - 1; i++) {
      if (chain[i].connect) {
        chain[i].connect(chain[i + 1].input || chain[i + 1]);
      } else {
        chain[i].connect(chain[i + 1]);
      }
    }
    
    return {
      input: input,
      connect: (dest) => {
        if (chain.length > 0) {
          const last = chain[chain.length - 1];
          if (last.connect) {
            last.connect(dest);
          } else {
            last.connect(dest);
          }
        } else {
          input.connect(dest);
        }
      },
      disconnect: () => {
        chain.forEach(effect => {
          if (effect.disconnect) effect.disconnect();
        });
      }
    };
  }

  reverseBuffer(buffer) {
    const reversed = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = reversed.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        outputData[i] = inputData[buffer.length - 1 - i];
      }
    }
    
    return reversed;
  }

  stopPad(padIndex) {
    const sourceData = this.activeSources.get(padIndex);
    if (sourceData) {
      try {
        if (sourceData.envelope) {
          sourceData.envelope.release();
        }
        sourceData.source.stop();
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
    this.activeSources.forEach((sourceData, index) => {
      try {
        if (sourceData.envelope) {
          sourceData.envelope.release();
        }
        sourceData.source.stop();
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

  clearPad(padIndex) {
    this.stopPad(padIndex);
    const pad = this.pads[padIndex];
    pad.sample = null;
    pad.element.classList.add('empty');
    pad.element.querySelector('.pad-label').textContent = 'Empty';
    pad.settings = {
      volume: 1,
      pan: 0,
      pitch: 0,
      reverse: false,
      loop: false,
      oneshot: false,
      attack: 0.01,
      decay: 0.1,
      sustain: 0.7,
      release: 0.2,
      lowpass: 20000,
      highpass: 20,
      reverb: 0,
      delay: 0,
      distortion: 0,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
      mute: false,
      solo: false
    };
  }

  clearAllPads() {
    this.stopAll();
    this.pads.forEach((pad, index) => this.clearPad(index));
  }

  autoAssignSamples(slices) {
    this.clearAllPads();
    slices.forEach((slice, index) => {
      if (index < this.pads.length) {
        this.assignSampleToPad(index, slice, `Slice ${index + 1}`);
      }
    });
  }

  showPadSettings(padIndex) {
    const pad = this.pads[padIndex];
    if (!pad) return;
    
    this.currentPadSettings = padIndex;
    const modal = document.getElementById('padSettingsModal');
    if (!modal) return;
    
    // Load settings into modal
    document.getElementById('padVolume').value = pad.settings.volume;
    document.getElementById('padVolumeValue').textContent = Math.round(pad.settings.volume * 100) + '%';
    document.getElementById('padPan').value = pad.settings.pan;
    document.getElementById('padPanValue').textContent = pad.settings.pan === 0 ? 'Center' : 
      pad.settings.pan > 0 ? `Right ${Math.round(pad.settings.pan * 100)}%` : 
      `Left ${Math.round(Math.abs(pad.settings.pan) * 100)}%`;
    document.getElementById('padPitch').value = pad.settings.pitch;
    document.getElementById('padPitchValue').textContent = pad.settings.pitch;
    document.getElementById('padReverse').checked = pad.settings.reverse;
    document.getElementById('padLoop').checked = pad.settings.loop;
    document.getElementById('padOneshot').checked = pad.settings.oneshot;
    document.getElementById('padAttack').value = pad.settings.attack;
    document.getElementById('padAttackValue').textContent = pad.settings.attack.toFixed(2) + 's';
    document.getElementById('padDecay').value = pad.settings.decay;
    document.getElementById('padDecayValue').textContent = pad.settings.decay.toFixed(2) + 's';
    document.getElementById('padSustain').value = pad.settings.sustain;
    document.getElementById('padSustainValue').textContent = Math.round(pad.settings.sustain * 100) + '%';
    document.getElementById('padRelease').value = pad.settings.release;
    document.getElementById('padReleaseValue').textContent = pad.settings.release.toFixed(2) + 's';
    document.getElementById('padLowpass').value = pad.settings.lowpass;
    document.getElementById('padLowpassValue').textContent = pad.settings.lowpass >= 1000 ? 
      (pad.settings.lowpass / 1000).toFixed(1) + 'kHz' : pad.settings.lowpass + 'Hz';
    document.getElementById('padHighpass').value = pad.settings.highpass;
    document.getElementById('padHighpassValue').textContent = pad.settings.highpass + 'Hz';
    document.getElementById('padReverb').value = pad.settings.reverb;
    document.getElementById('padReverbValue').textContent = Math.round(pad.settings.reverb * 100) + '%';
    document.getElementById('padDelay').value = pad.settings.delay;
    document.getElementById('padDelayValue').textContent = Math.round(pad.settings.delay * 100) + '%';
    document.getElementById('padDistortion').value = pad.settings.distortion;
    document.getElementById('padDistortionValue').textContent = pad.settings.distortion + '%';
    document.getElementById('padEQLow').value = pad.settings.eqLow;
    document.getElementById('padEQLowValue').textContent = pad.settings.eqLow.toFixed(1) + 'dB';
    document.getElementById('padEQMid').value = pad.settings.eqMid;
    document.getElementById('padEQMidValue').textContent = pad.settings.eqMid.toFixed(1) + 'dB';
    document.getElementById('padEQHigh').value = pad.settings.eqHigh;
    document.getElementById('padEQHighValue').textContent = pad.settings.eqHigh.toFixed(1) + 'dB';
    document.getElementById('padMute').checked = pad.settings.mute;
    document.getElementById('padSolo').checked = pad.settings.solo;
    
    // Setup event listeners for sliders
    this.setupPadSettingsListeners();
    
    modal.style.display = 'flex';
  }

  setupPadSettingsListeners() {
    const updateValue = (id, valueId, formatter) => {
      const slider = document.getElementById(id);
      const valueEl = document.getElementById(valueId);
      if (slider && valueEl) {
        slider.addEventListener('input', (e) => {
          valueEl.textContent = formatter(parseFloat(e.target.value));
        });
      }
    };
    
    updateValue('padVolume', 'padVolumeValue', v => Math.round(v * 100) + '%');
    updateValue('padPan', 'padPanValue', v => v === 0 ? 'Center' : 
      v > 0 ? `Right ${Math.round(v * 100)}%` : `Left ${Math.round(Math.abs(v) * 100)}%`);
    updateValue('padPitch', 'padPitchValue', v => v.toString());
    updateValue('padAttack', 'padAttackValue', v => v.toFixed(2) + 's');
    updateValue('padDecay', 'padDecayValue', v => v.toFixed(2) + 's');
    updateValue('padSustain', 'padSustainValue', v => Math.round(v * 100) + '%');
    updateValue('padRelease', 'padReleaseValue', v => v.toFixed(2) + 's');
    updateValue('padLowpass', 'padLowpassValue', v => v >= 1000 ? (v / 1000).toFixed(1) + 'kHz' : v + 'Hz');
    updateValue('padHighpass', 'padHighpassValue', v => v + 'Hz');
    updateValue('padReverb', 'padReverbValue', v => Math.round(v * 100) + '%');
    updateValue('padDelay', 'padDelayValue', v => Math.round(v * 100) + '%');
    updateValue('padDistortion', 'padDistortionValue', v => v + '%');
    updateValue('padEQLow', 'padEQLowValue', v => v.toFixed(1) + 'dB');
    updateValue('padEQMid', 'padEQMidValue', v => v.toFixed(1) + 'dB');
    updateValue('padEQHigh', 'padEQHighValue', v => v.toFixed(1) + 'dB');
  }

  savePadSettings() {
    if (this.currentPadSettings === null) return;
    
    const pad = this.pads[this.currentPadSettings];
    pad.settings.volume = parseFloat(document.getElementById('padVolume').value);
    pad.settings.pan = parseFloat(document.getElementById('padPan').value);
    pad.settings.pitch = parseInt(document.getElementById('padPitch').value);
    pad.settings.reverse = document.getElementById('padReverse').checked;
    pad.settings.loop = document.getElementById('padLoop').checked;
    pad.settings.oneshot = document.getElementById('padOneshot').checked;
    pad.settings.attack = parseFloat(document.getElementById('padAttack').value);
    pad.settings.decay = parseFloat(document.getElementById('padDecay').value);
    pad.settings.sustain = parseFloat(document.getElementById('padSustain').value);
    pad.settings.release = parseFloat(document.getElementById('padRelease').value);
    pad.settings.lowpass = parseFloat(document.getElementById('padLowpass').value);
    pad.settings.highpass = parseFloat(document.getElementById('padHighpass').value);
    pad.settings.reverb = parseFloat(document.getElementById('padReverb').value);
    pad.settings.delay = parseFloat(document.getElementById('padDelay').value);
    pad.settings.distortion = parseFloat(document.getElementById('padDistortion').value);
    pad.settings.eqLow = parseFloat(document.getElementById('padEQLow').value);
    pad.settings.eqMid = parseFloat(document.getElementById('padEQMid').value);
    pad.settings.eqHigh = parseFloat(document.getElementById('padEQHigh').value);
    pad.settings.mute = document.getElementById('padMute').checked;
    pad.settings.solo = document.getElementById('padSolo').checked;
    
    document.getElementById('padSettingsModal').style.display = 'none';
    this.currentPadSettings = null;
    
    if (window.app && window.app.uiFeedback) {
      window.app.uiFeedback.success('Pad settings saved');
    }
  }
}

// Make pad settings save/cancel work
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('savePadSettings');
  const cancelBtn = document.getElementById('cancelPadSettings');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (window.app && window.app.padController) {
        window.app.padController.savePadSettings();
      }
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      document.getElementById('padSettingsModal').style.display = 'none';
      if (window.app && window.app.padController) {
        window.app.padController.currentPadSettings = null;
      }
    });
  }
});
