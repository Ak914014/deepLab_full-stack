import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const signup = createAsyncThunk('auth/signup', async (formData) => {
  const response = await axios.post('http://localhost:3100/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  localStorage.setItem('token', response.data.token);
  return response.data.token;
});

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await axios.post('http://localhost:3100/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data.token;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = jwtDecode(action.payload);
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = jwtDecode(action.payload);
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
