import { THREE,M } from './geometry.js';
import { CATALOG,REFERENCES,buildModel,setExplosion,updateMotion } from './models.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const $=s=>document.querySelector(s), viewport=$('#viewport');
const REFERENCE_IMAGES={};
const scene=new THREE.Scene();scene.background=new THREE.Color('#eaf0f4');
const camera=new THREE.PerspectiveCamera(38,1,.01,200);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
renderer.domElement.setAttribute('aria-label','Mô hình 3D có thể xoay và chọn chi tiết');viewport.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.5;controls.maxDistance=65;controls.maxPolarAngle=Math.PI*.92;
scene.add(new THREE.HemisphereLight('#ffffff','#8ba3b4',3));
const key=new THREE.DirectionalLight('#fff7e9',4);key.position.set(-7,10,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:40});key.shadow.camera.updateProjectionMatrix();key.shadow.normalBias=.025;scene.add(key);
const fill=new THREE.DirectionalLight('#d7edff',2.5);fill.position.set(8,5,-7);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e7eef3',roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(20,80,'#bacbd6','#d5e0e8');grid.material.transparent=true;grid.material.opacity=.45;scene.add(grid);

let model=null,currentId='rotor',running=false,t=0,explodeAmount=0,mode='assembly',view='iso',selected=null;
let bounds=new THREE.Box3(),center=new THREE.Vector3(),size=new THREE.Vector3(),distance=10;
const clipPlane=new THREE.Plane(new THREE.Vector3(0,0,-1),0);
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
const highlighted=[];
const selectionBox=new THREE.BoxHelper(new THREE.Object3D(),0x329ec3);selectionBox.visible=false;scene.add(selectionBox);

function renderCatalog(query=''){
 const nav=$('#catalog');nav.replaceChildren();let last='';
 for(const item of CATALOG){if(!item.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))continue;
   if(last!==item.group){const h=document.createElement('p');h.className='catalog-group';h.textContent=item.group;nav.append(h);last=item.group;}
   const b=document.createElement('button');b.className='catalog-item'+(item.id===currentId?' active':'');b.dataset.id=item.id;b.innerHTML=`<span class="item-number">${item.tag}</span><span>${item.name}</span>`;b.setAttribute('aria-current',item.id===currentId?'true':'false');b.addEventListener('click',()=>loadModel(item.id));nav.append(b);
 }
}
$('#search').addEventListener('input',e=>renderCatalog(e.target.value));

