// GoBackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import goBackIcon from '../../assets/img/GoBack.svg';
import './main.css';

interface GoBackButtonProps {
  to?: string;
  className?: string;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ to, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className={`go-back ${className}`}>
      <div className="go-back__icon">
        <img src={goBackIcon} alt="Icono de regresar" />
      </div>
    </button>
  );
};

export default GoBackButton;
