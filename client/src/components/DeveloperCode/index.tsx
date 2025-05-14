// React and external libraries
import { useState, useCallback } from "react";

// Internal components
import ControllerConnectButton from '../CartridgeController/ControllerConnectButton';

// Types
import { InputEvent } from '../../types/components';

// Constants
const DEVELOPER_CODE = 'bytebeasts';
const INPUT_PLACEHOLDER = 'Enter developer code';

// Main Component
export const DeveloperCode: React.FC = () => {
  // State
  const [confirmed, setConfirmed] = useState<boolean>(false);

  // Event Handlers
  const handleCodeConfirmation = useCallback((e: InputEvent) => {
    if (e.target.value === DEVELOPER_CODE) {
      setConfirmed(true);
    }
  }, []);

  // Render
  return (
    <div className="developer-code-container">
      {confirmed ? (
        <ControllerConnectButton />
      ) : (
        <input
          id="developer-code"
          type="text"
          onChange={handleCodeConfirmation}
          placeholder={INPUT_PLACEHOLDER}
          className="input"
          aria-label="Developer code input"
        />
      )}
    </div>
  );
};

export default DeveloperCode;
