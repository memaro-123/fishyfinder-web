import React from 'react';
import { CheckCircle2, XCircle, ImageOff } from 'lucide-react';
import { GALLERY_ITEMS } from '../config/evaluationData';

export default function Gallery() {
  const hasItems = GALLERY_ITEMS && GALLERY_ITEMS.length > 0;

  return (
    <section id="gallery" className="section-container">
      <div className="section-header">
        <div className="section-tag">Test Gallery</div>
        <h2 className="section-title">Species Validation Gallery</h2>
        <p className="section-subtitle">
          Side-by-side ground truth vs. MobileNetV2 predicted outputs.
        </p>
      </div>

      {!hasItems ? (
        <div className="empty-gallery-state">
          <ImageOff size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h4>Gallery is Currently Empty</h4>
          <p>
            Add items to <span className="code-hint">GALLERY_ITEMS</span> in{' '}
            <span className="code-hint">src/config/evaluationData.js</span> once you have selected
            your representative test images.
          </p>
        </div>
      ) : (
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => {
            const isMatch =
              item.trueSpeciesLabel.toLowerCase() === item.predictedSpeciesLabel.toLowerCase();

            return (
              <div key={item.id} className="gallery-card">
                <div className="gallery-img-wrap">
                  <img src={item.imageUrl} alt={item.imageAlt} className="gallery-img" />
                </div>
                <div className="gallery-card-content">
                  <div className="gallery-card-row">
                    <span className="gallery-meta-key">True Label</span>
                    <span className="gallery-meta-val">{item.trueSpeciesLabel}</span>
                  </div>

                  <div className="gallery-card-row">
                    <span className="gallery-meta-key">Predicted</span>
                    <span className="gallery-meta-val" style={{ color: 'var(--accent-cyan)' }}>
                      {item.predictedSpeciesLabel}
                    </span>
                  </div>

                  <div className="gallery-card-row">
                    <span className="gallery-meta-key">Confidence</span>
                    <span className="gallery-meta-val">
                      {(item.confidenceScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="gallery-card-row" style={{ marginTop: '0.75rem' }}>
                    <span className="gallery-meta-key">Result</span>
                    {isMatch ? (
                      <span className="badge-comparison correct" style={{ padding: '0.2rem 0.5rem' }}>
                        <CheckCircle2 size={13} /> Correct
                      </span>
                    ) : (
                      <span className="badge-comparison incorrect" style={{ padding: '0.2rem 0.5rem' }}>
                        <XCircle size={13} /> Incorrect
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}