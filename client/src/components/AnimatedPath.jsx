import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPath = () => {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 100 100"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <motion.path
        fill="none"
        stroke="yellow"
        strokeWidth="3"
        d="M10 80 Q 95 10 180 80 T 330 80"
      />
    </motion.svg>
  );
};

export default AnimatedPath;
