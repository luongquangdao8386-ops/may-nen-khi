import { THREE,M } from './geometry.js';
import { CATALOG,REFERENCES,PARAM_SPECS,buildModel,setExplosion,updateMotion,setSection,showPorts,setAirflow } from './models.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const $=s=>document.querySelector(s), viewport=$('#viewport');
const REFERENCE_IMAGES={};
const scene=new THREE.Scene();scene.background=new THREE.Color('#eaf0f4');
const camera=new THREE.PerspectiveCamera(38,1,.01,200);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
renderer.domElement.setAttribute('aria-label','Mô hình 3D có thể xoay và chọn chi tiết');viewport.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.5;controls.maxDistance=65;controls.maxPolarAngle=Math.PI*.92;
scene.add(new THREE.HemisphereLight('#ffffff','#8ba3b4',3));
const key=new THREE.DirectionalLight('#fff7e9',4);key.position.set(-7,10,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:40});key.shadow.camera.updateProjectionMatrix();key.shadow.normalBias=.025;scene.add(key);
const fill=new THREE.DirectionalLight('#d7edff',2.5);fill.position.set(8,5,-7);scene.add(fill);
// Môi trường phản chiếu dựng bằng mã (không tải ảnh HDR) để bề mặt kim loại có độ sáng tự nhiên.
{const pmrem=new THREE.PMREMGenerator(renderer),env=new THREE.Scene(),panel=(size,pos,color,k=1)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(k)}));o.position.set(...pos);env.add(o);};
 env.add(new THREE.Mesh(new THREE.BoxGeometry(12,12,12),new THREE.MeshBasicMaterial({color:new THREE.Color('#8fa2b0'),side:THREE.BackSide})));
 panel([7,.1,7],[0,5.9,0],'#ffffff',3.2);panel([.1,4,6],[-5.9,1.5,0],'#e6f0f7',1.8);panel([.1,3,4],[5.9,2,1],'#fff3df',1.6);panel([12,.1,12],[0,-5.9,0],'#4c5964');
 scene.environment=pmrem.fromScene(env,.03).texture;scene.environmentIntensity=.38;pmrem.dispose();}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e7eef3',roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(20,80,'#bacbd6','#d5e0e8');grid.material.transparent=true;grid.material.opacity=.45;scene.add(grid);

let model=null,currentId='rotor',running=false,t=0,explodeAmount=0,mode='assembly',view='iso',selected=null;
let bounds=new THREE.Box3(),center=new THREE.Vector3(),size=new THREE.Vector3(),distance=10;
// Giá trị tham số theo nhóm: trục vít và đầu nén dùng chung bộ tham số 'rotor'.
const paramValues={};let rebuilding=false;const pkey=id=>CATALOG.find(c=>c.id===id)?.params??id;
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
const highlighted=[];
const selectionBox=new THREE.BoxHelper(new THREE.Object3D(),0x329ec3);selectionBox.visible=false;scene.add(selectionBox);
const mats=o=>[o.material].flat();

function renderCatalog(query=''){
 const nav=$('#catalog');nav.replaceChildren();let last='';
 for(const item of CATALOG){if(!item.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))continue;
   if(last!==item.group){const h=document.createElement('p');h.className='catalog-group';h.textContent=item.group;nav.append(h);last=item.group;}
   const b=document.createElement('button');b.className='catalog-item'+(item.id===currentId?' active':'');b.dataset.id=item.id;b.innerHTML=`<span class="item-number">${item.tag}</span><span>${item.name}</span>`;b.setAttribute('aria-current',item.id===currentId?'true':'false');b.addEventListener('click',()=>loadModel(item.id));nav.append(b);
 }
}
$('#search').addEventListener('input',e=>renderCatalog(e.target.value));

