import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Map as MapIcon,
} from 'lucide-react';
import { Button } from './components/Button';
import { APP_NAME } from './constants';

interface IntroSceneProps {
  onChangeScene: () => void;
}

export const IntroScene = ({ onChangeScene }: IntroSceneProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#e8e8e6] relative p-8">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
      
      <svg className="absolute w-full h-full pointer-events-none opacity-60 z-0" style={{top: 0, left: 0}}>
         <path d="M -50 400 L 100 550 L 250 350 L 450 600" stroke="#4dff88" strokeWidth="12" fill="none" strokeLinecap="square" />
         <circle cx="100" cy="550" r="6" fill="black" />
         <circle cx="250" cy="350" r="6" fill="black" />
      </svg>

      <div className="z-10 w-full flex flex-col items-start relative">
        <h2 className="text-xl font-bold text-zinc-400 mb-2 rotate-1" dangerouslySetInnerHTML={{ __html: APP_NAME }}></h2>
        <h1 className="text-6xl font-black text-zinc-900 leading-[0.85] tracking-tighter mb-6 relative">
          圳下<br/>
          之聲
          <span className="absolute -right-4 -top-4 w-12 h-12 bg-[#4dff88] rounded-full mix-blend-multiply opacity-80"></span>
        </h1>
        
        <div className="w-full h-0.5 bg-zinc-900 mb-6"></div>

        <p className="text-zinc-600 font-serif font-medium text-lg mb-8 leading-tight">
          瑠公圳的<br/>
          <span className="bg-zinc-900 text-[#e8e8e6] px-1">隱地下生態</span><br/>
          DECOmposer Project
        </p>

        {step >= 1 && (
          <div className="animate-fade-in w-full">
            <div className="bg-white border-2 border-zinc-900 p-4 mb-8 shadow-[4px_4px_0px_0px_#4dff88]">
              {/* TODO: make ... jump */}
              <p className="font-mono text-xs text-zinc-400 mb-1">// INCOMING MESSAGE...</p>
              <p className="text-sm font-bold text-zinc-900">
                「若你願意傾聽，沿著地面裂縫去找我們。」
              </p>
            </div>

            <Button onClick={() => onChangeScene()} className="w-full" variant="primary">
              開始聆聽 <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroScene;
