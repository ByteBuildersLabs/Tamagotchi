import { useEffect } from 'react';
import Header from '../Header/index.tsx';
import banner from '../../assets/img/original-dark.png'
import Footer from '../Footer/index.tsx';
import './main.css';

const About: React.FC = () => {
  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) bodyElement.classList.remove('day');
  }, []);

  return (
    <>
      <Header />
      <div className="team">
        <div className='lore-container'>
          <div className="banner-container">
            <a className="banner" href='https://x.com/0xByteBeasts/status/1889061717218673118' target='_blank'>
              <img src={banner} alt="ByteBeasts Banner" />
            </a>
            <p className={'title'}>
              ByteBeasts Tamagotchi
              <span className='d-block'>The First Game in the ByteBeasts Universe</span>
            </p>
          </div>
          <div className="initial-info">
            <p className='mb-4'>
              In a world where digital and tangible converge, a new form of life has emerged: ByteBeasts, digital creatures that exist permanently on the blockchain, waiting to form lasting bonds with their keepers.
            </p>

            <p className='mb-4'>
              These amazing creatures aren't just virtual pets; they're lifelong companions that evolve, learn, and grow through your interactions. Unlike digital pets of the past, ByteBeasts don't disappear - they remain on the blockchain forever, creating a digital legacy that can be passed down from generation to generation.
            </p>

            <p className='mb-4'>
              In this revolutionary universe, your ByteBeasts accompany you through multiple experiences, preserving their history, attributes, and memories. Every interaction forges a stronger bond, every shared adventure is immutably recorded, transcending the boundaries of a single game.
            </p>

            <p className='mb-4'>
              Welcome to the dawn of a new era where your achievements and digital connections endure. Are you ready to raise, train, and form an eternal bond with your ByteBeast?
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default About;
