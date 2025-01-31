import { useState } from 'react';
import { SDK } from "@dojoengine/sdk";
import { Link } from 'react-router-dom';
import { Schema } from "../../dojo/bindings.ts";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { Swords, ShieldPlus, TestTubeDiagonal, CircleGauge } from 'lucide-react';
import initials from "../../data/initials.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import './main.css';

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  const beast = useBeast(sdk);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: 'beast',
      content: beast && (
        <Link to={`/play`} className="beast" onClick={() => (document.querySelector('.navbar-toggler') as HTMLElement)?.click()}>
          <div className="beast-pic d-flex align-items-end">
            <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
            <h4 className="d-flex">
              <span>{beast.level}</span> Lvl
            </h4>
          </div>
          <div className="data">
            <div className="item">
              <div>
                <Swords />
                <span>{Math.round(beast.attack)}</span>
              </div>
            </div>
            <div className="item">
              <div>
                <ShieldPlus />
                <span>{Math.round(beast.defense)}</span>
              </div>
            </div>
            <div className="item">
              <div>
                <CircleGauge />
                <span>{Math.round(beast.speed)}</span>
              </div>
            </div>
            <div className="item">
              <div>
                <TestTubeDiagonal />
                <span>{(beast.experience)}</span>
              </div>
            </div>
          </div>
        </Link>
      )
    },
    {
      type: 'spawn',
      content: (
        <div className="spawn-slide">
          <h2>Sheep Lemus</h2>
          <p>The sheep is a social animal that thrives in flocks.</p>
          <ControllerConnectButton />
        </div>
      )
    }
  ];

  return (
    <div className="bag">
      <div className="eggs">
        <p className="title mb-4">
          Here will appear your <span>BabyBeasts</span>
        </p>
        
        <div className="carousel">
          <div className="slides">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`slide ${currentSlide === index ? 'active' : ''}`}
              >
                {slide.content}
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
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            
            <button
              className="control next"
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
              disabled={currentSlide === slides.length - 1}
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