import { useAccount } from "@starknet-react/core";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import initials, { Initial } from "../../data/initials";
import "./main.css";
import Hints from "../Hints/index.tsx";
import { useState } from "react";
import Joyride, { Placement } from "react-joyride";

function SpawnBeast() {
  const { spawn } = useSystemCalls();
  const { account } = useAccount();
  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        content: <h2>Spawn your creature!</h2>,
        placement: "button" as Placement,
        target: "#step-1",
        title: "Baby beast Toturial",
      },
    ],
  });

  return (
    <div className="spawn-beast">
      <Joyride
        run={run}
        steps={steps}
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: {
            backgroundColor: "#370001",
            overlayColor: "rgba(79, 26, 0, 0.4)",
            primaryColor: "#000",
            textColor: "white",
            width: 500,
            zIndex: 1000,
          },
        }}
      />
      <p className={"title mb-4"}>
        Collect them all!
        <span className="d-block">There are many species</span>
      </p>
      {initials.map((beast: Initial, i) => {
        return (
          <div key={i} className="initial-beast">
            <img src={beast.idlePicture} alt="beast" />
            <div className="initial-info">
              <h4>{beast.name}</h4>
              <p>{beast.description}</p>
              <button
                disabled={account ? false : true}
                className="button"
                id={i === 0 ? `step-${i + 1}` : undefined}
                onClick={async () => {
                  await spawn(i + 1);
                  (
                    document.querySelector(".navbar-toggler") as HTMLElement
                  )?.click();
                }}
              >
                Spawn
              </button>
            </div>
          </div>
        );
      })}
      <Hints />
    </div>
  );
}

export default SpawnBeast;
