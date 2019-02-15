import React, { Component } from "react";
import * as faceapi from "face-api.js";
import $ from "jquery";
// import {
//   requestExternalImage,
//   renderNavBar,
//   renderSelectList,
//   renderOption
// } from "./js/commons";
import {
  // resizeCanvasAndResults,
  drawDetections,
  // drawLandmarks,
  // drawExpressions
} from "./js/drawing";
import {
  changeFaceDetector,
  // changeInputSize,
  getFaceDetectorOptions,
  // initFaceDetectionControls,
  isFaceDetectionModelLoaded,
  // onDecreaseMinConfidence,
  // onIncreaseMinConfidence,
  // onDecreaseScoreThreshold,
  // onIncreaseScoreThreshold,
  // onDecreaseMinFaceSize,
  // onIncreaseMinFaceSize,
  // TINY_FACE_DETECTOR,
  // SSD_MOBILENETV1
} from "./js/faceDetectionControls";

import styles from "./styles.css";

async function onPlay() {
  
  const videoEl = $("#inputVideo").get(0);
  
  if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
    return setTimeout(() => onPlay());  
  
  const options = getFaceDetectorOptions();

  const result = await faceapi.detectSingleFace(videoEl, options);
  
  // updateTimeStats(Date.now() - ts)
  if (result) {
    drawDetections(videoEl, $("#overlay").get(0), [result]);
  }
  setTimeout(() => onPlay());
}

export default class FaceRecognition extends Component {
  constructor() {
    super();
    this.state = {
      forwardTimes: []
    };
  }

  async run() {
    // load face detection model
    // await changeFaceDetector(SSD_MOBILENETV1);
    // changeInputSize(128);

    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    const videoEl = $("#inputVideo").get(0);
    videoEl.srcObject = stream;
  }

  async componentDidMount() {
    // initFaceDetectionControls();
    changeFaceDetector();
    this.run();
  }

  render() {
    return (
      <div className="center-content">
        <div style={{ position: "relative" }} className="margin">
          <video
            onPlay={onPlay}
            id="inputVideo"
            autoPlay
            muted
          />
          <canvas id="overlay" />
        </div>

        <div>
          <div className="row side-by-side">
            <div
              id="face_detector_selection_control"
              className="row input-field"
              style={{ marginRight: 20 }}
            >
              {/* <select id="selectFaceDetector">
                <option value="ssd_mobilenetv1">SSD Mobilenet V1</option>
                <option value="tiny_face_detector">Tiny Face Detector</option>
                <option value="mtcnn">MTCNN</option>
              </select>
              <label>Select Face Detector</label> */}
            </div>
          </div>

          {/* <span id="ssd_mobilenetv1_controls">
            <div className="row side-by-side">
              <div className="row">
                <label htmlFor="minConfidence">Min Confidence:</label>
                <input
                  disabled
                  defaultValue="0.5"
                  id="minConfidence"
                  type="text"
                  className="bold"
                />
              </div>
              <button
                className="waves-effect waves-light btn"
                onClick={onDecreaseMinConfidence}
              >
                <i className="material-icons left">-</i>
              </button>
              <button
                className="waves-effect waves-light btn"
                onClick={onIncreaseMinConfidence}
              >
                <i className="material-icons left">+</i>
              </button>
            </div>
          </span>

          <span id="tiny_face_detector_controls">
            <div className="row side-by-side">
              <div className="row input-field" style={{ marginRight: 20 }}>
                <select id="inputSize">
                  <option value disabled>
                    Input Size:
                  </option>
                  <option value={128}>128 x 128</option>
                  <option value={160}>160 x 160</option>
                  <option value={224}>224 x 224</option>
                  <option value={320}>320 x 320</option>
                  <option value={416}>416 x 416</option>
                  <option value={512}>512 x 512</option>
                  <option value={608}>608 x 608</option>
                </select>
                <label>Input Size</label>
              </div>
              <div className="row">
                <label htmlFor="scoreThreshold">Score Threshold:</label>
                <input
                  disabled
                  defaultValue="0.5"
                  id="scoreThreshold"
                  type="text"
                  className="bold"
                />
              </div>
              <button
                className="waves-effect waves-light btn"
                onClick={onDecreaseScoreThreshold}
              >
                <i className="material-icons left">-</i>
              </button>
              <button
                className="waves-effect waves-light btn"
                onClick={onIncreaseScoreThreshold}
              >
                <i className="material-icons left">+</i>
              </button>
            </div>
          </span>

          <span id="mtcnn_controls">
            <div className="row side-by-side">
              <div className="row">
                <label htmlFor="minFaceSize">Minimum Face Size:</label>
                <input
                  disabled
                  defaultValue={20}
                  id="minFaceSize"
                  type="text"
                  className="bold"
                />
              </div>
              <button
                className="waves-effect waves-light btn"
                onClick={onDecreaseMinFaceSize}
              >
                <i className="material-icons left">-</i>
              </button>
              <button
                className="waves-effect waves-light btn"
                onClick={onIncreaseMinFaceSize}
              >
                <i className="material-icons left">+</i>
              </button>
            </div>
          </span> */}
        </div>
      </div>
    );
  }
}
