import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "antd";
import * as tmImage from "@teachablemachine/image";

const Teachable = () => {
  const URL = "https://teachablemachine.withgoogle.com/models/M9i5hLrrw/";

  let maxPredictions;
  const webcamRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [person, setPerson] = useState("");
  const [model, setModel] = useState(null);
  const webcam = new tmImage.Webcam(200, 200, true);
  // const webcam = new tmImage.Webcam(200, 200, true);
  const fetchModal = async () => {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    setModel(await tmImage.load(modelURL, metadataURL));
    maxPredictions = model && model.getTotalClasses();
  };

  const init = async () => {
    await webcam.setup();
    await webcam.play();
    webcamRef.current = webcam;
    webcamRef.current.srcObject = webcam.canvas.captureStream();

    console.log("webcam", webcam);
    loop();
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
    }
    window.requestAnimationFrame(loop);
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

  useEffect(() => {
    // Load the model when the component mounts

    fetchModal();
  }, []);

  const handleStart = () => {
    // Start the webcam and loop when the user clicks the "Start" button
    init();
  };

  const handleCancel = () => {
    setOpenModal(false);
    init();
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
      <video className="" ref={webcamRef} width="300" height="200" />

      <Modal open={openModal} onCancel={handleCancel} onOk={handleOk}>
        <h2 className="text-center font-normal text-green-500 text-xl">
          Hãy xác nhận bạn có phải là {person}{" "}
        </h2>
      </Modal>
    </div>
  );
};

export default Teachable;
