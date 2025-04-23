import React from 'react';
import Card from '../common/Card';

export type FootballerCardState = 'active' | 'eliminated' | 'selected';

interface FootballerCardProps {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
  state?: FootballerCardState;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const FootballerCard: React.FC<FootballerCardProps> = ({
  id,
  name,
  imageUrl,
  position,
  state = 'active',
  onClick,
  size = 'medium',
}) => {
  // Define size-specific classes
  const sizeClasses = {
    small: 'w-[70px] h-[105px]',
    medium: 'w-[90px] h-[135px] sm:w-[120px] sm:h-[180px]',
    large: 'w-[120px] h-[180px] sm:w-[150px] sm:h-[225px]',
  };

  // Define state-specific classes
  const stateClasses = {
    active: 'border-transparent',
    eliminated: 'opacity-60 grayscale',
    selected: 'border-[#0F4C81] border-2 shadow-lg shadow-[#0F4C81]/30',
  };

  return (
    <Card
      className={`
        ${sizeClasses[size]} 
        ${stateClasses[state]} 
        transition-all duration-200 p-1 overflow-hidden
      `}
      interactive={state !== 'eliminated'}
      onClick={state !== 'eliminated' ? onClick : undefined}
    >
      <div className="relative h-full flex flex-col">
        {/* Image container */}
        <div className="relative flex-grow overflow-hidden rounded bg-[#EEEEEE]">
          <img
            src={imageUrl}
            alt={name}
            className={`object-cover w-full h-full ${state === 'eliminated' ? 'filter grayscale' : ''}`}
            loading="lazy"
          />
          
          {/* Elimination overlay */}
          {state === 'eliminated' && (
            <div className="absolute inset-0 bg-[#333333]/20 flex items-center justify-center">
              <div className="w-full h-1 bg-[#D62839] transform rotate-45 origin-center"></div>
              <div className="w-full h-1 bg-[#D62839] transform -rotate-45 origin-center"></div>
            </div>
          )}
        </div>
        
        {/* Name and position */}
        <div className={`text-center mt-1 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          <p className="font-medium truncate">{name}</p>
          <p className="text-[#666666] text-xs truncate">{position}</p>
        </div>
      </div>
    </Card>
  );
};

export default FootballerCard; 