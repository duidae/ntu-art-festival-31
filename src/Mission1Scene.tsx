import React, { useState } from 'react';
import {
  Volume2, 
  Droplets, 
  Sparkles, 
  History, 
  Map as MapIcon,
  X, 
  Fish, 
} from 'lucide-react';
import { SCENES } from './constants'

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

export const Mission1 = ({ setScene, setProgress }: MissionProps) => {
  const [dialogStep, setDialogStep] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [complete, setComplete] = useState(false);
  
  const cards = [
    { id: 'B', text: '水泥截彎取直', sub: '都市化', angle: 'rotate-1' },
    { id: 'C', text: '沉睡於柏油下', sub: '隱沒', angle: '-rotate-2' },
    { id: 'A', text: '滋養阡陌良田', sub: '灌溉', angle: 'rotate-3' },
  ];

  const handleSwap = () => {
    setComplete(true);
  };

  const narrative = [
    { speaker: '系統', text: '正在讀取檔案：瑠公圳歷史...' },
    { speaker: '水脈族', text: '最初，我們是這片土地的血脈。金色的稻浪依靠我們呼吸，我們恣意蜿蜒在古老的阡陌之間。' },
    { speaker: '水脈族', text: '後來，城市渴望土地。我們被水泥「截彎取直」，被迫服從直線的秩序，成為都市的排水溝。' },
    { speaker: '水脈族', text: '現在，我們在繁華的柏油路下沉睡，成為看不見的幽靈。只剩下微弱的水聲...你聽見了嗎？' },
    { speaker: '系統', text: '偵測到時序錯亂。調查員，請重組歷史碎片，還原這段記憶。' },
  ];

  const handleNextDialog = () => {
    if (dialogStep < narrative.length - 1) {
      setDialogStep(d => d + 1);
    } else {
      setShowGame(true);
    }
  };

  return (
    <div className="h-full bg-[#f4f4f5] relative flex flex-col p-6">
       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <h1 className="text-9xl font-black">HIST</h1>
       </div>
       
      <div className="z-10 mb-6 flex justify-between items-center border-b-2 border-zinc-900 pb-2">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <span className="bg-[#4dff88] text-zinc-900 px-1">01</span> 水脈
        </h3>
        <button onClick={() => setScene(SCENES.MAP)}><X size={20} /></button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <iframe width="100%" height="100%" title="Catfish" frameBorder="0" allowFullScreen mozAllowFullScreen="true" webkitAllowFullScreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/bae8b44a11b14b639e42b54de0be18ff/embed"> </iframe>
      </div>

      <div className="flex-1 z-10 flex flex-col items-center justify-center relative">
        {!showGame && (
           <div className="w-full absolute bottom-10 z-50">
             <DialogBox 
                {...narrative[dialogStep]} 
                onNext={handleNextDialog}
                isEnd={dialogStep === narrative.length - 1}
             />
             <div className="absolute -top-60 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
                <History size={160} className="text-zinc-900" />
             </div>
           </div>
        )}

        {showGame && !complete && (
          <div className="w-full space-y-6 animate-fade-in relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-300 -z-10 border-l-2 border-dashed border-zinc-400"></div>
            
            <p className="text-center font-mono text-xs text-zinc-500 bg-white inline-block px-2 mx-auto block border border-zinc-300">點擊卡片重組順序</p>
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                onClick={handleSwap} 
                className={`bg-white border-2 border-zinc-900 p-6 shadow-[6px_6px_0px_0px_#e5e7eb] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer ${card.angle}`}
              >
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-zinc-900 font-serif">{card.text}</span>
                  <span className="text-[10px] font-black tracking-widest text-[#4dff88] bg-zinc-900 px-1">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {complete && (
          <div className="animate-fade-in text-center w-full">
            <div className="border-4 border-zinc-900 p-8 bg-white relative inline-block mb-8">
               <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#4dff88] border-2 border-zinc-900"></div>
               <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-zinc-900"></div>
               <h2 className="text-4xl font-black italic">修復完成</h2>
            </div>
            <p className="text-zinc-600 mb-8 font-serif">水脈族：記憶已歸檔。</p>
            <Button onClick={() => {
              setProgress(p => ({...p, m1: true}));
              setScene(SCENES.MAP);
            }} variant="primary" className="w-full">
              關閉檔案
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mission1;
