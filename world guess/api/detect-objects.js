// API route for object detection
// This will call Google Cloud Vision API server-side

import { detectObjects } from '@/components/utils/detection';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { imageData, lat, lng } = req.body;
    
    // For now, use simulated detection
    // In production, integrate with Google Cloud Vision API:
    // const vision = require('@google-cloud/vision');
    // const client = new vision.ImageAnnotatorClient();
    // const [result] = await client.objectLocalization(imageData);
    
    const detections = await detectObjects(imageData, lat, lng);
    
    res.status(200).json({
      success: true,
      detections,
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect objects',
    });
  }
}



