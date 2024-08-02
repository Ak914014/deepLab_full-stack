import React, { useState } from "react";
import Form from "../components/Form";

const DeepLabV3 = () => {
  const [image, setImage] = useState(null);

  return (
    <div className="p-5 w-full h-screen">
      <div className="flex gap-4 flex-row">
          <Form setImage={setImage} />

      </div>
    </div>
  );
};

export default DeepLabV3;
