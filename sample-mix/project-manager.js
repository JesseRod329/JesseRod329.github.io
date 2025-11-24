/**
 * Project Manager - Save and load projects
 */

class ProjectManager {
  constructor(app) {
    this.app = app;
    this.currentProject = null;
  }

  /**
   * Save current project to JSON
   */
  saveProject() {
    if (!this.app.audioProcessor.audioBuffer) {
      return null;
    }

    const project = {
      version: '1.0',
      fileName: this.app.currentFile?.name || 'untitled',
      audioInfo: {
        duration: this.app.audioProcessor.audioBuffer.duration,
        sampleRate: this.app.audioProcessor.sampleRate,
        channels: this.app.audioProcessor.audioBuffer.numberOfChannels
      },
      slices: this.app.audioProcessor.slices.map(slice => ({
        start: slice.start,
        end: slice.end,
        duration: slice.duration,
        index: slice.index
      })),
      slicePositions: this.app.waveformRenderer?.getSlicePositions() || [],
      padAssignments: this.app.padController?.pads.map((pad, index) => ({
        padIndex: index,
        sliceIndex: pad.sample?.index,
        label: pad.element?.querySelector('.pad-label')?.textContent || '',
        settings: pad.settings || {}
      })) || [],
      settings: {
        sensitivity: parseFloat(this.app.elements.sensitivitySlider?.value || 0.5),
        minSliceLength: parseFloat(this.app.elements.minSliceLength?.value || 100),
        masterVolume: parseFloat(this.app.elements.masterVolume?.value || 0.8)
      },
      timestamp: new Date().toISOString()
    };

    this.currentProject = project;
    return project;
  }

  /**
   * Export project as JSON file
   */
  exportProject() {
    const project = this.saveProject();
    if (!project) {
      return false;
    }

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.fileName.replace(/\.[^/.]+$/, '')}_project.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  }

  /**
   * Load project from JSON
   */
  async loadProject(projectData) {
    if (typeof projectData === 'string') {
      projectData = JSON.parse(projectData);
    }

    this.currentProject = projectData;
    
    // Note: Audio file needs to be loaded separately
    // This restores slice positions and pad assignments
    if (projectData.slicePositions && this.app.waveformRenderer) {
      this.app.waveformRenderer.setSlicePositions(projectData.slicePositions);
    }

    if (projectData.settings) {
      if (this.app.elements.sensitivitySlider) {
        this.app.elements.sensitivitySlider.value = projectData.settings.sensitivity;
        this.app.elements.sensitivityValue.textContent = projectData.settings.sensitivity;
      }
      if (this.app.elements.minSliceLength) {
        this.app.elements.minSliceLength.value = projectData.settings.minSliceLength;
        this.app.elements.minLengthValue.textContent = projectData.settings.minSliceLength + 'ms';
      }
      if (this.app.elements.masterVolume) {
        this.app.elements.masterVolume.value = projectData.settings.masterVolume;
        this.app.elements.masterVolumeValue.textContent = Math.round(projectData.settings.masterVolume * 100) + '%';
        this.app.padController?.setMasterVolume(projectData.settings.masterVolume);
      }
    }

    return projectData;
  }

  /**
   * Import project from file
   */
  async importProject(file) {
    try {
      const text = await file.text();
      const project = await this.loadProject(text);
      return project;
    } catch (error) {
      throw new Error('Failed to load project: ' + error.message);
    }
  }

  /**
   * Save to localStorage
   */
  saveToLocalStorage(key = 'sampleMix_project') {
    const project = this.saveProject();
    if (project) {
      localStorage.setItem(key, JSON.stringify(project));
      return true;
    }
    return false;
  }

  /**
   * Load from localStorage
   */
  loadFromLocalStorage(key = 'sampleMix_project') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return this.loadProject(stored);
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
      }
    }
    return null;
  }
}





