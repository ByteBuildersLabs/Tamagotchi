import React, { useState, useEffect } from 'react';
import beastsData from '../../data/dex/BeastsDex.json';
import DexCarousel from '../Dex/index.tsx';
import './main.css';

interface Beast {
  Name: string;
  BeastsType: string;
}

interface BeastWithIndex {
  beast: Beast;
  index: number;
}

const PokedexGrid: React.FC = () => {
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
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

  const beastsWithIndex: BeastWithIndex[] = beastsData.BeastsDex.map((beast, index) => ({
    beast,
    index,
  }));

  // Crear filas de 3 elementos
  const createRows = (items: BeastWithIndex[]): BeastWithIndex[][] => {
    const result: BeastWithIndex[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      result.push(items.slice(i, i + 3));
    }
    return result;
  };

  const rows = createRows(beastsWithIndex);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseDetail = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="grid-container">
      {selectedIndex === null ? (
        <>
          <h1 className="grid-title">BeastsDex</h1>
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
                        <h2 className="beast-name">{beast.Name}</h2>
                        <span className="beast-type">{beast.BeastsType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <DexCarousel initialSlide={selectedIndex} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default PokedexGrid;