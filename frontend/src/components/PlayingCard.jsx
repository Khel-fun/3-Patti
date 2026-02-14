import React from 'react';
import { cn } from '@/lib/utils';

export default function PlayingCard({ rank, suit, faceDown = false, className }) {
  // Get card image filename
  const getCardImage = () => {
    if (faceDown || !rank || !suit) {
      return '/cards/back_of_card.jpg'; // Updated to match other references
    }

    // Normalize suit to single character
    const suitMap = {
      'hearts': 'h', 'h': 'h', '♥': 'h',
      'diamonds': 'd', 'd': 'd', '♦': 'd',
      'clubs': 'c', 'c': 'c', '♣': 'c',
      'spades': 's', 's': 's', '♠': 's'
    };

    const normalizedSuit = suit ? suit.toLowerCase() : '';
    // Handle both full names and symbols
    let suitChar = suitMap[normalizedSuit];

    // If not in map, try first char
    if (!suitChar && normalizedSuit) {
      suitChar = normalizedSuit.charAt(0);
    }

    // Normalize rank
    const rankMap = {
      'A': 'a', 'a': 'a', '1': 'a', 'ace': 'a',
      'J': 'j', 'j': 'j', 'jack': 'j',
      'Q': 'q', 'q': 'q', 'queen': 'q',
      'K': 'k', 'k': 'k', 'king': 'k',
      'T': '10', 't': '10', // Ten
    };

    const rankStr = rank ? rank.toString() : '';
    // Check map first, then lowercase
    const rankChar = rankMap[rankStr] || rankMap[rankStr.toUpperCase()] || rankStr.toLowerCase();

    // Construct filename: e.g., "ah.png", "10d.png", "ks.png"
    // Assuming images are strictly rank+suitChar
    return `/cards/${rankChar}${suitChar}.png`;
  };

  const cardImage = getCardImage();

  return (
    <div className={cn(
      'card relative w-20 h-28 md:w-24 md:h-36 rounded-xl shadow-2xl overflow-hidden select-none bg-white transition-transform duration-200',
      'border-[3px] border-white', // Consistent white border for all cards
      className
    )}>
      <img
        src={cardImage}
        alt={faceDown ? 'Card back' : `${rank} of ${suit}`}
        className="w-full h-full object-cover"
        style={{
          imageRendering: 'high-quality',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        onError={(e) => {
          console.error(`Failed to load card image: ${cardImage}`);
          e.target.src = '/cards/back_of_card.jpg';
        }}
      />

      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>

      {/* Inner Shadow for depth */}
      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] pointer-events-none rounded-lg"></div>
    </div>
  );
}
