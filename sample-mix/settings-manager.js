/**
 * Settings Manager - Handle application settings and preferences
 */

class SettingsManager {
  constructor() {
    this.defaultSettings = {
      padGridSize: '32',
      autoSave: false,
      showTutorial: true,
      theme: 'auto',
      waveformStyle: 'default',
      sampleRate: 44100,
      bufferSize: 512
    };
  }

  load() {
    const stored = localStorage.getItem('sampleMix_settings');
    return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : this.defaultSettings;
  }

  save(settings) {
    localStorage.setItem('sampleMix_settings', JSON.stringify(settings));
  }

  get(key) {
    const settings = this.load();
    return settings[key];
  }

  set(key, value) {
    const settings = this.load();
    settings[key] = value;
    this.save(settings);
  }
}





