// GoBackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GoBackButtonProps {
  /**
   * Ruta a la que se desea navegar.
   * Si no se provee, el botón retrocede un paso en el historial.
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

const GoBackButton: React.FC<GoBackButtonProps> = ({ to, label = 'Volver', className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Si se especifica una ruta, navega a esa ruta,
    // de lo contrario retrocede un paso en el historial.
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  );
};

export default GoBackButton;
