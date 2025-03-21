import './spinner.css';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Loading..." }) => (
  <div className="spinner-overlay">
    <div className="spinner-content">
      <div className="loader"></div>
      <div className="spinner-message">{message}</div>
    </div>
  </div>
);

export default Spinner;