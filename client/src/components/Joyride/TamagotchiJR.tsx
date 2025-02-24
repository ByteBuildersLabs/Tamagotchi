import Joyride from "react-joyride";
import './main.css';

const TamagotchiJR = ({ run = false }: { run:boolean }) => {

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
      target: ".lore-icon",
      content: "Here is the lore of Byte Beasts",
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

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={() => {}}
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
