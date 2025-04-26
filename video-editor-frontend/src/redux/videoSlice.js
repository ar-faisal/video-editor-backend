import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoFile: null,
  videoDuration: null,
  videoThumbnail: null,
  timeline: [],
  audio: null,
  subtitles: [],
  overlays: [],
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoFile: (state, action) => {
      state.videoFile = action.payload;
    },
    setVideoDuration: (state, action) => {
      state.videoDuration = action.payload;
    },
    setVideoThumbnail: (state, action) => {
      state.videoThumbnail = action.payload;
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
    setSubtitles: (state, action) => {
      state.subtitles = action.payload;
    },
    setOverlays: (state, action) => {
      state.overlays = action.payload;
    },
  },
});

export const {
  setVideoFile,
  setVideoDuration,
  setVideoThumbnail,
  addScene,
  removeScene,
  setAudio,
  setSubtitles,
  setOverlays,
} = videoSlice.actions;

export default videoSlice.reducer;
