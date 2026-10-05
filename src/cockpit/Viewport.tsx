import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {buildCabin} from './cabin';
import {buildExterior} from './exterior';
import {buildCreatorLinks,creatorLinks} from './creatorLinks';
import {buildSensors} from './sensors';
import {drawCluster,drawInfotainment} from './displays';
import type {State,Camera,Section} from '../systems/model';
const presets:Record<Camera,{eye:number[];target:number[];fov:number}>= {
 'Driver':{eye:[-.43,1.34,1.03],target:[-.08,.96,-.67],fov:61},
 'Dashboard':{eye:[0,1.32,1.50],target:[0,.87,-.44],fov:57},
 'Infotainment':{eye:[.27,1.16,.44],target:[.27,1.11,-.5],fov:39},
 'Cluster':{eye:[-.45,1.28,.44],target:[-.46,1.115,-.50],fov:40},
 'Steering Wheel':{eye:[-.46,1.03,.86],target:[-.46,.84,.03],fov:40},
 'Center Console':{eye:[.24,1.29,.79],target:[0,.57,.23],fov:48},
 'Passenger':{eye:[.53,1.33,1.14],target:[-.1,.86,-.48],fov:64},
 'Interior Overview':{eye:[2.4,2.4,2.9],target:[0,.75,0],fov:46},
 'ADAS':{eye:[4.7,5.5,6.7],target:[0,0,-.9],fov:48},
 'Sensor View':{eye:[4.7,6.9,5.3],target:[0,0,-1],fov:53}
};
type Props={state:State;section:Section;camera:Camera;cameraRevision:number;hotspots:boolean;highlight:Camera|null;onAction:(action:string)=>void;onReady:()=>void};
export default function Viewport(props:Props){
 const host=useRef<HTMLDivElement>(null),live=useRef(props);live.current=props;
 const [load,setLoad]=useState({progress:5,label:'Preparing cabin geometry'});const [error,setError]=useState('');const [fallback,setFallback]=useState(false);const setView=useRef<((c:Camera)=>void)|null>(null);
 useEffect(()=>{setView.current?.(props.camera);},[props.camera,props.cameraRevision]);
 useEffect(()=>{
 const el=host.current!;let disposed=false,frame=0,renderer:T.WebGLRenderer|undefined;const disposers:(()=>void)[]=[];
 try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.setClearColor('#303b43');renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;el.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','Interactive 3D AERON cockpit. Drag to explore; pinch or scroll to zoom.');renderer.domElement.setAttribute('role','img');
 const scene=new T.Scene();scene.fog=new T.Fog('#303b43',10,32);const camera=new T.PerspectiveCamera(61,1,.035,70);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.enablePan=false;controls.rotateSpeed=.34;controls.zoomSpeed=.55;controls.minDistance=.27;controls.maxDistance=5;controls.maxPolarAngle=Math.PI*.82;controls.minPolarAngle=.10;controls.touches.ONE=T.TOUCH.ROTATE;controls.touches.TWO=T.TOUCH.DOLLY_ROTATE;
 const cabin=buildCabin();scene.add(cabin.root);
 const exterior=buildExterior();scene.add(exterior);exterior.visible=false;
 const links=buildCreatorLinks();cabin.root.add(links.root);cabin.interactive.push(...links.interactive);
 const linkAnchors=creatorLinks.map(link=>{const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.className='screen-creator-link';a.setAttribute('aria-label',link.label);a.textContent=link.label;el.appendChild(a);return a;});
 const focus=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1,1,1)),new T.LineBasicMaterial({color:'#ff9c65',transparent:true,opacity:.55}));scene.add(focus);
 const focusAreas:Partial<Record<Camera,number[]>>={'Cluster':[-.46,1.113,-.5,.68,.30,.035],'Infotainment':[.257,1.113,-.5,.75,.30,.035],'Steering Wheel':[-.465,.825,.055,.46,.42,.10],'Center Console':[0,.65,.12,.37,.16,.45],'Dashboard':[.2,.8,-.30,.34,.1,.08],'Passenger':[.6,.86,-.32,.53,.06,.05],'Driver':[-.45,1.25,-.94,.31,.14,.01]};
