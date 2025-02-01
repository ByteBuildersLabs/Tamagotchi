
import { useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import fight from '../../assets/img/banner.jpeg';
import Footer from "../Footer/index.tsx";
import SpawnBeast from "../SpawnBeast/index.tsx";
import { DeveloperCode } from "../DeveloperCode/index.tsx";

function Cover() {
  const { account } = useAccount();

  useEffect(() => {
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) bodyElement.style.backgroundImage = "url('/assets/background.png')";
  }, []);

  return (
    <>
      {
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
      }
    </>
  )
}

export default Cover;