function deselect(){for(const {object,material} of highlighted){object.material.dispose();object.material=material;}highlighted.length=0;selected=null;selectionBox.visible=false;$('#selection-name').textContent='Chọn một chi tiết';$('#selection-description').textContent=model?.meta.detail??'';document.querySelectorAll('.part-row').forEach(x=>x.classList.remove('selected'));}
function selectPart(part){deselect();if(!part)return;selected=part;
 part.traverse(o=>{if(o.isMesh){highlighted.push({object:o,material:o.material});const mat=o.material.clone();mat.emissive=new THREE.Color('#1a667d');mat.emissiveIntensity=.25;o.material=mat;}});
 selectionBox.setFromObject(part);selectionBox.visible=true;$('#selection-name').textContent=part.name;$('#selection-description').textContent=part.userData.description||model.meta.detail;
 for(const row of document.querySelectorAll('.part-row'))row.classList.toggle('selected',row.dataset.uuid===part.uuid);
}
$('#clear-selection').addEventListener('click',deselect);
function renderParts(){const list=$('#parts');list.replaceChildren();$('#part-count').textContent=`${model.parts.length} nhóm chi tiết có thể chọn`;
 for(const part of model.parts){const row=document.createElement('div');row.className='part-row';row.dataset.uuid=part.uuid;const dot=document.createElement('span');dot.className='part-dot';const name=document.createElement('button');name.className='part-name';name.textContent=part.name;name.addEventListener('click',()=>selectPart(part));
   const eye=document.createElement('button');eye.className='visibility-button';eye.textContent='◉';eye.title='Ẩn/hiện '+part.name;eye.setAttribute('aria-label',eye.title);eye.setAttribute('aria-pressed','true');eye.addEventListener('click',()=>{part.visible=!part.visible;eye.classList.toggle('off',!part.visible);eye.setAttribute('aria-pressed',String(part.visible));if(selected===part&&!part.visible)deselect();});row.append(dot,name,eye);list.append(row);
 }
}
function stats(){let triangles=0,meshes=0;model.root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});$('#geometry-stats').textContent=`${meshes.toLocaleString('vi')} mesh · ${Math.round(triangles).toLocaleString('vi')} tam giác`;}
function updateBounds(){model.root.updateMatrixWorld(true);bounds.setFromObject(model.root);bounds.getCenter(center);bounds.getSize(size);const d=Math.max(size.x,size.y,size.z);ground.position.y=bounds.min.y-.08;grid.position.set(center.x,bounds.min.y-.07,center.z);grid.scale.setScalar(d/7);clipPlane.constant=center.z+.02;}
function fitCamera(type=view){view=type;updateBounds();const aspect=Math.max(.4,viewport.clientWidth/viewport.clientHeight);const maxDim=Math.max(size.y,size.x/aspect,size.z/aspect);distance=Math.max(maxDim/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.65,Math.max(...size.toArray())*1.45);
 const dirs={iso:[1.5,1.0,1.7],front:[0,.10,1],top:[.001,1,.001]};const dir=new THREE.Vector3(...dirs[type]).normalize();camera.position.copy(center).addScaledVector(dir,distance);camera.near=Math.max(.01,distance/2000);camera.far=Math.max(200,distance*20);camera.updateProjectionMatrix();controls.target.copy(center);controls.minDistance=Math.max(.2,Math.max(...size.toArray())*.3);controls.maxDistance=distance*5;controls.update();for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('active',b.dataset.view===type);}
function applyMode(){deselect();const wire=$('#wireframe').checked;model.root.traverse(o=>{if(o.isMesh)o.material.wireframe=wire;});for(const o of model.covers){o.material.clippingPlanes=mode==='section'?[clipPlane]:[];o.material.clipShadows=true;o.material.needsUpdate=true;}for(const b of document.querySelectorAll('[data-mode]'))b.classList.toggle('active',b.dataset.mode===mode);}
function updateExplosion(value){explodeAmount=value;setExplosion(model,value);$('#explosion').value=String(value);$('#explosion-value').value=`${Math.round(value*100)}%`;updateBounds();}
function disposeModel(old){const geometries=new Set(),materials=new Set(),shared=new Set(Object.values(M));old.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material&&!shared.has(o.material))materials.add(o.material);});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}
function loadModel(id){
 deselect();if(model){scene.remove(model.root);disposeModel(model);}currentId=id;model=buildModel(id);scene.add(model.root);t=0;running=false;mode=['airend','separator','combined-filter','dryer','desiccant'].includes(id)?'section':'assembly';explodeAmount=0;
 $('#play').setAttribute('aria-pressed','false');$('#play').innerHTML='▶ <span>Chạy cơ cấu</span>';$('#play').disabled=model.motions.length===0&&!model.flow;$('#explosion').disabled=model.explodables.length===0;$('#airflow').disabled=!model.flow;
 $('#model-category').textContent=`${model.meta.group.toLocaleUpperCase('vi')} / ${model.meta.tag}`;$('#model-name').textContent=model.meta.name;$('#model-note').textContent=model.meta.note;$('#references-button').disabled=model.meta.refs.length===0;$('#export-status').textContent='';
 updateExplosion(0);renderCatalog($('#search').value);renderParts();stats();applyMode();fitCamera('iso');$('#selection-description').textContent=model.meta.detail;
}
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>fitCamera(b.dataset.view));$('#fit-camera').addEventListener('click',()=>fitCamera());
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{mode=b.dataset.mode;if(mode==='explode')updateExplosion(.7);else updateExplosion(0);applyMode();fitCamera();});
$('#wireframe').addEventListener('change',applyMode);$('#explosion').addEventListener('input',e=>{mode=Number(e.target.value)>0?'explode':'assembly';updateExplosion(Number(e.target.value));applyMode();});
$('#play').addEventListener('click',()=>{running=!running;$('#play').setAttribute('aria-pressed',String(running));$('#play').innerHTML=running?'Ⅱ <span>Tạm dừng</span>':'▶ <span>Chạy cơ cấu</span>';});
$('#speed').addEventListener('input',e=>{$('#speed-value').value=Number(e.target.value).toLocaleString('vi',{minimumFractionDigits:1})+'×';});
$('#airflow').addEventListener('change',()=>{if(model.flow)model.flow.object.visible=$('#airflow').checked;});
let pointerDown=null;renderer.domElement.addEventListener('pointerdown',e=>{pointerDown=[e.clientX,e.clientY];});
renderer.domElement.addEventListener('pointerup',e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>5)return;const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObject(model.root,true).find(h=>!h.object.isPoints);if(hit){let p=hit.object;while(p&&!p.userData.part)p=p.parent;selectPart(p);}else deselect();});

