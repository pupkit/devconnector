import React, { Component } from "react";
import * as faceapi from "face-api.js";
import { $ } from "jquery";
import {
  requestExternalImage,
  renderNavBar,
  renderSelectList,
  renderOption
} from "./js/commons";
import {
  resizeCanvasAndResults,
  drawDetections,
  drawLandmarks,
  drawExpressions
} from "./js/drawing";
import {
  initFaceDetectionControls,
  changeFaceDetector,
  changeInputSize,
  getFaceDetectorOptions,
  isFaceDetectionModelLoaded,
  TINY_FACE_DETECTOR
} from "./js/faceDetectionControls";

import styles from "./styles.css";

export default class FaceRecognition extends Component {
  constructor() {
    super();
    this.setState({
      forwardTimes: []
    });
  }

  async run() {
    // load face detection model
    await changeFaceDetector(TINY_FACE_DETECTOR);
    changeInputSize(128);
  
    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    const videoEl = $("#inputVideo").get(0);
    videoEl.srcObject = stream;
  }

  componentDidMount() {
    // initFaceDetectionControls();
    // this.run();
  }

  // updateTimeStats(timeInMs) {
  //   this.setState({
  //     forwardTimes: [timeInMs].concat(this.state.forwardTimes).slice(0, 30)
  //   })
  //   const avgTimeInMs = this.state.forwardTimes.reduce((total, t) => total + t) / this.state.forwardTimes.length
  //   $('#time').val(`${Math.round(avgTimeInMs)} ms`)
  //   $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
  // }

  async onPlay() {
    const videoEl = $("#inputVideo").get(0);

    if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
      return setTimeout(() => this.onPlay());

    const options = getFaceDetectorOptions();

    const ts = Date.now();

    const result = await faceapi.detectSingleFace(videoEl, options);

    // updateTimeStats(Date.now() - ts)

    if (result) {
      drawDetections(videoEl, $("#overlay").get(0), [result]);
    }

    setTimeout(() => this.onPlay.bind(this));
  }

  render() {
    return (
      <div className="center-content page-container">
        <div className="progress" id="loader">
          <div className="indeterminate" />
        </div>
        <div style={{ position: "relative" }} className="margin">
          <video
            // onplay={this.onPlay.bind(this)}
            id="inputVideo"
            autoPlay
            muted
          />
          <canvas id="overlay" />
        </div>
      </div>
    );
  }
}
