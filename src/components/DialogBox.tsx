import React from 'react';
import {
  Volume2, 
  Droplets, 
  Sparkles, 
  Map as MapIcon,
  Fish, 
} from 'lucide-react';

interface DialogBoxProps {
  speaker: string;
  text: string;
  onNext?: () => void;
  isEnd?: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({ speaker, text, onNext, isEnd }) => (
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
