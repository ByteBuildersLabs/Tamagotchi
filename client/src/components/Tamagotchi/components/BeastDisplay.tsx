import { Link } from 'react-router-dom';
import type { Beast } from '../../../types/components';
import Spinner from '../../ui/spinner';
import CleanlinessIndicator from '../../CleanIndicator';
import Close from "../../../assets/img/icon-close-white.svg";
import chatIcon from '../../../assets/img/icon-chat.svg';
import ranking from "../../../assets/img/icon-ranking.svg";
import Egg from '../../../assets/img/img-egg.gif';
import Cake from '../../../assets/img/icon-cake.svg';

interface BeastDisplayProps {
  isLoading: boolean;
  status: number[];
  currentBeast: Beast | null;
  currentImage: string;
  age: number;
  birthday: { hours: string; minutes: string };
  displayBirthday: boolean;
  onCuddle: () => void;
  onNewEgg: () => void;
  onShowBirthday: () => void;
  onChatToggle: () => void;
  onBackToActions: () => void;
  expanded: boolean;
}

const BeastDisplay = ({
  isLoading,
  status,
  currentBeast,
  currentImage,
  age,
  birthday,
  displayBirthday,
  onCuddle,
  onNewEgg,
  onShowBirthday,
  onChatToggle,
  onBackToActions,
  expanded
}: BeastDisplayProps) => {
  return (
    <>
      {status[2] === 0 && (
        <button className="button mb-4" onClick={onNewEgg}>
          Hatch a new Egg
          <img src={Egg} className="new-egg" alt="beast" />
        </button>
      )}
      
      <div className="scenario flex justify-center items-column">
        {isLoading ? (
          <Spinner message="Loading your beast..." />
        ) : (
          <div className="beast-cage">
            <img
              src={currentImage}
              alt="Tamagotchi"
              onClick={onCuddle}
              style={{ cursor: 'pointer' }}
            />
            {status[2] === 1 && <CleanlinessIndicator cleanlinessLevel={status[7]} />}
          </div>
        )}
      </div>

      <div className="beast-interaction">
        <div className="beast-buttons">
          {currentBeast && (
            <div className="d-flex justify-content-between position-relative w-100">
              <div className="age-indicator" onClick={onShowBirthday}>
                <span>{age}</span>
              </div>
              
              {displayBirthday && (
                <div className="age-info">
                  <img src={Cake} alt="cake" />
                  <span>{birthday.hours}:{birthday.minutes}</span>
                </div>
              )}
              
              {status[2] === 1 && status[3] === 1 && (
                <div className="chat-toggle" onClick={onChatToggle}>
                  <img src={chatIcon} alt="chat with tamagotchi" />
                </div>
              )}
              
              <div className="d-flex">
                { expanded &&
                  <div className="back-button">
                    <img
                      src={Close}
                      onClick={onBackToActions}
                      alt="Back to actions"
                    />
                  </div>
                }
                <Link to={'/leaderboard'} className="chat-toggle">
                  <img src={ranking} alt="Leaderboard" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BeastDisplay; 