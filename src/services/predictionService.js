import * as ort from 'onnxruntime-web';
import { SPECIES_CLASSES } from '../config/speciesConfig';

// Load WASM binaries directly from CDN to avoid Vite HTML fallback routing errors
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
ort.env.wasm.numThreads = 1;

let sessionPromise = null;

/**
 * Loads the ONNX model into memory (cached so it runs only once)
 */
export async function loadModel() {
  if (!sessionPromise) {
    const modelUrl = `${import.meta.env.BASE_URL}model/fish_model.onnx`;
    sessionPromise = ort.InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
    });
  }
  return sessionPromise;
}

/**
 * Helper to turn an image source (URL, Blob, File) into an HTMLImageElement
 */
function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

/**
 * Resizes image to 224x224 RGB and normalizes pixel values to [0, 1] (img / 255.0)
 */
function processImageToTensor(img) {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 224, 224);

  const imgData = ctx.getImageData(0, 0, 224, 224);
  const data = imgData.data; // RGBA buffer

  // Target shape: [1, 224, 224, 3]
  const float32Data = new Float32Array(1 * 224 * 224 * 3);

  let targetIdx = 0;
  for (let i = 0; i < data.length; i += 4) {
    float32Data[targetIdx++] = data[i] / 255.0;     // R
    float32Data[targetIdx++] = data[i + 1] / 255.0; // G
    float32Data[targetIdx++] = data[i + 2] / 255.0; // B
  }

  return new ort.Tensor('float32', float32Data, [1, 224, 224, 3]);
}

/**
 * Numerically stable Softmax calculation (fallback if raw logits are returned)
 */
function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

/**
 * Runs client-side inference on an image input (File, Blob, or URL string)
 */
export async function predictImage(imageInput) {
  const session = await loadModel();

  let imgElement = imageInput;
  let objectUrlToRevoke = null;

  if (imageInput instanceof File || imageInput instanceof Blob) {
    objectUrlToRevoke = URL.createObjectURL(imageInput);
    imgElement = await loadImageElement(objectUrlToRevoke);
  } else if (typeof imageInput === 'string') {
    imgElement = await loadImageElement(imageInput);
  }

  try {
    const inputTensor = processImageToTensor(imgElement);

    // Read the model's actual dynamic input name
    const inputName = session.inputNames[0];
    const feeds = { [inputName]: inputTensor };

    // Run inference locally in WebAssembly
    const results = await session.run(feeds);
    const outputName = session.outputNames[0];
    const rawOutput = Array.from(results[outputName].data);

    // Check if output is already post-softmax (sums to ~1.0 with all values between 0 and 1)
    const sum = rawOutput.reduce((acc, val) => acc + val, 0);
    const isAlreadySoftmax = Math.abs(sum - 1.0) < 0.05 && rawOutput.every((v) => v >= 0 && v <= 1.0);

    // Use output directly if already probabilities; only apply softmax if unnormalized logits
    const probabilities = isAlreadySoftmax ? rawOutput : softmax(rawOutput);

    // Map probabilities to the 14 species classes
    const scored = probabilities.map((prob, idx) => ({
      species: SPECIES_CLASSES[idx] || `Unknown (${idx})`,
      confidence: prob,
    }));

    // Sort descending by highest confidence
    scored.sort((a, b) => b.confidence - a.confidence);

    return {
      predicted_species: scored[0].species,
      confidence: scored[0].confidence,
      top_3: scored.slice(0, 3),
    };
  } finally {
    if (objectUrlToRevoke) {
      URL.revokeObjectURL(objectUrlToRevoke);
    }
  }
}