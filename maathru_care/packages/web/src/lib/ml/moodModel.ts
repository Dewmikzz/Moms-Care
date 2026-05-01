import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

const MODEL_PATH = '/models/mood_model_web/model.json';

export const loadMoodModel = async () => {
  if (model) return model;
  try {
    model = await tf.loadLayersModel(MODEL_PATH);
    console.log('Mood detection model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading mood model:', error);
    return null;
  }
};

export const predictMoodFromFrame = async (videoElement: HTMLVideoElement) => {
  if (!model) {
    await loadMoodModel();
  }
  if (!model) return 0;

  return tf.tidy(() => {
    // Capture frame from video
    const tensor = tf.browser.fromPixels(videoElement)
      .resizeNearestNeighbor([48, 48]) // FER-2013 standard size
      .mean(2) // Grayscale
      .expandDims(2)
      .toFloat()
      .div(255.0) // Normalize
      .expandDims(0);

    const prediction = model!.predict(tensor) as tf.Tensor;
    const scores = prediction.dataSync();
    
    // Map scores to our 3 classes: calm, mildly distressed, significantly distressed
    // Assuming model output matches these classes or needs mapping
    // If model has 7 classes (FER-2013), we map them:
    // 0: Angry, 1: Disgust, 2: Fear, 3: Happy, 4: Sad, 5: Surprise, 6: Neutral
    
    // Simplified mapping for demonstration:
    // Neutral/Happy/Surprise -> 0 (Calm)
    // Sad/Disgust -> 1 (Mildly)
    // Fear/Angry -> 2 (Significantly)
    
    const maxIdx = prediction.argMax(1).dataSync()[0];
    
    if ([3, 5, 6].includes(maxIdx)) return 0;
    if ([1, 4].includes(maxIdx)) return 1;
    if ([0, 2].includes(maxIdx)) return 2;
    
    return 0;
  });
};
