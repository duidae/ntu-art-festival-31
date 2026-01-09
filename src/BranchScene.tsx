import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './components/Button';
import { SCENES } from './constants';

interface SceneProps {
  setScene: (scene: SCENES) => void;
}

interface MissionProps extends SceneProps {
  setProgress: React.Dispatch<React.SetStateAction<{ m1: boolean; m2: boolean; m3: boolean, b1: boolean; b2: boolean; b3: boolean}>>;
}

export const BranchScene = ({ setScene, setProgress }: MissionProps) => {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const response = await fetch('/story/NTUST-turtle-pool.json');
        const story = await response.json();
        setStory(story);
      } catch (err) {
        console.error(err);
      }
    };
    loadStory();
  }, []);

  const renderStory = (story: any) => {
    if (!story || !story.contents) return null;
    
    return story.contents.map((item: any, index: number) => {
      switch (item.type) {
        case 'paragraph':
          return <p key={index} className="mb-4 text-zinc-900">{item.text}</p>;
        case 'image':
          return <img key={index} src={item.url} alt="" className="mb-4 w-full h-auto" />;
        case 'video':
          return (
            <video key={index} controls className="mb-4 w-full h-auto">
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        default:
          return null;
      }
    });
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="h-full bg-[#f4f4f5] relative flex flex-col p-6">
       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <h1 className="text-9xl font-black">HIST</h1>
       </div>
       
      <div className="z-10 mb-6 flex justify-between items-center border-b-2 border-zinc-900 pb-2">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <span className="bg-[#4dff88] text-zinc-900 px-1">支線</span> {story.title}
        </h3>
        <button onClick={() => setScene(SCENES.MAP)}><X size={20} /></button>
      </div>

      <div className="flex-1">
        {renderStory(story)}
      </div>

      <div className="flex-1 z-10 flex flex-col items-center justify-center relative">
        <div className="animate-fade-in text-center w-full">
          <Button onClick={() => {
            setProgress(p => ({...p, b1: true}));
            setScene(SCENES.MAP);
          }} variant="primary" className="w-full">
            關閉檔案
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchScene;
