const PreviewPlayer = () => {
    return (
      <div className="mt-4">
        <video controls width="100%">
          <source src={videoFile ? URL.createObjectURL(videoFile) : ''} type="video/mp4" />
        </video>
        <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded">Render Video</button>
      </div>
    );
  };
  
export default PreviewPlayer;