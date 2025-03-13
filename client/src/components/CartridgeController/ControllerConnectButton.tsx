import { Link } from 'react-router-dom';
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import logout from "../../assets/img/logout.svg";
import dojo from '../../assets/img/dojo-icon.svg';

const ControllerConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { status } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      {connectors.map((connector) => (
        status === "connected" ? (
          <Link to="/" key={connector.id} className="disconnect-button" onClick={() => {
            disconnect();
            localStorage.clear();
            const bodyElement = document.querySelector('.body') as HTMLElement;
              if (bodyElement) {
                bodyElement.classList.remove('day', 'night');
                bodyElement.style.backgroundSize = 'cover';
                bodyElement.style.padding = '0';
              }
            }}>
            <img src={logout} alt="Logout" />
            <span>Disconnect</span>
          </Link>
        ) : (
          <button
            key={connector.id}
            onClick={async() => {
              connect({ connector });
            }}
            className="button"
          >
            Connect
            <img src={dojo} alt="starknet" />
          </button>
        )
      ))}
    </>
  );
};

export default ControllerConnectButton;
