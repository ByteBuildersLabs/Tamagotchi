import { useAccount } from "@starknet-react/core";
import fight from "../../assets/img/banner.jpeg";
import Footer from "../Footer/index.tsx";
import SpawnBeast from "../SpawnBeast/index.tsx";

function Cover() {
  const { account } = useAccount();

  return (
    <>
      {account ? (
        <SpawnBeast />
      ) : (
        <>
          <div className="cover">
            <div className="mb-3">
              <img className="cover-pic" src={fight} alt="" />
            </div>
            <button
              className="connect-btn"
              onClick={() =>
                (
                  document.querySelector(".navbar-toggler") as HTMLElement
                )?.click()
              }
            >
              Connect and start Play
            </button>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Cover;
