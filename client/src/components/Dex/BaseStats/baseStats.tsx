import Attack from '../../../assets/img/Attack.svg';
import Defense from '../../../assets/img/Defence.svg';
import Speed from '../../../assets/img/Speed.svg';
import './baseStats.css';

/**
 * Interface representing the beast's stats data.
 */
interface BeastDex {
  Attack: string;
  Defense: string;
  Speed: string;
}

/**
 * Array defining the stats attributes to be displayed.
 * Each stat includes a label, a function to extract its value from `BeastDex`,
 * and an associated image icon.
 */
const statsItems = [
  { label: "Attack", value: (beast: BeastDex) => Math.round(Number(beast.Attack)), pic: Attack },
  { label: "Defense", value: (beast: BeastDex) => Math.round(Number(beast.Defense)), pic: Defense },
  { label: "Speed", value: (beast: BeastDex) => Math.round(Number(beast.Speed)), pic: Speed }
];

/**
 * Props for the `BaseStats` component.
 */
interface StatsCarouselProps {
  beast: BeastDex;
}

/**
 * `BaseStats` Component - Displays a beast's base stats including Attack, Defense, and Speed.
 * Each stat is visually represented with an icon, a progress bar, and a numeric value.
 *
 * @component
 * @example
 * ```tsx
 * <BaseStats beast={beastData} />
 * ```
 * @param {StatsCarouselProps} props - Component properties.
 * @param {BeastDex} props.beast - The beast's stats data.
 * @returns {JSX.Element} The rendered stats component.
 */
function BaseStats({ beast }: StatsCarouselProps): JSX.Element {
  return (
    <div className="stats-dex">
      {statsItems.map(({ label, value, pic }) => (
        <div className="item-dex" key={label}>
          <div className="stats-label-dex">
            <img src={pic} alt={label} />
            <label>{label}</label>
          </div>
          <div className={`stats-value-dex ${label}`}>
            <div className="progress-bar-dex">
              <div className="progress-dex" style={{ width: `${value(beast) * 10}%` }}></div>
            </div>
            <span>{value(beast)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BaseStats;
