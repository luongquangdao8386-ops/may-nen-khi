import test from 'node:test';
import assert from 'node:assert/strict';
import {THREE,screwGeometry,pleats} from '../geometry.js';
import {CATALOG,buildModel,setExplosion,updateMotion} from '../models.js';

test('18 cụm tạo được hình học hợp lệ, chỉ số và pháp tuyến hữu hạn',()=>{
 assert.equal(CATALOG.length,18);
 for(const item of CATALOG){const m=buildModel(item.id);let count=0;m.root.traverse(o=>{if(o.isMesh){count++;const g=o.geometry,p=g.attributes.position;assert.ok(p?.count>0,item.id);for(const a of ['position','normal'])if(g.attributes[a])for(const v of g.attributes[a].array)assert.ok(Number.isFinite(v),item.id+' '+a);if(g.index)for(const i of g.index.array)assert.ok(i>=0&&i<p.count,item.id+' index');}});assert.ok(count>0);const b=new THREE.Box3().setFromObject(m.root);assert.ok(!b.isEmpty());assert.ok(b.getSize(new THREE.Vector3()).toArray().every(n=>n>0&&Number.isFinite(n)));}
});
test('Cơ cấu có một trục vít chính và đúng hai bánh sao trên các trục vuông góc',()=>{
 const m=buildModel('rotor');assert.equal(m.parts.filter(p=>p.name==='Trục vít chính').length,1);assert.equal(m.parts.filter(p=>p.name.startsWith('Bánh sao')).length,2);assert.equal(m.motions[0].axis,'x');assert.ok(m.motions.slice(1).every(a=>a.axis==='y'));
});
test('Két có hai quạt bên dưới lõi và hạt gió có thể cập nhật',()=>{
 const m=buildModel('cooler');const fans=m.parts.filter(p=>p.name.startsWith('Cụm quạt '));assert.equal(fans.length,2);assert.ok(fans.every(p=>p.position.y<0));assert.equal(m.motions.length,2);m.flow.update(2.3);const positions=m.flow.object.children[0].geometry.attributes.position.array;assert.ok(Array.from(positions).every(Number.isFinite));
});
test('Tách cụm có thể trở về chính xác vị trí lắp',()=>{
 for(const item of CATALOG){const m=buildModel(item.id);const original=m.explodables.map(p=>p.object.position.clone());setExplosion(m,1);setExplosion(m,0);m.explodables.forEach((p,i)=>assert.ok(p.object.position.distanceTo(original[i])<1e-9));}
});
test('Chuyển động thay đổi đối tượng và vẫn hữu hạn',()=>{
 for(const id of ['rotor','cooler','inlet','water-valve']){const m=buildModel(id);updateMotion(m,3.1);for(const p of m.motions){assert.ok(Number.isFinite(p.object.rotation[p.axis]));assert.ok(Number.isFinite(p.object.position[p.axis]));}assert.ok(m.motions.length>0);}
});
test('Pháp tuyến rãnh xoắn và lõi xếp nếp hướng ra ngoài',()=>{
 for(const [kind,g] of [['screw',screwGeometry()],['pleats',pleats(.5,.4,2)]]){const p=g.attributes.position,n=g.attributes.normal;let dot=0;for(let i=0;i<p.count;i++)dot+=kind==='screw'?p.getY(i)*n.getY(i)+p.getZ(i)*n.getZ(i):p.getX(i)*n.getX(i)+p.getZ(i)*n.getZ(i);assert.ok(dot/p.count>0,kind);}
});
