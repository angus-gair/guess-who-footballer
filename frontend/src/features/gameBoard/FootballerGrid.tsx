import React from 'react';
import FootballerCard from '../../components/game/FootballerCard';
import { Footballer } from '../../types/game';

interface FootballerGridProps {
  footballers: Footballer[];
  eliminatedIds: string[];
  selectedId?: string;
  onCardClick: (footballerId: string) => void;
  isOpponentBoard?: boolean;
}

const FootballerGrid: React.FC<FootballerGridProps> = ({
  footballers,
  eliminatedIds,
  selectedId,
  onCardClick,
  isOpponentBoard = false,
}) => {
  if (!footballers || footballers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No footballers to display</p>
      </div>
    );
  }

  const getCardState = (id: string) => {
    if (eliminatedIds.includes(id)) return 'eliminated';
    if (selectedId === id) return 'selected';
    return 'active';
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center">
      {footballers.map((footballer) => (
        <FootballerCard
          key={footballer.id}
          id={footballer.id}
          name={footballer.name}
          imageUrl={footballer.imageUrl}
          position={footballer.position}
          state={getCardState(footballer.id)}
          onClick={() => onCardClick(footballer.id)}
          size={isOpponentBoard ? 'small' : 'medium'}
        />
      ))}
    </div>
  );
};

export default FootballerGrid; 