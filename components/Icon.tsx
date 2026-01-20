
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 18 }) => {
  return (
    <span 
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {name}
    </span>
  );
};
