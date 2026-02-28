/**
 * Client-side face extraction using @vladmandic/face-api.
 * Mirrors the backend /extractFaces logic so ML runs in the browser.
 */
import * as faceapi from "@vladmandic/face-api";

// Public CDN for face-api models so it works without serving /weights (e.g. add-on dev server).
const MODELS_CDN = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js-models@master";

let modelsLoaded = false;

/**
 * Load face-api models (call once before runDetection).
 * Loads from CDN so no local /weights folder is needed.
 */
export async function loadFaceApiModels() {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(`${MODELS_CDN}/tiny_face_detector`),
    faceapi.nets.faceLandmark68Net.loadFromUri(`${MODELS_CDN}/face_landmark_68`),
    faceapi.nets.faceRecognitionNet.loadFromUri(`${MODELS_CDN}/face_recognition`),
  ]);
  modelsLoaded = true;
}

/**
 * Load an image from base64 in the browser.
 */
function loadImageFromBase64(base64Data, mimeType = "image/jpeg") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image from base64"));
    img.src = `data:${mimeType};base64,${base64Data}`;
  });
}

/**
 * Run face detection and extraction on a single image (base64).
 * Returns an array of base64 JPEG strings, one per detected face (same shape as backend).
 */
export async function runDetection(base64Data, mimeType = "image/jpeg") {
  try {
    const img = await loadImageFromBase64(base64Data, mimeType);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const detections = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      return [];
    }

    const faceBase64List = [];
    for (let i = 0; i < detections.length; i++) {
      const box = detections[i].detection.box;

      const faceCanvas = document.createElement("canvas");
      faceCanvas.width = box.width;
      faceCanvas.height = box.height;
      const faceCtx = faceCanvas.getContext("2d");
      faceCtx.drawImage(
        canvas,
        box.x, box.y, box.width, box.height,
        0, 0, box.width, box.height
      );

      const dataUrl = faceCanvas.toDataURL("image/jpeg", 0.8);
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      faceBase64List.push(base64);
    }

    return faceBase64List;
  } catch (error) {
    console.error("Error processing image for face extraction:", error);
    return [];
  }
}

/**
 * Extract faces from multiple images (base64). Returns a flat array of base64 face images.
 * Same contract as POST /extractFaces: { images } -> faces[].
 */
export async function extractFacesFromImages(imageBuffers, mimeTypes) {
  await loadFaceApiModels();
  const mime = mimeTypes && mimeTypes.length === imageBuffers.length
    ? (i) => mimeTypes[i]
    : () => "image/jpeg";

  const results = await Promise.all(
    imageBuffers.map((base64, i) => runDetection(base64, mime(i)))
  );
  return results.flat(1);
}
