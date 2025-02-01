import { useState } from 'react';
import { SDK } from "@dojoengine/sdk";
import { Link } from 'react-router-dom';
import { Schema } from "../../dojo/bindings.ts";
import initials from "../../data/initials.tsx";
import './main.css';

// Datos quemados actualizados con nombres y descripciones
const MOCK_BEASTS = [
  {
    id: 1,
    specie: 1,
    name: "Sheep Lemus",
    description: "The sheep is a social animal that thrives in flocks.",
    level: 5,
    attack: 12.4,
    defense: 8.7,
    speed: 15.2,
    experience: 234,
  },
  {
    id: 2,
    specie: 2,
    name: "Fire Drake",
    description: "A fiery companion with scales that glow in the dark.",
    level: 3,
    attack: 9.8,
    defense: 11.3,
    speed: 12.6,
    experience: 150,
  },
  {
    id: 3,
    specie: 3,
    name: "Ice Phoenix",
    description: "Majestic frozen bird that commands winter winds.",
    level: 7,
    attack: 18.1,
    defense: 14.9,
    speed: 19.4,
    experience: 450,
  },
];

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = MOCK_BEASTS.length;

  const handleSpawn = (beastId: number) => {
    console.log(`Spawning beast with ID: ${beastId}`);
    //Add logic to manage spawn
  };

  const getSlideContent = (index: number) => {
    const beast = MOCK_BEASTS[index];
    
    return (
      <div className="beast-slide">
        <div className="beast">
          <div className="beast-header">
            <h2>{beast.name}</h2>
          </div>
          
          <div className="beast-pic d-flex align-items-end">
            <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
          </div>
          <div className="beast-description-container">
            <p className="beast-description ">{beast.description}</p>
          </div>

          <div className="spawn-button-container">
          <button className="spawn-button" onClick={() => handleSpawn(beast.id)}>
            SPAWN
          </button>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bag">
      <div className="eggs">
        
        <div className="carousel">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {MOCK_BEASTS.map((_, index) => (
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
              {MOCK_BEASTS.map((_, index) => (
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