// GoBackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import goBack from '../../assets/img/GoBack.svg';

interface GoBackButtonProps {
  /**
   * Ruta a la que se desea navegar. Si no se especifica, se retrocede un paso.
   */
  to?: string;
  /**
   * Texto o label que se muestra en el botón.
   */
  label?: string;
  /**
   * Clases CSS adicionales para el botón.
   */
  className?: string;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({
  to,
  label = 'Volver',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className={`go-back-button ${className}`}>
      <div className="logo">
        <img src={goBack} alt="Icono de regresar" />
      </div>
      <span>{label}</span>
    </button>
  );
};

export default GoBackButton;
