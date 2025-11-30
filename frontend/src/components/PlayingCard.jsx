import React from 'react';
import { cn } from '@/lib/utils';

export default function PlayingCard({ rank, suit, faceDown = false, className }) {
  // Normalize suit to lowercase for consistency
  const normalizedSuit = suit ? suit.toLowerCase() : '';

  // Determine color based on suit
  const isRed = normalizedSuit === 'hearts' || normalizedSuit === 'diamonds' || normalizedSuit === 'h' || normalizedSuit === 'd' || normalizedSuit === '♥' || normalizedSuit === '♦';
  const colorClass = isRed ? 'text-red-600' : 'text-black';

  // Get suit symbol
  const getSuitSymbol = (s) => {
    if (!s) return '';
    const map = {
      'hearts': '♥', 'h': '♥',
      'diamonds': '♦', 'd': '♦',
      'clubs': '♣', 'c': '♣',
      'spades': '♠', 's': '♠'
    };
    return map[s] || map[s.toLowerCase()] || '';
  };

  const symbol = getSuitSymbol(normalizedSuit);

  // Card Back Pattern
  if (faceDown) {
    return (
      <div className={cn(
        'card relative w-20 h-28 md:w-24 md:h-36 rounded-xl shadow-xl overflow-hidden bg-white border-2 border-white',
        className
      )}>
        <div className="w-full h-full bg-blue-900 relative overflow-hidden">
          {/* Simple geometric pattern for card back */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)',
              backgroundSize: '10px 10px'
            }}>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-white/30"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'card relative w-20 h-28 md:w-24 md:h-36 rounded-xl shadow-xl overflow-hidden bg-white border border-gray-200 flex flex-col justify-between p-1 md:p-2 select-none',
      colorClass,
      className
    )}>
      {/* Top Left Corner */}
      <div className="flex flex-col items-center leading-none">
        <span className="font-bold text-lg md:text-2xl font-serif">{rank}</span>
        <span className="text-sm md:text-lg">{symbol}</span>
      </div>

      {/* Center Suit */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-4xl md:text-6xl opacity-20 transform scale-150">{symbol}</span>
      </div>

      {/* Bottom Right Corner (Rotated) */}
      <div className="flex flex-col items-center leading-none transform rotate-180">
        <span className="font-bold text-lg md:text-2xl font-serif">{rank}</span>
        <span className="text-sm md:text-lg">{symbol}</span>
      </div>
    </div>
  );
}
