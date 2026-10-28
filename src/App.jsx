import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveGuesser from './components/LiveGuesser';
import ImageClassifier from './components/ImageClassifier';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Hero />
        <ImageClassifier />
        <LiveGuesser />        
      </main>
    </div>
  );
}