import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch history thunk
export const fetchHistory = createAsyncThunk('history/fetchHistory', async () => {
  const response = await axios.get('http://localhost:3100/login-history', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
});

// Delete history thunk
export const deleteHistory = createAsyncThunk('history/deleteHistory', async (id) => {
  await axios.delete(`http://localhost:3100/login-history/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return id;
});

const historySlice = createSlice({
  name: 'history',
  initialState: {
    history: [],
    status: 'idle',
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.history = state.history.filter((item) => item._id !== action.payload);
      });
  }
});

export default historySlice.reducer;
