import React from 'react';

/**
 * Component to display the legend of segmentation map.
 * @param {Object} props - Component props.
 * @param {Object} props.legend - Legend object containing class names and their corresponding colors.
 * @returns {JSX.Element} Legend component.
 */
const Legend = ({ legend = {} }) => {
  return (
    <div className="  ">
      <h2 className="text-2xl mt-2 font-semibold"> Legend: </h2>
      <ul className="mt-4">
        {Object.entries(legend).map(([key, color]) => (
          <li key={key} className="flex items-center mb-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: `rgb(${color.join(',')})` }}
            ></div>
            <span className="ml-2">{key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
