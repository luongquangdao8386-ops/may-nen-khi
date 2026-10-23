/** Xuất GLB thật bằng Three.js. Không cần trình duyệt; cần Node.js >= 18.
 *  node export-models.mjs                       → xuất cả 18 cụm vào models-glb/
 *  node export-models.mjs rotor airend          → chỉ xuất các cụm đã nêu
 *  node export-models.mjs rotor --tham-so '{"grooves":5}' --ra ./ket-qua   → xuất với tham số riêng vào thư mục khác
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
import {THREE} from './geometry.js';
import {CATALOG,buildModel} from './models.js';
const dir=dirname(fileURLToPath(import.meta.url));
// GLTFExporter sử dụng FileReader của trình duyệt để đọc Blob. Bộ chuyển nhỏ cho Node.
globalThis.FileReader=class {
 readAsArrayBuffer(blob){blob.arrayBuffer().then(data=>{this.result=data;this.onloadend?.();}).catch(error=>this.onerror?.(error));}
 readAsDataURL(blob){blob.arrayBuffer().then(data=>{this.result=`data:${blob.type};base64,${Buffer.from(data).toString('base64')}`;this.onloadend?.();}).catch(error=>this.onerror?.(error));}
};
let source=readFileSync(resolve(dir,'vendor/GLTFExporter.js'),'utf8');
source=source.replace("from 'three'",`from '${pathToFileURL(resolve(dir,'vendor/three.module.js')).href}'`);
const {GLTFExporter}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));

const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);if(i<0)return null;const v=args[i+1];args.splice(i,2);return v;};
const params=JSON.parse(opt('--tham-so')??'{}'),out=resolve(opt('--ra')??resolve(dir,'models-glb'));
const ids=args.length?args:CATALOG.map(c=>c.id),all=!args.length;
for(const id of ids)if(!CATALOG.some(c=>c.id===id))throw new Error('Không có cụm '+id+'. Các ID: '+CATALOG.map(c=>c.id).join(', '));
mkdirSync(out,{recursive:true});
const round=v=>+v.toFixed(4),manifest=[];
for(const id of ids){
 const entry=CATALOG.find(c=>c.id===id),model=buildModel(id,entry.params?params:{});model.root.traverse(o=>{if(o.userData.noExport)o.visible=false;});
 model.root.updateMatrixWorld(true);
 const data=await new GLTFExporter().parseAsync(model.root,{binary:true,onlyVisible:true});
 writeFileSync(resolve(out,id+'.glb'),Buffer.from(data));
 // Cổng nối ghi theo hệ tọa độ của cụm (đơn vị quy ước), để ghép hệ thống sau.
 const ports=model.ports.map(p=>{const w=p.getWorldPosition(new THREE.Vector3()),d=new THREE.Vector3(0,0,1).applyQuaternion(p.getWorldQuaternion(new THREE.Quaternion()));
  return {node:p.name,...p.userData.port,position:w.toArray().map(round),dir:d.toArray().map(round)};});
 let triangles=0;model.root.traverse(o=>{if(o.isMesh&&o.visible)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});
 manifest.push({id,name:entry.name,file:id+'.glb',bytes:data.byteLength,triangles:Math.round(triangles),refs:entry.refs,notes:entry.note,
  summary:model.info.summary,params:entry.params?{...model.info.defaults,...params}:undefined,
  illustrativeParts:model.parts.filter(p=>p.userData.minhHoa).map(p=>p.name),ports});
 console.log(id,data.byteLength,'bytes',Math.round(triangles),'tam giác',ports.length,'cổng');
 const geometries=new Set();model.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});for(const g of geometries)g.dispose();
}
if(all||out!==resolve(dir,'models-glb'))writeFileSync(resolve(out,'manifest.json'),JSON.stringify(manifest,null,1));
