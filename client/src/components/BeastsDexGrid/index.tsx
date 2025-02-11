// PokedexGrid.tsx
import React, { useState, useEffect } from 'react';
import beastsData from '../../data/dex/BeastsDex.json';
import DexCarousel from '../Dex/index.tsx';
import './main.css';

interface Beast {
  Name: string;
  BeastsType: string;
  // otros campos si los necesitas
}

interface BeastWithIndex {
  beast: Beast;
  index: number;
}

const PokedexGrid: React.FC = () => {
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Cargar imágenes de cada beast
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

  // Asignamos índice a cada beast para mantener el orden original
  const beastsWithIndex: BeastWithIndex[] = beastsData.BeastsDex.map((beast, index) => ({
    beast,
    index,
  }));

  // Distribuimos los beasts en 3 filas (round-robin)
  const rows: BeastWithIndex[][] = [[], [], []];
  beastsWithIndex.forEach((item, idx) => {
    rows[idx % 3].push(item);
  });

  // Maneja el clic en una tarjeta del grid
  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Función para el botón "Volver" en DexCarousel
  const handleCloseDetail = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="container pokedex-grid-container">
      {selectedIndex === null ? (
        <>
          {/* Título propio del grid */}
          <h1 className="grid-title">BeastsDex</h1>
          {rows.map((row, rowIndex) => (
            <div className="row mb-4" key={rowIndex}>
              {row.map(({ beast, index }) => (
                <div className="col" key={index}>
                  <div
                    className="card beast-card"
                    onClick={() => handleCardClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {beastImages[beast.Name] ? (
                      <img
                        src={beastImages[beast.Name]}
                        className="card-img-top beast-card-img"
                        alt={beast.Name}
                      />
                    ) : (
                      <div className="beast-card-img-placeholder">No Image</div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{beast.Name}</h5>
                      <p className="card-text">{beast.BeastsType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        // Vista de detalle: DexCarousel se encarga de mostrar su propio título
        <DexCarousel initialSlide={selectedIndex} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default PokedexGrid;
