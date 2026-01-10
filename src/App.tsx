import React, { useState } from 'react';
import { 
  MapPin, 
  Scan, 
  Waves,
  Map as MapIcon,
} from 'lucide-react';
import { SCENES } from '@/src/enum';
import { APP_NAME } from '@/src/constants';
import { Intro, Map, MainMission, SubMission, Final } from '@/src/scene';
import { Mission1 } from './Mission1Scene';
import { Mission2 } from './Mission2Scene';
import { Mission3 } from './Mission3Scene';

/**
 * 圳下之聲：瑠公圳的隱地下生態 (Voices from the Underground)
 * Style: DECOmposer (Art Festival / Brutalist / Deconstruction)
 * Palette: Light Gray Noise, Neon Green (#4dff88), Black
 */

const NoiseOverlay = () => (
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 mix-blend-multiply" 
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
    }}
  />
);

export default function App() {
  const [currentScene, setCurrentScene] = useState<{scene: SCENES, story: string}>({scene: SCENES.INTRO, story: ""});
  const [progress, setProgress] = useState({ m1: false, m2: false, m3: false, b1: false, b2: false, b3: false });

  const backToMap = () => {
    setCurrentScene({scene: SCENES.MAP, story: ""});
  };

  const mapToolbarJSX = (
    <div className="absolute bottom-8 left-4 right-4 h-16 bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex items-center justify-around px-2 z-[1000]">
      <button className="flex flex-col items-center gap-1 text-zinc-900 group" onClick={() => setCurrentScene({scene: SCENES.MAP, story: ""})}>
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
  );

  return (
    <div className="min-h-screen bg-[#dcdcdc] flex items-center justify-center p-0 md:p-8 font-sans text-zinc-900">
      <div className="w-full max-w-md h-[100dvh] md:h-[800px] bg-[#e8e8e6] md:border-4 border-zinc-900 shadow-2xl overflow-hidden relative flex flex-col">
        <NoiseOverlay />
        
        <div className="h-10 border-b-2 border-zinc-900 flex justify-between items-center px-4 bg-white z-50 relative shrink-0">
          <span className="font-mono font-bold text-xs tracking-widest" dangerouslySetInnerHTML={{ __html: APP_NAME }}></span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4dff88] animate-pulse border border-zinc-900"></div>
            <span className="font-mono text-xs font-bold">訊號連線中</span>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {currentScene.scene === SCENES.INTRO && <Intro onChangeScene={backToMap} />}
          {currentScene.scene === SCENES.MAP &&
            <>
              <Map setScene={setCurrentScene} progress={progress} />
              {mapToolbarJSX}
            </>
          }
          {currentScene.scene === SCENES.MISSION_1 && <Mission1 setScene={setCurrentScene} setProgress={setProgress} />}
          {currentScene.scene === SCENES.MISSION_2 && <Mission2 setScene={setCurrentScene} setProgress={setProgress} />}
          {currentScene.scene === SCENES.MISSION_3 && <Mission3 setScene={setCurrentScene} setProgress={setProgress} />}
          {currentScene.scene === SCENES.BRANCH_1 && <SubMission storyPath={currentScene.story} onChangeScene={backToMap} />}
          {currentScene.scene === SCENES.FINALE && <Final onChangeScene={backToMap} />}
        </div>
      </div>
    </div>
  );
}
