import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas'; // make sure installed via npm
import './PhotoBooth.css';

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stripRef = useRef(null); // <-- new ref here
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [theme, setTheme] = useState('beige');  // default theme

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const handleSnap = async () => {
    const newPhotos = [];

    for (let i = 0; i < 4; i++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise((res) => setTimeout(res, 1000));
      }

      setCountdown(null);
      await new Promise((res) => setTimeout(res, 200));

      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 300, 400);
      const image = canvasRef.current.toDataURL('image/png');
      newPhotos.push(image);

      await new Promise((res) => setTimeout(res, 500));
    }

    setPhotos(newPhotos);
  };

  const downloadStrip = () => {
    if (!stripRef.current) return;

    html2canvas(stripRef.current, {backgroundColor: null}).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chimi-strip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className={`chimi-wrapper theme-${theme}`}>
      <div className="chimi-container">
        <h1 className="chimi-title">ChimiChuu Photobooth</h1>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="theme-selector"
          aria-label="Select theme"
        >
          <option value="beige">Beige</option>
          <option value="pink">Pink</option>
          <option value="dark">Dark</option>
        </select>

        <video ref={videoRef} autoPlay className="chimi-video" />
        <canvas ref={canvasRef} width={300} height={400} style={{ display: 'none' }} />
        
        <button onClick={handleSnap} className="chimi-button" disabled={countdown !== null}>
          ✨ Snap ✨
        </button>

        {photos.length > 0 && (
          <>
            <button
              onClick={() => setPhotos([])}
              className="chimi-button chimi-button-secondary"
              disabled={countdown !== null}
            >
              📸 Take Another Picture
            </button>
            <button
              onClick={downloadStrip}
              className="chimi-button chimi-button-secondary"
              disabled={countdown !== null}
            >
              📥 Download Strip
            </button>
          </>
        )}

        {countdown && <div className="chimi-countdown">{countdown}</div>}
      </div>

      {/* Attach ref here so html2canvas can capture this div */}

        {photos.length > 0 && (
            <div className="chimi-strip" ref={stripRef}>
                {photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Chimi shot ${index}`} />
                ))}
            </div>
        )}
    </div>
  );
};

export default PhotoBooth;
