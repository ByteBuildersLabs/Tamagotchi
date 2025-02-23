import { BeastStatus } from "../../../dojo/bindings";
import Energy from '../../../assets/img/energy.svg';
import Happyness from '../../../assets/img/happiness.svg';
import Hygienne from '../../../assets/img/bubble.svg';
import Hunger from '../../../assets/img/hunger.svg';
import './main.css';

const statusItems = [
  { label: "Energy", value: (beastStatus: BeastStatus) => Math.round(beastStatus.energy), pic: Energy },
  { label: "Hunger", value: (beastStatus: BeastStatus) => Math.round(beastStatus.hunger), pic: Hunger },
  { label: "Happiness", value: (beastStatus: BeastStatus) => Math.round(beastStatus.happiness), pic: Happyness },
  { label: "Hygiene", value: (beastStatus: BeastStatus) => Math.round(beastStatus.hygiene), pic: Hygienne }
];

function Status({ beastStatus }: { beastStatus: any }) {

  if(beastStatus) {
    return (
      <div className="status">
        {statusItems.map(({ label, value, pic }) => (
          <div className="item" key={label}>
            <p className="mb-1">{label}</p>
            <div className="pic"><img src={pic} /></div>
            <p className="value">{value(beastStatus)}%</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Status;
