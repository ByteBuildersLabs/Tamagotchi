import { useState, useEffect } from 'react';
import './Carousel.css'; // Archivo con los estilos CSS que proporcioné antes

interface BeastData {
  title: string;
  image: string;
  description: string;
}

interface CarouselProps {
  beasts: BeastData[];
}

const Carousel = ({ beasts }: CarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beasts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [beasts.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleSpawn = () => {
    // Lógica para manejar el spawn de la bestia
    console.log('Spawn:', beasts[currentSlide].title);
  };

  return (
    <div className="beast-carousel">
      <div className="carousel-inner">
        {beasts.map((beast, index) => (
          <div 
            key={beast.title}
            className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="beast-content">
              <h2 className="beast-title">{beast.title}</h2>
              
              <div className="beast-image-container">
                <img 
                  src={beast.image} 
                  alt={beast.title} 
                  className="beast-image" 
                />
              </div>
              
              <p className="beast-description">
                {beast.description.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              
              <button 
                className="spawn-button"
                onClick={handleSpawn}
              >
                SPAWN
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {beasts.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;