// Object detection utility using Google Cloud Vision API
// This will be called from the client-side when user clicks on Street View

export const OBJECT_CATEGORIES = {
  ARCHITECTURE: 'architecture',
  MATERIAL: 'material',
  FLORA: 'flora',
  FAUNA: 'fauna',
};

export const ARCHITECTURE_TYPES = [
  'Modern',
  'Classical',
  'Colonial',
  'Mediterranean',
  'Art Deco',
  'Brutalist',
  'Neoclassical',
  'Victorian',
  'Contemporary',
  'Traditional',
];

export const MATERIAL_TYPES = [
  'Brick',
  'Concrete',
  'Wood',
  'Metal',
  'Stone',
  'Glass',
  'Stucco',
  'Adobe',
  'Tile',
  'Vinyl',
];

export const FLORA_TYPES = [
  'Palm Tree',
  'Oak Tree',
  'Pine Tree',
  'Eucalyptus',
  'Bamboo',
  'Cactus',
  'Grass',
  'Shrub',
  'Flower',
  'Ferns',
];

export const FAUNA_TYPES = [
  'Bird',
  'Dog',
  'Cat',
  'Livestock',
  'Wildlife',
  'Insect',
  'Marine Life',
];

// Simulate object detection based on location and image analysis
// In production, this would call Google Cloud Vision API or similar
export async function detectObjects(imageData, lat, lng) {
  // Placeholder: In production, this would make an API call
  // For now, we'll return simulated detections based on location
  
  const detectedObjects = [];
  
  // Simulate detection based on latitude (climate zones)
  const isTropical = lat > -23.5 && lat < 23.5;
  const isTemperate = (lat >= 23.5 && lat < 66.5) || (lat <= -23.5 && lat > -66.5);
  const isCold = Math.abs(lat) >= 66.5;
  
  // Architecture detection
  if (Math.random() > 0.3) {
    const archType = ARCHITECTURE_TYPES[Math.floor(Math.random() * ARCHITECTURE_TYPES.length)];
    detectedObjects.push({
      category: OBJECT_CATEGORIES.ARCHITECTURE,
      type: archType,
      confidence: 0.7 + Math.random() * 0.2,
      position: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
    });
  }
  
  // Material detection
  if (Math.random() > 0.4) {
    const materialType = MATERIAL_TYPES[Math.floor(Math.random() * MATERIAL_TYPES.length)];
    detectedObjects.push({
      category: OBJECT_CATEGORIES.MATERIAL,
      type: materialType,
      confidence: 0.65 + Math.random() * 0.25,
      position: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
    });
  }
  
  // Flora detection
  if (Math.random() > 0.5) {
    let floraType;
    if (isTropical) {
      floraType = ['Palm Tree', 'Bamboo', 'Tropical Plants'][Math.floor(Math.random() * 3)];
    } else if (isTemperate) {
      floraType = ['Oak Tree', 'Pine Tree', 'Grass', 'Shrub'][Math.floor(Math.random() * 4)];
    } else {
      floraType = 'Pine Tree';
    }
    
    detectedObjects.push({
      category: OBJECT_CATEGORIES.FLORA,
      type: floraType,
      confidence: 0.7 + Math.random() * 0.2,
      position: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
    });
  }
  
  // Fauna detection (less common)
  if (Math.random() > 0.7) {
    const faunaType = FAUNA_TYPES[Math.floor(Math.random() * FAUNA_TYPES.length)];
    detectedObjects.push({
      category: OBJECT_CATEGORIES.FAUNA,
      type: faunaType,
      confidence: 0.6 + Math.random() * 0.3,
      position: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
    });
  }
  
  return detectedObjects;
}

// Real API call function (to be implemented with actual API key)
export async function detectObjectsViaAPI(imageData, lat, lng) {
  try {
    // This would make a POST request to your API endpoint
    // which would then call Google Cloud Vision API
    const response = await fetch('/api/detect-objects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        lat,
        lng,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Detection failed');
    }
    
    const data = await response.json();
    return data.detections || [];
  } catch (error) {
    console.error('Error detecting objects:', error);
    // Fallback to simulated detection
    return detectObjects(imageData, lat, lng);
  }
}

// Format detection result for display
export function formatDetectionResult(detection) {
  const categoryLabels = {
    [OBJECT_CATEGORIES.ARCHITECTURE]: 'Architecture',
    [OBJECT_CATEGORIES.MATERIAL]: 'Material',
    [OBJECT_CATEGORIES.FLORA]: 'Flora',
    [OBJECT_CATEGORIES.FAUNA]: 'Fauna',
  };
  
  return {
    label: `${categoryLabels[detection.category]}: ${detection.type}`,
    category: detection.category,
    type: detection.type,
    confidence: Math.round(detection.confidence * 100),
  };
}



