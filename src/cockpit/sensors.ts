import * as T from 'three';
import {loft,rounded} from './geometry';
export function buildSensors(){
 const root=new T.Group();const metal=new T.MeshStandardMaterial({color:'#b3bbbc',metalness:.65,roughness:.27});
 const body=new T.Mesh(loft(Array.from({length:17},(_,i)=>{const x=-.89+i*1.78/16;const k=Math.pow(Math.abs(x)/.89,3);return{x,points:[[.55,-2.1+k*.23],[.78-k*.1,-1.55],[.85-k*.13,1.20],[.59,2.05-k*.21],[.28,1.88],[.28,-1.91]]};})),metal);root.add(body);
 const top=new T.Mesh(rounded(1.45,.46,1.69,.18),new T.MeshStandardMaterial({color:'#1e2c34',metalness:.5,roughness:.22}));top.position.set(0,.97,.03);root.add(top);
 const bonnet=new T.Mesh(rounded(1.38,.04,.72,.08),metal);bonnet.position.set(0,.83,-1.26);root.add(bonnet);
 for(const x of [-.9,.9])for(const z of [-1.28,1.27]){const tire=new T.Mesh(new T.CylinderGeometry(.32,.32,.20,32),new T.MeshStandardMaterial({color:'#14191b',roughness:.95}));tire.rotation.z=Math.PI/2;tire.position.set(x,.32,z);root.add(tire);const rim=new T.Mesh(new T.CylinderGeometry(.22,.22,.205,16),metal);rim.rotation.z=Math.PI/2;rim.position.copy(tire.position);root.add(rim);}
 for(const z of [-1.98,1.97]){const bar=new T.Mesh(rounded(1.29,.043,.025,.01),new T.MeshBasicMaterial({color:z<0?'#e9f9ff':'#f36545'}));bar.position.set(0,.62,z);root.add(bar);}
 const zones:T.Mesh[]=[];
 function zone(x:number,z:number,angle:number,range:number,fov:number,color:string){const shape=new T.Shape();shape.moveTo(0,0);for(let j=0;j<=48;j++){const a=angle-fov/2+j/48*fov;shape.lineTo(Math.sin(a)*range,Math.cos(a)*range);}shape.closePath();const mesh=new T.Mesh(new T.ShapeGeometry(shape),new T.MeshBasicMaterial({color,transparent:true,opacity:.13,side:T.DoubleSide,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.025,z);root.add(mesh);zones.push(mesh);
 const arc=new T.LineSegments(new T.EdgesGeometry(mesh.geometry),new T.LineBasicMaterial({color,transparent:true,opacity:.45}));arc.rotation.copy(mesh.rotation);arc.position.copy(mesh.position);root.add(arc);}
 zone(0,-2.0,0,4,1.0,'#ff9259');zone(0,-.7,0,5,1.45,'#7facbd');zone(-.8,1.6,-1.9,2.1,1.1,'#b0a0d1');zone(.8,1.6,1.9,2.1,1.1,'#b0a0d1');zone(0,2,Math.PI,1.7,2.2,'#85bca7');zone(-.9,0,-Math.PI/2,1.6,1.8,'#85bca7');zone(.9,0,Math.PI/2,1.6,1.8,'#85bca7');
 for(let i=0;i<4;i++){const s=new T.Mesh(new T.SphereGeometry(.037,12,8),new T.MeshBasicMaterial({color:'#f9b575'}));s.position.set(-.65+i*.43,.47,-2);root.add(s);}
 const grid=new T.GridHelper(20,40,0x455058,0x293138);grid.position.y=-.003;root.add(grid);return {root,zones};
}
