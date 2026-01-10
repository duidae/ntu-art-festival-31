import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Waves } from 'lucide-react';
import { Button } from '../components/Button';
import { SCENES } from '@/src/enum';
import { CENTER, MISSIONS } from '@/src/constants';

interface MapProps {
  setScene: (targetScene: {scene: SCENES, story: string}) => void;
  progress: { m1: boolean; m2: boolean; m3: boolean, b1: boolean; b2: boolean; b3: boolean};
}

// TODO: 
// 1. 增加 水道map layer
// 2. 本計劃/藝術季作品分隔顯示

export const Map = ({ setScene, progress }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const allDone = progress.m1 && progress.m2 && progress.m3;

  const mainMissions = [
    {
      id: SCENES.MISSION_1,
      pos: MISSIONS.Main[0].coordinates as L.LatLngExpression,
      title: MISSIONS.Main[0].title,
      img: `<img src="${MISSIONS.Main[0].img || ''}" loading="lazy" style="width: 100%; height: auto; display: block;" />`,
      done: progress.m1
    }, {
      id: SCENES.MAIN_MISSION,
      pos: MISSIONS.Main[1].coordinates as L.LatLngExpression,
      title: MISSIONS.Main[1].title,
      done: progress.m2
    }, {
      id: SCENES.MAIN_MISSION,
      pos: MISSIONS.Main[2].coordinates as L.LatLngExpression,
      title: MISSIONS.Main[2].title,
      done: progress.m3
    },
  ];

  const subMissions = MISSIONS.Sub.map(m => {
    return {
      id: SCENES.SUB_MISSION,
      pos: m.coordinates as L.LatLngExpression,
      title: m.title,
      img: `<img src="${m.img || ''}" loading="lazy" style="width: 100%; height: auto; display: block;" />`,
      story: m.story || "",
      done: true,
    };
  });

  const userIcon = L.divIcon({
    className: 'user-icon',
    html: `<div class="w-4 h-4 bg-zinc-900 rotate-45 border-2 border-[#4dff88] animate-spin-slow"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  // TODO: fix bg color issue
  const createMarkerIcon = (isDone: boolean, isMain: boolean = true) => L.divIcon({
    className: 'custom-brutalist-icon',
    html: `
      <div style="
        width: ${isMain ? '32' : '20'}px;
        height: ${isMain ? '32' : '20'}px;
        background: ${isDone ? '#d4d4d8' : '#4dff88'};
        border: 2px solid #18181b; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 3px 3px 0px 0px #18181b;
      ">
        <div style="width: 8px; height: 8px; background: #18181b; rotate: 45deg;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const initMap = (container: HTMLDivElement): L.Map => {
    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    }).setView(CENTER, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    return map;
  };

  const addGeoJsonLayer = (map: L.Map) => {
    fetch('/1932TaipeiWaterRoutes.geojson')
      .then(res => res.json())
      .then(data => {
        const geoLayer = L.geoJSON(data, {
          filter: f => f.geometry?.type !== "Point"
        }).addTo(map);
        L.control.layers(null, {
          '💧1932台北舊水路': geoLayer
        }, {
          collapsed: false
        }).addTo(map);
      })
      .catch(err => console.error('Failed to load GeoJSON', err));
  };

  const addMarkers = (map: L.Map) => {
    L.marker(CENTER, { icon: userIcon }).addTo(map);
    addMissionMarkers(map, mainMissions, true);
    addMissionMarkers(map, subMissions);
  };

  const addMissionMarkers = (map: L.Map, missions: any[], isMain: boolean = false) =>  {
    missions.forEach((m) => {
      const marker = L.marker(m.pos, { icon: createMarkerIcon(m.done, isMain) }).addTo(map);
      const popupContent = document.createElement('div');
      popupContent.className = 'p-4 bg-white font-mono flex flex-col items-center';
      const iconHtml = m.done 
        ? `<div class="w-36 h-36 mb-2 flex items-center justify-center bg-[#4dff88] border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#000] overflow-hidden">${m.img}</div>`
        : `<div class="w-12 h-12 mb-2 flex items-center justify-center bg-zinc-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#000]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;
      popupContent.innerHTML = `
        ${iconHtml}
        <p class="text-[10px] font-black mb-2 uppercase tracking-widest text-zinc-900">${m.title}</p>
        <button class="bg-zinc-900 text-[#4dff88] px-4 py-1 text-[10px] font-bold border-2 border-black hover:bg-zinc-800 transition-colors uppercase">${m.done ? '檔案已歸檔' : '進入節點'}</button>
      `;
      const btn = popupContent.querySelector('button');
      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault();
          setScene({scene: m.id, story: m.story || ""});
        };
      }
      marker.on('click', () => map.panTo(marker.getLatLng()));
      marker.bindPopup(popupContent, { minWidth: 120, autoPan: false });
    });
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = initMap(mapContainerRef.current);
      addGeoJsonLayer(map);
      addMarkers(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [setScene, progress]);

  return (
    <div className="h-full bg-[#e8e8e6] relative overflow-hidden flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="flex-1 z-0 grayscale contrast-125" />
      
      {/* TODO: use dynamic lat/lon */}
      <div className="absolute top-4 left-4 z-[1000] bg-zinc-900 text-white p-2 border-2 border-[#4dff88] font-mono text-[10px]">
        LAT_LON: 25.01°N 121.53°E
      </div>

      {/* Finale Trigger */}
      {allDone && (
        <div className="absolute inset-0 bg-white/90 z-[2000] flex flex-col items-center justify-center animate-fade-in p-8">
          <div className="relative mb-6">
            <Waves size={64} className="text-zinc-900" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#4dff88] rounded-full mix-blend-multiply animate-ping"></div>
          </div>
          <h2 className="text-3xl font-black mb-2 text-zinc-900 uppercase">系統同步完成</h2>
          <p className="text-zinc-500 font-mono text-xs mb-8">ALL NODES CONNECTED.</p>
          <Button variant="secondary" onClick={() => setScene({scene: SCENES.FINALE, story: ""})} className="w-full">
            進入地下終章
          </Button>
        </div>
      )}
    </div>
  );
};

export default Map;
