import * as T from 'three';
import {rounded} from './geometry';
import {makeDisplay} from './displays';
export const creatorLinks=[
 {label:'Personal website',short:'PERSONAL',url:'https://amirsaeiddehghan.ir',color:'#a7e6ff'},
 {label:'Azadi Studio',short:'AZADI STUDIO',url:'https://azadistudio.ir',color:'#ffc396'},
 {label:'GitHub · saaeiddev',short:'GITHUB',url:'https://github.com/saaeiddev',color:'#d8caff'}
];
export function buildCreatorLinks(){
 const root=new T.Group();root.position.set(.257,1.113,-.506);root.rotation.y=-.076;
 const interactive:T.Object3D[]=[];
 creatorLinks.forEach((link,i)=>{
  const tile=new T.Group();tile.position.set((i-1)*.232,-.078,.036);root.add(tile);
  const backing=new T.Mesh(rounded(.213,.066,.009,.008),new T.MeshStandardMaterial({color:'#19303f',metalness:.55,roughness:.25}));tile.add(backing);
  const glass=new T.Mesh(rounded(.211,.064,.012,.008),new T.MeshPhysicalMaterial({color:link.color,metalness:.15,roughness:.12,transparent:true,opacity:.42,clearcoat:1,depthWrite:false}));glass.position.z=.006;tile.add(glass);
  const d=makeDisplay(640,192),x=d.ctx;const gradient=x.createLinearGradient(0,0,0,192);gradient.addColorStop(0,'#355268');gradient.addColorStop(.5,'#172e40');gradient.addColorStop(1,'#12202b');x.fillStyle=gradient;x.beginPath();x.roundRect(0,0,640,192,24);x.fill();x.strokeStyle=link.color;x.lineWidth=3;x.stroke();x.fillStyle='#ffffff20';x.fillRect(25,10,590,5);x.strokeStyle=link.color;x.fillStyle=link.color;x.lineWidth=5;x.lineCap='round';
  if(i===0){x.beginPath();x.arc(81,94,39,0,Math.PI*2);x.stroke();x.beginPath();x.ellipse(81,94,19,39,0,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(42,94);x.lineTo(120,94);x.stroke();}
  else if(i===1){x.beginPath();x.moveTo(44,132);x.lineTo(80,54);x.lineTo(117,132);x.moveTo(59,105);x.lineTo(103,105);x.stroke();}
  else {x.save();x.translate(39,52);x.scale(3.5,3.5);x.fill(new Path2D('M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.333-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'));x.restore();}
  x.fillStyle='#effaff';x.font='500 30px Arial';x.textAlign='left';x.fillText(link.short,150,106);
  const face=new T.Mesh(new T.PlaneGeometry(.206,.061),new T.MeshBasicMaterial({map:d.texture,transparent:true,depthWrite:false,toneMapped:false}));face.position.z=.014;tile.add(face);
  for(const o of [backing,glass,face]){o.userData.url=link.url;o.userData.linkLabel=link.label;interactive.push(o);}
 });
 return {root,interactive};
}
