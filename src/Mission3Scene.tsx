import React, { useState } from 'react';
import {
  Map as MapIcon,
  X, 
  Fish, 
} from 'lucide-react';
import { Button } from './components/Button';
import { DialogBox } from './components/DialogBox';
import { SCENES } from './constants';

interface SceneProps {
  setScene: (scene: SCENES) => void;
}

interface MissionProps extends SceneProps {
  setProgress: React.Dispatch<React.SetStateAction<{ m1: boolean; m2: boolean; m3: boolean, b1: boolean; b2: boolean; b3: boolean}>>;
}

export const Mission3 = ({ setScene, setProgress }: MissionProps) => {
  const [dialogStep, setDialogStep] = useState(0);
  const [mode, setMode] = useState<'NARRATIVE' | 'CAMERA' | 'SUCCESS'>('NARRATIVE'); 
  const [scanning, setScanning] = useState(false);

  const narrative = [
    { speaker: '幽靈魚', text: '曾經，這裡的水清澈如鏡。臺灣鬥魚在水草間築巢，青鱂魚在陽光下閃爍...' },
    { speaker: '幽靈魚', text: '當城市崛起，黑水湧入。嬌貴的牠們都消失了。只剩下我們——土虱與吳郭魚。' },
    { speaker: '幽靈魚', text: '我們在混濁與缺氧中學會了生存，成為了這座城市地下的「幽靈」。' },
    { speaker: '系統', text: '訊號來源鎖定：地表藝術裝置。請開啟 AR 掃描器，尋找「土虱」的蹤跡。' }
  ];

  const handleNextDialog = () => {
    if (dialogStep < narrative.length - 1) {
      setDialogStep(d => d + 1);
    } else {
      setMode('CAMERA');
    }
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setMode('SUCCESS');
    }, 2500);
  };

  return (
    <div className="h-full bg-[#e8e8e6] relative flex flex-col p-6">
      <div className="z-10 mb-4 flex justify-between items-center border-b-2 border-zinc-900 pb-2">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <span className="bg-[#4dff88] text-zinc-900 px-1">03</span> 幽靈魚
        </h3>
        <button onClick={() => setScene(SCENES.MAP)}><X size={20} /></button>
      </div>

      <div className="flex-1 relative flex flex-col items-center pt-4">
        {mode === 'NARRATIVE' && (
          <div className="flex-1 flex items-center justify-center w-full">
             <div className="absolute top-1/4 opacity-20 animate-pulse-slow">
                <Fish size={180} className="text-zinc-900" />
             </div>
             <DialogBox 
               {...narrative[dialogStep]} 
               onNext={handleNextDialog}
               isEnd={dialogStep === narrative.length - 1}
             />
          </div>
        )}

        {mode === 'CAMERA' && (
          <div className="w-full flex-1 flex flex-col animate-fade-in relative">
             <div className="flex-1 bg-zinc-800 relative overflow-hidden border-2 border-zinc-900 rounded-sm">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')] bg-cover bg-center grayscale opacity-60"></div>
                
                <div className="absolute inset-8 border-2 border-white/50 flex items-center justify-center">
                   <div className="w-4 h-4 border-t-2 border-l-2 border-[#4dff88] absolute top-0 left-0 -translate-x-1 -translate-y-1"></div>
                   <div className="w-4 h-4 border-t-2 border-r-2 border-[#4dff88] absolute top-0 right-0 translate-x-1 -translate-y-1"></div>
                   <div className="w-4 h-4 border-b-2 border-l-2 border-[#4dff88] absolute bottom-0 left-0 -translate-x-1 translate-y-1"></div>
                   <div className="w-4 h-4 border-b-2 border-r-2 border-[#4dff88] absolute bottom-0 right-0 translate-x-1 translate-y-1"></div>
                   
                   {scanning && (
                     <div className="absolute inset-0 bg-[#4dff88]/20 animate-pulse flex items-center justify-center">
                        <span className="font-mono font-bold text-[#4dff88] bg-zinc-900 px-2">正在分析物件...</span>
                     </div>
                   )}
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                   <p className="text-white text-xs bg-black/50 inline-block px-2 mb-2 font-mono">目標：土虱藝術裝置</p>
                </div>
             </div>

             <div className="mt-6 mb-4 flex justify-center">
                <button 
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-16 h-16 rounded-full border-4 border-zinc-900 flex items-center justify-center bg-white active:scale-95 transition-all"
                >
                   <div className="w-12 h-12 rounded-full bg-zinc-900 group-hover:bg-[#4dff88]"></div>
                </button>
             </div>
             <p className="text-center text-zinc-500 font-bold text-xs">點擊開始掃描</p>
          </div>
        )}

        {mode === 'SUCCESS' && (
          <div className="animate-fade-in text-center w-full mt-10">
             <div className="inline-block relative mb-8">
                 <div className="w-40 h-40 bg-zinc-900 flex items-center justify-center border-4 border-[#4dff88] shadow-[8px_8px_0px_0px_rgba(24,24,27,1)]">
                     <Fish size={80} className="text-[#4dff88]" />
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30 mix-blend-overlay"></div>
                 </div>
             </div>

             <h2 className="text-3xl font-black mb-2 text-zinc-900">發現幽靈魚</h2>
             <p className="text-zinc-600 mb-8 px-4 font-serif leading-relaxed">
               幽靈魚：你找到了我。雖然我們長得不美，但我們是在這片污濁中，唯一活下來的見證者。
             </p>
             <Button onClick={() => {
               setProgress(p => ({...p, m3: true}));
               setScene(SCENES.MAP);
             }} variant="secondary" className="w-full">
               同步觀測數據
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mission3;
