import React from 'react';
import { MODEL_SPECS } from '../config/speciesConfig';

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-pill">
        <span className="hero-pill-dot" />
        Fish Computer Vision System
      </div>

      <h1 className="hero-title">
        Identify California Native Species <br />
        <span className="hero-title-highlight">with Deep Learning</span>
      </h1>

      <p className="hero-description">
        Powered by a fine-tuned MobileNetV2 architecture. Inspect validation metrics,
        verify model inference confidence, and benchmark ground-truth test labels.
      </p>

      <div className="hero-specs">
        <div className="hero-spec-chip">
          <div className="spec-name">Backbone</div>
          <div className="spec-val">{MODEL_SPECS.architecture}</div>
        </div>
        <div className="hero-spec-chip">
          <div className="spec-name">Input Shape</div>
          <div className="spec-val">{MODEL_SPECS.inputResolution}</div>
        </div>
        <div className="hero-spec-chip">
          <div className="spec-name">Model Weights</div>
          <div className="spec-val">{MODEL_SPECS.modelName}</div>
        </div>
      </div>
    </header>
  );
}