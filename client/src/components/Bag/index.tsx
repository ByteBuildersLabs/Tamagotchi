import { SDK } from "@dojoengine/sdk";
import { Link } from "react-router-dom";
import { Schema } from "../../dojo/bindings.ts";
import { useBeast } from "../../hooks/useBeasts.tsx";
import {
  Swords,
  ShieldPlus,
  TestTubeDiagonal,
  CircleGauge,
} from "lucide-react";
import initials from "../../data/initials.tsx";
import "./main.css";
import Joyride, { Placement } from "react-joyride";
import { useState } from "react";

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  // Trigger

  const beast = useBeast(sdk);

  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        content: <h2>Caring for your creature!</h2>,
        placement: "right" as Placement,
        target: "#step-2",
        title: "Baby beast Toturial",
      },
    ],
  });

  return (
    <>
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
      <div className="bag">
        <div className="eggs">
          <p className={"title mb-4"} id="step-2">
            Here will appear your <span>BabyBeasts</span>
          </p>
          <div>
            {beast && (
              <Link
                to={`/play`}
                className="beast"
                onClick={() =>
                  (
                    document.querySelector(".navbar-toggler") as HTMLElement
                  )?.click()
                }
              >
                <div className="beast-pic d-flex align-items-end">
                  <img
                    src={initials[beast.specie - 1].idlePicture}
                    alt="beast"
                  />

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
                      <span>{beast.experience}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bag;
