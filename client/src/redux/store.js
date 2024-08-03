// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import historyReducer from './historySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    history: historyReducer,
  },
});

export default store;


