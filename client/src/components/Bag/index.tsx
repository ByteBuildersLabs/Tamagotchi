import { useEffect, useState, useRef } from 'react';
import { SDK } from "@dojoengine/sdk";
import { Schema } from "../../dojo/bindings.ts";
import initials from "../../data/initials.tsx";
import './main.css';

// Mock data representing available beasts in the carousel
const MOCK_BEASTS = [
  {
    id: 1,
    specie: 1,
    name: "Dark Wolf",
    description: "A shadowy predator that prowls the night, striking fear into their eyes.",
    level: 5,
    attack: 12.4,
    defense: 8.7,
    speed: 15.2,
    experience: 234,
  },
  {
    id: 2,
    specie: 2,
    name: "Magic Cat",
    description: "A mystical feline imbued with arcane energy, capable of casting illusions.",
    level: 3,
    attack: 9.8,
    defense: 11.3,
    speed: 12.6,
    experience: 150,
  },
  {
    id: 3,
    specie: 3,
    name: "Crystal Eagle",
    description: "A majestic eagle with wings of crystal with the power to dominate the skies.",
    level: 7,
    attack: 18.1,
    defense: 14.9,
    speed: 19.4,
    experience: 450,
  },
];

/**
 * The `Bag` component represents a carousel of beasts that users can browse and spawn.
 * It includes swipe navigation, a visual representation of each beast, and a spawn button.
 *
 * @param {Object} props - The component props.
 * @param {SDK<Schema>} props.sdk - The SDK instance used for managing the beasts.
 *
 * @returns {JSX.Element} The rendered component.
 */

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  // State to track the current slide index in the carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = MOCK_BEASTS.length;

  // Refs to store touch start and end positions for swipe detection
  const touchStartX = useRef<number | null>(null); 
  const touchEndX = useRef<number | null>(null);

  /**
   * Handles spawning a beast when the "SPAWN" button is clicked.
   * Currently, it logs the beast ID but can be extended with further logic.
   * 
   * @param {number} beastId - The ID of the beast to be spawned.
   */
  const handleSpawn = (beastId: number) => {
    console.log(`Spawning beast with ID: ${beastId}`);
    // TODO: Implement spawn logic here
  };

  /**
   * Captures the initial touch position when the user starts a swipe.
   * 
   * @param {React.TouchEvent} e - The touch event.
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  /**
   * Updates the touch end position as the user moves their finger.
   * 
   * @param {React.TouchEvent} e - The touch event.
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  /**
   * Determines the swipe direction and updates the carousel accordingly.
   */
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchEndX.current - touchStartX.current; // Calculate horizontal swipe distance

      if (deltaX > 50) {
        // Swipe right: move to the previous slide
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (deltaX < -50) {
        // Swipe left: move to the next slide
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      }
    }

    // Reset touch positions after swipe
    touchStartX.current = null;
    touchEndX.current = null;
  };

  /**
   * Generates the slide content for a given beast.
   * 
   * @param {number} index - The index of the beast in the mock data.
   * @returns {JSX.Element} The JSX content for the beast slide.
   */
  const getSlideContent = (index: number) => {
    const beast = MOCK_BEASTS[index];
    
    return (
      <div className="beast-slide">
        <div className="beast">
          {/* Beast Name */}
          <div className="beast-header">
            <h2>{beast.name}</h2>
          </div>
          
          {/* Beast Image */}
          <div className="beast-pic d-flex align-items-end">
            <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
          </div>

          {/* Beast Description */}
          <div className="beast-description-container">
            <p className="beast-description">{beast.description}</p>
          </div>

          {/* Spawn Button */}
          <div className="spawn-button-container">
            <button className="spawn-button" onClick={() => handleSpawn(beast.id)}>
              SPAWN
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
      bodyElement.classList.remove('night');
      bodyElement.style.backgroundSize = 'cover';
    }
  }, []);

  return (
    <div className="bag">
      <div className="eggs">
        <div className="carousel">
          {/* Slides container with swipe handling */}
          <div
            className="slides"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {MOCK_BEASTS.map((_, index) => (
              <div key={index} className="slide">
                {getSlideContent(index)}
              </div>
            ))}
          </div>
          
          {/* Carousel indicators for manual slide selection */}
          <div className="carousel-controls">
            <div className="indicators">
              {MOCK_BEASTS.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bag;
