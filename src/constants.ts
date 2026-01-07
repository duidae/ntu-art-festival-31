export const APP_NAME = 'NTU 31<sup>st</sup> ART FESTIVAL';

export enum SCENES {
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

export const CENTER = [25.018429, 121.538275]; // NTU center coordinates
export const CATFISH_3D_MODEL = 'catfish.glb';
export const CATFISH_3D_MODEL_COVER = 'mission-1-catfish.png';

const mainMissions = [{
  time: '過去',
  title: '幽靈土虱',
  coordinates: [25.019714, 121.537269],
}, {
  time: '現在',
  title: '幽靈外來種',
  coordinates: [25.017488, 121.534450],
}, {
  time: '未來',
  title: '幽靈牛屎鯽',
  coordinates: [25.019397, 121.534129],
}];

const subMissions = [{
  title: '新生特一號大排起點',
  coordinates: [25.016538412134473, 121.53344031408966],
}, {
  title: '霧裡薛圳第二支線遺址',
  coordinates: [25.02142546608335, 121.53331719333822],
  link: 'https://maps.app.goo.gl/YFi6DGBU56eGVhCJ9',
  link2: 'https://nchdb.boch.gov.tw/assets/advanceSearch/monument/20250716000002',
}, {
  title: '民族實中重現北市水圳風華計畫',
  coordinates: [25.009941, 121.539239],
}, {
  title: '倪蔣懷 - 《臺北郊外》',
  coordinates: [25.01347054981437, 121.53613110546853],
  link: 'https://www.gch.tw/works/73',
}, {
  title: '瑠公圳原址紀念碑',
  coordinates: [25.017749911515796, 121.53358571541791],
  link: 'https://maps.app.goo.gl/Ph8fcuHWHXMpGrZD9',
}, {
  title: '瑠公圳水源池',
  coordinates: [25.016141649719067, 121.53976500223325],
  link: 'https://maps.app.goo.gl/tf4FkGwVxXDzvyK37',
}, {
  title: '水工所神秘尼斯湖',
  coordinates: [25.016486, 121.539349],
}, {
  title: '瑠公綠廊銅魚',
  coordinates: [25.042568, 121.544556],
}, {
  title: '師範大學誠溪',
  coordinates: [25.02743010513216, 121.52942428094387],
  link: 'http://history.lib.ntnu.edu.tw/wp/%E8%AA%A0%E6%BA%AA/',
}, {
  title: '傳說中醉月湖的船',
  coordinates: [25.015961719374307, 121.54159971128277],
}, {
  title: '綜合教學館水圳意象',
  coordinates: [25.018242, 121.539151],
}, {
  title: '志鴻館水圳意象(草溝)',
  coordinates: [25.018947, 121.539132],
}, {
  title: '新生南路水圳意象重現(堀川)',
  coordinates: [25.020390, 121.5343171],
}, {
  title: '台一新生特一號大排木棧橋舊照(二樓)',
  coordinates: [25.019129385103625, 121.53363154698376],
  link: 'https://www.instagram.com/p/DQHI0D6gbDe/?img_index=1',
}];

export const MISSIONS = {
  Main: mainMissions,
  Branch: subMissions,
};
