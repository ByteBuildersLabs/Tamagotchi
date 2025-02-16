import { useState } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import './main.css';

const TamagotchiJR = () => {
  const [run, setRun] = useState(true);

  const steps = [
    {
      target: ".navbar .logo img",
      content: "Here you will come back to the Tamagotchi Screen",
    },
    {
      target: ".sound-button",
      content: "Enable and disable the sound",
    },
    {
      target: ".dex-icon",
      content: "Here is your Beasts Dex",
    },
    {
      target: ".bag-icon",
      content: "Here are your Beasts",
    },
    {
      target: ".status",
      content: "Here are the stats of your Baby Beast, It will decrease every 5 seconds",
    },
    {
      target: ".beast-interaction .actions-icon",
      content: "Here are the actions. Interact with your Baby Beast to increase his stats and level up",
    },
    {
      target: ".beast-interaction .message-icon",
      content: "Here you can talk to your Baby Beasts! Say hi :D",
    },
    {
      target: ".beast-interaction .stats-icon",
      content: "Here the stats of your Baby Beast, the better you care, the better the stats",
    },
    {
      target: ".hatch-icon",
      content: "Here you can hatch a new egg, take your Baby to level 15 and get a surprise!",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as "finished" | "skipped")) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default TamagotchiJR;
