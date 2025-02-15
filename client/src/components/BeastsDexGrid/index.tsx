import React, { useState, useEffect } from 'react';
import beastsData from '../../data/dex/BeastsDex.json';
import DexCarousel from '../Dex/DexCarousel/index.tsx';
import GoBackButton from '../GoBack/GoBackButton.tsx';
import './main.css';
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton.tsx';

interface Beast {
  Name: string;
  BeastsType: string;
}

interface BeastWithIndex {
  beast: Beast;
  index: number;
}

const BeastsDexGrid: React.FC = () => {
  // State for holding loaded beast images
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
  // State for tracking the currently selected beast index for detailed view
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadImages = async () => {
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

    loadImages();
  }, []);

  // Combine beasts data with their indices
  const beastsWithIndex: BeastWithIndex[] = beastsData.BeastsDex.map((beast, index) => ({
    beast,
    index,
  }));

  const createRows = (items: BeastWithIndex[]): BeastWithIndex[][] => {
    const result: BeastWithIndex[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      result.push(items.slice(i, i + 3));
    }
    return result;
  };

  // Create rows for the grid layout
  const rows = createRows(beastsWithIndex);

  const handleCardClick = (index: number): void => {
    setSelectedIndex(index);
  };

  const handleCloseDetail = (): void => {
    setSelectedIndex(null);
  };

  return (
    <div className="dex-container-syles">
      {selectedIndex === null ? (
        <>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <p className={'title'}>
              Beast DEX
              <span className='d-block'>Collect them all!</span>
            </p>
            <ControllerConnectButton />
          </div>
          <div className="scrollable-container">
            <div className="beast-grid">
              {rows.map((row, rowIndex) => (
                <div className="grid-row" key={rowIndex}>
                  {row.map(({ beast, index }) => (
                    <div 
                      className="beast-card-wrapper" 
                      key={index}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="beast-card">
                        {beastImages[beast.Name] ? (
                          <div className="beast-image-container">
                            <img
                              src={beastImages[beast.Name]}
                              className="beast-image"
                              alt={beast.Name}
                            />
                          </div>
                        ) : (
                          <div className="beast-image-placeholder">No Image</div>
                        )}
                        <div className="beast-info">
                          <h2 className="beast-name" style={{ fontSize: '15px' }}>
                            {beast.Name}
                          </h2>
                          <span className="beast-type" style={{ marginBottom: '5px' }}>
                            {beast.BeastsType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="go-back-container">
              <GoBackButton/>
            </div>
          </div>
        </>
      ) : (
        <DexCarousel initialSlide={selectedIndex} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default BeastsDexGrid;
