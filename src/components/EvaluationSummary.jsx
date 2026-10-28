import React from 'react';
import { Database } from 'lucide-react';
import { EVALUATION_METRICS } from '../config/evaluationData';

export default function EvaluationSummary() {
  if (!EVALUATION_METRICS.hasEvaluationResults) {
    return (
      <section id="stats" className="section-container">
        <div className="section-header">
          <div className="section-tag">Benchmark Verification</div>
          <h2 className="section-title">Validation Dataset Statistics</h2>
        </div>
        <div className="empty-stats-state">
          <Database size={36} style={{ marginBottom: '1rem', color: 'var(--text-dim)' }} />
          <h4>No Official Evaluation Data Loaded</h4>
          <p>
            When you complete offline evaluation on your test set, update{' '}
            <span className="code-hint">src/config/evaluationData.js</span> to showcase your test
            accuracy, top-k metrics, and classification loss here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="stats" className="section-container">
      <div className="section-header">
        <div className="section-tag">Performance Benchmark</div>
        <h2 className="section-title">Validation Accuracy Summary</h2>
        <p className="section-subtitle">
          Evaluated against {EVALUATION_METRICS.totalValidationSamples} unseen validation images.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Overall Accuracy</div>
          <div className="stat-value">{EVALUATION_METRICS.overallAccuracy}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Top-3 Accuracy</div>
          <div className="stat-value">{EVALUATION_METRICS.top3Accuracy}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Macro F1-Score</div>
          <div className="stat-value">{EVALUATION_METRICS.macroF1}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Categorical Cross-Entropy Loss</div>
          <div className="stat-value">{EVALUATION_METRICS.testLoss}</div>
        </div>
      </div>
    </section>
  );
}