import { BeastStatus } from "../../../dojo/bindings";
import CircularProgressBar from "../../ui/circularProgressBar";
import Energy from '../../../assets/img/energy.svg';
import Happyness from '../../../assets/img/Mood.svg';
import Hygienne from '../../../assets/img/Hygeine.svg';
import Hunger from '../../../assets/img/hunger.svg';
import './main.css';


const statusItems = [
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.energy), pic: Energy, color: '#ECECDA' },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.hunger), pic: Hunger, color: '#ECECDA' },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.happiness), pic: Happyness, color: '#ECECDA' },
  { value: (beastStatus: BeastStatus) => Math.round(beastStatus.hygiene), pic: Hygienne, color: '#ECECDA' }
];

function Status({ beastStatus }: { beastStatus: any }) {

  if(beastStatus) {
    return (
      <div className="status">
        {statusItems.map(({ pic, value, color }) => (
          <div className="item">
            <CircularProgressBar progress={value(beastStatus)} pic={pic} color={color} />
          </div>
        ))}
      </div>
    );
  }
}

export default Status;
