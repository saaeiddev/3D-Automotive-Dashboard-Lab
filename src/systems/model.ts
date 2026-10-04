export const modes = ['Comfort','Sport','Sport+','Eco','Individual'] as const;
export type Mode = typeof modes[number];
export const sections = ['Home','Navigation','Media','Phone','Vehicle','Performance','Climate','ADAS','Cameras','Lighting','Settings'] as const;
export type Section = typeof sections[number];
export const cameras = ['Driver','Dashboard','Infotainment','Cluster','Steering Wheel','Center Console','Passenger','Interior Overview','ADAS','Sensor View'] as const;
export type Camera = typeof cameras[number];
export type State = {
 speed:number; rpm:number; gear:string; mode:Mode; running:boolean; ambient:string; brightness:number;
 driverTemp:number; passengerTemp:number; fan:number; ac:boolean; airflow:string; heating:number; ventilation:number;
 playing:boolean; track:number; progress:number; volume:number; favorite:boolean; hud:boolean; night:boolean;
 adas:Record<string,boolean>; distance:number; muted:boolean; cameraFeed:string; phone:boolean; route:boolean;
 vehicle:Record<string,string>; quality:string; lapRunning:boolean; lapTime:number; laps:number[];
};
export const initialState:State = {
 speed:0,rpm:850,gear:'P',mode:'Comfort',running:false,ambient:'#ff783c',brightness:0.6,
 driverTemp:21,passengerTemp:21,fan:3,ac:true,airflow:'Face',heating:0,ventilation:0,
 playing:false,track:0,progress:0,volume:45,favorite:false,hud:true,night:false,
 adas:{'Adaptive Cruise':false,'Lane Keeping':true,'Lane Departure':true,'Collision Warning':true,'Emergency Braking':true,'Blind Spot':true,'Sign Recognition':true,'Parking Assist':false},
 distance:120,muted:true,cameraFeed:'Surround',phone:false,route:true,
 vehicle:{'Engine response':'Balanced','Steering weight':'Comfort','Suspension':'Comfort','Transmission':'Automatic','Traction control':'On','Exhaust sound':'Subtle'},quality:'Auto',lapRunning:false,lapTime:0,laps:[]
};
export const tracks = [{title:'Midnight Drive',artist:'AERON Sound Lab',color:'#b65c3a',duration:182},{title:'Alpine Frequencies',artist:'AERON Sound Lab',color:'#718d8c',duration:216},{title:'After the Apex',artist:'AERON Sound Lab',color:'#74768e',duration:195}];
export const modeColor = (m:Mode) => m==='Eco'?'#8dc8ac':m==='Sport+'?'#ff564a':m==='Sport'?'#ff9b56':'#ff783c';
export const timeString = (s:number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
