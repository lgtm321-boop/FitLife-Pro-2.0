import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-xl' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
    xl: { icon: 64, text: 'text-4xl' }
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Logo Symbol - Hexagon style matching the image */}
      <div className="relative flex items-center justify-center">
         <svg 
            width={s.icon} 
            height={s.icon} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary drop-shadow-[0_0_10px_rgba(0,200,150,0.4)]"
         >
            {/* Hexagon Shape */}
            <path 
              d="M50 5 L93.3 27.5 V72.5 L50 95 L6.7 72.5 V27.5 L50 5Z" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="8"
              strokeLinejoin="round"
            />
            {/* Inner Diamond/Chevrons */}
            <path 
              d="M50 25 L70 45 H30 L50 25Z" 
              fill="currentColor"
            />
             <path 
              d="M50 75 L70 55 H30 L50 75Z" 
              fill="currentColor"
            />
         </svg>
      </div>

      {showText && (
        <div className={`font-extrabold tracking-tight ${s.text} flex items-center leading-none`}>
          <span className="text-primary">FITLIFE</span>
          <span className="text-white ml-0.5">PRO</span>
        </div>
      )}
    </div>
  );
};