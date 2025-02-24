import { BeastStatus } from "../../../dojo/bindings";
import Energy from '../../../assets/img/Energy.svg';
import Happyness from '../../../assets/img/Mood.svg';
import Hygienne from '../../../assets/img/Hygeine.svg';
import Hunger from '../../../assets/img/Hunger.svg';
import './main.css';

const statusItems = [
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.energy), pic: Energy },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.hunger), pic: Hunger },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.happiness), pic: Happyness },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.hygiene), pic: Hygienne }
];

function Status({ beastStatus }: { beastStatus: any }) {

  if(beastStatus) {
    return (
      <div className="status">
        {statusItems.map(({ pic }) => (
          <div className="item">
            <div className="pic"><img src={pic} /></div>
          </div>
        ))}
      </div>
    );
  }
}

export default Status;
