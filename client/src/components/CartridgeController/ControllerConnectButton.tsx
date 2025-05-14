// React and external libraries
import { Link } from 'react-router-dom';
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";

// Types
import { ConnectorButtonProps } from '../../types/components';

// Assets
import logout from "../../assets/img/icon-logout.svg";
import dojo from '../../assets/img/icon-dojo.svg';

// Constants
const BODY_CLASSES = ['day', 'night'] as const;
const DEFAULT_BODY_STYLES = {
  backgroundSize: 'cover',
  padding: '0'
} as const;

// Components
const DisconnectButton: React.FC<ConnectorButtonProps> = ({ connector, onDisconnect }) => (
  <Link 
    to="/" 
    key={connector.id} 
    className="disconnect-button" 
    onClick={onDisconnect}
  >
    <img src={logout} alt="Logout" />
    <span>Disconnect</span>
  </Link>
);

const ConnectButton: React.FC<ConnectorButtonProps> = ({ connector, onConnect }) => (
  <button
    key={connector.id}
    onClick={() => onConnect(connector)}
    className="button"
  >
    Connect
    <img src={dojo} alt="starknet" />
  </button>
);

// Main Component
const ControllerConnectButton: React.FC = () => {
  // Hooks
  const { connect, connectors } = useConnect();
  const { status } = useAccount();
  const { disconnect } = useDisconnect();

  // Derived state
  const isConnected = status === "connected";

  // Event Handlers
  const handleDisconnect = () => {
    disconnect();
    localStorage.clear();
    
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      BODY_CLASSES.forEach(className => bodyElement.classList.remove(className));
      Object.entries(DEFAULT_BODY_STYLES).forEach(([property, value]) => {
        bodyElement.style[property as keyof typeof DEFAULT_BODY_STYLES] = value;
      });
    }
  };

  const handleConnect = async (connector: ConnectorButtonProps['connector']) => {
    await connect({ connector });
  };

  // Render
  return (
    <div className="controller-connect-container">
      {connectors.map((connector) => (
        isConnected ? (
          <DisconnectButton
            key={connector.id}
            connector={connector}
            isConnected={isConnected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <ConnectButton
            key={connector.id}
            connector={connector}
            isConnected={isConnected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        )
      ))}
    </div>
  );
};

export default ControllerConnectButton;
