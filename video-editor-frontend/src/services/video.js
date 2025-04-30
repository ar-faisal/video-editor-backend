// services/video.js
import axios from 'axios';

export const uploadVideo = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('video', file);

  return axios.post(
    `${process.env.NEXT_PUBLIC_API}api/videos/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }
  );
};

export const addSubtitles = async (videoId, subtitles) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API}api/videos/${videoId}/subtitles`,
      {
        subtitles: subtitles
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading subtitles:', error);
    throw error;
  }
};
