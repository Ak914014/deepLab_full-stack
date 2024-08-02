import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DeepLab from './pages/DeepLab';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deeplab" element={<DeepLab />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;
