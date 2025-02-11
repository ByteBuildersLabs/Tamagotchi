import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsData from '../../data/dex/BeastsDex.json';
import Header from "../Header/index.tsx";
import StatsCarousel from './baseStats.tsx';
import './main.css';

/**
 * DexCarouselProps interface - Defines the properties for the DexCarousel component.
 *
 * @typedef {object} DexCarouselProps
 * @property {number} [initialSlide] - The initial slide index to display.
 * @property {() => void} [onClose] - Optional callback function triggered when the back button is clicked.
 */
interface DexCarouselProps {
  initialSlide?: number;
  onClose?: () => void;
}

/**
 * DexCarousel Component - Displays a carousel slider with beasts' information.
 *
 * This component dynamically loads beast images, renders beast details in a slider,
 * and optionally displays a back button when the onClose callback is provided.
 *
 * @param {DexCarouselProps} props - The properties for the component.
 * @param {number} [props.initialSlide=0] - The initial slide index to display.
 * @param {() => void} [props.onClose] - Callback function for handling the back button.
 * @returns {JSX.Element} The rendered DexCarousel component.
 */
function DexCarousel({ initialSlide = 0, onClose }: DexCarouselProps): JSX.Element {
  // State for holding dynamically loaded beast images
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});

  // Load beast images on component mount
  useEffect(() => {
    /**
     * Asynchronously loads images for each beast from the JSON data.
     * Updates the beastImages state with the loaded image paths.
     */
    const loadBeastImages = async () => {
      const loadedImages: Record<string, string> = {};
      for (const beast of beastsData.BeastsDex) {
        try {
          // Construct the image path based on the beast's name
          const imagePath = `../../assets/beasts/${beast.Name}-idle.gif`;
          const imageModule = await import(/* @vite-ignore */ imagePath);
          loadedImages[beast.Name] = imageModule.default;
        } catch (error) {
          console.error(`Error loading image for ${beast.Name}:`, error);
          loadedImages[beast.Name] = '';
        }
      }
      setBeastImages(loadedImages);

      // Update body element styling after images are loaded
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('day', 'night');
        bodyElement.style.backgroundSize = 'cover';
        bodyElement.style.padding = '80px 15px 30px';
      }
    };

    loadBeastImages();
  }, []);

  /**
   * Slider settings configuration for the carousel.
   *
   * @type {object}
   */
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide,
    arrows: false,
    swipe: beastsData.BeastsDex.length > 1,
    customPaging: function () {
      return <div className="indicator-carrousel"></div>;
    }
  };

  /**
   * Handles the event when a beast image fails to load.
   *
   * @param {string} beastName - The name of the beast whose image failed to load.
   * @returns {void}
   */
  const handleImageError = (beastName: string): void => {
    console.error(`Failed to load image for ${beastName}`);
  };

  /**
   * Renders a section for displaying a list of types with a title.
   *
   * @param {string} title - The title for the type section.
   * @param {string[]} types - Array of types to display.
   * @returns {JSX.Element} The rendered type section.
   */
  const renderTypeSection = (title: string, types: string[]): JSX.Element => (
    <div className="type-section-carrousel">
      <h3>{title}</h3>
      <div className="type-tags-carrousel">
        {types.map((type, index) => (
          <span key={index} className="type-tag-carrousel">
            {type}
          </span>
        ))}
      </div>
    </div>
  );

  // Render the DexCarousel component
  return (
    <>
      <Header />
      <div className="dex-container-carrousel">
        {/* Back Button */}
        {onClose && (
          <button 
            className="back-button-carrousel" 
            onClick={onClose}
          >
            Back
          </button>
        )}

        <Slider {...settings}>
          {beastsData.BeastsDex.map((beast, index) => (
            <div key={index} className="beast-card-carrousel">
              <div className="beast-header-carrousel">
                <h2 className="beast-name-carrousel">{beast.Name}</h2>
              </div>
              <div className="beast-type-badge-carrousel">{beast.BeastsType}</div>
              <div className="beast-image-container-carrousel">
                {beastImages[beast.Name] && (
                  <img
                    src={beastImages[beast.Name]}
                    alt={beast.Name}
                    className="beast-image-carrousel"
                    onError={() => handleImageError(beast.Name)}
                  />
                )}
              </div>
              <div className="beast-info-carrousel">
                <div className="info-row">
                  {renderTypeSection('Height', [beast.Height])}
                  {renderTypeSection('Weight', [beast.Weight])}
                </div>
                {renderTypeSection('Effective Against', beast.EffectiveAgainst)}
                {renderTypeSection('Weak Against', beast.WeakAgainst)}
                {renderTypeSection('Favorite Food', beast.FavoriteFood)}
                <div className="evolution-section-carrousel">
                  <h3>Evolution Line</h3>
                  <div className="evolution-chain-carrousel">
                    {beast.BeastsEvolutions.map((evolution, idx) => (
                      <div key={idx} className="evolution-step-carrousel">
                        {evolution}
                        {idx < beast.BeastsEvolutions.length - 1 && (
                          <span className="evolution-arrow-carrousel">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="base-stats-section-carrousel">
                  <h3>Base Stats </h3>
                  <StatsCarousel beast={beast} />
                </div>
                <div className="bio-section-carrousel">
                  <h3>Bio</h3>
                  {beast.Bio.map((paragraph, idx) => (
                    <p key={idx} className="bio-paragraph-carrousel">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}

export default DexCarousel;
