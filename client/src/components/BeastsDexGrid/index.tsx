import React, { useState, useEffect } from 'react';
import beastsData from '../../data/dex/BeastsDex.json';
import DexCarousel from '../Dex/index.tsx';
import './main.css';

/**
 * Represents a beast with its name and type.
 *
 * @typedef {Object} Beast
 * @property {string} Name - The name of the beast.
 * @property {string} BeastsType - The type of the beast.
 */
interface Beast {
  Name: string;
  BeastsType: string;
}

/**
 * Represents a beast along with its index in the list.
 *
 * @typedef {Object} BeastWithIndex
 * @property {Beast} beast - The beast data.
 * @property {number} index - The index of the beast in the dataset.
 */
interface BeastWithIndex {
  beast: Beast;
  index: number;
}

/**
 * PokedexGrid Component - Displays a grid of beast cards.
 *
 * This component loads images for each beast, arranges the beasts into a grid,
 * and allows a user to click on a beast card to view detailed information in a carousel.
 *
 * @component
 * @returns {JSX.Element} The rendered grid view or detailed carousel view.
 */
const BeastsDexGrid: React.FC = () => {
  // State for holding loaded beast images
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
  // State for tracking the currently selected beast index for detailed view
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    /**
     * Asynchronously loads images for each beast from the assets folder.
     * Updates the beastImages state with the loaded image paths.
     *
     * @async
     * @returns {Promise<void>}
     */
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

  /**
   * Organizes an array of beast items into rows with three items per row.
   *
   * @param {BeastWithIndex[]} items - Array of beast items with their indices.
   * @returns {BeastWithIndex[][]} A two-dimensional array where each sub-array represents a row.
   */
  const createRows = (items: BeastWithIndex[]): BeastWithIndex[][] => {
    const result: BeastWithIndex[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      result.push(items.slice(i, i + 3));
    }
    return result;
  };

  // Create rows for the grid layout
  const rows = createRows(beastsWithIndex);

  /**
   * Handles the click event on a beast card, setting the selected index to display details.
   *
   * @param {number} index - The index of the clicked beast card.
   * @returns {void}
   */
  const handleCardClick = (index: number): void => {
    setSelectedIndex(index);
  };

  /**
   * Handles closing the detailed carousel view by resetting the selected index.
   *
   * @returns {void}
   */
  const handleCloseDetail = (): void => {
    setSelectedIndex(null);
  };

  return (
    <div className="dex-container-syles">
      {selectedIndex === null ? (
        <>
          <h1 className="grid-title">BeastsDex</h1>
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
          </div>
        </>
      ) : (
        <DexCarousel initialSlide={selectedIndex} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default BeastsDexGrid;
