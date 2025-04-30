import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoDetails: {},
  timeline: [],
  audio: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoFile: (state, action) => {
      console.log(action.payload, "action/payload")
      state.videoDetails = action.payload;
    },
    addScene: (state, action) => {
      state.timeline.push(action.payload);
    },
    removeScene: (state, action) => {
      state.timeline = state.timeline.filter((scene) => scene.id !== action.payload);
    },
    setAudio: (state, action) => {
      state.audio = action.payload;
    },
  },
});

export const {
  setVideoFile,
  addScene,
  removeScene,
  setAudio,
} = videoSlice.actions;

export default videoSlice.reducer;
