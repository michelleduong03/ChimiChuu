import React, { useRef, useState, useEffect } from 'react';
import './PhotoBooth.css';

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 400);
    const image = canvasRef.current.toDataURL('image/png');
    setPhotos((prev) => [...prev, image].slice(0, 4)); // Limit to 4
  };

  return (
    <div className="chimi-container">
      <h1 className="chimi-title">ChimiChuu Photobooth 💕</h1>
      <video ref={videoRef} autoPlay className="chimi-video" />
      <canvas ref={canvasRef} width={300} height={400} style={{ display: 'none' }} />
      <button onClick={takePhoto} className="chimi-button">✨ Snap ✨</button>

      <div className="chimi-strip">
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Chimi shot ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default PhotoBooth;
