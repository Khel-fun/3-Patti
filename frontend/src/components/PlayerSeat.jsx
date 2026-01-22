import React, { useEffect, useRef } from 'react';
import { User, Crown } from 'lucide-react';
import { cn, formatChips } from '@/lib/utils';
import PlayingCard from './PlayingCard';
import gsap from 'gsap';

export default function PlayerSeat({
  player,
  isCurrentPlayer,
  isDealer,
  cards = [],
  showCards = false,
  position = 'bottom',
  className
}) {
  const seatRef = useRef(null);
  const progressCircleRef = useRef(null);

  // Animation for turn timer - fill overlay that reduces
  useEffect(() => {
    if (isCurrentPlayer && progressCircleRef.current) {
      // Start with full circle (0 offset) and animate to empty (239 offset - circumference of r=38)
      gsap.set(progressCircleRef.current, { strokeDashoffset: 0 });
      gsap.to(progressCircleRef.current, {
        strokeDashoffset: 239,
        duration: 15,
        ease: "linear"
      });
    } else if (progressCircleRef.current) {
      gsap.killTweensOf(progressCircleRef.current);
      gsap.set(progressCircleRef.current, { strokeDashoffset: 239 });
    }
  }, [isCurrentPlayer]);

  const isHero = position === 'bottom';

  return (
    <div
      ref={seatRef}
      className={cn(
        'player-seat relative flex flex-col items-center gap-2',
        player.isFolded && 'opacity-50 grayscale',
        className
      )}
    >
      {/* Avatar Container */}
      <div className="relative">
        {/* Avatar Circle */}
        <div className={cn(
          'w-20 h-20 rounded-full border-4 overflow-hidden relative z-10 flex items-center justify-center shadow-2xl',
          isCurrentPlayer ? 'border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : 'border-gray-600',
          'bg-gray-900',
          'transition-all duration-300'
        )}>
          {/* Placeholder Avatar Image or Initial */}
          <div className="bg-gradient-to-br from-gray-800 to-black w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>

          {/* Timer Overlay - Transparent Yellow Circle that reduces */}
          {isCurrentPlayer && (
            <svg className="absolute inset-0 w-full h-full z-10 rotate-[-90deg]">
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="rgba(251, 191, 36, 0.01)"
                stroke="rgba(251, 191, 36, 0.4)"
                strokeWidth="76"
                strokeDasharray="239"
                strokeDashoffset="0"
                ref={progressCircleRef}
                className="drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
              />
            </svg>
          )}

          {/* Dealer Button */}
          {isDealer && (
            <div className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs border border-yellow-500 shadow-md z-20">
              D
            </div>
          )}
        </div>

        {/* Status Badge (Folded) */}
        {player.isFolded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/70">
            <span className="text-white font-bold text-xs">FOLD</span>
          </div>
        )}
      </div>

      {/* Player Info (Name & Chips) */}
      <div className="z-20 bg-black/80 backdrop-blur-md border border-gray-600 rounded-lg px-3 py-1 text-center min-w-[100px] shadow-lg -mt-4">
        <div className="text-white font-bold text-sm truncate max-w-[90px]">{player.name}</div>
        <div className="text-yellow-400 text-xs font-mono">{formatChips(player.chips)}</div>
      </div>

      {/* Cards */}
      {cards.length > 0 && (
        <div className={cn(
          "absolute flex gap-0.5 md:gap-1 transition-all duration-300",
          // Dynamic positioning based on seat location
          // Hero: Cards just above avatar, closer positioning
          position === 'bottom' && "-top-24 md:-top-28 left-1/2 -translate-x-1/2 scale-90 md:scale-100 z-20",
          // Other positions: Cards below avatar
          position === 'top' && "top-16 md:top-18 left-1/2 -translate-x-1/2 scale-60 md:scale-40 z-0",
          position === 'left' && "top-12 md:top-14 -right-16 md:-right-20 scale-60 md:scale-40 origin-left z-0",
          position === 'right' && "top-12 md:top-32 -left-16 md:-left-20 scale-60 md:scale-40 origin-right flex-row-reverse z-0",
          // Fallback for any other case
          !['bottom', 'top', 'left', 'right'].includes(position) && "-top-24 left-1/2 -translate-x-1/2 scale-70 z-0"
        )}>
          {cards.map((card, idx) => (
            <div key={idx} className={cn("shadow-2xl", isHero && "hover:-translate-y-2 transition-transform")}>
              <PlayingCard
                rank={showCards || isHero ? card.rank : null}
                suit={showCards || isHero ? card.suit : null}
                faceDown={!showCards}
                className="w-16 h-24 md:w-20 md:h-28"
              />
            </div>
          ))}
        </div>
      )}

      {/* Current Bet Bubble */}
      {player.currentBet > 0 && (
        <div className="absolute -bottom-8 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs shadow-md border border-yellow-300 z-30 animate-bounce">
          {formatChips(player.currentBet)}
        </div>
      )}

    </div>
  );
}
