import { Link } from 'react-router-dom';
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import dojo from '../../assets/img/dojo-icon.svg'

const ControllerConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect()

  return (
    <>
      {connectors.map((connector) => (
        status === "connected" ? (
          <Link to="/" key={connector.id} className="connect-btn" onClick={() => {
            disconnect();
            (document.querySelector('.navbar-toggler') as HTMLElement)?.click();
            }}>
            Disconnect ...{address?.slice(-6)}
          </Link>
        ) : (
          <button
            key={connector.id}
            onClick={() => { connect({ connector }) }}
            className="connect-btn"
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
