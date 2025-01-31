import { SDK } from "@dojoengine/sdk";
import { Link } from 'react-router-dom';
import { Schema } from "../../dojo/bindings.ts";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { Swords, ShieldPlus, TestTubeDiagonal, CircleGauge, } from 'lucide-react';
import initials from "../../data/initials.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import './main.css';

function Bag({ sdk }: { sdk: SDK<Schema> }) {

  const beast = useBeast(sdk);

  return (
    <>
      <div className="bag">
        <div className="eggs">
          <p className={'title mb-4'}>
            Here will appear your <span>BabyBeasts</span>
          </p>
          <div>
            {
              beast &&
              <Link to={`/play`} className="beast" onClick={() => (document.querySelector('.navbar-toggler') as HTMLElement)?.click()}>
                <div className="beast-pic d-flex align-items-end">
                  <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
                  <h4 className="d-flex">
                    <span>{beast.level}</span> Lvl
                  </h4>
                </div>
                <div className="data">
                  <div className="item">
                    <div>
                      <Swords />
                      <span>{Math.round(beast.attack)}</span>
                    </div>
                  </div>
                  <div className="item">
                    <div>
                      <ShieldPlus />
                      <span>{Math.round(beast.defense)}</span>
                    </div>
                  </div>
                  <div className="item">
                    <div>
                      <CircleGauge />
                      <span>{Math.round(beast.speed)}</span>
                    </div>
                  </div>
                  <div className="item">
                    <div>
                      <TestTubeDiagonal />
                      <span>{(beast.experience)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            }
          </div>
          <ControllerConnectButton />
        </div>
      </div>
    </>
  )
}

export default Bag;
