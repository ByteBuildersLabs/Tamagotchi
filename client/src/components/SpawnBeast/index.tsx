import { useAccount } from "@starknet-react/core";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import initials, { Initial } from "../../data/initials";
import './main.css';
import Hints from "../Hints/index.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";

function SpawnBeast() {
  const { spawn } = useSystemCalls();
  const { account } = useAccount();

  return (
    <div className="spawn-beast">
      <p className={'title mb-4'}>
        Collect them all!
        <span className='d-block'>There are many species</span>
      </p>
      {initials.map((beast: Initial, i) => {
        return (
          <div key={i} className="initial-beast">
            <img src={beast.idlePicture} alt="beast" />
            <div className="initial-info">
              <h4>
                {beast.name}
              </h4>
              <p>
                {beast.description}
              </p>
              <button
                disabled={account ? false : true}
                className="button"
                onClick={async () => {
                  await spawn(i + 1);
                  (document.querySelector('.navbar-toggler') as HTMLElement)?.click();
                }}>Spawn
              </button>
            </div>
          </div>
        )
      })}
      <ControllerConnectButton />
      <Hints />
    </div>
  );
}

export default SpawnBeast;
