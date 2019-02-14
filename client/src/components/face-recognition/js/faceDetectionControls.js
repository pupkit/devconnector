import { $ } from "jquery";
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from "canvas";

import * as faceapi from "face-api.js";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export const SSD_MOBILENETV1 = "ssd_mobilenetv1";
export const TINY_FACE_DETECTOR = "tiny_face_detector";
export const MTCNN = "mtcnn";

let selectedFaceDetector = SSD_MOBILENETV1;

// ssd_mobilenetv1 options
let minConfidence = 0.5;

// tiny_face_detector options
let inputSize = 512;
let scoreThreshold = 0.5;

//mtcnn options
let minFaceSize = 20;

export function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : selectedFaceDetector === TINY_FACE_DETECTOR
    ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    : new faceapi.MtcnnOptions({ minFaceSize });
}

export function onIncreaseMinConfidence() {
  minConfidence = Math.min(faceapi.round(minConfidence + 0.1), 1.0);
  $("#minConfidence").val(minConfidence);
  // updateResults()
}

export function onDecreaseMinConfidence() {
  minConfidence = Math.max(faceapi.round(minConfidence - 0.1), 0.1);
  $("#minConfidence").val(minConfidence);
  // updateResults()
}

export function onInputSizeChanged(e) {
  changeInputSize(e.target.value);
  // updateResults()
}

export function changeInputSize(size) {
  inputSize = parseInt(size);

  const inputSizeSelect = $("#inputSize");
  inputSizeSelect.val(inputSize);
  inputSizeSelect.material_select();
}

export function onIncreaseScoreThreshold() {
  scoreThreshold = Math.min(faceapi.round(scoreThreshold + 0.1), 1.0);
  $("#scoreThreshold").val(scoreThreshold);
  // updateResults()
}

export function onDecreaseScoreThreshold() {
  scoreThreshold = Math.max(faceapi.round(scoreThreshold - 0.1), 0.1);
  $("#scoreThreshold").val(scoreThreshold);
  // updateResults()
}

export function onIncreaseMinFaceSize() {
  minFaceSize = Math.min(faceapi.round(minFaceSize + 20), 300);
  $("#minFaceSize").val(minFaceSize);
}

export function onDecreaseMinFaceSize() {
  minFaceSize = Math.max(faceapi.round(minFaceSize - 20), 50);
  $("#minFaceSize").val(minFaceSize);
}

export function getCurrentFaceDetectionNet() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1;
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector;
  }
  if (selectedFaceDetector === MTCNN) {
    return faceapi.nets.mtcnn;
  }
}

export function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params;
}

export async function changeFaceDetector(detector) {
  [
    "#ssd_mobilenetv1_controls",
    "#tiny_face_detector_controls",
    "#mtcnn_controls"
  ].forEach(id => $(id).hide());

  selectedFaceDetector = detector;
  const faceDetectorSelect = $("#selectFaceDetector");
  faceDetectorSelect.val(detector);
  faceDetectorSelect.material_select();

  $("#loader").show();
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load("/");
  }

  $(`#${detector}_controls`).show();
  $("#loader").hide();
}

export async function onSelectedFaceDetectorChanged(e) {
  selectedFaceDetector = e.target.value;

  await changeFaceDetector(e.target.value);
  // updateResults()
}

export function initFaceDetectionControls() {
  const faceDetectorSelect = $("#selectFaceDetector");
  faceDetectorSelect.val(selectedFaceDetector);
  faceDetectorSelect.on("change", onSelectedFaceDetectorChanged);
  faceDetectorSelect.material_select();

  const inputSizeSelect = $("#inputSize");
  inputSizeSelect.val(inputSize);
  inputSizeSelect.on("change", onInputSizeChanged);
  inputSizeSelect.material_select();
}
