import React, { useEffect, useState } from 'react';
import DexCarousel from '../Dex/DexCarousel/index.tsx';
import beastsDex, { iBeastDex, } from '../../data/beastDex.tsx';
import './main.css';
import Header from '../Header/index.tsx';

interface BeastWithIndex {
  beast: iBeastDex;
  index: number;
}

const BeastsDexGrid: React.FC = () => {
  // State for holding loaded beast images
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
  // State for tracking the currently selected beast index for detailed view
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const pics = beastsDex.reduce((acc, beast) => {
      acc[beast.name] = beast?.idlePicture;
      return acc;
    }, {} as Record<string, string>);
    setBeastImages(pics);
  }, []);

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
    }
  }, []);

  // Combine beasts data with their indices
  const beastsWithIndex: BeastWithIndex[] = beastsDex.map((beast, index) => ({
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
    <>
      <Header />
      <div className="dex-container-syles">
        {selectedIndex === null ? (
          <>
            <div className='d-flex justify-content-between align-items-center'>
              <p className={'title'}>
                Beast DEX
                <span className='d-block'>Knowledge source</span>
              </p>
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
                          {beastImages[beast.name] ? (
                            <div className="beast-image-container">
                              <img
                                src={beastImages[beast.name]}
                                className="beast-image"
                                alt={beast.name}
                              />
                            </div>
                          ) : (
                            <div className="beast-image-placeholder">No Image</div>
                          )}
                          <div className="beast-info">
                            <h2 className="beast-name" style={{ fontSize: '15px' }}>
                              {beast.name}
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
              <div className="initial-info">
                <h4>
                  This to your Beasts Dex
                </h4>
                <p className='mb-4'>
                  Tap the beasts and get more info. More Beasts are coming to the Byte Beasts Universe soon!
                </p>
              </div>
            </div>
          </>
        ) : (
          <DexCarousel initialSlide={selectedIndex} onClose={handleCloseDetail} />
        )}
      </div>
    </>

  );
};

export default BeastsDexGrid;
