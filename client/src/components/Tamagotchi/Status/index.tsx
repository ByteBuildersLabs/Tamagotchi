import CircularProgressBar from "../../ui/circularProgressBar";
import Energy from '../../../assets/img/energy.svg';
import Happyness from '../../../assets/img/Mood.svg';
import Hygienne from '../../../assets/img/Hygeine.svg';
import Hunger from '../../../assets/img/hunger.svg';
import './main.css';

const statusItems = [
  { value: (beastStatus: any) => beastStatus[4], pic: Energy, color: '#ECECDA', name: 'Energy' },
  { value: (beastStatus: any) => beastStatus[6], pic: Hygienne, color: '#ECECDA', name: 'Hygienne' },
  { value: (beastStatus: any) => beastStatus[3], pic: Hunger, color: '#ECECDA', name: 'Hunger' },
  { value: (beastStatus: any) => beastStatus[5], pic: Happyness, color: '#ECECDA', name: 'Happyness' },
];

function Status({ beastStatus }: { beastStatus: any }) {

  if (!beastStatus || beastStatus.length === 0) {
    return <div className="status empty-status"></div>;
  }

  if(beastStatus) {
    return (
      <div className="status">
        {statusItems.map(({ pic, value, color, name }, index) => (
          <div className="item" key={index}>
            <CircularProgressBar progress={value(beastStatus)} pic={pic} color={color} name={name} />
          </div>
        ))}
      </div>
    );
  }
}

export default Status;
