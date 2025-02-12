// GoBackButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import goBackIcon from '../../assets/img/GoBack.svg';
import './main.css';

/**
 * Props for the GoBackButton component.
 * 
 * @interface GoBackButtonProps
 * @property {string} [to] - Optional destination route. If provided, the button navigates to this route; otherwise, it goes back one step in history.
 * @property {string} [className] - Optional additional CSS classes for styling.
 */
interface GoBackButtonProps {
  to?: string;
  className?: string;
}

/**
 * A reusable button component for navigating back or to a specified route.
 *
 * @component
 * @example
 * // Default back button (navigates one step back)
 * <GoBackButton />
 * 
 * @example
 * // GoBackButton navigating to a specific route
 * <GoBackButton to="/home" />
 * 
 * @param {GoBackButtonProps} props - The component props.
 * @returns {JSX.Element} A styled button for navigation.
 */
const GoBackButton: React.FC<GoBackButtonProps> = ({ to, className = '' }) => {
  const navigate = useNavigate();

  /**
   * Handles the button click event.
   * If a `to` prop is provided, it navigates to that route;
   * otherwise, it navigates one step back in the browser history.
   */
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
        <img src={goBackIcon} alt="Go Back Icon" />
      </div>
    </button>
  );
};

export default GoBackButton;
