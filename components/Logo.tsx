import React from 'react';

export const Logo: React.FC<{ className?: string, size?: 'sm' | 'lg' }> = ({ className = "", size = 'lg' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-gold-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${size === 'lg' ? 'w-48 h-48' : 'w-16 h-16'}`}></div>
            
             <div className={`relative flex items-center justify-center rounded-full border-4 border-gold-500/30 bg-royal-900/80 backdrop-blur-sm shadow-2xl shadow-gold-500/20 ${size === 'lg' ? 'w-40 h-40' : 'w-16 h-16'}`}>
                
                {/* Central Crown */}
                <svg className={`${size === 'lg' ? 'w-24 h-24 mb-2' : 'w-8 h-8 mb-1'} text-gold-400 drop-shadow-lg`} fill="currentColor" viewBox="0 0 24 24">
                     <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                </svg>
                
                {/* The Oil Drop - Positioned below the crown */}
                <svg className={`absolute ${size === 'lg' ? 'w-6 h-6 bottom-6' : 'w-3 h-3 bottom-2'} text-amber-400 drop-shadow-md`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C12 2 5 9.5 5 14.5C5 18.6 8.1 22 12 22C15.9 22 19 18.6 19 14.5C19 9.5 12 2 12 2ZM12 18C10.9 18 10 17.1 10 16C10 14.9 12 13 12 13C12 13 14 14.9 14 16C14 17.1 13.1 18 12 18Z" />
                </svg>
             </div>
        </div>
    </div>
  );
};