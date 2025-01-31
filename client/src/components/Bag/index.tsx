import { SDK } from "@dojoengine/sdk";
import { Schema } from "../../dojo/bindings.ts";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { Swords, ShieldPlus, TestTubeDiagonal, CircleGauge } from 'lucide-react';
import initials from "../../data/initials.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import Carousel from '../../components/Carousel/Carousel.tsx';
import './main.css';

interface BeastData {
  title: string;
  image: string;
  description: string;
  beast: any; // Usa tu tipo real de bestia aquí
}

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  const currentBeast = useBeast(sdk);

  // Datos para el carrusel basados en tus bestias
  const beastsData: BeastData[] = [
    {
      title: 'Baby Beast',
      image: initials[(currentBeast?.specie ?? 1) - 1]?.idlePicture || '',
      description: 'The sheep is a social animal that thrives in flocks.',
      beast: currentBeast
    },
    // Agrega más bestias según sea necesario
  ];

  const handleSpawn = (selectedBeast: BeastData) => {
    // Lógica de spawn usando el SDK
    console.log('Spawning:', selectedBeast.title);
    // Aquí iría tu implementación real con el SDK
  };

  return (
    <div className="bag">
      <div className="eggs">
        <p className="title mb-4">
          Choose your <span>BabyBeast</span>
        </p>
        
        <Carousel 
          beasts={beastsData}
          renderSlide={(beast: BeastData) => (
            <div className="beast-content">
              <div className="beast-pic d-flex align-items-end">
                <img src={beast.image} alt={beast.title} />
                <h4 className="d-flex">
                  <span>{beast.beast?.level}</span> Lvl
                </h4>
              </div>
              <div className="data">
                <div className="item">
                  <div>
                    <Swords />
                    <span>{Math.round(beast.beast?.attack)}</span>
                  </div>
                </div>
                <div className="item">
                  <div>
                    <ShieldPlus />
                    <span>{Math.round(beast.beast?.defense)}</span>
                  </div>
                </div>
                <div className="item">
                  <div>
                    <CircleGauge />
                    <span>{Math.round(beast.beast?.speed)}</span>
                  </div>
                </div>
                <div className="item">
                  <div>
                    <TestTubeDiagonal />
                    <span>{(beast.beast?.experience)}</span>
                  </div>
                </div>
              </div>
              <button 
                className="spawn-button"
                onClick={() => handleSpawn(beast)}
              >
                SPAWN
              </button>
            </div>
          )}
        />

        <ControllerConnectButton />
      </div>
    </div>
  );
}

export default Bag;