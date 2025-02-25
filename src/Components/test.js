import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const ImageProcessingApp = () => {
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    const imgElement = document.createElement("img");
    imgElement.src = image;
    imgElement.onload = async () => {
      const detections = await faceapi.detectAllFaces(imgElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      setDetections(detections);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
    };
  };

  return (
    <div className="container">
      <h1>🖼️ Image Processing App</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: "100%" }} />}
      <button onClick={processImage}>Process Image</button>
      <canvas ref={canvasRef} />
      {detections.length > 0 && <p>Faces detected: {detections.length}</p>}
    </div>
  );
};

export default ImageProcessingApp;