function deselect(){for(const {object,material} of highlighted){for(const m of mats(object))m.dispose();object.material=material;}highlighted.length=0;selected=null;selectionBox.visible=false;$('#selection-name').textContent='Chọn một chi tiết';$('#selection-description').textContent=model?.meta.detail??'';$('#selection-badge').hidden=true;document.querySelectorAll('.part-row').forEach(x=>x.classList.remove('selected'));}
const isIllustrative=p=>{for(let o=p;o;o=o.parent)if(o.userData.minhHoa)return true;return false;};
function selectPart(part){deselect();if(!part)return;selected=part;
 part.traverse(o=>{if(o.isMesh&&!o.userData.portMarker&&!o.parent?.userData.portMarker){highlighted.push({object:o,material:o.material});const glow=m=>{const c=m.clone();c.emissive=new THREE.Color('#1a667d');c.emissiveIntensity=.25;return c;};o.material=Array.isArray(o.material)?o.material.map(glow):glow(o.material);}});
 selectionBox.setFromObject(part);selectionBox.visible=true;$('#selection-name').textContent=part.name;$('#selection-description').textContent=part.userData.description||model.meta.detail;$('#selection-badge').hidden=!isIllustrative(part);
 for(const row of document.querySelectorAll('.part-row'))row.classList.toggle('selected',row.dataset.uuid===part.uuid);
}
$('#clear-selection').addEventListener('click',deselect);
function depth(part){let d=0;for(let o=part.parent;o;o=o.parent)if(o.userData.part)d++;return d;}
function renderParts(){const list=$('#parts');list.replaceChildren();const n=model.parts.filter(p=>p.userData.minhHoa).length;$('#part-count').textContent=`${model.parts.length} nhóm chi tiết có thể chọn`+(n?` · ${n} nhóm minh họa`:'');
 for(const part of model.parts){const row=document.createElement('div');row.className='part-row';row.dataset.uuid=part.uuid;row.style.paddingLeft=8+depth(part)*12+'px';const dot=document.createElement('span');dot.className='part-dot';const name=document.createElement('button');name.className='part-name';name.textContent=part.name;name.addEventListener('click',()=>selectPart(part));
   const tags=[];if(part.userData.minhHoa){const b=document.createElement('span');b.className='part-badge';b.textContent='minh họa';b.title='Kết cấu không có bản vẽ xác nhận; chỉ là cấu tạo minh họa';tags.push(b);}
   const eye=document.createElement('button');eye.className='visibility-button';eye.textContent='◉';eye.title='Ẩn/hiện '+part.name;eye.setAttribute('aria-label',eye.title);eye.setAttribute('aria-pressed','true');eye.addEventListener('click',()=>{part.visible=!part.visible;eye.classList.toggle('off',!part.visible);eye.setAttribute('aria-pressed',String(part.visible));if(selected===part&&!part.visible)deselect();});row.append(dot,name,...tags,eye);list.append(row);
 }
}
function stats(){let triangles=0,meshes=0;model.root.traverse(o=>{if(o.isMesh&&!o.parent?.userData.portMarker){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});$('#geometry-stats').textContent=`${meshes.toLocaleString('vi')} mesh · ${Math.round(triangles).toLocaleString('vi')} tam giác`;}
function updateBounds(){model.root.updateMatrixWorld(true);bounds.setFromObject(model.root);bounds.getCenter(center);bounds.getSize(size);const d=Math.max(size.x,size.y,size.z);ground.position.y=bounds.min.y-.08;grid.position.set(center.x,bounds.min.y-.07,center.z);grid.scale.setScalar(d/7);
 // bóng đổ phủ vừa mô hình (cụm nhỏ hay cả trạm)
 const half=Math.max(12,d*.62);key.position.copy(center).add(new THREE.Vector3(-7,10,8).normalize().multiplyScalar(Math.max(14,d*1.1)));key.target.position.copy(center);key.target.updateMatrixWorld();Object.assign(key.shadow.camera,{left:-half,right:half,top:half,bottom:-half,near:.1,far:Math.max(40,d*3)});key.shadow.camera.updateProjectionMatrix();}
function fitCamera(type=view){view=type;updateBounds();const aspect=Math.max(.4,viewport.clientWidth/viewport.clientHeight);const maxDim=Math.max(size.y,size.x/aspect,size.z/aspect);distance=Math.max(maxDim/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.65,Math.max(...size.toArray())*1.45);
 const dirs={iso:[1.5,1.0,1.7],front:[0,.10,1],top:[.001,1,.001]};const dir=new THREE.Vector3(...dirs[type]).normalize();camera.position.copy(center).addScaledVector(dir,distance);camera.near=Math.max(.01,distance/2000);camera.far=Math.max(200,distance*20);camera.updateProjectionMatrix();controls.target.copy(center);controls.minDistance=Math.max(.2,Math.max(...size.toArray())*.3);controls.maxDistance=distance*5;controls.update();for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('active',b.dataset.view===type);}
function applyMode(){deselect();setSection(model,mode==='section');const wire=$('#wireframe').checked;model.root.traverse(o=>{if(o.isMesh&&!o.parent?.userData.portMarker)for(const m of mats(o))m.wireframe=wire;});for(const b of document.querySelectorAll('[data-mode]'))b.classList.toggle('active',b.dataset.mode===mode);}
function updateExplosion(value){explodeAmount=value;setExplosion(model,value);$('#explosion').value=String(value);$('#explosion-value').value=`${Math.round(value*100)}%`;updateBounds();}
function disposeModel(old){const geometries=new Set(),materials=new Set(),shared=new Set(Object.values(M));old.root.traverse(o=>{for(const g of [o.geometry,o.userData.original?.geometry,o.userData.section?.geometry])if(g)geometries.add(g);for(const m of [o.material,o.userData.original?.material,o.userData.section?.material].flat())if(m&&!shared.has(m))materials.add(m);});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}

// ---- Tham số có thể chỉnh (trục vít, đầu nén, chiều gió két) ----
function renderParams(){
 const box=$('#params'),spec=PARAM_SPECS[model.meta.params];box.hidden=!spec;const list=$('#param-list');list.replaceChildren();$('#param-error').textContent='';if(!spec)return;
 const values={...(model.info.defaults??{}),...(paramValues[pkey(currentId)]??{})};
 for(const s of spec){const label=document.createElement('label');label.className='param-row';const span=document.createElement('span');span.textContent=s.label;let input;
   if(s.type==='select'){input=document.createElement('select');for(const [v,t] of s.options){const o=document.createElement('option');o.value=v;o.textContent=t;input.append(o);}input.value=String(values[s.key]);}
   else{input=document.createElement('input');input.type='number';input.min=s.min;input.max=s.max;input.step=s.step??(s.type==='int'?1:.01);input.value=String(values[s.key]);}
   input.dataset.key=s.key;input.addEventListener('change',()=>{if(rebuilding)return;const v=s.type==='select'?input.value:Number(input.value);if(s.type!=='select'&&!Number.isFinite(v))return;(paramValues[pkey(currentId)]??={})[s.key]=v;rebuilding=true;setTimeout(()=>{try{reload();}finally{rebuilding=false;}},0);});
   label.append(span,input);list.append(label);}
}
$('#param-reset').addEventListener('click',()=>{delete paramValues[pkey(currentId)];reload();});
function reload(){const keep={pos:camera.position.clone(),target:controls.target.clone()};return loadModel(currentId,{keepCamera:keep});}

// Cụm dựng lâu (trạm ghép ~10 giây, đầu nén ~2 giây): hiện lớp chờ rồi mới dựng để trình duyệt kịp vẽ thông báo.
const HEAVY={station:'Đang ghép trạm hoàn chỉnh (khoảng 10 giây)…',airend:'Đang dựng đầu nén…'};
function loadModel(id,opts={}){
 if(!HEAVY[id])return Promise.resolve(loadModelNow(id,opts));
 $('#loading-text').textContent=HEAVY[id];$('#loading').hidden=false;
 return new Promise(resolve=>setTimeout(()=>requestAnimationFrame(()=>setTimeout(()=>{try{loadModelNow(id,opts);}finally{$('#loading').hidden=true;$('#loading-text').textContent='Đang dựng hình học 3D…';resolve();}},0)),20));
}
function loadModelNow(id,{keepCamera=null}={}){
 deselect();
 let next,error='';
 try{next=buildModel(id,paramValues[pkey(id)]??{});}catch(e){error=e.message;console.warn(e.message);delete paramValues[pkey(id)];next=buildModel(id);}
 if(model){scene.remove(model.root);disposeModel(model);}currentId=id;model=next;scene.add(model.root);t=0;running=false;
 if(!keepCamera)mode=['airend','separator','combined-filter','dryer','desiccant'].includes(id)?'section':'assembly';explodeAmount=0;
 $('#play').setAttribute('aria-pressed','false');$('#play').innerHTML='▶ <span>Chạy cơ cấu</span>';$('#play').disabled=model.motions.length===0&&!model.flow;$('#explosion').disabled=model.explodables.length===0;$('#airflow').disabled=!model.flow;$('#reverse-airflow').disabled=!model.flow?.setDirection;
 $('#model-category').textContent=`${model.meta.group.toLocaleUpperCase('vi')} / ${model.meta.tag}`;$('#model-name').textContent=model.meta.name;$('#model-note').textContent=model.meta.note;$('#model-info').textContent=model.info.summary??'';$('#references-button').disabled=model.meta.refs.length===0;$('#export-status').textContent='';
 updateExplosion(mode==='explode'?.7:0);renderCatalog($('#search').value);renderParts();renderParams();if(error)$('#param-error').textContent='Không dựng được với tham số đã nhập, đã trở về mặc định. '+error;
 stats();applyMode();showPorts(model,$('#ports').checked);
 if(keepCamera){updateBounds();camera.position.copy(keepCamera.pos);controls.target.copy(keepCamera.target);controls.update();}else fitCamera('iso');
 $('#selection-description').textContent=model.meta.detail;
}
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>fitCamera(b.dataset.view));$('#fit-camera').addEventListener('click',()=>fitCamera());
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{mode=b.dataset.mode;if(mode==='explode')updateExplosion(.7);else updateExplosion(0);applyMode();fitCamera();});
$('#wireframe').addEventListener('change',applyMode);$('#explosion').addEventListener('input',e=>{const next=Number(e.target.value)>0?'explode':'assembly';updateExplosion(Number(e.target.value));if(next!==mode){mode=next;applyMode();}});
$('#ports').addEventListener('change',()=>showPorts(model,$('#ports').checked));
$('#play').addEventListener('click',()=>{running=!running;$('#play').setAttribute('aria-pressed',String(running));$('#play').innerHTML=running?'Ⅱ <span>Tạm dừng</span>':'▶ <span>Chạy cơ cấu</span>';});
$('#speed').addEventListener('input',e=>{$('#speed-value').value=Number(e.target.value).toLocaleString('vi',{minimumFractionDigits:1})+'×';});
$('#airflow').addEventListener('change',()=>{if(model.flow)model.flow.object.visible=$('#airflow').checked;});
$('#reverse-airflow').addEventListener('click',()=>{if(!model.flow?.setDirection)return;const dir=model.flow.direction==='len'?'xuong':'len';setAirflow(model,dir);(paramValues[pkey(currentId)]??={}).airflow=dir;const sel=document.querySelector('#param-list [data-key="airflow"]');if(sel)sel.value=dir;$('#model-info').textContent=model.info.summary??'';});
let pointerDown=null;renderer.domElement.addEventListener('pointerdown',e=>{pointerDown=[e.clientX,e.clientY];});
const shown=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
renderer.domElement.addEventListener('pointerup',e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>5)return;const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObject(model.root,true).find(h=>!h.object.isPoints&&shown(h.object));if(hit){let p=hit.object;while(p&&!p.userData.part)p=p.parent;selectPart(p);}else deselect();});

