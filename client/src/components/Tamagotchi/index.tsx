import { useEffect, useState } from "react";
import { Account } from "starknet";
import { useAccount } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings";
import { Card } from "../../components/ui/card";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { useParams } from "react-router-dom";
import initials from "../../data/initials.tsx";
import message from "../../assets/img/message.svg";
import dead from "../../assets/img/dead.gif";
import Stats from "./Stats/index.tsx";
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Talk from "./Talk/index.tsx";
import Food from "./Food/index.tsx";
import Whispers from "./Whispers/index.tsx";
import useSound from "use-sound";
import feedSound from "../../assets/sounds/bbeating.mp3";
import cleanSound from "../../assets/sounds/bbshower.mp3";
import sleepSound from "../../assets/sounds/bbsleeps.mp3";
import playSound from "../../assets/sounds/bbjump.mp3";
import reviveSound from "../../assets/sounds/bbrevive.mp3";
import monster from "../../assets/img/logo.svg";
import Joyride, { Placement } from "react-joyride";
import "./main.css";
import { Button } from "../ui/button.tsx";

function Tamagotchi({ sdk }: { sdk: SDK<Schema> }) {
  const { beasts } = useBeast(sdk);
  const { beastId } = useParams();
  const beast = beasts.find(
    (beast: Beast) => String(beast.beast_id) === beastId
  );

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState("actions");

  //Joyride
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    {
      title: "Welcome to your Tamagotchi!",
      content: <h2>Here you can take care of your Baby Beast.</h2>,
      placement: "center" as Placement,
      target: "#step-Energy",
    },
    {
      title: "Energy",
      content: (
        <h2>Represents the Tamagotchi's energy; it recovers by sleeping</h2>
      ),
      placement: "center" as Placement,
      target: "#step-Energy",
    },
    {
      title: "Hunger",
      content: <h2>Measures the hunger level; decreases by eating</h2>,
      placement: "center" as Placement,
      target: "#step-Hunger",
    },
    {
      title: "Happiness",
      content: (
        <h2>
          Indicates how happy it is; increases by playing and getting attention
        </h2>
      ),
      placement: "center" as Placement,
      target: "#step-Happiness",
    },
    {
      title: "Hygiene",
      content: (
        <h2>
          Reflects cleanliness; decreases over time and is restored by bathing
        </h2>
      ),
      placement: "center" as Placement,
      target: "#step-Hygiene",
    },
    {
      title: "Feed",
      content: <h2>Give food to your Tamagotchi to satisfy its hunger.</h2>,
      placement: "center" as Placement,
      target: "#step-Feed",
    },
    {
      title: "Sleep",
      content: <h2>Put your Tamagotchi to sleep to recover energy.</h2>,
      placement: "center" as Placement,
      target: "#step-Sleep",
    },
    {
      title: "Clean",
      content: <h2>Use this to keep your Tamagotchi clean and happy.</h2>,
      placement: "center" as Placement,
      target: "#step-Clean",
    },
    {
      title: "Play",
      content: <h2>Play with your Tamagotchi to increase its happiness.</h2>,
      placement: "center" as Placement,
      target: "#step-Play",
    },
    {
      title: "Wake Up",
      content: <h2>Wake up your Tamagotchi to get it active again.</h2>,
      placement: "center" as Placement,
      target: "#step-Wake-up",
    },
    {
      title: "Revive",
      content: <h2>If your Tamagotchi is down, you can revive it here.</h2>,
      placement: "center" as Placement,
      target: "#step-Revive",
    },
  ];

  // Add sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  const [isModalOpen, setModalOpen] = useState(false);

  const {
    setup: { client },
  } = useDojo();

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      const isDayTime = hour > 6 && hour < 18;
      const bodyElement = document.querySelector(".body") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add(`${isDayTime ? "day" : "night"}`);
        bodyElement.style.backgroundSize = "inherit";
        bodyElement.style.padding = "80px 15px 30px";
      }
    };
    updateBackground();
  }, []);

  const { account } = useAccount();

  // Animations
  const [currentImage, setCurrentImage] = useState(
    beast ? initials[beast.specie - 1].idlePicture : ""
  );
  const [firstTime, isFirstTime] = useState(true);

  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : "");
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : "");
    }, loadingTime);
  };
  const showDeathAnimation = () => {
    setCurrentImage(dead);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (beast?.is_alive && account) {
        await client.actions.decreaseStats(account as Account);
      }
    }, 10000000);

    return () => clearInterval(interval);
  }, [beast?.is_alive]);

  useEffect(() => {
    if (beast?.is_alive == false) {
      showDeathAnimation();
    }
  }, [beast?.is_alive]);

  // Helper to wrap Dojo actions with toast
  const handleAction = async (
    actionName: string,
    actionFn: () => Promise<{ transaction_hash: string } | undefined>,
    animation: string
  ) => {
    setIsLoading(true);
    showAnimation(animation);

    // Trigger sound based on action
    switch (actionName) {
      case "Feed":
        playFeed();
        break;
      case "Clean":
        playClean();
        break;
      case "Sleep":
        playSleep();
        break;
      case "Play":
        playPlay();
        break;
      case "Revive":
        playRevive();
        break;
      case "Wake up":
        console.warn("Missing sound for awake action");
        break;
    }
    actionFn();
  };

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        hideCloseButton={true}
        callback={(data) => {
          const { action, index, status, type } = data;
          if (action === "next" && index < steps.length - 1) {
            setStepIndex(index + 1);
          } else if (action === "prev" && index > 0) {
            setStepIndex(index - 1);
          } else if (
            status === "finished" ||
            status === "skipped" ||
            (action === "next" && index === steps.length - 1)
          ) {
            setRun(false);
            setStepIndex(0);
          } else if (type === "tour:end") {
            setRun(false);
          }
        }}
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

      <div className="tamaguchi">
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <Button
            className="btn-dark"
            type="button"
            onClick={() => setRun(true)}
          >
            Tutorial
          </Button>
        </div>

        <>
          {beast && (
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div className="status-tamagotchi">
                <Status beast={beast} />
              </div>

              <div>
                <div
                  className="scenario flex justify-center items-column"
                  style={{ height: "90%" }}
                >
                  <img
                    src={currentImage}
                    alt="Tamagotchi"
                    className="w-40 h-40"
                  />
                </div>
                <Whispers beast={beast} />
                {currentView === "stats" ? (
                  <Stats beast={beast} />
                ) : currentView === "actions" ? (
                  <Actions
                    handleAction={handleAction}
                    isLoading={isLoading}
                    beast={beast}
                    account={account}
                    client={client}
                    setCurrentView={setCurrentView}
                  />
                ) : currentView === "food" ? (
                  <Food
                    handleAction={handleAction}
                    beast={beast}
                    account={account}
                    client={client}
                    showAnimation={showAnimation}
                  />
                ) : (
                  <></>
                )}
                <div className="beast-interaction">
                  <img
                    src={monster}
                    onClick={() =>
                      setCurrentView(
                        currentView !== "actions" ? "actions" : "stats"
                      )
                    }
                  />
                  <img src={message} onClick={() => setModalOpen(true)} />
                </div>
              </div>
            </Card>
          )}
        </>
        <Talk
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          pic={currentImage}
          name={initials[beast?.specie - 1]?.name}
        />
      </div>
    </>
  );
}

export default Tamagotchi;
