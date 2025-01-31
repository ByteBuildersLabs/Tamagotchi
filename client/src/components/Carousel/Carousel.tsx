import { useState, useEffect } from 'react';
import './Carousel.css';

interface CarouselProps<T> {
  beasts: T[];
  renderSlide: (beast: T) => React.ReactNode;
}

const Carousel = <T extends unknown>({ beasts, renderSlide }: CarouselProps<T>) => {
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

  return (
    <div className="beast-carousel">
      <div className="carousel-inner">
        {beasts.map((beast, index) => (
          <div 
            key={index}
            className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
          >
            {renderSlide(beast)}
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