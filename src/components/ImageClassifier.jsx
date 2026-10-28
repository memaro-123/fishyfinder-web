import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw, HelpCircle, FileImage } from 'lucide-react';
import { predictImage } from '../services/predictionService';
import { SPECIES_CLASSES } from '../config/speciesConfig';

export default function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [trueSpecies, setTrueSpecies] = useState('');
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }

    setError(null);
    setPrediction(null);
    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    setLoading(true);
    try {
      // Run inference in-browser using TensorFlow.js
      const result = await predictImage(selectedFile);
      setPrediction(result);
    } catch (err) {
      console.error('Inference error:', err);
      setError('Failed to process image with TensorFlow.js: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setTrueSpecies('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isMatch = trueSpecies && prediction?.predicted_species === trueSpecies;
  const isMismatch = trueSpecies && prediction?.predicted_species && prediction.predicted_species !== trueSpecies;

  return (
    <section id="classifier" className="section-container">
      <div className="section-header">
        <div>
          <div className="section-tag">Interactive Evaluation</div>
          <h2 className="section-title">Manual Image Classifier: Orient Fish Horizontally</h2>
          <p className="section-subtitle">
            Supported species: California Corbina, Leopard Shark, Pacific Mackerel, Barred Sand Bass, Barred Surfperch, Bat Ray ,Garibaldi ,California Halibut ,Jacksmelt ,Lizardfish ,Shovelnose Guitarfish ,Spotfin Croaker ,Round Stingray, and Yellowfin Croaker.
          </p>
        </div>
      </div>

      <div className="classifier-grid">
        {/* Upload & Drop Zone Card */}
        <div className="classifier-card">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileProcess(e.target.files[0])}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <div
              className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} className="dropzone-icon" />
              <h4>Drag & drop fish image here</h4>
              <p>Supports JPG, PNG, WEBP (Rescaled to 224x224 RGB)</p>
              <button
                type="button"
                className="btn-select-file"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="preview-container">
              <img src={previewUrl} alt="Target Specimen" className="preview-image" />
              <button className="btn-reset-preview" onClick={handleReset} title="Clear Image">
                <RefreshCw size={16} /> New Image
              </button>
            </div>
          )}

          {/* Verification Dropdown */}
          <div className="ground-truth-control">
            <label className="ground-truth-label">
              <span>Known True Species (Optional Verification)</span>
              <HelpCircle size={14} title="Select actual species to test prediction accuracy" />
            </label>
            <select
              className="species-dropdown"
              value={trueSpecies}
              onChange={(e) => setTrueSpecies(e.target.value)}
            >
              <option value="">-- Select ground truth (optional) --</option>
              {SPECIES_CLASSES.map((species, idx) => (
                <option key={idx} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prediction Results Card */}
        <div className="classifier-card telemetry-card">
          <div className="telemetry-header">
            <span className="spec-name">Classification Analysis</span>
            {loading && <RefreshCw size={16} className="spin-icon" style={{ color: 'var(--accent-cyan)' }} />}
          </div>

          <div className="telemetry-body">
            {error && (
              <div className="error-badge">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {!prediction && !loading && !error && (
              <div className="empty-state-notice">
                <FileImage size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <p>Upload an image on the left to see model confidence and class distributions.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state-notice">
                <div className="scanner-spinner" />
                <p>Executing WebGL tensor ops...</p>
              </div>
            )}

            {prediction && (
              <>
                <div className="prediction-main-result">
                  <span className="sub-label">Predicted Species</span>
                  <div className="prediction-label-large">{prediction.predicted_species}</div>

                  {/* Ground Truth Validation Badge */}
                  {trueSpecies && (
                    <div className={`validation-badge ${isMatch ? 'match' : 'mismatch'}`}>
                      {isMatch ? (
                        <>
                          <CheckCircle2 size={16} /> Matches Ground Truth
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} /> Differs from: {trueSpecies}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="confidence-container" style={{ marginTop: '1.5rem' }}>
                  <div className="confidence-header">
                    <span>Confidence Score</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
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

                {prediction.top_3 && (
                  <div className="top3-container" style={{ marginTop: '1.5rem' }}>
                    <span className="spec-name" style={{ display: 'block', marginBottom: '0.75rem' }}>
                      Top 3 Probabilities
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
              </>
            )}
          </div>

          <div className="telemetry-footer">
            <span className="spec-name">Client-side MobileNetV2 • Zero Backend Latency</span>
          </div>
        </div>
      </div>
    </section>
  );
}