/**
 * Audio Effects Processor - Reverb, Delay, Filters, Distortion, etc.
 */

class EffectsProcessor {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Create a reverb effect using ConvolverNode
   */
  createReverb(roomSize = 0.5, damping = 0.5) {
    const convolver = this.audioContext.createConvolver();
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, roomSize) * Math.exp(-i / length / damping);
      }
    }
    
    convolver.buffer = impulse;
    return convolver;
  }

  /**
   * Create a delay effect
   */
  createDelay(delayTime = 0.3, feedback = 0.3, wetLevel = 0.5) {
    const delay = this.audioContext.createDelay(1.0);
    const feedbackGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    
    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;
    wetGain.gain.value = wetLevel;
    dryGain.gain.value = 1 - wetLevel;
    
    // Connect delay with feedback
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    delay.connect(wetGain);
    
    return {
      input: dryGain,
      delay: delay,
      wet: wetGain,
      dry: dryGain,
      connect: function(destination) {
        this.dry.connect(destination);
        this.wet.connect(destination);
      },
      disconnect: function() {
        this.dry.disconnect();
        this.wet.disconnect();
      }
    };
  }

  /**
   * Create a low-pass filter
   */
  createLowPass(cutoff = 20000, resonance = 1) {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;
    return filter;
  }

  /**
   * Create a high-pass filter
   */
  createHighPass(cutoff = 20, resonance = 1) {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;
    return filter;
  }

  /**
   * Create a bandpass filter
   */
  createBandPass(frequency = 1000, Q = 1) {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
  }

  /**
   * Create a distortion effect
   */
  createDistortion(amount = 50) {
    const distortion = this.audioContext.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    const amountNormalized = amount / 100;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amountNormalized) * x * 20 * deg) / (Math.PI + amountNormalized * Math.abs(x));
    }
    
    distortion.curve = curve;
    distortion.oversample = '4x';
    return distortion;
  }

  /**
   * Create a compressor
   */
  createCompressor(threshold = -24, knee = 30, ratio = 12, attack = 0.003, release = 0.25) {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;
    return compressor;
  }

  /**
   * Create a 3-band EQ
   */
  createEQ(lowGain = 0, midGain = 0, highGain = 0) {
    const lowFilter = this.audioContext.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = 320;
    lowFilter.gain.value = lowGain;
    
    const midFilter = this.audioContext.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    midFilter.gain.value = midGain;
    
    const highFilter = this.audioContext.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = 3200;
    highFilter.gain.value = highGain;
    
    return {
      low: lowFilter,
      mid: midFilter,
      high: highFilter,
      connect: function(destination) {
        this.low.connect(this.mid);
        this.mid.connect(this.high);
        this.high.connect(destination);
      },
      disconnect: function() {
        this.low.disconnect();
        this.mid.disconnect();
        this.high.disconnect();
      }
    };
  }

  /**
   * Create ADSR envelope
   */
  createADSR(attack = 0.01, decay = 0.1, sustain = 0.7, release = 0.2) {
    const gainNode = this.audioContext.createGain();
    
    return {
      node: gainNode,
      attack: attack,
      decay: decay,
      sustain: sustain,
      release: release,
      trigger: function(when = 0) {
        const now = this.node.context.currentTime;
        const startTime = now + when;
        
        this.node.gain.cancelScheduledValues(startTime);
        this.node.gain.setValueAtTime(0, startTime);
        this.node.gain.linearRampToValueAtTime(1, startTime + this.attack);
        this.node.gain.linearRampToValueAtTime(this.sustain, startTime + this.attack + this.decay);
        
        return {
          release: (releaseTime = 0) => {
            const releaseStart = startTime + releaseTime;
            this.node.gain.cancelScheduledValues(releaseStart);
            this.node.gain.setValueAtTime(this.node.gain.value, releaseStart);
            this.node.gain.linearRampToValueAtTime(0, releaseStart + this.release);
          }
        };
      }
    };
  }
}





