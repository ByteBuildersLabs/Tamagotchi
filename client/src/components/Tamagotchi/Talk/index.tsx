import Chat from '../../Chat';
import toggle from '../../../assets/img/x.svg';
import { Beast } from "../../../dojo/bindings";
import './main.css';

const Talk = ({ isOpen, onClose, pic, name, beast, }: { isOpen: boolean; onClose: () => void; pic: string; name: string; beast: Beast; }) => {
  if (!isOpen) return null;

  return (
    <div className="talk-modal">
      <div className="talk">
        <div className='talk-header'>
          <div className='talk-info'>
            <img src={pic} className='talk-icon' />
            <h4>{name}</h4>
          </div>
          <img src={toggle} className='close-talk' onClick={onClose} />
        </div>
        <Chat beast={beast} />
      </div>
    </div>
  );
};

export default Talk;
