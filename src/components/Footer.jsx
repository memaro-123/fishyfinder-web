import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copy">
          © {new Date().getFullYear()} FishyFinder. Built for Computer Vision & Marine Species Classification.
        </div>
        <div className="footer-links">
          <a 
            href="https://github.com/memaro-123/fishyfinder" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}