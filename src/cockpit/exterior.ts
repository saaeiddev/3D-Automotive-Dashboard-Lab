import * as T from 'three';
import {rounded,tube} from './geometry';

// Original fastback body, built around the existing cabin's dimensions.
export function buildExterior(){
 const root=new T.Group();root.name='Complete exterior';
 const paint=new T.MeshPhysicalMaterial({color:'#82969d',metalness:.78,roughness:.25,clearcoat:1,clearcoatRoughness:.16,side:T.DoubleSide});
 const black=new T.MeshStandardMaterial({color:'#10171d',roughness:.42,metalness:.35});
 const rubber=new T.MeshStandardMaterial({color:'#101114',roughness:.94});
 const chrome=new T.MeshStandardMaterial({color:'#b9c5cc',metalness:1,roughness:.21});
 const glass=new T.MeshPhysicalMaterial({color:'#35525b',metalness:.25,roughness:.08,transparent:true,opacity:.66,side:T.DoubleSide,depthWrite:false,clearcoat:1});
 const white=new T.MeshStandardMaterial({color:'#e8faff',emissive:'#bceaff',emissiveIntensity:2});
 const red=new T.MeshStandardMaterial({color:'#ff383d',emissive:'#ff222a',emissiveIntensity:1.6});
 function mesh(g:T.BufferGeometry,m:T.Material,p:number[]=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...p as [number,number,number]);o.castShadow=true;o.receiveShadow=true;root.add(o);return o;}
 function box(w:number,h:number,d:number,m:T.Material,p:number[],r=.025){return mesh(rounded(w,h,d,r),m,p);}
 function line(p:number[][],r:number,m:T.Material){return mesh(tube(p,r,Math.max(24,p.length*10)),m);}
 function surface(rows:number[][][],m:T.Material){const pos:number[]=[],indices:number[]=[];const cols=rows[0].length;rows.forEach(row=>row.forEach(p=>pos.push(...p)));for(let i=0;i<rows.length-1;i++)for(let j=0;j<cols-1;j++){const a=i*cols+j,b=a+1,c=a+cols,d=c+1;indices.push(a,c,b,b,c,d);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(indices);g.computeVertexNormals();return mesh(g,m);}
 // Longitudinal body sections: bumper, hood, cowl, doors, rear haunches and tail.
 const stations=[[-2.70,.86,.56],[-2.53,1.00,.69],[-2.18,1.055,.79],[-1.65,1.055,.91],[-1.05,1.025,.98],[-.65,1.02,.94],[.15,1.045,.92],[.95,1.07,.92],[1.55,1.08,.90],[2.10,1.02,.82],[2.42,.93,.70]];
 for(const side of [-1,1]){
  const sections=Array.from({length:161},(_,i)=>{const z=-2.70+i*5.12/160;let j=0;while(j<stations.length-2&&stations[j+1][0]<z)j++;const a=stations[j],b=stations[j+1],t=(z-a[0])/(b[0]-a[0]);const w=T.MathUtils.lerp(a[1],b[1],t),h=T.MathUtils.lerp(a[2],b[2],t);let bottom=.22;for(const axle of [-1.77,1.57]){const d=Math.abs(z-axle);if(d<.374)bottom=Math.max(bottom,.325+Math.sqrt(.374**2-d*d));}return [[side*w,h,z],[side*(w+.025),Math.max(h-.10,bottom),z],[side*(w+.025),Math.max(.46,bottom),z],[side*(w-.035),bottom,z]];});surface(sections,paint);
  line(stations.map(([z,w,h])=>[side*(w+.027),h-.12,z]),.007,chrome);
  box(.095,.11,3.02,black,[side*1.05,.23,.07]);
  // Glazed side openings, swept pillars and window surrounds.
  const border=[[side*1.015,.99,-1.04],[side*.70,1.60,-.77],[side*.76,1.62,.72],[side*.99,.94,1.55],[side*1.03,.94,.17],[side*1.015,.99,-1.04]];
  surface([[border[0],border[1],border[2]],[border[5],border[4],border[3]]],glass);
  line(border,.018,chrome);
  line([[side*1.035,.94,.35],[side*.77,1.625,.28]],.032,black);
  line([[side*1.015,.99,-1.04],[side*.70,1.60,-.77]],.042,paint);
  line([[side*.76,1.62,.72],[side*.99,.94,1.55]],.052,paint);
  // Door shut lines, flush handles, sill aero and mirror housing.
  for(const z of [-.82,.35,1.48])line([[side*1.06,.87,z],[side*1.07,.37,z]],.003,black);
  for(const z of [.05,1.13])box(.019,.035,.16,black,[side*1.074,.81,z],.014);
  box(.20,.105,.24,paint,[side*1.15,1.04,-.74],.04);
  box(.16,.070,.008,chrome,[side*1.15,1.04,-.613],.018);
  // Four complete wheels: rubber, sidewalls, brake discs, calipers and ten sculpted spokes.
  for(const z of [-1.77,1.57]){
   const x=side*1.065,y=.325;
   const tire=mesh(new T.TorusGeometry(.253,.084,16,64),rubber,[x,y,z]);tire.rotation.y=Math.PI/2;
   const barrel=mesh(new T.CylinderGeometry(.223,.223,.17,48),black,[x,y,z]);barrel.rotation.z=Math.PI/2;
   const face=x+side*.10;
   const disc=mesh(new T.CylinderGeometry(.185,.185,.012,48),chrome,[face-side*.035,y,z]);disc.rotation.z=Math.PI/2;
   const lip=mesh(new T.TorusGeometry(.217,.011,8,64),chrome,[face,y,z]);lip.rotation.y=Math.PI/2;
   for(let i=0;i<10;i++){const a=i*Math.PI/5;const spoke=box(.019,.177,.026,chrome,[face,y+Math.cos(a)*.115,z+Math.sin(a)*.115],.005);spoke.rotation.x=a;}
   const hub=mesh(new T.CylinderGeometry(.047,.047,.022,24),black,[face+side*.006,y,z]);hub.rotation.z=Math.PI/2;
   for(let i=0;i<5;i++){const a=i*Math.PI*.4;const bolt=mesh(new T.SphereGeometry(.007,8,6),chrome,[face+side*.018,y+Math.cos(a)*.032,z+Math.sin(a)*.032]);bolt.castShadow=false;}
   box(.042,.105,.056,red,[face-side*.026,y+.06,z+.135],.01);
   const arch:number[][]=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI;arch.push([side*1.10,.325+Math.sin(a)*.374,z+Math.cos(a)*.374]);}line(arch,.026,paint);
   const well=mesh(new T.TorusGeometry(.347,.017,8,48,Math.PI),black,[side*1.101,y,z]);well.rotation.y=side*Math.PI/2;
  }
 }
 // Sculpted hood and rear deck with raised center and tapered shoulders.
 surface(stations.slice(0,5).map(([z,w,h])=>[[-w,h,z],[-w*.48,h+.055,z],[0,h+.07,z],[w*.48,h+.055,z],[w,h,z]]),paint);
 surface(stations.slice(8).map(([z,w,h])=>[[-w,h,z],[-w*.6,h+.035,z],[0,h+.045,z],[w*.6,h+.035,z],[w,h,z]]),paint);
 for(const side of [-1,1])line([[side*.54,.76,-2.48],[side*.62,.91,-1.75],[side*.66,1.02,-1.06]],.005,chrome);
 surface([[[-.70,1.60,-.77],[0,1.65,-.77],[.70,1.60,-.77]],[[-.75,1.65,.05],[0,1.70,.05],[.75,1.65,.05]],[[-.76,1.62,.72],[0,1.67,.72],[.76,1.62,.72]]],paint);
 surface([[[-.76,1.62,.72],[0,1.67,.72],[.76,1.62,.72]],[[-.97,.96,1.54],[0,1.00,1.54],[.97,.96,1.54]]],glass);
 surface([[[-.98,.99,-1.05],[0,1.035,-1.05],[.98,.99,-1.05]],[[-.70,1.60,-.77],[0,1.65,-.77],[.70,1.60,-.77]]],glass);
 surface([[[-.86,.56,-2.70],[0,.63,-2.70],[.86,.56,-2.70]],[[-.86,.22,-2.70],[0,.22,-2.70],[.86,.22,-2.70]]],paint);
 surface([[[-.93,.70,2.42],[0,.745,2.42],[.93,.70,2.42]],[[-.93,.22,2.42],[0,.22,2.42],[.93,.22,2.42]]],paint);
 box(1.73,.34,.20,paint,[0,.40,-2.58],.07);box(1.88,.27,.18,paint,[0,.39,2.32],.06);
 box(1.20,.14,.026,black,[0,.43,-2.69]);box(1.68,.055,.24,black,[0,.205,-2.54]);
 for(let i=-8;i<=8;i++)box(.012,.115,.012,chrome,[i*.065,.43,-2.708],.002);
 for(const side of [-1,1]){
  const lamp=box(.49,.075,.06,black,[side*.63,.655,-2.58],.018);lamp.rotation.y=side*-.15;
  line([[side*.40,.668,-2.62],[side*.67,.67,-2.62],[side*.86,.65,-2.53]],.012,white);
  box(.47,.060,.05,red,[side*.63,.693,2.455],.015);
  const exhaust=mesh(new T.CylinderGeometry(.05,.05,.10,24),chrome,[side*.71,.275,2.41]);exhaust.rotation.x=Math.PI/2;
  const outlet=mesh(new T.CircleGeometry(.04,24),black,[side*.71,.275,2.465]);outlet.rotation.y=0;
 }
 box(1.46,.08,.17,black,[0,.225,2.38]);for(let i=-3;i<=3;i++)box(.025,.10,.25,black,[i*.17,.23,2.32],.005);
 box(1.58,.035,.12,paint,[0,.91,2.10],.012);
 box(1.87,.08,4.6,black,[0,.12,-.08]);
 return root;
}
