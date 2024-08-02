import React from 'react';

const ImageComponent = ({ image }) => {
  console.log(image);
  return (
    <div className="mt-4">
      {image ? (
        <>
          <h2 className="text-xl mb-2">Segmented Image:</h2>
          <img src={image} className='w-[45vw] h-[45vh]'alt="Segmented" />
        </>
      ) : (
        <p>No image uploaded yet</p>
      )}
    </div>
  );
};

export default ImageComponent;
