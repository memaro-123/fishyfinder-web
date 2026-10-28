import React from 'react';
import { Compass, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Compass className="brand-icon" size={26} />
        <span className="brand-text">FishyFinder</span>
      </div>

      <ul className="navbar-links">
        <li><a href="#classifier" className="nav-link">Classifier</a></li>
        <li><a href="#gallery" className="nav-link">Validation Gallery</a></li>
        <li>
          <a 
            href="https://github.com/memaro-123/fishyfinder" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
            aria-label="GitHub Repository"
          >
            <Github size={18} />
          </a>
        </li>
      </ul>
    </nav>
  );
}