import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Cpu, AlertCircle } from 'lucide-react';
import { predictImage } from '../services/predictionService';

const EXAMPLE_IMAGES = [
  'barredsurfperch.jpg',
  'batray.jpg',
  'corbina.jpg',
  'halibut.jpg',
  'lepord shark.jpg',
  'sfc.jpg'
];


export default function LiveGuesser() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalSec, setIntervalSec] = useState(4);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentFilename = EXAMPLE_IMAGES[currentIndex];
  // import.meta.env.BASE_URL ensures paths work in dev and on GitHub Pages (/fishyfinder/)
  const currentImageUrl = `${import.meta.env.BASE_URL}examples/${currentFilename}`;

  // Predict the current image using client-side TensorFlow.js
  const runPrediction = useCallback(async (imgUrl) => {
    if (!imgUrl) return;
    setLoading(true);
    setError(null);
    try {
      const result = await predictImage(imgUrl);
      setPrediction(result);
    } catch (err) {
      console.error('Inference error:', err);
      setError('Model inference error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger prediction when image changes
  useEffect(() => {
    runPrediction(currentImageUrl);
  }, [currentImageUrl, runPrediction]);

  // Auto-cycle timer
  useEffect(() => {
    if (!isPlaying || EXAMPLE_IMAGES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length);
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, intervalSec]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + EXAMPLE_IMAGES.length) % EXAMPLE_IMAGES.length);
  };

  return (
    <section id="live-stream" className="section-container">
      <div className="section-header live-stream-header">
        <div>
          <div className="section-tag">Client-Side TFJS Inference</div>
          <h2 className="section-title">Live Example Scanner</h2>
          <p className="section-subtitle">
            Cycling through test images with in-browser MobileNetV2 classification.
          </p>
        </div>

        <div className="live-status-badge">
          <span className={`status-dot ${isPlaying ? 'pulse' : ''}`} />
          {isPlaying ? 'LIVE SCANNING' : 'PAUSED'}
        </div>
      </div>

      {error ? (
        <div className="empty-stats-state">
          <AlertCircle size={40} style={{ color: 'var(--status-warning)', marginBottom: '1rem' }} />
          <h4>Inference Warning</h4>
          <p>{error}</p>
        </div>
      ) : (
        <div className="live-grid">
          {/* Main Visual Display */}
          <div className="live-viewport-card">
            <div className="live-screen-wrapper">
              <img
                src={currentImageUrl}
                alt={currentFilename}
                className="live-current-img"
              />

              {/* Scanning visual overlay */}
              {loading && <div className="scanner-line" />}
              
              <div className="live-image-overlay">
                <span className="file-badge">{currentFilename}</span>
                <span className="counter-badge">
                  {currentIndex + 1} / {EXAMPLE_IMAGES.length}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="live-controls-bar">
              <div className="control-group">
                <button className="ctrl-btn" onClick={handlePrev} title="Previous Image">
                  <SkipBack size={18} />
                </button>
                <button
                  className="ctrl-btn primary"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause Cycle' : 'Resume Cycle'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="ctrl-btn" onClick={handleNext} title="Next Image">
                  <SkipForward size={18} />
                </button>
              </div>

              <div className="speed-group">
                <label className="speed-label">Cycle Interval:</label>
                <select
                  className="speed-select"
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                >
                  <option value={2}>2 seconds</option>
                  <option value={3}>3 seconds</option>
                  <option value={4}>4 seconds</option>
                  <option value={6}>6 seconds</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Guess Output */}
          <div className="live-telemetry-card">
            <div className="telemetry-header">
              <span className="spec-name">In-Browser MobileNetV2 Output</span>
              <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
            </div>

            <div className="telemetry-body">
              <div className="prediction-label-large">
                {loading ? 'Analyzing...' : prediction?.predicted_species || 'Ready'}
              </div>

              {prediction && (
                <div className="confidence-container" style={{ marginTop: '1.25rem' }}>
                  <div className="confidence-header">
                    <span>Inference Confidence</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="confidence-bar-track">
                    <div
                      className="confidence-bar-fill"
                      style={{ width: `${Math.min(prediction.confidence * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Top 3 Predictions Breakdown */}
              {prediction?.top_3 && (
                <div className="top3-container">
                  <span className="spec-name" style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Top Class Probabilities
                  </span>
                  {prediction.top_3.map((item, idx) => (
                    <div key={idx} className="top3-row">
                      <div className="top3-info">
                        <span className="top3-rank">#{idx + 1}</span>
                        <span className="top3-species">{item.species}</span>
                      </div>
                      <span className="top3-conf">{(item.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="telemetry-footer">
              <div className="spec-name">Engine: TensorFlow.js (WebGL) • Input: 224x224 RGB</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}