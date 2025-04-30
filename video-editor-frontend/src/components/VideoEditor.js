import React from 'react';
import VideoTimeline from './VideoTimeline';
// import AudioManager from './AudioManager';
// import SubtitleManager from './SubtitleManager';
// import TextOverlay from './TextOverlay';
// import ImageOverlay from './ImageOverlay';
import PreviewPlayer from './PreviewPlayer';

const VideoEditor = () => {
  return (
    <div className="p-4">
      <VideoTimeline />
      {/* <AudioManager />
      <SubtitleManager />
      <TextOverlay />
      <ImageOverlay /> */}
      <PreviewPlayer />
    </div>
  );
};

export default VideoEditor;
