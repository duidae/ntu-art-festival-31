import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'action';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 font-bold transition-all active:translate-y-1 relative group overflow-hidden border-2 border-zinc-900 select-none";
  
  const variants = {
    primary: "bg-[#4dff88] text-zinc-900 hover:bg-[#3ce677]", 
    secondary: "bg-zinc-900 text-[#e8e8e6] hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-900 hover:bg-white/50",
    action: "bg-zinc-900 text-[#4dff88] hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="absolute top-1 right-1 w-1 h-1 bg-current opacity-50"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};
