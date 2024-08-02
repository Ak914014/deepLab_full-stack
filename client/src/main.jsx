import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store'; // Import your Redux store
import './index.css';

// Get the root element from the HTML
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Initial render
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
