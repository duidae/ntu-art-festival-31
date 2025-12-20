import React, { useState } from 'react';
import { 
  Headphones, 
  CheckCircle2,
  Map as MapIcon,
  Mic, 
  Share2,
} from 'lucide-react';
import { Button } from './components/Button';

export const FinalScene = () => {
  const [pledged, setPledged] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [recording, setRecording] = useState(false);

  const handleRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
    }, 2000);
  };

  if (pledged) {
    return (
      <div className="h-full bg-[#e8e8e6] flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#4dff88]"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-zinc-900"></div>

        <div className="w-40 h-40 relative mb-8 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full animate-spin-slow">
             <path id="curve" d="M 20 100 A 80 80 0 1 1 180 100 A 80 80 0 1 1 20 100" fill="none"/>
             <text width="500">
               <textPath xlinkHref="#curve" className="text-xs font-mono font-bold tracking-widest fill-zinc-900">
                 UNDERGROUND GUARDIAN • UNDERGROUND GUARDIAN •
               </textPath>
             </text>
          </svg>
          <div className="w-24 h-24 bg-[#4dff88] border-4 border-zinc-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]">
            <Headphones size={40} className="text-zinc-900" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-zinc-900 mb-2 uppercase">感謝你的參與</h1>
        <p className="text-zinc-500 mb-10 font-serif italic">這座城市聽見了你的聲音。</p>
        
        <div className="w-full border-t-2 border-zinc-900 pt-6">
           <Button variant="action" className="w-full mb-4 bg-zinc-900 text-[#4dff88]">
             <Share2 size={18} /> 分享徽章
           </Button>
           <p className="font-mono text-[10px] text-zinc-400">ID: 31TH_ART_FEST_001</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f4f4f5] overflow-y-auto p-6 relative">
      <div className="border-l-4 border-[#4dff88] pl-4 mb-8 mt-4">
        <h2 className="text-3xl font-black text-zinc-900 uppercase">終章</h2>
        <p className="text-zinc-500 font-serif italic">重新建立連結。</p>
      </div>

      <div className="mb-8 p-6 bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#e5e5e5]">
        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <div className="w-3 h-3 bg-[#4dff88] border border-zinc-900"></div> 
          步驟 01 / 生態承諾
        </h3>
        <div className="space-y-3">
          {['減少化學清潔劑', '參與水圳淨溪', '分享故事'].map((text, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 border-2 border-zinc-900 flex items-center justify-center bg-white group-hover:bg-[#4dff88] transition-colors">
                 <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer" />
                 <div className="w-3 h-3 bg-zinc-900 opacity-0 check-indicator"></div>
              </div>
              <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900">{text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8 p-6 bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#e5e5e5]">
        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <div className="w-3 h-3 bg-[#4dff88] border border-zinc-900"></div> 
          步驟 02 / 留下聲音
        </h3>
        <div className="flex flex-col items-center justify-center">
          <button 
            onClick={handleRecord}
            className={`w-20 h-20 border-4 border-zinc-900 flex items-center justify-center transition-all ${
              recording ? 'bg-red-500 rounded-full' : 'bg-[#e8e8e6] rounded-none hover:bg-[#4dff88] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]'
            }`}
          >
            {recorded ? <CheckCircle2 size={32} /> : <Mic size={32} />}
          </button>
          <p className="text-xs font-mono text-zinc-400 mt-4 uppercase">
            {recording ? '錄音中...' : recorded ? '上傳完成' : '點擊錄製 15秒'}
          </p>
        </div>
      </div>

      <Button 
        variant="primary" 
        className="w-full shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
        onClick={() => setPledged(true)}
        disabled={!recorded}
      >
        完成調查
      </Button>
    </div>
  );
};

export default FinalScene;
