import React from 'react';

interface DressFormIconProps {
  className?: string;
  size?: number;
}

export const DressFormIcon: React.FC<DressFormIconProps> = ({ 
  className = "", 
  size 
}) => {
  const style = size ? {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain' as const
  } : {};

  return (
    <img 
      src="/logo.png" 
      alt="DRIGOCRIS CAMISARIA" 
      className={className}
      style={style}
    />
  );
};
