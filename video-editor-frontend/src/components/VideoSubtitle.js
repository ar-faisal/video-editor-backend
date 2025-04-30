'use client'
import React, { useState } from 'react';
import { addSubtitles } from '@/services/video';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const VideoSubtitle = () => {
  const [subtitles, setSubtitles] = useState([{ text: '', start_time: '', end_time: '' }]);
  const videoDetails =  useSelector((state) => state?.videoDetails);

  // Function to handle input change
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newSubtitles = [...subtitles];
    newSubtitles[index][name] = value;
    setSubtitles(newSubtitles);
  };

  // Function to handle adding a new subtitle row
  const handleAddRow = () => {
    setSubtitles([...subtitles, { text: '', start_time: '', end_time: '' }]);
  };

  const handleDeleteRow = () => {
    if (subtitles.length > 1) {
      const newSubtitles = [...subtitles];
      newSubtitles.pop(); // Remove the last row
      setSubtitles(newSubtitles);
    } else {
      toast.warning('At least one subtitle is required.');
    }
  };

  // Function to handle submitting the subtitles
  const handleSubmit = async () => {
    if (subtitles.some((sub) => !sub.text || !sub.start_time || !sub.end_time)) {
      toast.error('Please fill all subtitle fields.');
      return;
    }

    try {
      const response = await addSubtitles(videoDetails?.id, subtitles);
      toast.success('Subtitles added successfully!');
      console.log(response);
    } catch (error) {
      toast.error('Failed to add subtitles.');
    }
  };

  return (
    <div className="video-subtitle-container p-6 space-y-4">
        <div className='video-subtitle-container-child'>
            <h2 className="text-2xl font-semibold video-subtitle-container-heading">Add Subtitles</h2>
            <div className="subtitles-form space-y-4">
                {subtitles.map((subtitle, index) => (
                <div key={index} className="subtitle-row flex gap-4 items-center">
                    <input
                    type="text"
                    name="text"
                    value={subtitle.text}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Subtitle text"
                    className="input-field"
                    />
                    <input
                    type="text"
                    name="start_time"
                    value={subtitle.start_time}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Start time (hh:mm:ss)"
                    className="input-field"
                    />
                    <input
                    type="text"
                    name="end_time"
                    value={subtitle.end_time}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="End time (hh:mm:ss)"
                    className="input-field"
                    />
                </div>
                ))}
            </div>
            <div className='subtitles-button'>
                <div>
                    <button
                        onClick={handleAddRow}
                        className="add-row-btn py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-700"
                    >
                        Add Subtitle Row
                    </button>
                    <button
                        onClick={handleDeleteRow}
                        className="delete-row-btn py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700"
                        >
                        Delete Last Row
                    </button>
                </div>
                <button
                    onClick={handleSubmit}
                    className="submit-btn py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                    Add Subtitles
                </button>
            </div>
        </div>
    </div>
  );
};

export default VideoSubtitle;
