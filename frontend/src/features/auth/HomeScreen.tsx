import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Container from '../../components/layout/Container';
import { GameMode } from '../../types/game';

interface HomeScreenProps {
  onStartSinglePlayer: () => void;
  onStartMultiPlayer: () => void;
  onShowLeaderboard: () => void;
  onShowHowToPlay: () => void;
  onShowSettings: () => void;
  onShowProfile: () => void;
  isAuthenticated: boolean;
  username?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSinglePlayer,
  onStartMultiPlayer,
  onShowLeaderboard,
  onShowHowToPlay,
  onShowSettings,
  onShowProfile,
  isAuthenticated,
  username,
}) => {
  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Game Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-[#1E6E50]">FOOTBALL</h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#0F4C81]">GUESS WHO</h1>
          <p className="text-xl text-gray-600">Can you guess the secret footballer?</p>
        </div>
        
        {/* Main Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl mb-8">
          <Button
            variant="primary"
            isFullWidth
            onClick={onStartSinglePlayer}
            className="py-4 text-lg"
          >
            Singleplayer Mode
          </Button>
          
          <Button
            variant="primary"
            isFullWidth
            onClick={onStartMultiPlayer}
            className="py-4 text-lg"
          >
            Multiplayer Mode
          </Button>
        </div>
        
        {/* Secondary Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mb-12">
          <Button
            variant="secondary"
            isFullWidth
            onClick={onShowHowToPlay}
          >
            How To Play
          </Button>
          
          <Button
            variant="secondary"
            isFullWidth
            onClick={onShowLeaderboard}
          >
            Leaderboard
          </Button>
        </div>
        
        {/* Footer with Settings and Profile */}
        <div className="flex justify-between w-full max-w-xl">
          <Button
            variant="secondary"
            size="compact"
            onClick={onShowSettings}
          >
            Settings
          </Button>
          
          <Button
            variant="secondary"
            size="compact"
            onClick={onShowProfile}
          >
            {isAuthenticated ? username : 'Profile'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default HomeScreen; 