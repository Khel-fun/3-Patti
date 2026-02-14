import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const variants = {
    // "Gunmetal & Silver" - Primary Action
    // Uses a deep metallic gradient with a "machined" border look
    default: 'relative bg-gradient-to-b from-gray-200 via-gray-400 to-gray-500 text-black border-none shadow-[0_0_20px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:brightness-110 active:scale-[0.98] after:absolute after:inset-[1px] after:rounded-[10px] after:border after:border-white/40 after:content-[""]',

    // "Red Alert" - Destructive
    destructive: 'relative bg-gradient-to-b from-red-600 to-red-900 text-white border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.4)] inset-panel hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]',

    // "Glass Prism" - Outline replacement
    outline: 'glass-button text-gray-200 hover:text-white hover:border-white/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] active:bg-white/10',

    // "Obsidian" - Secondary
    secondary: 'bg-gradient-to-b from-slate-800 to-black text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-white/20',

    // "Phantom"
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    link: 'text-gray-400 underline-offset-4 hover:underline hover:text-white bg-transparent',
  };

  const sizes = {
    default: 'px-6 py-3 text-[14px]',
    sm: 'px-4 py-2 text-xs',
    lg: 'px-8 py-4 text-lg tracking-widest',
    icon: 'h-10 w-10 p-0',
  };

  return (
    <button
      className={cn(
        'group inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer gap-2.5 uppercase tracking-wider overflow-hidden isolate',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Subtle shine for default variant only */}
      {variant === 'default' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
