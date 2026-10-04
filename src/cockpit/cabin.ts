import * as T from 'three';
import {rounded,tube,loft,panelShape,curvedScreen,surfaceTexture} from './geometry';
import {makeDisplay} from './displays';
export function buildCabin(){
 const root=new T.Group(),interactive:T.Object3D[]=[],ambient:T.MeshStandardMaterial[]=[];
 const grain=surfaceTexture('leather'),perf=surfaceTexture('perforated'),carbon=surfaceTexture('carbon'),brushed=surfaceTexture('brushed');
 const leather=new T.MeshStandardMaterial({color:'#202629',roughness:.9,map:grain,bumpMap:grain,bumpScale:.0016});
 const dark=new T.MeshStandardMaterial({color:'#111820',roughness:.9,bumpMap:grain,bumpScale:.0008});
 const perforated=new T.MeshStandardMaterial({color:'#30373b',roughness:.9,map:perf,bumpMap:perf,bumpScale:.0017});
 const metal=new T.MeshStandardMaterial({color:'#79878b',metalness:.83,roughness:.43,envMapIntensity:.7,bumpMap:brushed,bumpScale:.0002});
 const cf=new T.MeshStandardMaterial({color:'#525b5d',map:carbon,metalness:.32,roughness:.36});
 const piano=new T.MeshPhysicalMaterial({color:'#101518',metalness:.4,roughness:.2,clearcoat:1,clearcoatRoughness:.18});
 const stitch=new T.MeshStandardMaterial({color:'#a4a29a',roughness:.9});
 const lightmat=new T.MeshStandardMaterial({color:'#ff783c',emissive:'#ff783c',emissiveIntensity:1.5,roughness:.35});ambient.push(lightmat);
 function mesh(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0,parent:T.Object3D=root){const a=new T.Mesh(g,m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
 function box(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,r=.015,parent:T.Object3D=root){return mesh(rounded(w,h,d,r),m,x,y,z,parent);}
 function line(p:number[][],radius:number,m:T.Material,parent:T.Object3D=root){return mesh(tube(p,radius,Math.max(20,p.length*8)),m,0,0,0,parent);}
 function action(o:T.Object3D,name:string){o.userData.action=name;interactive.push(o);}
 function label(text:string,w:number,h:number,x:number,y:number,z:number,parent:T.Object3D=root,color='#ced6d8'){
 const d=makeDisplay(512,128);d.ctx.font='500 49px Arial';d.ctx.textAlign='center';d.ctx.fillStyle=color;d.ctx.fillText(text,256,82);const o=mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:d.texture,transparent:true,depthWrite:false}),x,y,z,parent);return o;}
 // Full-width double-curvature instrument panel, with separate soft-touch upper and lower surfaces.
 const dashboardSections=Array.from({length:25},(_,i)=>{const x=-.94+i*1.88/24,edge=Math.pow(Math.abs(x)/.94,3);return {x,points:[[1.00-edge*.04,-1.04+edge*.12],[1.045-edge*.05,-.75],[.982-edge*.06,-.455],[.88-edge*.04,-.36],[.71,-.39],[.63,-.68],[.72,-1.05]]};});
 mesh(loft(dashboardSections),leather);
 const lower=Array.from({length:25},(_,i)=>{const x=-.92+i*1.84/24;return{x,points:[[.855,-.367],[.80,-.325],[.68,-.355],[.57,-.54],[.57,-.78],[.76,-.78]]};});mesh(loft(lower),dark);
 const trimPoints=Array.from({length:41},(_,i)=>{const x=-.91+i*1.82/40;return[x,.877-Math.pow(Math.abs(x),3)*.04,-.359+Math.cos(x*1.5)*.012];});line(trimPoints,.014,cf);line(trimPoints.map(p=>[p[0],p[1]-.022,p[2]+.003]),.0028,lightmat);
 line(Array.from({length:41},(_,i)=>{const x=-.91+i*1.82/40;return[x,.994-Math.pow(Math.abs(x),3)*.05,-.48];}),.001,stitch);
 // Beveled continuous panoramic display housing; separate canvas surfaces retain clear, live instrumentation.
 const frame=mesh(curvedScreen(1.43,.32,.065),piano,-.075,1.115,-.544);action(frame,'Infotainment');
 const borderPoints:number[][]=[];
 for(let i=0;i<=40;i++){const x=-.79+i*1.43/40;borderPoints.push([x,1.264,-.548+.063*Math.pow((x+.075)/.715,2)]);}
 for(let i=1;i<=12;i++)borderPoints.push([.64,1.264-i*.298/12,-.485]);
 for(let i=1;i<=40;i++){const x=.64-i*1.43/40;borderPoints.push([x,.966,-.548+.063*Math.pow((x+.075)/.715,2)]);}
 for(let i=1;i<=12;i++)borderPoints.push([-.79,.966+i*.298/12,-.485]);
 line(borderPoints,.004,piano);

 const cluster=makeDisplay(1024,430),screen=makeDisplay(960,430);
 const clusterMesh=mesh(curvedScreen(.65,.279,.018),new T.MeshBasicMaterial({map:cluster.texture,toneMapped:false}),-.46,1.113,-.503);clusterMesh.rotation.y=.078;action(clusterMesh,'Cluster');
 const infoMesh=mesh(curvedScreen(.73,.279,.024),new T.MeshBasicMaterial({map:screen.texture,toneMapped:false}),.257,1.113,-.506);infoMesh.rotation.y=-.076;action(infoMesh,'Infotainment');
 box(.04,.22,.045,metal,-.55,.97,-.62);box(.04,.22,.045,metal,.44,.97,-.62);
 // Four multi-vane vents, with metallic louvers, shadowed recesses and tactile thumb tabs.
 for(const xx of [-.78,-.2,.20,.76]){
 const w=Math.abs(xx)>.7?.20:.29;box(w,.082,.034,metal,xx,.798,-.337,.012);box(w-.012,.067,.038,dark,xx,.799,-.313,.009);
 for(let j=0;j<5;j++)box(w-.027,.004,.021,metal,xx,.774+j*.012,-.285,.001);
 box(.011,.045,.012,piano,xx,.8,-.269,.003);
 }
 box(.64,.22,.15,dark,.55,.565,-.45,.037);
 line([[.245,.60,-.366],[.85,.60,-.366]],.001,metal);
 box(.073,.012,.013,metal,.58,.634,-.366,.003);
 box(.48,.18,.15,dark,-.51,.557,-.54,.038);
 label('A E R O N',.18,.045,.64,.705,-.317);
 // Console: tapered sculpted leather tunnel, carbon top, metallic borders, real recesses.
 const console=mesh(panelShape([[-.20,-.54],[.20,-.54],[.23,.54],[.17,.70],[-.17,.70],[-.23,.54]],.12,.024),dark,0,.43,.35);console.rotation.x=-Math.PI/2;
 const consoleTop=mesh(panelShape([[-.156,-.43],[.156,-.43],[.184,.29],[.13,.41],[-.13,.41],[-.184,.29]],.012,.01),cf,0,.57,.11);consoleTop.rotation.x=-Math.PI/2;
 for(const x of [-.197,.197])line([[x,.579,-.26],[x*1.12,.564,.46],[x*.87,.548,.83]],.006,metal);
 // Charging tray, selector pod, knurled drive controller and illuminated physical keys.
 box(.255,.016,.17,dark,0,.592,-.22,.024);for(let i=0;i<7;i++)box(.2,.002,.002,metal,0,.602,-.285+i*.021,.001);
 const selector=new T.Group();selector.position.set(-.095,.60,.02);root.add(selector);const stalk=box(.055,.065,.075,metal,0,.03,0,.024,selector);stalk.rotation.x=-.3;box(.065,.058,.091,piano,0,.070,-.013,.025,selector);const gLabel=label('P',.03,.025,0,.079,.037,selector);action(stalk,'Drive Selector');action(gLabel,'Gear');
 const knob=mesh(new T.CylinderGeometry(.057,.058,.027,64),metal,.07,.612,.075);action(knob,'Mode');mesh(new T.CylinderGeometry(.049,.049,.029,64),piano,.07,.617,.075);for(let i=0;i<44;i++){const a=i/44*Math.PI*2;box(.002,.02,.003,dark,.07+Math.cos(a)*.058,.618,.075+Math.sin(a)*.058,.001);}
 for(let i=0;i<3;i++){const b=box(.068,.008,.036,piano,-.106+i*.105,.603,.19,.005);action(b,['Mode','Media','Climate'][i]);const l=label(['MODE','MEDIA','A/C'][i],.052,.016,-.106+i*.105,.609,.193);l.rotation.x=-Math.PI/2;}
 // Cup holders with visible deep wells and bright lips.
 for(const zz of [.37,.52]){mesh(new T.CylinderGeometry(.061,.05,.038,48),dark,0,.585,zz);const ring=mesh(new T.TorusGeometry(.06,.003,8,48),metal,0,.607,zz);ring.rotation.x=Math.PI/2;}
 box(.34,.105,.30,leather,0,.61,.80,.046);line([[-.13,.662,.7],[-.13,.664,.9],[.13,.664,.9],[.13,.662,.7]],.001,stitch);
 // Flat-bottom wheel, organic grips, original three-spoke structure and split metallic lower spoke.
 const wheel=new T.Group();wheel.position.set(-.465,.825,.055);wheel.rotation.x=-.17;root.add(wheel);
 const rim:number[][]=[];for(let i=0;i<72;i++){const a=i/72*Math.PI*2;rim.push([Math.cos(a)*.211,Math.max(-.172,Math.sin(a)*.211),0]);}rim.push(rim[0]);line(rim,.021,dark,wheel);
 const inner=rim.map(p=>[p[0]*.94,p[1]*.94,.017]);line(inner,.0011,stitch,wheel);
 for(const side of [-1,1]){const grip=mesh(new T.SphereGeometry(1,24,20),perforated,side*.198,.018,.003,wheel);grip.scale.set(.029,.092,.029);
 const spoke=mesh(panelShape(side<0?[[-.19,.025],[-.04,.045],[-.045,-.055],[-.175,-.035]]:[[.04,.045],[.19,.025],[.175,-.035],[.045,-.055]],.016,.008),metal,0,0,0,wheel);
 const pad=box(.104,.062,.023,piano,side*.112,-.001,.023,.016,wheel);action(pad,side<0?'Cruise':'Media');
 for(let j=0;j<3;j++){const b=box(.025,.020,.006,dark,side*.114+(j-1)*.030,.01,.039,.004,wheel);action(b,side<0?['Cruise','ADAS','Voice'][j]:['Previous','Play','Next'][j]);label(side<0?['SET','◈','♪'][j]:['‹','Ⅱ','›'][j],.020,.014,side*.114+(j-1)*.030,.008,.043,wheel);}
 const bv=box(.053,.014,.007,dark,side*.12,-.019,.039,.003,wheel);action(bv,side<0?'Cluster':'Volume');label(side<0?'VIEW':'VOL +',.045,.012,side*.12,-.021,.044,wheel);
 const paddle=box(.032,.135,.015,metal,side*.16,.055,-.055,.014,wheel);paddle.rotation.z=side*-.18;action(paddle,side<0?'Downshift':'Upshift');label(side<0?'−':'+',.021,.03,side*.16,.088,-.045,wheel);
 }
 mesh(panelShape([[-.052,-.029],[.052,-.029],[.042,-.146],[.022,-.17],[-.022,-.17],[-.042,-.146]],.018,.007),metal,0,0,.001,wheel);
 mesh(panelShape([[-.025,-.07],[.025,-.07],[.015,-.155],[-.015,-.155]],.022,.005),piano,0,0,.014,wheel);
 const hub=box(.15,.13,.064,leather,0,-.009,.043,.045,wheel);action(hub,'Steering Wheel');label('Λ',.052,.044,0,.006,.078,wheel);label('AIRBAG',.038,.013,0,-.045,.078,wheel);
 line([[-.021,.211,.006],[0,.213,.006],[.021,.211,.006]],.004,lightmat,wheel);
 const column=mesh(new T.CylinderGeometry(.059,.075,.24,24),dark,-.465,.79,-.12);column.rotation.x=Math.PI/2;
 // Door architecture, stitched armrests, recessed pulls, speaker cones and window switch packs.
 for(const side of [-1,1]){
 const door=new T.Group();door.position.x=side*.935;root.add(door);
 const dp=mesh(panelShape([[-.69,.14],[.88,.14],[.94,.53],[.79,.91],[-.48,.93],[-.79,.73]],.065,.028),dark,0,0,0,door);dp.rotation.y=side*Math.PI/2;dp.position.z=.16; // local long dimension becomes fore/aft
 const strip=line([[0,.86,-.54],[-side*.045,.85,-.05],[-side*.047,.80,.55],[-side*.02,.73,.9]],.004,lightmat,door);
 line([[0,.88,-.54],[-side*.045,.87,-.05],[-side*.047,.82,.55],[-side*.02,.75,.9]],.016,cf,door);
 box(.09,.095,.63,leather,-side*.05,.56,.26,.035,door);
 const pull=line([[-side*.058,.76,-.32],[-side*.10,.72,-.22],[-side*.10,.69,-.04]],.012,metal,door);action(pull,'Lighting');
 const speaker=mesh(new T.CircleGeometry(.10,48),metal,-side*.045,.48,-.38,door);speaker.rotation.y=-side*Math.PI/2;
 const speakerDark=mesh(new T.CircleGeometry(.093,48),perforated,-side*.047,.48,-.38,door);speakerDark.rotation.y=-side*Math.PI/2;
 for(let i=0;i<4;i++)box(.038,.007,.023,piano,-side*.1,.613,.15+i*.035,.003,door);
 line([[-side*.06,.61,-.03],[-side*.06,.61,.5]],.001,stitch,door);
 }
 // Sculpted sport seats: separately padded center sections, curved bolsters, shoulder wings and headrests.
 for(const xx of [-.46,.46]){
 const seat=new T.Group();seat.position.set(xx,.24,.72);root.add(seat);
 box(.42,.115,.49,dark,0,0,0,.055,seat);box(.265,.061,.36,perforated,0,.073,-.032,.027,seat);
 for(const side of [-1,1]){const bolster=mesh(new T.SphereGeometry(1,24,18),leather,side*.18,.102,-.022,seat);bolster.scale.set(.061,.074,.225);line([[side*.17,.161,-.18],[side*.17,.17,.04],[side*.155,.14,.17]],.0012,stitch,seat);}
 const back=new T.Group();back.position.set(0,.09,.195);back.rotation.x=.12;seat.add(back);
 const backShape=mesh(panelShape([[-.16,0],[.16,0],[.235,.39],[.20,.57],[.12,.66],[-.12,.66],[-.20,.57],[-.235,.39]],.10,.045),dark,0,0,0,back);
 box(.26,.47,.069,perforated,0,.30,-.055,.043,back);
 for(const side of [-1,1]){const b=mesh(new T.SphereGeometry(1,24,18),leather,side*.17,.30,-.08,back);b.scale.set(.065,.27,.082);line([[side*.15,.09,-.13],[side*.2,.40,-.115],[side*.13,.57,-.07]],.0013,stitch,back);}
 box(.21,.18,.12,leather,0,.70,.005,.05,back);label('AERON',.11,.031,0,.7,-.058,back).rotation.y=Math.PI;
 for(let j=0;j<7;j++)line([[-.1,.14+j*.049,-.092],[0,.13+j*.049,-.095],[.1,.14+j*.049,-.092]],.0007,stitch,back);
 }
 // Footwell, carpet floor and weighted-metal pedals.
 box(1.85,.04,2.25,dark,0,.035,.0,.018);for(const [xx,ww] of [[-.65,.095],[-.47,.08],[-.32,.055]]){const pedal=box(ww,.14,.017,metal,xx,.26,-.44,.01);pedal.rotation.x=-.33;for(let i=0;i<5;i++){const rib=box(ww-.012,.009,.018,dark,xx,.212+i*.024,-.426,.003);rib.rotation.x=-.33;}}
 // Windshield is transparent with a subtle edge tint; structural pillars remain visible from the driver's eye.
 const glass=new T.MeshPhysicalMaterial({color:'#bfdae0',transparent:true,opacity:.065,roughness:.08,metalness:.2,side:T.DoubleSide,depthWrite:false});
 const wind=mesh(panelShape([[-.90,0],[.90,0],[.70,.52],[-.70,.52]],.002,0),glass,0,1.00,-1.04);wind.rotation.x=-.48;
 for(const side of [-1,1]){line([[side*.93,.87,-.85],[side*.80,1.20,-.99],[side*.69,1.54,-.79]],.039,leather);line([[side*.69,1.54,-.79],[side*.81,1.57,.13],[side*.88,1.50,1.06]],.031,dark);
 const mirror=box(.17,.091,.05,piano,side*1.00,1.01,-.71,.03);mirror.rotation.y=side*-.23;const reflection=box(.143,.067,.004,new T.MeshStandardMaterial({color:'#92a4a8',metalness:1,roughness:.13}),side*1.00,1.01,-.68,.02);reflection.rotation.y=side*-.23;
 }
 box(.22,.073,.033,piano,0,1.43,-.77,.025);box(.194,.052,.007,new T.MeshStandardMaterial({color:'#63777e',metalness:1,roughness:.1}),0,1.43,-.75,.018);
 // Forward road context, deliberately restrained so the cabin remains the centerpiece.
 const outside=new T.Group();root.add(outside);box(14,.035,30,new T.MeshStandardMaterial({color:'#3a4347',roughness:1}),0,-.055,-12,.01,outside);
 for(let j=0;j<18;j++)for(const xx of [-1.4,1.4])box(.035,.004,.7,new T.MeshStandardMaterial({color:'#b2b3a7',roughness:1}),xx,-.031,-1.7-j*1.4,.001,outside);
 const hud=makeDisplay(512,220);const hudMesh=mesh(new T.PlaneGeometry(.29,.125),new T.MeshBasicMaterial({map:hud.texture,transparent:true,depthWrite:false,toneMapped:false}),-.45,1.25,-.94);hudMesh.rotation.x=-.08;action(hudMesh,'HUD');
 const hotspots=[{name:'Cluster',p:[-.48,1.22,-.46]},{name:'Infotainment',p:[.35,1.23,-.43]},{name:'Steering Wheel',p:[-.68,.91,.09]},{name:'Drive Selector',p:[.04,.7,.02]},{name:'Climate',p:[.22,.82,-.26]},{name:'Lighting',p:[.82,.92,-.25]}];
 return {root,interactive,ambient,wheel,cluster,screen,hud,hudMesh,hotspots,textures:[grain,perf,carbon,brushed]};
}
