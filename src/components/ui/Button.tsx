import React, { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'danger';
  icon?: FC<any>; // Icon component from lucide-react
  className?: string;
}

const Button: FC<ButtonProps> = ({ children, onClick, disabled = false, type = 'primary', icon: Icon, className = '' }) => {
  const baseStyle = 'flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition duration-200 shadow-md';
  const colorStyle = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }[type];

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const finalIcon = disabled && type === 'primary' ? Loader2 : Icon;
  const iconProps = { size: 20, className: disabled ? 'animate-spin' : '' };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${colorStyle} ${disabledStyle} ${className}`}
    >
      {finalIcon && React.createElement(finalIcon, iconProps)}
      <span>{children}</span>
    </button>
  );
};

export default Button;