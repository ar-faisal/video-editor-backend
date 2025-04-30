'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoFile, setVideoDuration, setVideoThumbnail } from '@/redux/videoSlice';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
import { uploadVideo } from '@/services/video'; // make sure you create this
import { toast } from 'react-toastify';

const VideoUpload = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const videoFile = acceptedFiles[0];

    if (!videoFile) return;
    toast.info('Uploading video...');

    setLoading(true);

    try {
      const response = await uploadVideo(videoFile, (progress) => {
        setUploadProgress(progress);  // Update state with progress
      });

      setFile(videoFile);
      dispatch(setVideoFile(response.data));
      toast.success('Video uploaded successfully!');

    } catch (error) {
      console.error('Upload failed:', error.message);
      setFile([]);
      toast.error('Failed to upload video.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': [] },
    onDrop,
  });

  return (
    <div className="upload-container flex flex-col items-center justify-center p-8 border-3 border-dashed rounded-3xl transition-all ease-in-out duration-300 hover:border-indigo-500">
    <div
      {...getRootProps()}
      className={`dropzone w-full flex flex-col items-center justify-center p-10 cursor-pointer ${
        isDragActive ? 'drag-active' : ''
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-gray-400 text-lg font-semibold">
          {isDragActive ? 'Drop your video here...' : 'Drag & Drop or Click to Upload Video'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Only video files are accepted</p>
      </div>
    </div>
    {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
    )}

    {/* Preview player after upload */}
    {file && (
      <div className="w-full mt-8">
        <ReactPlayer url={URL.createObjectURL(file)} controls width="100%" height="400px" />
      </div>
    )}
  </div>
  );
};

export default VideoUpload;
