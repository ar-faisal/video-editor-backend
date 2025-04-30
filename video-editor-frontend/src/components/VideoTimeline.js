import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addScene, removeScene } from '../app/redux/videoSlice';

const VideoTimeline = () => {
  const dispatch = useDispatch();
  const timeline = useSelector((state) => state.video.timeline);

  const handleAddScene = () => {
    const newScene = { id: Math.random(), start: 0, end: 10 }; // Mock logic
    dispatch(addScene(newScene));
  };

  const handleRemoveScene = (id) => {
    dispatch(removeScene(id));
  };

  return (
    <div className="mb-4">
      <button onClick={handleAddScene} className="btn btn-primary">
        Add Scene
      </button>
      <div className="flex space-x-2 mt-2">
        {timeline.map((scene) => (
          <div key={scene.id} className="bg-gray-200 p-2 rounded-md">
            <p>Scene {scene.id}</p>
            <button onClick={() => handleRemoveScene(scene.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTimeline;
