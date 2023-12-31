import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "antd";
import * as tmImage from "@teachablemachine/image";

const Demo = () => {
  const modelURL = "https://teachablemachine.withgoogle.com/models/M9i5hLrrw/model.json";
  const metadataURL = "https://teachablemachine.withgoogle.com/models/M9i5hLrrw/metadata.json";

  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [person, setPerson] = useState("");
  const [model, setModel] = useState(null);

  useEffect(() => {
    const fetchModel = async () => {
      setModel(await tmImage.load(modelURL, metadataURL));
    };

    fetchModel();
  }, [modelURL, metadataURL]);

  const initWebcam = async () => {
    const webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    webcamRef.current = webcam;
    videoRef.current.srcObject = webcamRef.current.canvas.captureStream();
    loop();
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
      requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (model) {
      const prediction = await model.predict(webcamRef.current.canvas);
      const highProbabilityPrediction = prediction.find(
        (p) => p.probability >= 0.9
      );
      if (highProbabilityPrediction && !openModal) {
        setOpenModal(true);
        setPerson(highProbabilityPrediction.className);
        webcamRef.current.pause();
      }
      setPredictions(prediction);
    }
  };

  const handleStart = () => {
    initWebcam();
  };

  const handleCancel = () => {
    setOpenModal(false);
    if (webcamRef.current) {
      webcamRef.current.play();
    }
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Button onClick={handleStart}>Start</Button>
      <div id="label-container">
        {predictions.map((prediction, i) => (
          <div key={i}>
            {prediction.className}: {prediction.probability.toFixed(2)}
          </div>
        ))}
      </div>
      <video className="" ref={videoRef} width="300" height="200" />

      <Modal visible={openModal} onCancel={handleCancel} onOk={handleOk}>
        <h2 className="text-center font-normal text-green-500 text-xl">
          Hãy xác nhận bạn có phải là {person}{" "}
        </h2>
      </Modal>
    </div>
  );
};

export default Demo;
