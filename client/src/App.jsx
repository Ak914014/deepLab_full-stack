import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DeepLab from './pages/DeepLab';
import History from './components/History';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deeplab" element={<DeepLab />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
};

export default App;