const dialog=$('#references-dialog');$('#references-button').addEventListener('click',()=>{const c=$('#reference-images');c.replaceChildren();for(const ref of model.meta.refs){const figure=document.createElement('figure');figure.className='reference-card';const caption=document.createElement('figcaption');caption.textContent=`${ref} — ${REFERENCES[ref]}`;const img=document.createElement('img');img.src=REFERENCE_IMAGES[ref]??`./references/${ref}.png`;img.alt=caption.textContent;figure.append(caption,img);c.append(figure);}dialog.showModal();});$('#close-references').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('#export-glb').addEventListener('click',async()=>{const b=$('#export-glb');b.disabled=true;$('#export-status').textContent='Đang xuất hình học GLB…';let clean;
 try{clean=buildModel(currentId,paramValues[pkey(currentId)]??{});clean.root.traverse(o=>{if(o.userData.noExport)o.visible=false;if(o.isMesh&&o.material){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();for(const m of mats(o)){m.wireframe=false;m.clippingPlanes=[];}}});const data=await new GLTFExporter().parseAsync(clean.root,{binary:true,onlyVisible:true,trs:false});download(new Blob([data],{type:'model/gltf-binary'}),currentId+'.glb');$('#export-status').textContent='Đã tạo '+currentId+'.glb (kèm nút cổng nối)';}
 catch(e){$('#export-status').textContent='Lỗi xuất GLB: '+e.message;console.error(e);}finally{b.disabled=false;if(clean)disposeModel(clean);}
});
$('#export-png').addEventListener('click',()=>{selectionBox.visible=false;renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(blob)download(blob,currentId+'-goc-nhin.png');},'image/png');if(selected)selectionBox.visible=true;});
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(model)fitCamera();}
new ResizeObserver(resize).observe(viewport);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#error').hidden=false;$('#error-detail').textContent='WebGL đã bị ngắt. Hãy tải lại trang.';});
resize();loadModel('station');
let last=performance.now(),fpsTime=0,frames=0;
function animate(now){requestAnimationFrame(animate);const dt=Math.min(Math.max((now-last)/1000,0),.1);last=now;if(model){if(running){t+=dt*Number($('#speed').value);updateMotion(model,t);}if(model.flow)model.flow.object.visible=$('#airflow').checked;}controls.update();if(selected)selectionBox.setFromObject(selected);renderer.render(scene,camera);frames++;fpsTime+=dt;if(fpsTime>1){$('#fps').textContent=Math.round(frames/fpsTime)+' FPS';frames=0;fpsTime=0;}}
requestAnimationFrame(animate);
// Cho phép kiểm thử tự động điều khiển trình xem.
window.mechViewer={loadModel:id=>loadModel(id),get ready(){return $('#loading').hidden;},setMode:m=>{mode=m;if(m==='explode')updateExplosion(.7);else updateExplosion(0);applyMode();fitCamera();},fitCamera,get model(){return model;},camera,controls,setParams:(id,p)=>{paramValues[pkey(id)]=p;if(id===currentId)return reload();}};