const sensors=buildSensors();scene.add(sensors.root);sensors.root.visible=false;
 // Batch static surfaces by material. Retain button objects and the animated wheel hierarchy for picking.
 cabin.root.updateMatrixWorld(true);const bins=new Map<T.Material,T.BufferGeometry[]>(),remove:T.Mesh[]=[];
 cabin.root.traverse(o=>{if(!(o instanceof T.Mesh)||Array.isArray(o.material)||o.userData.action||o.userData.url)return;let p:T.Object3D|null=o;while(p){if(p===cabin.wheel)return;p=p.parent;}if(o===cabin.hudMesh||o.material instanceof T.MeshBasicMaterial)return;const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrixWorld);const list=bins.get(o.material)||[];list.push(g);bins.set(o.material,list);remove.push(o);});
 for(const [mat,geos] of bins){const merged=mergeGeometries(geos,false);if(merged){const mesh=new T.Mesh(merged,mat);mesh.castShadow=true;mesh.receiveShadow=true;cabin.root.add(mesh);}geos.forEach(g=>g.dispose());}remove.forEach(o=>{o.removeFromParent();o.geometry.dispose();});
 const hemisphere=new T.HemisphereLight('#eaf3ff','#393d3d',1.8);scene.add(hemisphere);const sun=new T.DirectionalLight('#fff0db',2.0);sun.position.set(-3,6,2);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-2;sun.shadow.camera.right=2;sun.shadow.camera.top=3;sun.shadow.camera.bottom=-2;sun.shadow.bias=-.001;scene.add(sun);const fill=new T.DirectionalLight('#9ecce1',1.0);fill.position.set(3,2,-2);scene.add(fill);const interior=new T.PointLight('#ff864f',1.4,2.5,2);interior.position.set(0,1,-.1);scene.add(interior);
 const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();let env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();setLoad({progress:45,label:'Loading studio reflections'});
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 fetch(`${import.meta.env.BASE_URL}assets/studio_small_03_1k.hdr`,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Environment load failed');return r.arrayBuffer();}).then(buffer=>{if(disposed)return;const hdr=new RGBELoader().parse(buffer);const texture=new T.DataTexture(hdr.data,hdr.width,hdr.height,T.RGBAFormat,hdr.type);texture.mapping=T.EquirectangularReflectionMapping;texture.needsUpdate=true;const next=pmrem.fromEquirectangular(texture);env.dispose();env=next;scene.environment=env.texture;texture.dispose();}).catch(()=>{if(!disposed)setFallback(true);}).finally(()=>{clearTimeout(timeout);if(!disposed){setLoad({progress:100,label:'Digital cockpit ready'});live.current.onReady();}});
 const markerEls=cabin.hotspots.map(h=>{const b=document.createElement('button');b.className='hotspot';b.setAttribute('aria-label',`Explore ${h.name}`);b.innerHTML=`<span>+</span><em>${h.name}</em>`;b.onclick=()=>live.current.onAction(h.name);el.appendChild(b);return {b,point:new T.Vector3(...h.p as [number,number,number])};});
 let transition=1;const startEye=new T.Vector3(),startTarget=new T.Vector3(),endEye=new T.Vector3(),endTarget=new T.Vector3();let startFov=61,endFov=61;
 function view(c:Camera){const p=presets[c];startEye.copy(camera.position);startTarget.copy(controls.target);startFov=camera.fov;endEye.set(...p.eye as [number,number,number]);endTarget.set(...p.target as [number,number,number]);endFov=p.fov+(camera.aspect<.85&&['Driver','Dashboard','Passenger'].includes(c)?22:0);transition=matchMedia('(prefers-reduced-motion: reduce)').matches?.999:0;const sensor=c==='Sensor View'||c==='ADAS';cabin.root.visible=!sensor;sensors.root.visible=sensor;controls.maxDistance=16;controls.minDistance=sensor?3:c==='Interior Overview'?.8:c==='Driver'||c==='Dashboard'||c==='Passenger'?.75:.33;controls.minAzimuthAngle=sensor||c==='Interior Overview'?-Infinity:-.9;controls.maxAzimuthAngle=sensor||c==='Interior Overview'?Infinity:.9;controls.maxPolarAngle=sensor||c==='Interior Overview'?2.3:1.75;}
 const first=presets[live.current.camera];camera.position.set(...first.eye as [number,number,number]);controls.target.set(...first.target as [number,number,number]);controls.update();setView.current=view;view(live.current.camera);
 const stopTransition=()=>{transition=1;};controls.addEventListener('start',stopTransition);
 const resize=()=>{const {width,height}=el.getBoundingClientRect();if(!width||!height)return;renderer!.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(el);resize();view(live.current.camera);
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down={x:0,y:0};const pointerDown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY};};const pointerUp=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>6||!cabin.root.visible)return;const b=el.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(cabin.interactive,false)[0];if(hit?.object.userData.url&&!exterior.visible)window.open(hit.object.userData.url,'_blank','noopener,noreferrer');else if(hit?.object.userData.action&&!exterior.visible)live.current.onAction(hit.object.userData.action);};
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);const contextLost=(e:Event)=>{e.preventDefault();setError('The graphics context was interrupted. Reload to restore the cockpit.');};renderer.domElement.addEventListener('webglcontextlost',contextLost);
 let last=performance.now(),lastDraw=0,speed=0,rpm=850,lastQuality='';
 function animate(now:number){if(disposed)return;frame=requestAnimationFrame(animate);if(document.hidden){last=now;return;}const elapsed=Math.min((now-last)/1000,.5);const dt=Math.min(elapsed,.05);last=now;const {state:s,section}=live.current;
 if(transition<1){transition=Math.min(1,transition+elapsed/1.15);const t=transition*transition*(3-2*transition);camera.position.lerpVectors(startEye,endEye,t);controls.target.lerpVectors(startTarget,endTarget,t);camera.fov=T.MathUtils.lerp(startFov,endFov,t);camera.updateProjectionMatrix();}const distance=camera.position.distanceTo(controls.target);
 const external=distance>2.8&&cabin.root.visible;exterior.visible=external;
 if(transition===1){const fov=external?Math.max(endFov,55):endFov;if(Math.abs(camera.fov-fov)>.01){camera.fov=fov;camera.updateProjectionMatrix();}}
 if(cabin.root.visible){const overview=live.current.camera==='Interior Overview';controls.minAzimuthAngle=external||overview?-Infinity:-.9;controls.maxAzimuthAngle=external||overview?Infinity:.9;controls.maxPolarAngle=external||overview?2.3:1.75;}controls.update();
 if(s.quality!==lastQuality){renderer!.setPixelRatio(s.quality==='High'?Math.min(devicePixelRatio,2):s.quality==='Low'?1:Math.min(devicePixelRatio,1.5));lastQuality=s.quality;}
 const area=live.current.highlight?focusAreas[live.current.highlight]:undefined;focus.visible=!!area&&cabin.root.visible;if(area){focus.position.set(area[0],area[1],area[2]);focus.scale.set(area[3],area[4],area[5]);}
 const bg=s.night?'#0e1722':'#303b43';renderer!.setClearColor(bg);(scene.fog as T.Fog).color.set(bg);hemisphere.intensity=s.night?.85:1.8;sun.intensity=s.night?.7:2.0;
 speed=T.MathUtils.damp(speed,s.speed,4,dt);rpm=T.MathUtils.damp(rpm,s.rpm,4,dt);cabin.wheel.rotation.z=s.running?Math.sin(now*.00065)*.035:0;
 cabin.ambient.forEach(m=>{m.color.set(s.ambient);m.emissive.set(s.ambient);m.emissiveIntensity=s.brightness*2;});interior.color.set(s.ambient);interior.intensity=s.brightness*(s.night?1.4:.6);cabin.hudMesh.visible=s.hud;
 if(now-lastDraw>65){drawCluster(cabin.cluster.ctx,s,speed,rpm);drawInfotainment(cabin.screen.ctx,s,section);cabin.cluster.texture.needsUpdate=true;cabin.screen.texture.needsUpdate=true;const x=cabin.hud.ctx;x.clearRect(0,0,512,220);x.fillStyle='#bce7d5';x.textAlign='center';x.font='300 74px Arial';x.fillText(`${Math.round(speed)}`,120,100);x.font='20px Arial';x.fillText('km/h',120,132);x.font='40px Arial';x.fillText(s.route?'↗ 450 m':'—',350,95);x.font='17px Arial';x.fillText(s.adas['Lane Keeping']?'LANE ASSIST':'DRIVE AWARE',256,186);cabin.hud.texture.needsUpdate=true;lastDraw=now;}
 sensors.zones.forEach((z,i)=>(z.material as T.MeshBasicMaterial).opacity=(.10+Math.sin(now*.0018+i)*.025)*(i===0&&!s.adas['Adaptive Cruise']?.55:1));
 links.root.updateMatrixWorld(true);
 linkAnchors.forEach((a,i)=>{const tile=links.root.children[i];const center=tile.getWorldPosition(new T.Vector3());const normal=new T.Vector3(0,0,1).transformDirection(tile.matrixWorld);const visible=cabin.root.visible&&!external&&normal.dot(camera.position.clone().sub(center))>0;const v=center.clone().project(camera);const left=tile.localToWorld(new T.Vector3(-.1065,0,.014)).project(camera);const right=tile.localToWorld(new T.Vector3(.1065,0,.014)).project(camera);const top=tile.localToWorld(new T.Vector3(0,.033,.014)).project(camera);const bottom=tile.localToWorld(new T.Vector3(0,-.033,.014)).project(camera);a.style.display=visible&&v.z<1&&Math.abs(v.x)<.95&&Math.abs(v.y)<.95?'block':'none';a.style.left=`${(v.x*.5+.5)*el.clientWidth}px`;a.style.top=`${(-v.y*.5+.5)*el.clientHeight}px`;a.style.width=`${Math.abs(right.x-left.x)*el.clientWidth*.5}px`;a.style.height=`${Math.abs(top.y-bottom.y)*el.clientHeight*.5}px`;});
 for(const {b,point} of markerEls){const v=point.clone().project(camera);b.style.display=live.current.hotspots&&cabin.root.visible&&!external&&v.z<1&&Math.abs(v.x)<.92&&Math.abs(v.y)<.9?'flex':'none';b.style.left=`${(v.x*.5+.5)*el.clientWidth}px`;b.style.top=`${(-v.y*.5+.5)*el.clientHeight}px`;}
 renderer!.render(scene,camera);
 }frame=requestAnimationFrame(animate);
 disposers.push(()=>{controller.abort();clearTimeout(timeout);observer.disconnect();controls.dispose();pmrem.dispose();env.dispose();markerEls.forEach(m=>m.b.remove());linkAnchors.forEach(a=>a.remove());renderer!.domElement.removeEventListener('webglcontextlost',contextLost);const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{materials.add(m);Object.values(m).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());cabin.textures.forEach(t=>t.dispose());});
 }catch(e){setError(e instanceof Error?e.message:'WebGL initialization failed.');}
 return()=>{disposed=true;cancelAnimationFrame(frame);setView.current=null;disposers.forEach(f=>f());renderer?.dispose();renderer?.domElement.remove();};
 },[]);
 return <div className="viewport-wrap"><div className="viewport" ref={host}/>{load.progress<100&&!error&&<div className="loader"><span className="brand-glyph">Λ</span><small>3D AUTOMOTIVE DASHBOARD LAB</small><h2>Initializing Digital Cockpit<span>…</span></h2><div className="load-track"><i style={{width:`${load.progress}%`}}/></div><p>{load.label}<b>{load.progress}%</b></p></div>}{error&&<div className="loader error"><h2>Let’s restore your cockpit.</h2><p>{error}</p><p>Use a browser with WebGL 2 and hardware acceleration enabled.</p><button onClick={()=>location.reload()}>Reload cockpit</button></div>}{fallback&&<span className="asset-note">Studio reflections unavailable · built-in lighting active</span>}</div>;
}
