import { Beast } from "../../../dojo/bindings";
import Food from '../../../assets/img/food.png';

const statusItems = [
  { label: "Energy", value: (beast: Beast) => Math.round(beast.energy) },
  { label: "Hunger", value: (beast: Beast) => Math.round(beast.hunger) },
  { label: "Happiness", value: (beast: Beast) => Math.round(beast.happiness) },
  { label: "Hygiene", value: (beast: Beast) => Math.round(beast.hygiene) }
];

const Status = ({ beast }: { beast: Beast }) => {
  return (
    <div className="status">
      {statusItems.map(({ label, value }) => (
        <div className="item" key={label}>
          <p className="mb-1">{label}</p>
          <img src={Food} />
          <span>{value(beast)}%</span>
        </div>
      ))}
    </div>
  );
}

export default Status;
