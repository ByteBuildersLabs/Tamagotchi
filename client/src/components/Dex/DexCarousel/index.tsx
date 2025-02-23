import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import beastsDex, { iBeastDex } from '../../../data/beastDex.tsx';
import goBackIcon from '../../../assets/img/GoBack.svg';
import StatsCarousel from '../BaseStats/baseStats.tsx';
import RadarStats from '../Radar';
import { generateSpeech } from '../../../services/text-to-speech.ts';
import { findMatchingVoice } from '../../../utils/voiceUtils.ts';
import './main.css';


interface DexCarouselProps {
  initialSlide?: number;
  onClose?: () => void;
}

function DexCarousel({ initialSlide = 0, onClose }: DexCarouselProps): JSX.Element {
  // State for holding dynamically loaded beast images
  const [beastImages, setBeastImages] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        bodyElement.style.padding = '22px 15px';
      }
    };

    loadBeastImages();
  }, []);

  const handlePlay = async (beastsDex: iBeastDex) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }

      // Find the corresponding voice for the current beast
      const beastVoice = findMatchingVoice(beastsDex.name);
      console.log(`Using voice ${beastVoice.name} (${beastVoice.id}) for ${beastsDex.name}`);

      // We use the bio or description, whichever is available
      const textToSpeak = beastsDex.Bio ? beastsDex.Bio.join('. ') : beastsDex.description;
      
      const data = await generateSpeech(textToSpeak, beastVoice.id);
      
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };

        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  };

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
                <button
                    className="sound-button-carrousel"
                    onClick={() => isPlaying ? handleStop() : handlePlay(beast)}
                    title={`Listen to ${beast.name}'s description`}
                  >
                    <div className="sound-button-carrousel__icon">
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 9L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 9L23 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.07 5.93C20.9447 7.80528 21.9979 10.3478 21.9979 13C21.9979 15.6522 20.9447 18.1947 19.07 20.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
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