const dialog=$('#references-dialog');$('#references-button').addEventListener('click',()=>{const c=$('#reference-images');c.replaceChildren();for(const ref of model.meta.refs){const figure=document.createElement('figure');figure.className='reference-card';const caption=document.createElement('figcaption');caption.textContent=`${ref} — ${REFERENCES[ref]}`;const img=document.createElement('img');img.src=REFERENCE_IMAGES[ref]??`./references/${ref}.png`;img.alt=caption.textContent;figure.append(caption,img);c.append(figure);}dialog.showModal();});$('#close-references').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('#export-glb').addEventListener('click',async()=>{const b=$('#export-glb');b.disabled=true;$('#export-status').textContent='Đang xuất hình học GLB…';let clean;
 try{clean=buildModel(currentId);clean.root.traverse(o=>{if(o.userData.noExport)o.visible=false;if(o.isMesh&&o.material){o.material=o.material.clone();o.material.wireframe=false;o.material.clippingPlanes=[];}});const data=await new GLTFExporter().parseAsync(clean.root,{binary:true,onlyVisible:true,trs:false});download(new Blob([data],{type:'model/gltf-binary'}),currentId+'.glb');$('#export-status').textContent='Đã tạo '+currentId+'.glb';}
 catch(e){$('#export-status').textContent='Lỗi xuất GLB: '+e.message;console.error(e);}finally{b.disabled=false;if(clean)disposeModel(clean);}
});
$('#export-png').addEventListener('click',()=>{selectionBox.visible=false;renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(blob)download(blob,currentId+'-goc-nhin.png');},'image/png');if(selected)selectionBox.visible=true;});
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(model)fitCamera();}
new ResizeObserver(resize).observe(viewport);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#error').hidden=false;$('#error-detail').textContent='WebGL đã bị ngắt. Hãy tải lại trang.';});
loadModel('rotor');resize();$('#loading').hidden=true;
let last=performance.now(),fpsTime=0,frames=0;
function animate(now){requestAnimationFrame(animate);const dt=Math.min(Math.max((now-last)/1000,0),.1);last=now;if(running){t+=dt*Number($('#speed').value);updateMotion(model,t);}if(model.flow)model.flow.object.visible=$('#airflow').checked;controls.update();if(selected)selectionBox.setFromObject(selected);renderer.render(scene,camera);frames++;fpsTime+=dt;if(fpsTime>1){$('#fps').textContent=Math.round(frames/fpsTime)+' FPS';frames=0;fpsTime=0;}}
requestAnimationFrame(animate);
