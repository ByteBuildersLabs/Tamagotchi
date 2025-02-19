import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsDex from '../../../data/beastDex.tsx';
import goBackIcon from '../../../assets/img/GoBack.svg';
import StatsCarousel from '../BaseStats/baseStats.tsx';
import RadarStats from '../Radar';
import './main.css';

interface DexCarouselProps {
  initialSlide?: number;
  onClose?: () => void;
}

function DexCarousel({ initialSlide = 0, onClose }: DexCarouselProps): JSX.Element {
  // State for holding dynamically loaded beast images
  const [beastImages, setBeastImages] = useState<string[]>([]);

  // Load beast images on component mount
  useEffect(() => {

    const loadBeastImages = async () => {
      const loadedImages = beastsDex.map((beast) => beast.idlePicture);
      setBeastImages(loadedImages);
      // Update body element styling after images are loaded
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('day', 'night');
        bodyElement.style.backgroundSize = 'cover';
        bodyElement.style.padding = '15px';
      }
    };

    loadBeastImages();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide,
    arrows: false,
    swipe: beastsDex.length > 1,
    customPaging: function () {
      return <div className="indicator-carrousel"></div>;
    }
  };

  const handleImageError = (beastName: string): void => {
    console.error(`Failed to load image for ${beastName}`);
  };

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
      <div className="dex-container-carrousel">
        <Slider {...settings}>
          {beastsDex.map((beast, index) => (
            <div key={index} className="beast-card-carrousel">
              <div className='d-flex justify-content-between'>
                <div className="beast-header-carrousel">
                  <h2 className="beast-name-carrousel">{beast.name}</h2>
                  <h3 className="beast-type-badge-carrousel">{beast.BeastsType}</h3>
                </div>
                {onClose && (
                  <button
                    className="back-button-carrousel"
                    onClick={onClose}
                  >
                    <div className="back-button-carrousel__icon">
                      <img src={goBackIcon} alt="Back" />
                    </div>
                  </button>
                )}
              </div>
              <div className="beast-image-container-carrousel">
                {beastImages[index] && (
                  <img
                    src={beastImages[index]}
                    alt={beast.name}
                    className="beast-image-carrousel"
                    onError={() => handleImageError(beast.name)}
                  />
                )}
              </div>
              <div className="beast-info-carrousel">
                <div className="bio-section-carrousel">
                  <h3>Bio</h3>
                  {beast.Bio && beast.Bio.map((paragraph, idx) => (
                    <p key={idx} className="bio-paragraph-carrousel">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="info-row">
                  {renderTypeSection('Height', [beast.Height || 'Unknown'])}
                  {renderTypeSection('Weight', [beast.Weight || 'Unknown'])}
                </div>
                {renderTypeSection('Effective Against', beast.EffectiveAgainst || [])}
                {renderTypeSection('Weak Against', beast.WeakAgainst || [])}
                {renderTypeSection('Favorite Food', beast.FavoriteFood || [])}
                <div className="evolution-section-carrousel">
                  <h3>Evolution Line</h3>
                  <div className="evolution-chain-carrousel">
                    {beast.BeastsEvolutions && beast.BeastsEvolutions.map((evolution, idx) => (
                      <div key={idx} className="evolution-step-carrousel">
                        {evolution}
                        {beast.BeastsEvolutions && idx < beast.BeastsEvolutions.length - 1 && (
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
                <div className="base-stats-section-carrousel">
                  <h3>Skills </h3>
                  <RadarStats beast={beast} />
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
