import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsData from '../../data/dex/BeastsDex.json';
import './main.css';

function DexCarousel() {
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
    };

    loadBeastImages();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: beastsData.BeastsDex.length > 1,
    customPaging: function () {
      return <div className="indicator"></div>;
    }
  };

  const handleImageError = (beastName: string) => {
    console.error(`Failed to load image for ${beastName}`);
  };

  const renderTypeSection = (title: string, types: string[]) => (
    <div className="type-section">
      <h3>{title}</h3>
      <div className="type-tags">
        {types.map((type, index) => (
          <span key={index} className="type-tag">
            {type}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dex-container">
      <h1 style={{ color: '#ECECDA' }}>BeastsDex</h1>
      <Slider {...settings}>
        {beastsData.BeastsDex.map((beast, index) => (
          <div key={index} className="beast-card">
            <div className="beast-header">
              <h2 className="beast-name">{beast.Name}</h2>
            </div>
            
            <div className="beast-type-badge" >
              {beast.BeastsType}
            </div>

            <div className="beast-image-container">
              {beastImages[beast.Name] && (
                <img
                  src={beastImages[beast.Name]}
                  alt={beast.Name}
                  className="beast-image"
                  onError={() => handleImageError(beast.Name)}
                />
              )}
            </div>

            <div className="beast-info">
              {renderTypeSection('Effective Against', beast.EffectiveAgainst)}
              {renderTypeSection('Weak Against', beast.WeakAgainst)}

              <div className="evolution-section">
                <h3>Evolution Line</h3>
                <div className="evolution-chain">
                  {beast.BeastsEvolutions.map((evolution, idx) => (
                    <div key={idx} className="evolution-step">
                      {evolution}
                      {idx < beast.BeastsEvolutions.length - 1 && <span className="evolution-arrow">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bio-section">
                <h3>Bio</h3>
                {beast.Bio.map((paragraph, idx) => (
                  <p key={idx} className="bio-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default DexCarousel;