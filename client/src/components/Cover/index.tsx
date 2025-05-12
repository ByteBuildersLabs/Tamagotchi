// React and external libraries
import { useEffect } from "react";
// import { useAccount } from "@starknet-react/core";

// Internal components
// import Footer from "../Footer/index.tsx";
// import SpawnBeast from "../SpawnBeast/index.tsx";
// import { DeveloperCode } from "../DeveloperCode/index.tsx";

// Assets
// import fight from '../../assets/img/banner.jpeg';

function Cover() {
  // const { account } = useAccount();

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day');
      bodyElement.classList.remove('night');
      bodyElement.style.backgroundSize = 'cover';
      bodyElement.style.padding = '22px 15px';
    }
  }, []);

  return (
    <>
      {/* {
        account ? <SpawnBeast /> :
          <>
            <div className='cover'>
              <div className="mb-3">
                <img className="cover-pic" src={fight} alt="" />
              </div>
              <DeveloperCode />
              <Footer />
            </div>
          </>
      } */}
    </>
  )
}

export default Cover;
