import './main.css';
import Header from '../Header/index.tsx';
import banner from '../../assets/img/bannerlogo.jpeg'
import Footer from '../Footer/index.tsx';
import dojologo from '../../assets/img/dojo-icon.svg';
import starknet from '../../assets/img/stark.png'
import { useEffect } from 'react';
import './main.css';

const Team: React.FC = () => {
  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
    }
  }, []);

  return (
    <>
      <Header />
      <div className="team">
        <div className='d-flex justify-content-between align-items-center'>
          <p className={'title mb-4'}>
            Lore Book
            <span className='d-block'>This is the beginning</span>
          </p>
        </div>
        <div className='lore-container'>
          <a href='https://x.com/0xByteBeasts/status/1889061717218673118' target='_blank'>
            <img className="banner" src={banner} alt="" />
          </a>
          <div className="initial-info">
            <h4>
              Byte Beasts - Welcome to Etheria
            </h4>
            <p className='mb-4'>
              In a distant future, humanity left behind the cities of metal and concrete to inhabit a reborn world: Etheria, a land where primordial energy flows like an invisible river, giving life to ancient creatures that emerge from mystical eggs
            </p>
            <p className='mb-4'>
              These beings, known as Byte Beasts, are the embodiment of the elements and the Earth's very emotions. Among them, Celestial Dragons soar through the skies with wings of fire and lightning, while Umbral Wolves roam the forests, shrouded in magical mist and living shadows.
            </p>
            <p className='mb-4'>
              Humans, now divided into clans, compete for dominance over these beings, seeking to forge bonds with the beasts or subjugate them for war. In this world where technology and magic intertwine, the key to power lies with those who can truly understand the spirit of the Byte Beasts.
            </p>
            <p className='mb-4'>
              But deep within Etheria, an ancient egg pulses with dark energy, waiting for the moment to awaken...
            </p>
          </div>
          <Footer />
        </div>
        <p className='bottom-footer'>
          <span>Powered by Dojo</span>
          <img src={dojologo} />
          <span>and Starknet</span>
          <img src={starknet} />
        </p>
      </div>
    </>
  )
}

export default Team;
