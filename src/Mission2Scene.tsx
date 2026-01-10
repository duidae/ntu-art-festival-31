import React, { useState } from 'react';
import {
  Map as MapIcon,
  X,
} from 'lucide-react';
import { Button } from './components/Button';
import { DialogBox } from './components/DialogBox';
import { SCENES } from '@/src/enum';

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
