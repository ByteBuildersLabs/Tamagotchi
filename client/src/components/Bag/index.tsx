import { useState } from 'react';
import { SDK } from "@dojoengine/sdk";
import { Link } from 'react-router-dom';
import { Schema } from "../../dojo/bindings.ts";
import initials from "../../data/initials.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import './main.css';

// Datos quemados de ejemplo
const MOCK_BEASTS = [
  {
    id: 1,
    specie: 1,
    level: 5,
    attack: 12.4,
    defense: 8.7,
    speed: 15.2,
    experience: 234,
  },
  {
    id: 2,
    specie: 2,
    level: 3,
    attack: 9.8,
    defense: 11.3,
    speed: 12.6,
    experience: 150,
  },
  {
    id: 3,
    specie: 3,
    level: 7,
    attack: 18.1,
    defense: 14.9,
    speed: 19.4,
    experience: 450,
  },
];

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Simulamos 3 bestias + el slide de spawn
  const totalSlides = MOCK_BEASTS.length + 1;

  const getSlideContent = (index: number) => {
    if (index < MOCK_BEASTS.length) {
      const beast = MOCK_BEASTS[index];
      return (
        <Link to={`/play`} className="beast" onClick={() => (document.querySelector('.navbar-toggler') as HTMLElement)?.click()}>
          <div className="beast-pic d-flex align-items-end">
            <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
          </div>
        </Link>
      );
    }
    
    // Último slide (spawn)
    return (
      <div className="spawn-slide">
        <h2>Sheep Lemus</h2>
        <p>The sheep is a social animal that thrives in flocks.</p>
        <ControllerConnectButton />
      </div>
    );
  };

  return (
    <div className="bag">
      <div className="eggs">
        <p className="title mb-4">
          Here will appear your <span>BabyBeasts</span>
        </p>
        
        <div className="carousel">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {[...Array(totalSlides)].map((_, index) => (
              <div 
                key={index}
                className="slide"
              >
                {getSlideContent(index)}
              </div>
            ))}
          </div>
          
          <div className="carousel-controls">
            <button 
              className="control prev"
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
            >
              ‹
            </button>
            
            <div className="indicators">
              {[...Array(totalSlides)].map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            
            <button
              className="control next"
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bag;