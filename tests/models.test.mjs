import test from 'node:test';
import assert from 'node:assert/strict';
import {THREE,M,screwGeometry,pleats,screwKinematics,singleScrewGeometry,insideScrew,revolveGeometry} from '../geometry.js';
import {CATALOG,buildModel,setExplosion,updateMotion,setSection,setAirflow,showPorts} from '../models.js';

const models=new Map();const get=id=>{if(!models.has(id))models.set(id,buildModel(id));return models.get(id);};

test('18 cụm tạo được hình học hợp lệ, chỉ số và pháp tuyến hữu hạn',()=>{
 assert.equal(CATALOG.length,18);
 for(const item of CATALOG){const m=get(item.id);let count=0;m.root.traverse(o=>{if(o.isMesh){count++;const g=o.geometry,p=g.attributes.position;assert.ok(p?.count>0,item.id);for(const a of ['position','normal'])if(g.attributes[a])for(const v of g.attributes[a].array)assert.ok(Number.isFinite(v),item.id+' '+a);if(g.index)for(const i of g.index.array)assert.ok(i>=0&&i<p.count,item.id+' index');}});assert.ok(count>0);const b=new THREE.Box3().setFromObject(m.root);assert.ok(!b.isEmpty());assert.ok(b.getSize(new THREE.Vector3()).toArray().every(n=>n>0&&Number.isFinite(n)));}
});
test('Cơ cấu có một trục vít chính và đúng hai bánh sao trên các trục vuông góc',()=>{
 const m=get('rotor');assert.equal(m.parts.filter(p=>p.name==='Trục vít chính').length,1);assert.equal(m.parts.filter(p=>p.name.startsWith('Bánh sao')).length,2);assert.equal(m.motions[0].axis,'x');assert.ok(m.motions.slice(1).every(a=>a.axis==='y'));
 // hai bánh sao cùng vị trí dọc trục, đối xứng hai bên trục vít, quay ngược chiều nhau với tỷ số z1/z2
 const [a,b]=m.parts.filter(p=>p.name.startsWith('Bánh sao '));const kin=m.info.kin;
 assert.ok(Math.abs(a.position.x-b.position.x)<1e-9&&Math.abs(a.position.z+b.position.z)<1e-9&&Math.abs(Math.abs(a.position.z)-kin.A)<1e-9);
 const [s,ga,gb]=m.motions;assert.ok(Math.abs(ga.ratio/s.ratio+kin.z1/kin.z2)<1e-12&&Math.abs(gb.ratio/s.ratio-kin.z1/kin.z2)<1e-12);
});
test('Răng bánh sao và giá đỡ không cắt vào thân vít khi quay (mô hình động học, có khe hở)',()=>{
 for(const params of [{},{grooves:5,gateTeeth:11},{grooves:6,gateTeeth:12,toothWidth:.13,toothRootWidth:.17},{screwRadius:.95,gateRadius:.9,grooveDepth:.36}]){
  const m=buildModel('rotor',params),kin=m.info.kin,screw=m.parts.find(p=>p.name==='Trục vít chính'),t=kin.p.gateThickness;
  const disks=m.parts.filter(p=>p.name.startsWith('Đĩa răng bánh sao')),sups=m.parts.filter(p=>p.name.startsWith('Giá đỡ bánh sao'));
  assert.equal(disks.length,2);let checked=0,bad=0;const v=new THREE.Vector3(),inv=new THREE.Matrix4();
  for(let i=0;i<48;i++){updateMotion(m,i*.37);m.root.updateMatrixWorld(true);inv.copy(screw.matrixWorld).invert();
   for(const [objs,hwf,sMax,ys,bev] of [[disks,s=>kin.tooth.at(s),kin.R2,[-t/2,0,t/2],.012],[sups,s=>Math.max(.02,kin.tooth.at(s)-.035),kin.R2-.07,[-.0175,0,.0175],.004]])
    for(const o of objs)for(let j=0;j<kin.z2;j++){const phi=Math.PI/2+j*kin.pitch,D=[Math.cos(phi),-Math.sin(phi)],N=[-Math.sin(phi),-Math.cos(phi)];
     for(let k=0;k<=10;k++)for(const y of ys){const face=y!==0,s=kin.rRoot+(sMax-(face?bev:0)-kin.rRoot)*k/10,hw=hwf(s)-(face?bev:0);
      for(const q of [-hw,0,hw]){v.set(s*D[0]+q*N[0],y,s*D[1]+q*N[1]).applyMatrix4(o.matrixWorld).applyMatrix4(inv);checked++;if(insideScrew(kin,v.x,Math.hypot(v.y,v.z),Math.atan2(v.z,v.y)))bad++;}}}}
  assert.ok(checked>10000);assert.equal(bad,0,JSON.stringify(params)+': '+bad+' điểm giao cắt');
 }
});
test('Rãnh trục vít: biên dạng kín, mặt trụ không chồng lấn, pháp tuyến hướng ra ngoài',()=>{
 const kin=screwKinematics(),g=singleScrewGeometry(kin,{keepProfiles:true});let back=0;
 for(const pr of g.profiles)for(let i=0;i<pr.length-1;i++){const a=pr[i],b=pr[i+1];if(Math.abs(a[1]-kin.R1)<1e-9&&Math.abs(b[1]-kin.R1)<1e-9&&b[0]<a[0]-1e-9)back++;}
 assert.equal(back,0);assert.ok(kin.wrapDeg>150&&kin.wrapDeg<300);assert.ok(kin.L>2*kin.xExt);
 assert.throws(()=>screwKinematics({grooveDepth:.8}),/không hợp lệ/);assert.throws(()=>screwKinematics({grooves:12,gateTeeth:11}),/không hợp lệ/);
});
test('Két có hai quạt bên dưới lõi; chiều gió đảo được',()=>{
 const m=get('cooler');const fans=m.parts.filter(p=>p.name.startsWith('Cụm quạt '));assert.equal(fans.length,2);assert.ok(fans.every(p=>p.position.y<0));assert.equal(m.motions.length,2);m.flow.update(2.3);const positions=m.flow.object.children[0].geometry.attributes.position.array;assert.ok(Array.from(positions).every(Number.isFinite));
 const ys=()=>{m.flow.update(1);const a=Array.from(positions).filter((_,i)=>i%3===1);m.flow.update(1.1);return Array.from(positions).filter((_,i)=>i%3===1).map((y,i)=>y-a[i]);};
 const up=ys().filter(d=>Math.abs(d)<.5);assert.ok(up.every(d=>d>0));
 setAirflow(m,'xuong');assert.ok(m.motions.every(a=>a.ratio<0));assert.ok(ys().filter(d=>Math.abs(d)<.5).every(d=>d<0));setAirflow(m,'len');
 assert.equal(buildModel('cooler',{airflow:'xuong'}).flow.direction,'xuong');
 // không tự thêm bộ trao đổi nhiệt dạng tấm của phương án giải nhiệt nước (H6)
 assert.ok(!m.parts.some(p=>/tấm|plate/i.test(p.name)&&/trao đổi/i.test(p.name)));
});
test('Tách cụm có thể trở về chính xác vị trí lắp',()=>{
 for(const item of CATALOG){const m=get(item.id);const original=m.explodables.map(p=>p.object.position.clone());setExplosion(m,1);setExplosion(m,0);m.explodables.forEach((p,i)=>assert.ok(p.object.position.distanceTo(original[i])<1e-9));}
});
test('Chuyển động thay đổi đối tượng và vẫn hữu hạn',()=>{
 for(const id of ['rotor','airend','motor','cooler','inlet','water-valve']){const m=get(id);updateMotion(m,3.1);for(const p of m.motions){assert.ok(Number.isFinite(p.object.rotation[p.axis]));assert.ok(Number.isFinite(p.object.position[p.axis]));}assert.ok(m.motions.length>0);updateMotion(m,0);}
});
test('Pháp tuyến rãnh xoắn, khối tròn xoay và lõi xếp nếp hướng ra ngoài',()=>{
 const kin=screwKinematics();
 for(const [kind,g] of [['screw',screwGeometry()],['screw-kin',singleScrewGeometry(kin)],['revolve',revolveGeometry([[0,0],[0,.5],[1,.5],[1,0]])],['pleats',pleats(.5,.4,2)]]){const p=g.attributes.position,n=g.attributes.normal;let dot=0;for(let i=0;i<p.count;i++)dot+=kind==='pleats'?p.getX(i)*n.getX(i)+p.getZ(i)*n.getZ(i):kind==='revolve'?(p.getX(i)-.5)*n.getX(i)+p.getY(i)*n.getY(i)+p.getZ(i)*n.getZ(i):p.getY(i)*n.getY(i)+p.getZ(i)*n.getZ(i);assert.ok(dot/p.count>0,kind);}
});
test('Đầu nén: vỏ rỗng cắt được bằng CSG, có nắp, ổ đỡ, phớt, cổng và nhóm minh họa',()=>{
 const m=get('airend'),names=m.parts.map(p=>p.name);
 for(const n of ['Vỏ đúc đầu nén','Nắp hông bánh sao A','Nắp hông bánh sao B','Nắp đầu phía xả','Vỏ chuông nối động cơ','Cặp ổ bi đỡ chặn phía xả','Ổ đũa trụ phía truyền động','Phớt trục phía xả'])assert.ok(names.includes(n),n);
 assert.ok(m.parts.filter(p=>p.userData.minhHoa).length>=5);
 const casing=m.solids.find(o=>o.name==='Vỏ đúc');assert.ok(casing);
 // tia thẳng đứng qua tâm trục vít cắt vỏ ở 4 mặt (ngoài–trong phía trên, trong–ngoài phía dưới) → vỏ rỗng có thành dày
 const ray=new THREE.Raycaster(new THREE.Vector3(0,5,0),new THREE.Vector3(0,-1,0));casing.material.side=THREE.DoubleSide;
 const hits=ray.intersectObject(casing).map(h=>+h.point.y.toFixed(3)).filter((y,i,a)=>a.indexOf(y)===i);assert.ok(hits.length>=4,'số mặt cắt tia: '+hits.length);
 setSection(m,true);assert.ok(Array.isArray(casing.material)&&casing.material.includes(M.cut));assert.ok(casing.geometry.groups.some(g=>g.materialIndex===1&&g.count>0));
 setSection(m,false);assert.ok(!Array.isArray(casing.material));
 const kinds=new Set(m.ports.map(p=>p.userData.port.kind));for(const k of ['khi','nuoc','co-khi'])assert.ok(kinds.has(k),k);
});
test('Động cơ: khớp nối hai nửa có đệm đàn hồi, nắp che và nắp quạt tháo được',()=>{
 const m=get('motor'),names=m.parts.map(p=>p.name);
 for(const n of ['Nửa khớp nối phía động cơ','Nửa khớp nối phía đầu nén','Đệm đàn hồi hình sao','Nắp che khớp nối','Nắp quạt và lưới bảo vệ','Hộp đấu điện','Đầu cáp và cáp nguồn','Chân đế','Nắp đầu phía truyền động (mặt bích)','Nắp đầu phía quạt'])assert.ok(names.includes(n),n);
 const ex=new Set(m.explodables.map(e=>e.object.name));for(const n of ['Nửa nắp che trên','Nắp quạt và lưới bảo vệ','Nửa khớp nối phía đầu nén'])assert.ok(ex.has(n),n);
 // mặt bích động cơ và chuông nối đầu nén cùng bán kính lỗ để ghép sau
 const a=get('airend').ports.find(p=>p.userData.port.name==='Mặt bích nối động cơ'),b=m.ports.find(p=>p.userData.port.name==='Mặt bích nối chuông đầu nén');assert.ok(a&&b);assert.ok(Math.abs(a.userData.port.size-b.userData.port.size)<1e-9);
});
test('Bình tách là bình riêng, vỏ rỗng, có kính mức, van và đường nước; nội thất đánh dấu minh họa',()=>{
 const m=get('separator'),names=m.parts.map(p=>p.name);
 for(const n of ['Vỏ bình tách','Kính mức nước','Van an toàn','Đồng hồ áp suất','Van xả đáy và đường xả','Cổ nước ra két và van chặn','Cửa nước bù','Chân đỡ bình','Cổ khí ra và mặt bích'])assert.ok(names.includes(n),n);
 const inner=m.parts.find(p=>p.name.startsWith('Cơ cấu tách bên trong'));assert.ok(inner?.userData.minhHoa);
 const shell=m.solids.find(o=>o.name==='Vỏ có độ dày');const ray=new THREE.Raycaster(new THREE.Vector3(-3,2,0.05),new THREE.Vector3(1,0,0));shell.material.side=THREE.DoubleSide;
 assert.ok(ray.intersectObject(shell).length>=4);
 assert.notEqual(get('receiver').meta.name,m.meta.name);assert.ok(m.ports.length>=5);
});
test('Mọi cụm có cổng nối; dấu cổng không xuất GLB còn nút cổng thì có',()=>{
 for(const item of CATALOG){const m=get(item.id);assert.ok(m.ports.length>0,item.id);for(const p of m.ports){assert.ok(p.name.startsWith('Cổng: '));assert.ok(!p.userData.noExport);const d=new THREE.Vector3(...p.userData.port.dir);assert.ok(Math.abs(d.length()-1)<1e-3);let marker=0;p.traverse(o=>{if(o.userData.portMarker){marker++;assert.ok(o.userData.noExport);}});assert.equal(marker,1);}
  showPorts(m,true);showPorts(m,false);}
});
test('Không tự thêm thiết bị không có trong ảnh: không có bơm nước, không có RO ở cụm làm mềm',()=>{
 for(const item of CATALOG){const m=get(item.id);for(const p of m.parts){assert.ok(!/bơm/i.test(p.name),item.id+': '+p.name);}}
 assert.ok(!get('softener').parts.some(p=>/RO|thẩm thấu/i.test(p.name)));
});
