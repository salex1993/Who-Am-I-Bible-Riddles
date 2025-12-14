import React from 'react';
import { audio } from '../services/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = "",
  onClick,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-serif font-bold tracking-wider py-4 px-8 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    primary: "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-royal-950 shadow-[0_0_25px_-5px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,215,0,0.6)] border border-gold-300/50 hover:border-gold-200",
    secondary: "bg-royal-800/80 backdrop-blur-md text-gold-200 border border-gold-500/20 hover:bg-royal-700/80 hover:border-gold-500/50 hover:text-gold-100 shadow-lg",
    outline: "bg-transparent text-gold-400 border border-gold-500/30 hover:border-gold-400 hover:text-gold-200 hover:bg-gold-500/5",
    ghost: "bg-transparent text-gold-500/70 hover:text-gold-300 hover:bg-gold-500/5 border border-transparent"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playClick();
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {/* Button Shine Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </div>
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};