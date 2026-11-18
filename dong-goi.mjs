/** Đóng gói mô hình máy nén khí thành một tệp ES module để ghép vào trang Three.js khác.
 *  npm install --no-save esbuild@0.24.2 && node dong-goi.mjs   → dist/may-nen-khi-3d.js
 *  Tệp ra chỉ cần trang dùng có Three.js dạng ES module (importmap "three"), bản 0.160 trở lên.
 */
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const {build}=await import(process.env.ESBUILD??'esbuild');
const dir=dirname(fileURLToPath(import.meta.url));
await build({
 entryPoints:[resolve(dir,'tich-hop.js')],outfile:resolve(dir,'dist/may-nen-khi-3d.js'),bundle:true,format:'esm',minify:true,target:'es2020',legalComments:'eof',charset:'utf8',
 // Three.js lấy từ trang dùng (importmap "three"), không đóng kèm để tránh hai bản Three.js trong một trang.
 plugins:[{name:'three-tu-trang-dung',setup(b){b.onResolve({filter:/three\.module\.js$/},()=>({path:'three',external:true}));}}],
 banner:{js:'// Mô hình 3D máy nén khí trục vít đơn phun nước — gói tích hợp (https://github.com/luongquangdao8386-ops/may-nen-khi).\n// Gồm mã may-nen-khi (LICENSE-APP.txt), three-mesh-bvh và three-bvh-csg (MIT). Cần Three.js ≥ 0.160 qua importmap "three".'},
});
console.log('Đã ghi dist/may-nen-khi-3d.js');
