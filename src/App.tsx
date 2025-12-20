import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  MapPin, 
  Scan, 
  Volume2, 
  ArrowRight, 
  Droplets, 
  Sparkles, 
  History, 
  CheckCircle2,
  Waves,
  Map as MapIcon,
  Mic, 
  Share2, 
  X, 
  Play, 
  Fish, 
  Camera, 
  HelpCircle 
} from 'lucide-react';
import L from 'leaflet';
import { IntroScene } from './IntroScene';
import { MapScene } from './MapScene';
import { CATFISH_BASE64 } from './constants'

/**
 * 圳下之聲：瑠公圳的隱地下生態 (Voices from the Underground)
 * Style: DECOmposer (Art Festival / Brutalist / Deconstruction)
 * Palette: Light Gray Noise, Neon Green (#4dff88), Black
 */

// --- Style Tokens ---
const STYLES = {
  bg: "bg-[#e8e8e6]", 
  textMain: "text-zinc-900",
  textSub: "text-zinc-500",
  accent: "bg-[#4dff88]", 
  accentText: "text-[#00a63e]",
  black: "bg-zinc-900",
  border: "border-zinc-900",
};

// --- Helper for HTML Strings (since Leaflet popups use innerHTML) ---
const getIconSvg = (type: 'unknown' | 'check' | SCENES) => {
  let svgs = {
    unknown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  };
  svgs[SCENES.MISSION_1] = `<img src="${CATFISH_BASE64}" style="width: 100%; height: auto; display: block;" alt="Catfish"/>`;
  return svgs[type];
};

// --- Components ---

const NoiseOverlay = () => (
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 mix-blend-multiply" 
       style={{ 
         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
       }}
  />
);

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

// --- Game States ---
enum SCENES {
  INTRO = 'INTRO',
  MAP = 'MAP',
  MISSION_1 = 'MISSION_1',
  MISSION_2 = 'MISSION_2',
  MISSION_3 = 'MISSION_3',
  BRANCH_1 = 'BRANCH_1',
  BRANCH_2 = 'BRANCH_2',
  BRANCH_3 = 'BRANCH_3',
  FINALE = 'FINALE'
}

// --- Main App ---

export default function App() {
  const [scene, setScene] = useState<SCENES>(SCENES.INTRO);
  const [progress, setProgress] = useState({ m1: false, m2: false, m3: false, b1: false, b2: false, b3: false });

  return (
    <div className="min-h-screen bg-[#dcdcdc] flex items-center justify-center p-0 md:p-8 font-sans text-zinc-900">
      <div className="w-full max-w-md h-[100dvh] md:h-[800px] bg-[#e8e8e6] md:border-4 border-zinc-900 shadow-2xl overflow-hidden relative flex flex-col">
        <NoiseOverlay />
        
        {/* Status Bar */}
        <div className="h-10 border-b-2 border-zinc-900 flex justify-between items-center px-4 bg-white z-50 relative shrink-0">
          <span className="font-mono font-bold text-xs tracking-widest">31TH_FESTIVAL</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4dff88] animate-pulse border border-zinc-900"></div>
            <span className="font-mono text-xs font-bold">訊號連線中</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {scene === SCENES.INTRO && <IntroScene setScene={setScene} />}
          {scene === SCENES.MAP && <MapScene setScene={setScene} progress={progress} />}
          {scene === SCENES.MISSION_1 && <Mission1 setScene={setScene} setProgress={setProgress} />}
          {scene === SCENES.MISSION_2 && <Mission2 setScene={setScene} setProgress={setProgress} />}
          {scene === SCENES.MISSION_3 && <Mission3 setScene={setScene} setProgress={setProgress} />}
          {scene === SCENES.FINALE && <FinaleScene />}
        </div>

        {/* Navigation - Floating Brutalist Bar */}
        {scene === SCENES.MAP && (
          <div className="absolute bottom-8 left-4 right-4 h-16 bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex items-center justify-around px-2 z-[1000]">
            <button className="flex flex-col items-center gap-1 text-zinc-900 group" onClick={() => setScene(SCENES.MAP)}>
              <div className="bg-[#4dff88] p-1 border border-zinc-900 transition-transform group-hover:-translate-y-1">
                <MapPin size={18} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">地圖</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900 group">
              <div className="p-1 border border-transparent group-hover:border-zinc-900 transition-colors">
                 <Waves size={18} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">聲音</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-zinc-900 group relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4dff88] rounded-full border border-black z-10"></div>
              <div className="p-1 border border-zinc-900 bg-zinc-900 text-white transition-transform group-hover:scale-110">
                 <Scan size={18} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">掃描</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Scenes ---

interface SceneProps {
  setScene: (scene: SCENES) => void;
}

interface MissionProps extends SceneProps {
  setProgress: React.Dispatch<React.SetStateAction<{ m1: boolean; m2: boolean; m3: boolean, b1: boolean; b2: boolean; b3: boolean}>>;
}

const unknowSVG = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

// --- Mission 1: History Sort ---
function Mission1({ setScene, setProgress }: MissionProps) {
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

      <div>
        { !complete ? unknowSVG : <img src={CATFISH_BASE64} alt="Catfish"/>}
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
}

// --- Mission 2: Ecology Connect ---
function Mission2({ setScene, setProgress }: MissionProps) {
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
}

// --- Mission 3: Ghost Fish ---
function Mission3({ setScene, setProgress }: MissionProps) {
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
}

// --- Finale Scene ---
function FinaleScene() {
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
}