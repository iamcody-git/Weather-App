import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "e10423bd1cea4a068e080826242612";
const BASE_URL = "https://api.weatherapi.com/v1/";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeatherByCity",
  async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}forecast.json?key=${API_KEY}&q=${city}&days=3`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || "Failed to fetch weather data");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weather: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
