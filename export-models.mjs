/** Xuất GLB thật bằng Three.js. Không cần trình duyệt; cần Node.js >= 18. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
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
mkdirSync(resolve(dir,'models-glb'),{recursive:true});
const manifest=[];
for(const entry of CATALOG){
 const model=buildModel(entry.id);model.root.traverse(o=>{if(o.userData.noExport)o.visible=false;});
 const data=await new GLTFExporter().parseAsync(model.root,{binary:true,onlyVisible:true});
 const path=resolve(dir,'models-glb',entry.id+'.glb');writeFileSync(path,Buffer.from(data));
 manifest.push({id:entry.id,name:entry.name,file:entry.id+'.glb',bytes:data.byteLength,refs:entry.refs,notes:entry.note});
 console.log(entry.id,data.byteLength,'bytes');
 const geometries=new Set();model.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});for(const g of geometries)g.dispose();
}
writeFileSync(resolve(dir,'models-glb/manifest.json'),JSON.stringify(manifest,null,2));
