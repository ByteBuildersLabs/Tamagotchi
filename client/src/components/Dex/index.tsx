// DexCarousel.tsx
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsData from '../../data/dex/BeastsDex.json';
import Header from "../Header/index.tsx";
import './main.css';

interface DexCarouselProps {
  initialSlide?: number;
  onClose?: () => void; // Callback para el botón "Volver"
}

/**
 * DexCarousel Component - Displays a slider with Beasts information.
 * @param {DexCarouselProps} props
 * @returns {JSX.Element} The rendered DexCarousel component.
 */
function DexCarousel({ initialSlide = 0, onClose }: DexCarouselProps) {
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadBeastImages = async () => {
      const loadedImages: Record<string, string> = {};
      for (const beast of beastsData.BeastsDex) {
        try {
          const imagePath = `../../assets/beasts/${beast.Name}-idle.gif`;
          const imageModule = await import(/* @vite-ignore */ imagePath);
          loadedImages[beast.Name] = imageModule.default;
        } catch (error) {
          console.error(`Error loading image for ${beast.Name}:`, error);
          loadedImages[beast.Name] = '';
        }
      }
      setBeastImages(loadedImages);

      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('day', 'night');
        bodyElement.style.backgroundSize = 'cover';
        bodyElement.style.padding = '80px 15px 30px';
      }
    };

    loadBeastImages();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide, // iniciamos en el beast seleccionado
    arrows: false,
    swipe: beastsData.BeastsDex.length > 1,
    customPaging: function () {
      return <div className="indicator-carrousel"></div>;
    }
  };

  const handleImageError = (beastName: string) => {
    console.error(`Failed to load image for ${beastName}`);
  };

  const renderTypeSection = (title: string, types: string[]) => (
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

  return (
    <>
      <Header />
      <div className="dex-container-carrousel">
        {/* Botón "Volver": se renderiza si se provee la prop onClose */}
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
                {renderTypeSection('Effective Against', beast.EffectiveAgainst)}
                {renderTypeSection('Weak Against', beast.WeakAgainst)}
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
