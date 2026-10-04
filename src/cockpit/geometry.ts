import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export function rounded(w:number,h:number,d:number,r=0.02){return new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/2,h/2,d/2));}
export function tube(points:number[][],radius:number,segments=64,closed=false){return new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number])),closed),segments,radius,8,closed);}
// A closed surface swept across cross-sections: dashboard and door panels are sculpted, not box stand-ins.
export function loft(sections:{x:number;points:number[][]}[]){
 const pos:number[]=[],idx:number[]=[],uv:number[]=[]; const n=sections[0].points.length;
 for(let i=0;i<sections.length;i++) for(let j=0;j<n;j++){pos.push(sections[i].x,...sections[i].points[j]);uv.push(i/(sections.length-1),j/(n-1));}
 for(let i=0;i<sections.length-1;i++)for(let j=0;j<n;j++){const a=i*n+j,b=i*n+(j+1)%n,c=(i+1)*n+j,d=(i+1)*n+(j+1)%n;idx.push(a,b,c,b,d,c);}
 for(let j=1;j<n-1;j++){idx.push(0,j+1,j);const k=(sections.length-1)*n;idx.push(k,k+j,k+j+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function panelShape(points:number[][],depth:number,bevel=0.008){const s=new T.Shape();points.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel});g.computeVertexNormals();return g;}
export function curvedScreen(width:number,height:number,curve=0.09){
 const g=new T.PlaneGeometry(width,height,64,8);const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i);a.setZ(i,curve*Math.pow(x/(width/2),2));}g.computeVertexNormals();return g;
}
export function surfaceTexture(kind:'leather'|'carbon'|'perforated'|'brushed'){
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d')!;x.fillStyle=kind==='carbon'?'#32383b':'#808080';x.fillRect(0,0,256,256);
 let seed=43;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 if(kind==='carbon'){for(let i=0;i<32;i++)for(let j=0;j<32;j++){x.fillStyle=(i+j)%2?'#555b5e':'#22292c';x.fillRect(i*8,j*8,7,7);x.fillStyle='#3c4245';x.fillRect(i*8,j*8,2,7);}}
 else if(kind==='brushed'){for(let i=0;i<256;i++){x.strokeStyle=`rgba(255,255,255,${rnd()*.3})`;x.beginPath();x.moveTo(0,i);x.lineTo(256,i);x.stroke();}}
 else {for(let i=0;i<15000;i++){x.fillStyle=`rgba(${rnd()>.5?'255,255,255':'0,0,0'},${rnd()*.18})`;x.fillRect(rnd()*256,rnd()*256,1+rnd()*2,1);}
 if(kind==='perforated')for(let i=8;i<256;i+=16)for(let j=8;j<256;j+=16){x.fillStyle='#26282a';x.beginPath();x.arc(i,j,2.2,0,Math.PI*2);x.fill();}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='carbon'?6:4,kind==='carbon'?4:3);return t;
}
