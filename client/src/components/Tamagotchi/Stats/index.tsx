import { Beast } from "../../../dojo/bindings";
import Food from '../../../assets/img/food.png';

const statsItems = [
  { label: "Attack", value: (beast: Beast) => Math.round(beast.attack) },
  { label: "Defense", value: (beast: Beast) => Math.round(beast.defense) },
  { label: "Speed", value: (beast: Beast) => Math.round(beast.speed) },
  { label: "Experience", value: (beast: Beast) => beast.experience }
];

const Stats = ({ beast }: { beast: Beast }) => {
  return (
    <div className="stats">
      <h2 className="level">
        Lvl <span>{beast.level}</span>
      </h2>
      {statsItems.map(({ label, value }) => (
        <div className="item" key={label}>
          <div>
            <img src={Food} />
            <span>{value(beast)}</span>
          </div>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default Stats;
