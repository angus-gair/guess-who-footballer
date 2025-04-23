import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card; 