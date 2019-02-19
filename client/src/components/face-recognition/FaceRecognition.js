import React, { Component } from "react";
import * as faceapi from "face-api.js";
import path from "path";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import $ from "jquery";
import ReactJson from 'react-json-view';
import { setWhoIsIt, setModelStatus } from "../../actions/faceRecognitionActions";
// import {
//   requestExternalImage,
//   renderNavBar,
//   renderSelectList,
//   renderOption
// } from "./js/commons";
import {
  // resizeCanvasAndResults,
  drawDetections,
  drawLandmarks
  // drawExpressions
} from "./js/drawing";
import {
  changeFaceDetector,
  // changeInputSize,
  getFaceDetectorOptions,
  initFaceDetectionControls,
  isFaceDetectionModelLoaded,
  isFaceRecognitionModelLoaded,
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
import isEmpty from "../../utils/is-empty";

let videoEl, overlay, faceMatcher, bestMatch, labeledFaceDescriptors;
const maxDescriptorDistance = 0.5;

async function buildLabeledDescriptors() {
  // const labels = [
  //   "sheldon",
  //   "raj",
  //   "leonard",
  //   "howard",
  //   "amy",
  //   "stuart",
  //   "bernadette",
  //   "penny"
  // ];
  const labels = ["raj", "howard"];

  labeledFaceDescriptors = await Promise.all(
    labels.map(async label => {
      console.log(label + ": start");
      // fetch image data from urls and convert blob to HTMLImage element
      const imgUrl = `${label}.png`;
      const img = await faceapi.fetchImage(`/faces/${imgUrl}`);
      // detect the face with the highest score in the image and compute it's landmarks and face descriptor
      const fullFaceDescription = await faceapi
        .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log(fullFaceDescription);

      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${label}`);
      }

      const faceDescriptors = [fullFaceDescription.descriptor];
      console.log(label + ": end");
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
    })
  );
}

class FaceRecognition extends Component {
  constructor() {
    super();
    this.state = {
      whoIsIt: "Nobody",
      faceInfo: {},
      modelStatus: "Loading..."
    };
    this.onPlay = this.onPlay.bind(this);
  }

  async onPlay() {
    if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
      return setTimeout(() => this.onPlay());
    // const options = getFaceDetectorOptions();

    // const result = await faceapi.detectSingleFace(videoEl, options);
    const result = await faceapi
      .detectSingleFace(videoEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image

    // const result = await faceapi.mtcnn(videoEl, options);

    // Compute Face Descriptors
    // const alignedFaceBoxes = result.map(({ landmarks }) => landmarks.align());

    // const alignedFaceTensors = await faceapi.extractFaceTensors(
    //   videoEl,
    //   alignedFaceBoxes
    // );

    // const descriptors = await Promise.all(
    //   alignedFaceTensors.map(faceTensor =>
    //     faceapi.computeFaceDescriptor(faceTensor)
    //   )
    // );

    // // free memory
    // alignedFaceTensors.forEach(t => t.dispose());

    if (!isEmpty(result)) {
      console.log(result);
      // drawDetections(videoEl, overlay, [result]);
      drawLandmarks(videoEl, overlay, [result], true);

      console.log("labeledFaceDescriptors: " + labeledFaceDescriptors);
      faceMatcher = new faceapi.FaceMatcher(
        labeledFaceDescriptors,
        maxDescriptorDistance
      );
      // faceMatcher = new faceapi.FaceMatcher(result);

      if (result) {
        bestMatch = faceMatcher.findBestMatch(result.descriptor);
        this.props.setWhoIsIt(bestMatch.toString(), result);
      }
      faceMatcher = null;
      bestMatch = null;
    }
    setTimeout(() => this.onPlay());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.whoIsIt) {
      this.setState({ whoIsIt: nextProps.whoIsIt, faceInfo: nextProps.faceInfo, modelStatus: nextProps.modelStatus });
    }
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
  
  async componentWillMount() {
    await faceapi.loadSsdMobilenetv1Model("/weights");
    await faceapi.loadFaceRecognitionModel("/weights");
    await faceapi.loadFaceLandmarkModel("/weights");
    await buildLabeledDescriptors();
    this.props.setModelStatus("Ready");
  }

  async componentDidMount() {
    overlay = $("#overlay").get(0);
    videoEl = $("#inputVideo").get(0);

    this.run();
  }

  render() {
    return (
      <div className="center-content">
        <div style={{ position: "relative" }} className="margin">
          <video onPlay={this.onPlay} id="inputVideo" autoPlay muted />
          <canvas id="overlay" />
          <label>{this.state.modelStatus}</label>
        </div>
        <div>
          <label>{JSON.stringify(this.state.whoIsIt)}</label>
          <ReactJson src={this.state.faceInfo} />
        </div>
      </div>
    );
  }
}

FaceRecognition.propTypes = {
  whoIsIt: PropTypes.string.isRequired,
  faceInfo: PropTypes.object.isRequired,
  modelStatus: PropTypes.string.isRequired
};

// const mapStateToProps = state => ({
//   whoIsIt: state.whoIsIt
// });

const mapStateToProps = state => {
  return {
    whoIsIt: state.faceRecognition.whoIsIt,
    faceInfo: state.faceRecognition.faceInfo,
    modelStatus: state.faceRecognition.modelStatus
  };
};

export default connect(
  mapStateToProps,
  { setWhoIsIt, setModelStatus }
)(FaceRecognition);
