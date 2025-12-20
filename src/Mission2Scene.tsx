import React, { useState } from 'react';
import { 
  Volume2, 
  Droplets, 
  Sparkles, 
  Map as MapIcon,
  X, 
  Fish, 
} from 'lucide-react';
import { SCENES } from './constants';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'action';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
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

interface DialogBoxProps {
  speaker: string;
  text: string;
  onNext?: () => void;
  isEnd?: boolean;
}

const DialogBox: React.FC<DialogBoxProps> = ({ speaker, text, onNext, isEnd }) => (
  <div className="absolute bottom-6 left-4 right-4 bg-white border-2 border-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] z-50 animate-slide-up">
    <div className="absolute -top-3 left-4 flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-2 bg-[#4dff88] border border-zinc-900 rotate-45"></div>
      ))}
    </div>

    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 border border-zinc-900 flex items-center justify-center shrink-0 bg-[#e8e8e6]`}>
        {speaker === '系統' && <Volume2 size={20} className="text-zinc-900" />}
        {speaker === '水脈族' && <Droplets size={20} className="text-zinc-900" />}
        {speaker === '微光族' && <Sparkles size={20} className="text-zinc-900" />}
        {speaker === '幽靈魚' && <Fish size={20} className="text-zinc-900" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold bg-zinc-900 text-[#4dff88] inline-block px-2 py-0.5 mb-2 uppercase tracking-wider">{speaker}</p>
        <p className="text-zinc-900 text-base font-medium leading-relaxed font-serif">{text}</p>
      </div>
    </div>
    {onNext && (
      <div className="mt-4 flex justify-end">
        <button onClick={onNext} className="text-sm font-bold flex items-center gap-2 text-zinc-900 hover:underline decoration-[#4dff88] decoration-4 underline-offset-2">
          {isEnd ? '結束對話' : '下一步'} <div className="w-4 h-4 bg-zinc-900 rounded-full"></div>
        </button>
      </div>
    )}
  </div>
);

interface SceneProps {
  setScene: (scene: SCENES) => void;
}

interface MissionProps extends SceneProps {
  setProgress: React.Dispatch<React.SetStateAction<{ m1: boolean; m2: boolean; m3: boolean, b1: boolean; b2: boolean; b3: boolean}>>;
}

export const Mission2 = ({ setScene, setProgress }: MissionProps) => {
  const [step, setStep] = useState(0);
  const [litNodes, setLitNodes] = useState<number[]>([]);

  const handleNodeClick = (id: number) => {
    if (!litNodes.includes(id)) {
      const newLit = [...litNodes, id];
      setLitNodes(newLit);
      if (newLit.length === 4) {
        setTimeout(() => setStep(2), 1000);
      }
    }
  };

  return (
    <div className="h-full bg-zinc-900 relative flex flex-col p-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <div className="z-10 mb-6 flex justify-between items-center border-b border-[#4dff88] pb-2">
        <h3 className="text-xl font-black uppercase flex items-center gap-2 text-[#e8e8e6]">
          <span className="bg-[#4dff88] text-zinc-900 px-1">02</span> 微光
        </h3>
        <button onClick={() => setScene(SCENES.MAP)} className="text-white"><X size={20} /></button>
      </div>

      <div className="flex-1 z-20 relative flex items-center justify-center">
        {step === 0 && (
           <div className="absolute bottom-10 left-0 right-0">
             <DialogBox 
               speaker="微光族" 
               text="連接斷裂的節點。我們需要能量..." 
               onNext={() => setStep(1)} 
               isEnd={true}
             />
           </div>
        )}

        {step === 1 && (
          <div className="relative w-72 h-72">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline 
                points="50,50 250,50 250,250 50,250 50,50" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2" 
              />
              <line x1="20%" y1="20%" x2="80%" y2="20%" stroke={litNodes.includes(1) ? "#4dff88" : "transparent"} strokeWidth="4" />
              <line x1="80%" y1="20%" x2="80%" y2="80%" stroke={litNodes.includes(2) ? "#4dff88" : "transparent"} strokeWidth="4" />
              <line x1="80%" y1="80%" x2="20%" y2="80%" stroke={litNodes.includes(3) ? "#4dff88" : "transparent"} strokeWidth="4" />
            </svg>
            
            {[
              {id: 0, x: '20%', y: '20%'},
              {id: 1, x: '80%', y: '20%'},
              {id: 2, x: '80%', y: '80%'},
              {id: 3, x: '20%', y: '80%'}
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 border-2 ${
                  litNodes.includes(node.id) 
                    ? 'bg-[#4dff88] border-[#4dff88] shadow-[0_0_15px_#4dff88]' 
                    : 'bg-zinc-900 border-zinc-600 hover:border-[#4dff88]'
                }`}
                style={{ left: node.x, top: node.y }}
              >
              </button>
            ))}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#4dff88] font-mono text-xs opacity-50">
              網絡建構: {Math.round((litNodes.length / 4) * 100)}%
            </div>
          </div>
        )}

        {step === 2 && (
           <div className="text-center animate-fade-in w-full">
             <h2 className="text-5xl font-black text-[#4dff88] mb-2 tracking-tighter">連結成功</h2>
             <div className="h-1 w-full bg-[#4dff88] mb-6"></div>
             <p className="text-zinc-400 mb-8 font-mono text-sm">生態系統重啟中...</p>
             <Button variant="primary" onClick={() => {
               setProgress(p => ({...p, m2: true}));
               setScene(SCENES.MAP);
             }} className="w-full border-white text-zinc-900 hover:bg-white">
               返回地圖
             </Button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Mission2;
