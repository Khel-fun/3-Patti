import React, { useEffect, useRef } from 'react';
import { User, Crown, X, Trophy } from 'lucide-react';
import { cn, formatChips } from '@/lib/utils';
import PlayingCard from './PlayingCard';
import gsap from 'gsap';

export default function PlayerSeat({
  player,
  isCurrentPlayer,
  isDealer,
  cards = [],
  showCards = false,
  position = 'bottom', // 'bottom' (hero), 'top', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  className
}) {
  const progressCircleRef = useRef(null);

  // Timer Animation
  useEffect(() => {
    if (isCurrentPlayer && progressCircleRef.current) {
      const circumference = 2 * Math.PI * 46; // r=46
      gsap.fromTo(progressCircleRef.current,
        { strokeDashoffset: 0 },
        { strokeDashoffset: circumference, duration: 15, ease: "linear" }
      );
    } else {
      gsap.killTweensOf(progressCircleRef.current);
    }
  }, [isCurrentPlayer]);

  const isHero = position === 'bottom';
  const isFolded = player.isFolded;
  const isWinner = player.isWinner;

  return (
    <div className={cn('relative group flex flex-col items-center justify-center', className)}>

      {/* Cards Container - Positioned relative to avatar */}
      <div className={cn(
        "absolute flex items-center justify-center transition-all duration-500 z-0 perspective-[1000px]",
        // Hero: Cards larger, above avatar
        isHero && "bottom-[85%] mb-4 scale-100 gap-[-15px] hover:translate-y-[-10px]",
        // Opponents: Cards smaller, positioned based on seat
        position.includes('top') && "top-[85%] mt-4 scale-75",
        position.includes('left') && "left-[85%] ml-4 scale-75 origin-left",
        position.includes('right') && "right-[85%] mr-4 scale-75 origin-right",
      )}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={cn(
              "relative transition-all duration-300",
              isHero ? "shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "shadow-lg",
              idx > 0 && "-ml-8 md:-ml-12" // Overlap cards
            )}
            style={{
              transform: `rotate(${(idx - 1) * 5}deg) translateY(${Math.abs(idx - 1) * 2}px)`,
              zIndex: idx
            }}
          >
            {/* If we have card data (hero or showdown), render it. Otherwise render card back */}
            {(card.rank || showCards) ? (
              <PlayingCard
                rank={card.rank}
                suit={card.suit}
                className={cn(
                  "border border-white/10 rounded-lg",
                  isHero ? "w-20 h-28 md:w-24 md:h-36" : "w-14 h-20 md:w-16 md:h-24"
                )}
              />
            ) : (
              <div className={cn(
                "bg-blue-900 border border-white/20 rounded-lg shadow-xl overflow-hidden relative",
                isHero ? "w-20 h-28 md:w-24 md:h-36" : "w-14 h-20 md:w-16 md:h-24"
              )}>
                <div className="absolute inset-0 bg-[url('/cards/back_of_card.jpg')] bg-cover bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Avatar Section */}
      <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">

        {/* Active Player Glow/Timer Ring */}
        <div className="absolute inset-0">
          <svg className="w-full h-full rotate-[-90deg] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {/* Background Ring */}
            <circle cx="50%" cy="50%" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            {/* Timer Ring */}
            {isCurrentPlayer && (
              <circle
                ref={progressCircleRef}
                cx="50%" cy="50%" r="46"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset="0"
                className="drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
              />
            )}
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Avatar Image Container */}
        <div className={cn(
          "w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] relative z-10 transition-transform duration-300",
          isCurrentPlayer ? "scale-105" : "",
          isWinner ? "animate-bounce" : ""
        )}>
          {/* Border Gradient */}
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-b opacity-100",
            isCurrentPlayer ? "from-yellow-400 via-yellow-200 to-yellow-600 animate-pulse" :
              isWinner ? "from-green-400 via-green-200 to-green-600" :
                "from-gray-700 to-gray-900"
          )}></div>

          {/* Image Mask */}
          <div className="relative w-full h-full rounded-full bg-black overflow-hidden border-[3px] border-[#0A0A0A]">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
              alt={player.name}
              className={cn("w-full h-full object-cover transition-opacity", isFolded ? "opacity-40 grayscale" : "")}
            />

            {/* Fold Overlay */}
            {isFolded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                <X className="w-8 h-8 text-red-500/80" />
              </div>
            )}

            {/* Winner Overlay */}
            {isWinner && (
              <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/20 mix-blend-overlay"></div>
            )}
          </div>

          {/* Dealer Badge */}
          {isDealer && (
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border border-yellow-200 z-20">
              <span className="text-[10px] font-black text-black">D</span>
            </div>
          )}

          {/* Winner Badge */}
          {isWinner && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border border-green-200 z-20 animate-bounce delay-100">
              <Trophy className="w-4 h-4 text-white fill-current" />
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-[-10px] relative z-20">
        <div className={cn(
          "glass-panel px-4 py-1.5 rounded-xl min-w-[110px] text-center border transition-colors duration-300 bg-[#0A0A0A]/90 backdrop-blur-md",
          isCurrentPlayer ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]" : "border-white/10 shadow-lg"
        )}>
          <div className={cn(
            "text-xs font-bold truncate max-w-[100px] mb-0.5",
            isCurrentPlayer ? "text-yellow-100" : "text-gray-300"
          )}>
            {player.name}
          </div>
          <div className={cn(
            "text-[10px] font-black font-mono tracking-widest uppercase",
            isCurrentPlayer ? "text-yellow-400" : "text-gray-500"
          )}>
            {formatChips(player.chips)}
          </div>
        </div>
      </div>

      {/* Action/Bet Bubble */}
      {player.currentBet > 0 && !isFolded && (
        <div className="absolute -right-8 top-0 md:-right-12 md:top-4 z-30 animate-zoom-in duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg border border-blue-400/50 flex flex-col items-center min-w-[50px]">
            <span className="text-[8px] uppercase tracking-widest opacity-80 mb-px">Bet</span>
            <span className="font-mono">{formatChips(player.currentBet)}</span>
          </div>
        </div>
      )}

    </div>
  );
}
