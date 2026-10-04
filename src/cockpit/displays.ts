import * as T from 'three';
import {modeColor,tracks,timeString,type State,type Section} from '../systems/model';
export function makeDisplay(w:number,h:number){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;return {canvas,ctx:canvas.getContext('2d')!,texture};}
export function drawCluster(x:CanvasRenderingContext2D,s:State,speed:number,rpm:number){
 const w=x.canvas.width,h=x.canvas.height;x.clearRect(0,0,w,h);x.fillStyle='#090e13';x.fillRect(0,0,w,h);const accent=modeColor(s.mode);
 const grad=x.createLinearGradient(0,h,0,0);grad.addColorStop(0,s.mode==='Eco'?'#142c26':'#241b19');grad.addColorStop(1,'#090e13');x.fillStyle=grad;x.fillRect(0,0,w,h);
 const text=(t:string,px:number,py:number,size:number,color='#ecf2f4',align:CanvasTextAlign='center')=>{x.font=`${size>45?'300':'500'} ${size}px Arial`;x.fillStyle=color;x.textAlign=align;x.fillText(t,px,py);};
 text('A E R O N',w/2,34,18,'#8a959c');text(s.mode.toUpperCase(),100,38,17,accent);text('87%  ▰',w-90,38,16,'#8a959c');
 // Original segmented perimeter tachometer.
 const cx=w/2,cy=h*.73,r=h*.65;
 for(let i=0;i<80;i++){const a=Math.PI*1.06+i/80*Math.PI*.88; x.beginPath();x.lineWidth=i%10===0?5:3;x.strokeStyle=i<rpm/100?(i>65?'#ef5545':accent):'#283039';x.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);x.lineTo(cx+Math.cos(a)*(r+(i%10===0?17:11)),cy+Math.sin(a)*(r+(i%10===0?17:11)));x.stroke();}
 text(Math.round(speed).toString().padStart(2,'0'),cx,h*.59,102);text('km/h',cx,h*.7,19,'#839097');text(s.gear,cx+172,h*.56,49,accent);text('GEAR',cx+172,h*.66,12,'#87949e');
 text(`${(rpm/1000).toFixed(1)}`,cx-185,h*.55,34);text('×1000 RPM',cx-185,h*.65,12,'#87949e');
 x.strokeStyle='#465463';x.lineWidth=2;x.beginPath();x.moveTo(cx-29,h-17);x.lineTo(cx-13,h-62);x.moveTo(cx+29,h-17);x.lineTo(cx+13,h-62);x.stroke();x.fillStyle=s.adas['Lane Keeping']?'#93cab2':'#556069';x.fillRect(cx-5,h-43,10,17);
 text('↗  450 m',135,h-38,24);text(s.route?'ALPINE PASS':'NO ACTIVE ROUTE',135,h-15,11,'#849199');
 x.beginPath();x.arc(w-127,h-40,23,0,Math.PI*2);x.fillStyle='#eee';x.fill();x.strokeStyle='#cb5448';x.lineWidth=5;x.stroke();text('80',w-127,h-32,21,'#15191c');
 if(speed>80)text('CHECK SPEED',w-230,h-18,12,'#ffa36a');else text('SYSTEMS READY',w-265,h-18,11,'#89a797');
}
export function drawMap(x:CanvasRenderingContext2D,left:number,top:number,w:number,h:number){
 x.save();x.beginPath();x.rect(left,top,w,h);x.clip();x.fillStyle='#192329';x.fillRect(left,top,w,h);
 x.strokeStyle='#27363c';x.lineWidth=15;for(let i=-3;i<12;i++){x.beginPath();x.moveTo(left+i*70,top);x.lineTo(left+i*70+130,top+h);x.stroke();}x.lineWidth=7;for(let i=0;i<8;i++){x.beginPath();x.moveTo(left,top+i*50);x.lineTo(left+w,top+i*50-70);x.stroke();}
 x.fillStyle='#24332d';x.beginPath();x.ellipse(left+w*.73,top+h*.28,w*.2,h*.2,-.5,0,Math.PI*2);x.fill();
 x.lineCap='round';x.lineJoin='round';x.strokeStyle='#ff8b52';x.lineWidth=7;x.beginPath();x.moveTo(left+w*.4,top+h);x.lineTo(left+w*.45,top+h*.57);x.lineTo(left+w*.71,top+h*.39);x.lineTo(left+w*.64,top-20);x.stroke();
 x.fillStyle='#f8f5ef';x.beginPath();const cx=left+w*.445,cy=top+h*.65;x.moveTo(cx,cy-14);x.lineTo(cx-10,cy+12);x.lineTo(cx,cy+7);x.lineTo(cx+10,cy+12);x.fill();x.restore();
}
export function drawInfotainment(x:CanvasRenderingContext2D,s:State,section:Section){
 const w=x.canvas.width,h=x.canvas.height;x.fillStyle='#0b1116';x.fillRect(0,0,w,h);const tx=(t:string,px:number,py:number,size=20,c='#edf1f2')=>{x.textAlign='left';x.fillStyle=c;x.font=`${size>30?'300':'500'} ${size}px Arial`;x.fillText(t,px,py);};
 tx('DriveOS',30,37,20);tx('09:41',w-86,37,17,'#9ca7ab');x.fillStyle='#293239';x.fillRect(30,52,w-60,1);
 if(section==='Home'||section==='Navigation'){
 drawMap(x,30,76,w*.56,h-140);tx('↗  Alpine pass',48,108,21);tx('450 m · Turn right',48,135,14,'#a4acae');
 const a=w*.64;tx('GOOD EVENING',a,94,11,'#86939a');tx('Make it a',a,132,27);tx('great drive.',a,164,27);
 x.fillStyle='#202931';x.fillRect(a,191,w*.3,77);tx('MIDNIGHT DRIVE',a+12,215,13);tx(s.playing?'Ⅱ  Playing':'▷  Ready to play',a+12,246,17,'#ff935e');
 }else if(section==='Media'){
 const t=tracks[s.track];const g=x.createLinearGradient(30,80,250,280);g.addColorStop(0,t.color);g.addColorStop(1,'#1d252b');x.fillStyle=g;x.fillRect(30,80,200,195);for(let i=0;i<14;i++){x.strokeStyle='#ffffff28';x.beginPath();x.arc(130,170,20+i*10,.2,5.7);x.stroke();}tx(t.title,265,140,32);tx(t.artist,265,174,18,'#89999e');tx(s.playing?'Ⅱ':'▷',290,237,40,'#ff9b63');tx(timeString(s.progress),370,229,18);
 }else if(section==='Climate'){
 tx('YOUR CLIMATE',30,97,14,'#a1adb5');tx(`${s.driverTemp}°`,55,209,86);tx(`${s.passengerTemp}°`,w*.57,209,86);tx('DRIVER',62,250,14);tx('PASSENGER',w*.58,250,14);tx(`FAN  ${s.fan}  /  7       ${s.ac?'A/C ON':'A/C OFF'}       ${s.airflow.toUpperCase()}`,40,291,17,'#ff9b63');
 }else if(section==='Performance'){
 tx('VEHICLE DYNAMICS',30,96,13,'#99a5ab');tx(s.mode.toUpperCase(),30,151,38,modeColor(s.mode));tx(`${Math.round(s.rpm/8000*380)} kW`,35,230,41);tx(`${Math.round(s.rpm/8000*580)} Nm`,w*.52,230,41);tx('SIMULATED OUTPUT',35,262,13,'#8e9a9f');
 }else{
 tx(section.toUpperCase(),30,111,15,'#ff995e');tx(section==='Lighting'?'A cabin, in your color.':section==='ADAS'?'Intelligence around you.':section==='Cameras'?'A clearer perspective.':'Designed around you.',30,164,31);tx(section==='Lighting'?'AMBIENT LIGHTING':section==='Vehicle'?s.mode+' drive profile':'Explore controls in the DriveOS panel',30,223,17,'#8c9ba5');x.fillStyle=s.ambient;x.fillRect(30,257,w-60,3);
 }
 x.fillStyle='#111b22';x.fillRect(0,h-51,w,51);['HOME','NAV','MEDIA','CLIMATE','VEHICLE'].forEach((t,i)=>tx(t,30+i*(w-35)/5,h-22,12,i===0?'#ff975c':'#a8b4b9'));
}
