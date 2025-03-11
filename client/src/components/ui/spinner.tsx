import './spinner.css';

const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-content">
      <div className="loader"></div>
      <div className="spinner-message">Loading your beast...</div>
    </div>
  </div>
);

export default Spinner;