import React, { useState } from "react";
import Form from "../components/Form";
import History from "../components/History";

const DeepLabV3 = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);

  const handleImageClick = (item) => {
    console.log("Image clicked:", item);
  };
  return (
    <div className="p-5 w-full">
      <div className="flex gap-4 flex-row">
        <Form setImage={setImage} setHistory={null} />

      </div>
    </div>
  );
};

export default DeepLabV3;
