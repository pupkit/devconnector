import { $ } from "jquery";
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from "canvas";

import * as faceapi from "face-api.js";

import {
  renderSelectList,
  requestExternalImage,
  renderOption
} from "./commons";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function onSelectedImageChanged(uri) {
  const img = await faceapi.fetchImage(uri);
  $(`#inputImg`).get(0).src = img.src;
  // updateResults()
}

export async function loadImageFromUrl(url) {
  const img = await requestExternalImage($("#imgUrlInput").val());
  $("#inputImg").get(0).src = img.src;
  // updateResults()
}

export function renderImageSelectList(
  selectListId,
  onChange,
  initialValue,
  withFaceExpressionImages
) {
  let images = [1, 2, 3, 4, 5].map(idx => `bbt${idx}.jpg`);

  if (withFaceExpressionImages) {
    images = [
      "happy.jpg",
      "sad.jpg",
      "angry.jpg",
      "disgusted.jpg",
      "surprised.jpg",
      "fearful.jpg",
      "neutral.jpg"
    ].concat(images);
  }

  function renderChildren(select) {
    images.forEach(imageName => renderOption(select, imageName, imageName));
  }

  renderSelectList(selectListId, onChange, initialValue, renderChildren);
}

export function initImageSelectionControls(
  initialValue = "bbt1.jpg",
  withFaceExpressionImages = false
) {
  renderImageSelectList(
    "#selectList",
    async uri => {
      await onSelectedImageChanged(uri);
    },
    initialValue,
    withFaceExpressionImages
  );
  onSelectedImageChanged($("#selectList select").val());
}
