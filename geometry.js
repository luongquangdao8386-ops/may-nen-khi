import * as THREE from './vendor/three.module.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION } from './vendor/three-bvh-csg.module.js';
export { THREE };

// Mọi chi tiết dưới đây là hình học 3D thật, có đỉnh, mặt, pháp tuyến và tên.
// Màu theo tông bản vẽ kỹ thuật: thép sáng, gang sơn xám xanh, nhựa kỹ thuật màu be. Đây là màu minh họa.
const std=(color,metalness,roughness,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
export const M = {
  steel: std(0xb4c1ca,.78,.3),
  casting: std(0x9facb7,.55,.56),
  bright: std(0xdde5ea,.9,.2),
  dark: std(0x303d49,.4,.45),
  gate: std(0x435765,.2,.42),
  paint: std(0x265870,.4,.4),
  black: std(0x17212a,.15,.6),
  rubber: std(0x1e272d,0,.85),
  paper: std(0xe8d4a4,0,.9),
  brass: std(0xb69b60,.72,.35),
  copper: std(0xb97f59,.75,.35),
  white: std(0xe6ebeb,.12,.45),
  water: std(0x37a9c1,.1,.2,{transparent:true,opacity:.5,depthWrite:false}),
  glass: std(0x91c7d6,0,.15,{transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}),
  blue: std(0x367faa,.4,.4),
  red: std(0xd96b59,.25,.4),
  resin: std(0xbaa16f,0,.9),
  // Bổ sung cho các cụm đã nâng cấp.
  housing: std(0x5a7383,.35,.55),      // vỏ gang đầu nén, sơn xám xanh
  housingDark: std(0x4d616e,.35,.55),  // nắp, chuông nối
  stainless: std(0xccd5db,.88,.24),    // trục vít inox
  peek: std(0xb9864a,0,.48),            // đĩa bánh sao nhựa kỹ thuật (màu minh họa)
  support: std(0x8e9aa3,.75,.35),      // giá đỡ bánh sao bằng thép
  bearing: std(0xdfe5e9,.95,.16),
  cage: std(0xa98245,.65,.4),          // vòng cách đồng thau
  seal: std(0x2f2724,0,.78),           // phớt, gioăng cao su
  motor: std(0x3e6a84,.35,.42),
  motorDark: std(0x2b3c47,.35,.5),
  vessel: std(0xaebcc5,.3,.45),
  frame: std(0x3c4852,.4,.5),
  lamination: std(0x6c767d,.75,.38),
  winding: std(0xc0753d,.8,.35),
  mesh: std(0xa9b8c1,.7,.45,{transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),
  label: std(0xece6d4,.1,.6),
  handle: std(0xc9473a,.2,.45),
  cut: std(0xd36a43,.05,.65,{side:THREE.DoubleSide}),  // mặt cắt
};
const UP = new THREE.Vector3(0,1,0);
export function modelBase(id) { const root=new THREE.Group(); root.name=id; return { id,root,parts:[],covers:[],solids:[],explodables:[],motions:[],ports:[],flow:null,section:null,info:{} }; }
// opts.minhHoa=true: kết cấu không có bản vẽ xác nhận, chỉ là cấu tạo minh họa.
export function part(m,name,pos=[0,0,0],parent=m.root,description='',opts={}) {
  const g=new THREE.Group(); g.name=name; g.position.set(...pos); g.userData.part=true; g.userData.description=description;
  if(opts.minhHoa)g.userData.minhHoa=true;
  parent.add(g); m.parts.push(g); return g;
}
export function explode(m,g,offset) { m.explodables.push({ object:g,base:g.position.clone(),offset:new THREE.Vector3(...offset) }); return g; }
export function cover(m,obj) {
  obj.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.side=THREE.DoubleSide;m.covers.push(o);}});return obj;
}
// Vỏ kín có độ dày: ở chế độ mặt cắt được cắt thật bằng CSG và tô màu mặt cắt.
export function solid(m,obj) {
  obj.traverse(o=>{if(o.isMesh){o.material=o.material.clone();m.solids.push(o);}});return obj;
}
export function mesh(geo,mat,pos,parent,name='') { const o=new THREE.Mesh(geo,mat);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;o.name=name;parent.add(o);return o; }

// Bộ nhớ đệm hình học trong một lần dựng: bu lông, vòng giống nhau dùng chung một hình học (GLB nhỏ hơn).
let CACHE=new Map();
export function resetGeometryCache(){CACHE=new Map();}
function cached(key,make){let g=CACHE.get(key);if(!g){g=make();CACHE.set(key,g);}return g;}
const k3=v=>v.map(x=>+(+x).toFixed(4)).join(',');

export function box(size,pos,mat,parent,name='') { return mesh(cached('box'+k3(size),()=>new THREE.BoxGeometry(...size)),mat,pos,parent,name); }
export function roundedBoxGeometry(size,radius=.06,seg=6) {
  const r=Math.min(radius,...size.map(v=>v*.45)),g=new THREE.BoxGeometry(...size,seg,seg,seg),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i));const inner=new THREE.Vector3(...v.toArray().map((x,j)=>THREE.MathUtils.clamp(x,-size[j]/2+r,size[j]/2-r)));const n=v.clone().sub(inner);if(n.lengthSq()>0)v.copy(inner).add(n.normalize().multiplyScalar(r));p.setXYZ(i,v.x,v.y,v.z);}
  g.computeVertexNormals();return g;
}
export function roundedBox(size,pos,mat,parent,radius=.06,name='') { return mesh(roundedBoxGeometry(size,radius),mat,pos,parent,name); }
export function cyl(r,h,pos,mat,parent,axis='y',segments=48,r2=r) {
  const o=mesh(cached(`cyl${k3([r,h,r2])}/${segments}`,()=>new THREE.CylinderGeometry(r,r2,h,segments)),mat,pos,parent);
  if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;
}
export function ball(r,pos,mat,parent) { return mesh(cached('ball'+r,()=>new THREE.SphereGeometry(r,20,14)),mat,pos,parent); }
export function rod(a,b,r,mat,parent,segments=16) {
  const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),v=q.clone().sub(p);
  if(v.length()<1e-7)throw new Error('Đoạn trụ cần có chiều dài');
  const o=cyl(r,v.length(),p.add(q).multiplyScalar(.5).toArray(),mat,parent,'y',segments);o.quaternion.setFromUnitVectors(UP,v.normalize());return o;
}
export function ringGeometry(ro,ri,h,segments=64) {
  return cached(`ring${k3([ro,ri,h])}/${segments}`,()=>{
    const s=new THREE.Shape();s.absarc(0,0,ro,0,Math.PI*2,false);
    const hole=new THREE.Path();hole.absarc(0,0,ri,0,Math.PI*2,true);s.holes.push(hole);
    const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:segments});geo.translate(0,0,-h/2);return geo;});
}
export function ring(ro,ri,h,pos,mat,parent,axis='y',segments=64) {
  const o=mesh(ringGeometry(ro,ri,h,segments),mat,pos,parent);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=-Math.PI/2;return o;
}
export function torus(r,t,pos,mat,parent,axis='y') {
  const o=mesh(cached('torus'+k3([r,t]),()=>new THREE.TorusGeometry(r,t,8,64)),mat,pos,parent);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=Math.PI/2;return o;
}
export function tube(r,thickness,h,pos,mat,parent,axis='y') { return ring(r,r-thickness,h,pos,mat,parent,axis,32); }
// axis là hướng mũ bu lông: 'x','y','z' hoặc '-x','-y','-z'.
export function bolt(pos,parent,scale=.075,axis='y',long=.18) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);
  cyl(scale*.53,long,[0,-long/2,0],M.steel,g,'y',12);
  ring(scale*1.25,scale*.62,scale*.18,[0,.005,0],M.bright,g,'y',12);
  cyl(scale,scale*.65,[0,scale*.35,0],M.bright,g,'y',6);
  cyl(scale*.38,.003,[0,scale*.685,0],M.dark,g,'y',6);
  orientUp(g,axis);return g;
}
function orientUp(g,axis){({x:()=>g.rotation.z=-Math.PI/2,z:()=>g.rotation.x=Math.PI/2,'-x':()=>g.rotation.z=Math.PI/2,'-z':()=>g.rotation.x=-Math.PI/2,'-y':()=>g.rotation.x=Math.PI})[axis]?.();}
export function boltCircle(parent,axis,at,r,n=12,size=.065,phase=0) {
  const dir=axis.replace('-','');
  for(let i=0;i<n;i++){const a=phase+i*Math.PI*2/n;
    const pos=dir==='x'?[at,Math.cos(a)*r,Math.sin(a)*r]:dir==='y'?[Math.cos(a)*r,at,Math.sin(a)*r]:[Math.cos(a)*r,Math.sin(a)*r,at];
    bolt(pos,parent,size,axis);
  }
}
export function thread(r,length,pos,parent,axis='y',pitch=.08) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);cyl(r,length,[0,0,0],M.steel,g);
  const points=[];const turns=length/pitch;const n=Math.ceil(turns*24);
  for(let i=0;i<=n;i++){const a=i/n*turns*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*r,-length/2+i/n*length,Math.sin(a)*r));}
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),n,.008,4,false),M.bright,[0,0,0],g);
  if(axis==='x')g.rotation.z=-Math.PI/2;if(axis==='z')g.rotation.x=Math.PI/2;return g;
}
export function pipe(coords,r,mat,parent) {
  const pts=coords.map(p=>new THREE.Vector3(...p));const path=new THREE.CurvePath();let prev=pts[0];
  for(let i=1;i<pts.length-1;i++){const c=pts[i];const bend=Math.min(.17,c.distanceTo(pts[i-1])*.3,c.distanceTo(pts[i+1])*.3);
    const a=c.clone().add(pts[i-1].clone().sub(c).normalize().multiplyScalar(bend));
    const b=c.clone().add(pts[i+1].clone().sub(c).normalize().multiplyScalar(bend));
    path.add(new THREE.LineCurve3(prev,a));path.add(new THREE.QuadraticBezierCurve3(a,c,b));prev=b;
  }path.add(new THREE.LineCurve3(prev,pts.at(-1)));
  return mesh(new THREE.TubeGeometry(path,Math.max(24,coords.length*16),r,12,false),mat,[0,0,0],parent);
}
export function dome(r,height,pos,mat,parent,down=false) {
  const points=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI/2;points.push(new THREE.Vector2(Math.sin(a)*r,Math.cos(a)*height));}
  const o=mesh(new THREE.LatheGeometry(points,64),mat,pos,parent);if(down)o.rotation.z=Math.PI;return o;
}
export function gauge(pos,parent,r=.21) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);
  cyl(r,.10,[0,0,0],M.bright,g,'z');cyl(r*.88,.012,[0,0,.058],M.white,g,'z');
  torus(r*.91,.012,[0,0,.069],M.dark,g,'z');
  for(let i=0;i<=24;i++){const a=(-.8+i/24*1.6)*Math.PI;const rr=r*.73;const tick=box([.009,i%3===0?r*.18:r*.09,.005],[Math.sin(a)*rr,-Math.cos(a)*rr,.069],M.dark,g);tick.rotation.z=-a;}
  const needle=box([.012,r*.65,.006],[r*.17,r*.19,.08],M.red,g);needle.rotation.z=-.7;
  ball(r*.06,[0,0,.082],M.dark,g);rod([0,-r-.15,0],[0,-r+.02,0],r*.13,M.brass,g);return g;
}
export function flange(pos,parent,axis='x',r=.25) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);ring(r,r*.53,.07,[0,0,0],M.steel,g,axis,24);boltCircle(g,axis,.045,r*.79,6,r*.12);return g;
}

// ---------- Khối tròn xoay, ren, rãnh then ----------

// Xoay hình học hoặc đối tượng dựng quanh trục X sang trục khác (giữ chiều quay).
export function orientX(g,axis) {
  if(axis==='y')g.rotateZ(Math.PI/2);else if(axis==='z')g.rotateY(-Math.PI/2);
  else if(axis==='-x')g.rotateZ(Math.PI);else if(axis==='-y')g.rotateZ(-Math.PI/2);else if(axis==='-z')g.rotateY(Math.PI/2);
  return g;
}
export function orientObject(o,axis) {
  if(axis==='y')o.rotation.z=Math.PI/2;else if(axis==='z')o.rotation.y=-Math.PI/2;
  else if(axis==='-x')o.rotation.z=Math.PI;else if(axis==='-y')o.rotation.z=-Math.PI/2;else if(axis==='-z')o.rotation.y=Math.PI/2;
  return o;
}
// Khối tròn xoay quanh trục X từ biên dạng kín [[x,r],...]: chạm trục (r=0) ở hai đầu cho khối đặc,
// hoặc một vòng kín cho khối rỗng. Chiều biên dạng tự sửa; góc gãy lớn hơn `smooth` độ giữ cạnh sắc.
export function revolveGeometry(profile,{segments=64,axis='x',smooth=40}={}) {
  let pts=profile.map(([x,r])=>[x,Math.max(0,r)]);
  let area=0;for(let i=0;i<pts.length;i++){const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%pts.length];area+=x1*y2-x2*y1;}if(area>0)pts=pts.reverse();
  const a0=pts[0],b0=pts.at(-1);if(Math.hypot(a0[0]-b0[0],a0[1]-b0[1])>1e-9&&(a0[1]>1e-9||b0[1]>1e-9))pts.push([...a0]);
  const segs=[];for(let i=0;i<pts.length-1;i++){const dx=pts[i+1][0]-pts[i][0],dr=pts[i+1][1]-pts[i][1],l=Math.hypot(dx,dr);if(l>1e-9)segs.push({a:pts[i],b:pts[i+1],t:[dx/l,dr/l]});}
  const cos=Math.cos(smooth*Math.PI/180),runs=[];let run=[segs[0]];
  for(let i=1;i<segs.length;i++){const p=segs[i-1].t,q=segs[i].t;if(p[0]*q[0]+p[1]*q[1]<cos){runs.push(run);run=[];}run.push(segs[i]);}runs.push(run);
  const pos=[],nor=[],idx=[],cs=[],sn=[];for(let j=0;j<=segments;j++){const a=j/segments*Math.PI*2;cs.push(Math.cos(a));sn.push(Math.sin(a));}
  for(const r of runs){
    const P=[r[0].a,...r.map(s=>s.b)],base=pos.length/3;
    for(let i=0;i<P.length;i++){const t0=r[Math.max(0,i-1)].t,t1=r[Math.min(r.length-1,i)].t;let tx=t0[0]+t1[0],tr=t0[1]+t1[1];const l=Math.hypot(tx,tr)||1;tx/=l;tr/=l;
      for(let j=0;j<=segments;j++){pos.push(P[i][0],P[i][1]*cs[j],P[i][1]*sn[j]);nor.push(-tr,tx*cs[j],tx*sn[j]);}}
    for(let i=0;i<P.length-1;i++)for(let j=0;j<segments;j++){const a=base+i*(segments+1)+j,b=a+1,c=a+segments+1,d=c+1;
      if(P[i][1]>1e-9)idx.push(a,b,c);if(P[i+1][1]>1e-9)idx.push(b,d,c);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setIndex(idx);
  return orientX(g,axis);
}
export function revolve(profile,pos,mat,parent,axis='x',opts={}) { return mesh(revolveGeometry(profile,{...opts,axis}),mat,pos,parent,opts.name??''); }

// Ren tam giác xoắn thật quanh trục X: r là bán kính đỉnh ren; lưới bám theo đường xoắn nên đỉnh và chân ren sắc nét.
export function threadGeometry({r=.2,depth=.02,pitch=.05,length=.2,segments=48,perPitch=8,axis='x'}={}) {
  const turns=Math.ceil(length/pitch)+2,nu=turns*perPitch,pos=[],idx=[];
  for(let i=0;i<=nu;i++){const u=-length/2-pitch+i/perPitch*pitch,f=(i%perPitch)/perPitch,rr=r-depth*Math.abs(2*f-1);
    for(let j=0;j<=segments;j++){const a=j/segments*Math.PI*2,x=THREE.MathUtils.clamp(u+pitch*j/segments,-length/2,length/2);pos.push(x,rr*Math.cos(a),rr*Math.sin(a));
      if(i<nu&&j<segments){const k=i*(segments+1)+j;idx.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return orientX(g,axis);
}
// Đoạn trục có rãnh then hở đầu, dài theo +X từ 0 đến length; rãnh nằm phía +Y.
export function keyedShaftGeometry({r=.2,length=.5,keyWidth=.06,keyDepth=.035,segments=48}={}) {
  const s=new THREE.Shape(),hw=keyWidth/2,yt=Math.sqrt(r*r-hw*hw),a0=Math.atan2(yt,hw);
  s.moveTo(-hw,yt);s.absarc(0,0,r,Math.PI-a0,a0+Math.PI*2,false);s.lineTo(hw,r-keyDepth);s.lineTo(-hw,r-keyDepth);s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:length,bevelEnabled:false,curveSegments:segments});g.rotateY(Math.PI/2);return g;
}
// Then bằng đầu tròn: dài theo X, cao theo Y, tâm tại gốc.
export function keyGeometry(w=.06,h=.06,len=.4) {
  const s=new THREE.Shape(),r=w/2,l=len/2-r;s.moveTo(-l,-r);s.lineTo(l,-r);s.absarc(l,0,r,-Math.PI/2,Math.PI/2,false);s.lineTo(-l,r);s.absarc(-l,0,r,Math.PI/2,Math.PI*1.5,false);
  const g=new THREE.ExtrudeGeometry(s,{depth:h-.008,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelOffset:-.004,bevelSegments:1,curveSegments:10});g.translate(0,0,-(h-.008)/2);g.rotateX(-Math.PI/2);return g;
}

// ---------- Chi tiết tiêu chuẩn: ổ lăn, phớt, vòng giữ, đai ốc khóa ----------
// Các hàm dựng quanh trục X rồi xoay cả nhóm theo `axis`.

// Ổ lăn: 'bi' (ổ bi đỡ), 'bi-chan' (ổ bi đỡ chặn), 'dua' (ổ đũa trụ). ri/ro: bán kính lỗ và vòng ngoài; w: bề rộng.
export function bearing(parent,{type='bi',ri,ro,w},pos=[0,0,0],axis='x',name='Ổ lăn') {
  const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);
  const h=ro-ri,t=h*.27,pr=(ri+ro)/2,e=h*.44,hw=w/2;
  const groove=(rBase,sign)=>{const out=[];for(let i=0;i<=8;i++){const a=-Math.PI/2+i/8*Math.PI;out.push([Math.sin(a)*e*.42,rBase+sign*Math.cos(a)*e*.18]);}return out;};
  const lip=type==='bi-chan'?t*.45:0;
  const outerIn=type==='dua'?[[hw,ro-t-h*.1],[w*.32,ro-t-h*.1],[w*.32,ro-t],[-w*.32,ro-t],[-w*.32,ro-t-h*.1],[-hw,ro-t-h*.1]]
    :[[hw,ro-t+lip],...groove(ro-t,1).reverse(),[-hw,ro-t]];
  revolve([[-hw,ro],[hw,ro],...outerIn],[0,0,0],M.bearing,g,'x',{segments:48});
  const innerOut=type==='dua'?[[-hw,ri+t],[hw,ri+t]]:[[-hw,ri+t],...groove(ri+t,-1),[hw,ri+t]];
  revolve([[-hw,ri],...innerOut,[hw,ri]],[0,0,0],M.bearing,g,'x',{segments:48});
  const n=Math.max(6,Math.floor(Math.PI*2*pr/(e*1.45))),list=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2;list.push({p:[0,Math.cos(a)*pr,Math.sin(a)*pr]});}
  const elem=type==='dua'?cached('roll'+k3([e,w]),()=>new THREE.CylinderGeometry(e/2,e/2,w*.6,16).rotateZ(Math.PI/2)):cached('bb'+k3([e]),()=>new THREE.SphereGeometry(e/2,16,10));
  instances(elem,M.bright,list,g,type==='dua'?'Con lăn đũa':'Viên bi');
  revolve([[-w*.36,pr-e*.2],[-w*.36,pr+e*.2],[w*.36,pr+e*.2],[w*.36,pr-e*.2]],[0,0,0],M.cage,g,'x',{segments:48});
  return orientObject(g,axis);
}
// Phớt môi: thân cao su có môi làm kín ôm trục và lò xo vòng.
export function lipSeal(parent,{ri,ro,w},pos=[0,0,0],axis='x',name='Phớt môi') {
  const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);const h=ro-ri;
  revolve([[-w/2,ro],[w/2,ro],[w/2,ro-h*.3],[-w*.25,ro-h*.3],[-w*.05,ri+h*.18],[w*.32,ri],[w/2,ri+h*.05],[w/2,ri+h*.35],[-w*.3,ri+h*.55],[-w/2,ri+h*.55]],[0,0,0],M.seal,g,'x',{segments:56});
  const sp=mesh(cached('spring'+k3([ri,h]),()=>new THREE.TorusGeometry(ri+h*.33,h*.07,8,56)),M.bright,[-w*.05,0,0],g);sp.rotation.y=Math.PI/2;
  return orientObject(g,axis);
}
// Vòng giữ chữ C cho trục có hai tai lỗ kìm; bề dày theo X.
export function circlipGeometry(ri,ro,th) {
  const s=new THREE.Shape(),gap=.22,d=.34,e=(ro-ri)*.9,a1=Math.PI/2+gap,a2=Math.PI/2-gap,P=(r,a)=>[Math.cos(a)*r,Math.sin(a)*r];
  s.moveTo(...P(ro,a1+d));s.absarc(0,0,ro,a1+d,a2-d+Math.PI*2,false);s.lineTo(...P(ro+e,a2-d));s.lineTo(...P(ro+e,a2));s.lineTo(...P(ri,a2));
  s.absarc(0,0,ri,a2,a1,true);s.lineTo(...P(ro+e,a1));s.lineTo(...P(ro+e,a1+d));s.closePath();
  for(const a of [a2-d/2,a1+d/2]){const hole=new THREE.Path(),c=P((ri+ro+e)/2+e*.15,a);hole.absarc(c[0],c[1],Math.min(d*ro,(ro+e-ri))*.22,0,Math.PI*2,true);s.holes.push(hole);}
  const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:40});g.translate(0,0,-th/2);g.rotateY(Math.PI/2);return g;
}
// Đai ốc khóa có bốn rãnh vặn và vòng đệm hãm.
export function lockNut(parent,{ri,ro,w},pos=[0,0,0],axis='x',name='Đai ốc khóa') {
  const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);
  const s=new THREE.Shape(),n=4,sw=.22,rr=ro-(ro-ri)*.3;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,b=a+Math.PI*2/n-sw/2,c=a+Math.PI*2/n+sw/2;s.absarc(0,0,ro,a+sw/2,b,false);s.lineTo(Math.cos(b)*rr,Math.sin(b)*rr);s.lineTo(Math.cos(c)*rr,Math.sin(c)*rr);}
  s.closePath();const hole=new THREE.Path();hole.absarc(0,0,ri,0,Math.PI*2,true);s.holes.push(hole);
  const geo=new THREE.ExtrudeGeometry(s,{depth:w-.012,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelOffset:-.006,bevelSegments:1,curveSegments:16});geo.translate(0,0,-(w-.012)/2);geo.rotateY(Math.PI/2);
  mesh(geo,M.steel,[0,0,0],g);
  revolve([[-.006,ri*.99],[.006,ri*.99],[.006,ro*.9],[-.006,ro*.9]],[w/2+.008,0,0],M.bright,g,'x',{segments:48});
  return orientObject(g,axis);
}

// ---------- Khối đặc bằng CSG (three-bvh-csg) ----------
const brushOf=g=>{const b=new Brush(g);b.updateMatrixWorld();return b;};
// Hợp các khối `add`, trừ các khối `sub`. Hình học đầu vào phải kín và đã đặt đúng vị trí; sẽ bị giải phóng sau khi dùng.
export function csgGeometry(add,sub=[]) {
  const ev=new Evaluator();ev.attributes=['position','normal'];ev.useGroups=false;
  let acc=brushOf(add[0]);
  for(const g of add.slice(1))acc=ev.evaluate(acc,brushOf(g),ADDITION);
  if(sub.length){let hole=brushOf(sub[0]);for(const g of sub.slice(1))hole=ev.evaluate(hole,brushOf(g),ADDITION);acc=ev.evaluate(acc,hole,SUBTRACTION);}
  for(const g of [...add,...sub])g.dispose();
  const out=new THREE.BufferGeometry();for(const k of ['position','normal'])out.setAttribute(k,new THREE.Float32BufferAttribute(Array.from(acc.geometry.attributes[k].array),3));
  if(acc.geometry.index)out.setIndex(Array.from(acc.geometry.index.array));return out;
}
// Hình học đặt sẵn vị trí để đưa vào CSG.
export const placed=(g,pos=[0,0,0],rot=null)=>{if(rot)g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rot)));g.translate(...pos);return g;};
export const boxG=(size,pos)=>placed(new THREE.BoxGeometry(...size),pos);
export const rboxG=(size,pos,r=.06)=>placed(roundedBoxGeometry(size,r,5),pos);
export const cylG=(r,h,pos,axis='y',seg=48,r2=r)=>{const g=new THREE.CylinderGeometry(r,r2,h,seg);if(axis==='x')g.rotateZ(-Math.PI/2);if(axis==='z')g.rotateX(Math.PI/2);return placed(g,pos);};
export const revG=(profile,pos,axis='x',seg=64)=>placed(revolveGeometry(profile,{axis,segments:seg}),pos);
// Cắt một mesh kín bằng hộp (tọa độ mô hình). Trả về hình học có hai nhóm: bề mặt cũ và mặt cắt (M.cut).
export function sectionGeometry(meshObj,cutBox,rootInverse) {
  const ev=new Evaluator();ev.attributes=['position','normal'];ev.useGroups=true;
  const a=new Brush(meshObj.geometry,meshObj.material);a.matrixWorld.multiplyMatrices(rootInverse,meshObj.matrixWorld);
  const size=cutBox.getSize(new THREE.Vector3()),c=cutBox.getCenter(new THREE.Vector3());
  const b=new Brush(new THREE.BoxGeometry(size.x,size.y,size.z),M.cut);b.position.copy(c);b.updateMatrixWorld();
  const r=ev.evaluate(a,b,SUBTRACTION);b.geometry.dispose();return {geometry:r.geometry,material:r.material};
}

// ---------- Cổng nối để ghép hệ thống sau này ----------
const PORT_COLORS={khi:0x2f8fd0,nuoc:0x18aeb5,'co-khi':0xe0902f,dien:0xa65bd0};
// Cổng nối là nút rỗng tên "Cổng: …", được ghi vào GLB; trục +Z cục bộ của nút là hướng nối ra ngoài.
export function port(m,name,pos,dir,{kind='khi',size=.1,parent=m.root,note=''}={}) {
  const g=new THREE.Group();g.name='Cổng: '+name;g.position.set(...pos);
  const d=new THREE.Vector3(...dir).normalize();g.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d);
  g.userData.port={name,kind,size,note,dir:d.toArray().map(v=>+v.toFixed(4))};parent.add(g);m.ports.push(g);
  const mk=new THREE.Group();mk.name='Dấu cổng';mk.userData.noExport=true;mk.userData.portMarker=true;mk.visible=false;g.add(mk);
  const mat=new THREE.MeshBasicMaterial({color:PORT_COLORS[kind]??0x888888,depthTest:false,transparent:true,opacity:.9});
  // vòng bằng cỡ cổng, mũi tên cỡ cố định chỉ hướng nối
  const rr=Math.max(.06,size)*.9,a=Math.min(.3,Math.max(.14,size*.8));
  for(const geo of [new THREE.TorusGeometry(rr,Math.min(.018,rr*.12),6,48),new THREE.ConeGeometry(a*.3,a*.55,16).rotateX(Math.PI/2).translate(0,0,a*1.05),new THREE.CylinderGeometry(a*.06,a*.06,a*.8,8).rotateX(Math.PI/2).translate(0,0,a*.4)]){
    const o=new THREE.Mesh(geo,mat);o.renderOrder=10;mk.add(o);}
  return g;
}

// ---------- Trục vít đơn và bánh sao: mô hình động học lý tưởng ----------
// Tham số mặc định của cặp một trục vít – hai bánh sao. Đơn vị quy ước của mô hình, không phải mm.
export const ROTOR_DEFAULTS={
  screwRadius:.83,     // R1: bán kính đỉnh trục vít
  grooves:6,           // z1: số rãnh xoắn
  gateTeeth:11,        // z2: số răng mỗi bánh sao
  gateRadius:.83,      // R2: bán kính đỉnh răng bánh sao
  grooveDepth:.33,     // h: chiều sâu rãnh lớn nhất; khoảng cách tâm A = R1 + R2 − h
  toothWidth:.15,      // bề rộng răng tại đỉnh
  toothRootWidth:.19,  // bề rộng răng tại chân
  gateThickness:.075,  // chiều dày đĩa bánh sao
  clearance:.03,       // khe hở mỗi bên rãnh (phóng đại để nhìn thấy; máy thật nhỏ hơn nhiều)
  tipClearance:.02,    // khe hở đỉnh răng với đáy rãnh
  rootGap:.04,         // khe giữa vòng chân răng bánh sao và mặt trụ vít
  screwLength:0,       // chiều dài thân vít; 0 = tự tính theo vùng ăn khớp
  edge:.012,           // vát mép rãnh
  profile:'dong-hoc',  // 'dong-hoc': rãnh sinh từ răng bánh sao; 'minh-hoa': rãnh hình sin như bản trước
  twist:1.9,           // góc xoắn toàn chiều dài (rad), chỉ dùng cho 'minh-hoa'
  meridians:720,       // số mặt cắt kinh tuyến quanh trục vít
};

// Tính đại lượng dẫn xuất. Mô hình: răng bánh sao là dải phẳng mỏng nằm trong mặt phẳng chứa trục vít, cạnh răng thẳng,
// bánh sao quay theo tỷ số z1/z2. Rãnh là vùng răng quét qua trong hệ quay của trục vít.
// Chưa tính chiều dày răng, khe hở thật, biến dạng, sai số chế tạo hay biên dạng cạnh răng hiệu chỉnh.
export function screwKinematics(params={}) {
  const p={...ROTOR_DEFAULTS,...params};
  const R1=+p.screwRadius,R2=+p.gateRadius,h=+p.grooveDepth,A=R1+R2-h,z1=Math.round(p.grooves),z2=Math.round(p.gateTeeth);
  const k=z1/z2,pitch=Math.PI*2/z2,rRoot=A-R1-p.rootGap,sTip=R2+p.tipClearance;
  const hwRoot=p.toothRootWidth/2,hwTip=p.toothWidth/2,errors=[];
  if(!(z1>=2&&z2>=z1+1))errors.push('cần 2 ≤ số rãnh < số răng');
  if(!(h>.05&&h<R2*.7))errors.push('chiều sâu rãnh phải lớn hơn 0,05 và nhỏ hơn 0,7·R2');
  if(!(rRoot>R2*.25))errors.push('vòng chân răng bánh sao quá nhỏ: giảm chiều sâu rãnh hoặc tăng bán kính bánh sao');
  else if(Math.PI*2*rRoot/z2<2*hwRoot+.03)errors.push('răng bánh sao quá rộng ở chân so với bước răng');
  if(!(hwTip>.01&&hwRoot>=hwTip*.5))errors.push('bề rộng răng không hợp lệ');
  if(errors.length)throw new Error('Tham số trục vít không hợp lệ: '+errors.join('; '));
  // nửa bề rộng răng theo khoảng cách s từ tâm bánh sao, tuyến tính giữa chân và đỉnh
  const hwLin=c=>{const b=(hwTip-hwRoot)/(R2-rRoot),a=hwRoot-b*rRoot+c;return {a,b,at:s=>a+b*s};};
  const tooth=hwLin(0),sweep=hwLin(p.clearance),{a,b}=sweep,hT=sweep.at(sTip);
  const P=(s,q,sg,cg)=>[s*sg+q*cg,A-s*cg+q*sg];
  // Mặt cắt rãnh trên mặt phẳng kinh tuyến (x, bán kính) khi răng ở góc g, đo từ hướng −Z về +X.
  function section(g) {
    const sg=Math.sin(g),cg=Math.cos(g),TL=P(sTip,-hT,sg,cg),TR=P(sTip,hT,sg,cg),inL=TL[1]<R1,inR=TR[1]<R1;
    if(!inL&&!inR)return null;
    const sL=Math.min(sTip,Math.max(rRoot,(A-R1-a*sg)/(cg+b*sg))),sR=Math.min(sTip,Math.max(rRoot,(A-R1+a*sg)/(cg-b*sg)));
    const Lt=P(sL,-sweep.at(sL),sg,cg),Rt=P(sR,sweep.at(sR),sg,cg);Lt[1]=Rt[1]=R1;
    if(inL&&inR)return [Lt,TL,TR,Rt];
    const u=(R1-TL[1])/(TR[1]-TL[1]),X=[TL[0]+u*(TR[0]-TL[0]),R1];
    return inL?[Lt,TL,X,X]:[X,X,TR,Rt];
  }
  // góc răng lớn nhất còn cắt vào trụ vít
  let lo=0,hi=Math.PI/2;for(let i=0;i<60;i++){const m=(lo+hi)/2;(A-sTip*Math.cos(m)-hT*Math.sin(m)<R1)?lo=m:hi=m;}
  const gMax=lo,xe=sTip*Math.sin(gMax)-hT*Math.cos(gMax);
  let xExt=xe;for(let i=0;i<=400;i++){const s=section(-gMax+i/400*2*gMax);if(s)for(const q of s)xExt=Math.max(xExt,Math.abs(q[0]));}
  const sc=R1/.83,minL=2*(xExt+.04*sc+p.edge*1.5);
  const L=p.screwLength>0?Math.max(+p.screwLength,minL):minL;
  return {p,R1,R2,A,h,z1,z2,k,pitch,rRoot,sTip,gMax,xe,xExt,L,sc,section,tooth,sweep,
    lengthClamped:p.screwLength>0&&p.screwLength<minL,wrapDeg:2*gMax/k*180/Math.PI,
    // góc răng j của bánh sao A khi kinh tuyến alpha của trục vít đi qua mặt phẳng bánh sao (trục vít ở góc 0)
    toothAngle:(alpha,j)=>k*(Math.PI/2-alpha)+j*pitch};
}

// Lưới thân trục vít: mỗi kinh tuyến là một biên dạng có cùng số điểm; rãnh vắng mặt thu về điểm tiếp xúc.
// Mỗi đoạn biên dạng có đỉnh riêng nên cạnh rãnh sắc, còn theo chiều quay mặt vẫn trơn.
export function singleScrewGeometry(kin,{rHub,keepProfiles=false}={}) {
  const {R1,L,k,pitch,gMax,xe,section,p}=kin,L2=L/2,ee=p.edge*1.5,hub=rHub??R1*.36,N=Math.max(90,Math.round(p.meridians));
  const jMin=Math.floor((-gMax-k*Math.PI/2)/pitch)-1,jMax=Math.ceil((gMax-k*Math.PI/2+2*Math.PI*k)/pitch)+1;
  const dist=(A,B)=>Math.hypot(B[0]-A[0],B[1]-A[1]);
  const lerpTo=(A,B,d)=>{const l=dist(A,B);return l<1e-12?[...A]:[A[0]+(B[0]-A[0])*d/l,A[1]+(B[1]-A[1])*d/l];};
  function profile(alpha) {
    const out=[[-L2,hub],[-L2,R1-ee],[-L2+ee,R1]];
    for(let j=jMin;j<=jMax;j++){const g=kin.toothAngle(alpha,j),s=g>-gMax&&g<gMax?section(g):null;
      if(!s){const e=[g<0?-xe:xe,R1];out.push(e,e,e,e,e,e);continue;}
      const [Lt,TL,TR,Rt]=s,cl=Math.min(p.edge,.35*dist(Lt,TL)),cr=Math.min(p.edge,.35*dist(Rt,TR));
      out.push([Lt[0]-cl,R1],lerpTo(Lt,TL,cl),TL,TR,lerpTo(Rt,TR,cr),[Rt[0]+cr,R1]);}
    out.push([L2-ee,R1],[L2,R1-ee],[L2,hub]);return out;
  }
  const profiles=[];for(let i=0;i<=N;i++)profiles.push(profile(i/N*Math.PI*2));
  const n=profiles[0].length,pos=[],idx=[],v=new THREE.Vector3(),w=new THREE.Vector3();
  const P3=(pt,a)=>[pt[0],pt[1]*Math.cos(a),pt[1]*Math.sin(a)];
  const area=(A,B,C)=>{v.set(B[0]-A[0],B[1]-A[1],B[2]-A[2]);w.set(C[0]-A[0],C[1]-A[1],C[2]-A[2]);return v.cross(w).lengthSq();};
  for(let s=0;s<n-1;s++){
    const keep=[];let any=false;
    for(let i=0;i<N;i++){const a0=i/N*Math.PI*2,a1=(i+1)/N*Math.PI*2,A=P3(profiles[i][s],a0),B=P3(profiles[i+1][s],a1),C=P3(profiles[i][s+1],a0),D=P3(profiles[i+1][s+1],a1);
      keep.push([area(A,B,C)>1e-16,area(B,D,C)>1e-16]);any||=keep[i][0]||keep[i][1];}
    if(!any)continue;
    const base=pos.length/3;
    for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;pos.push(...P3(profiles[i][s],a),...P3(profiles[i][s+1],a));}
    for(let i=0;i<N;i++){const A=base+i*2,C=A+1,B=A+2,D=A+3;if(keep[i][0])idx.push(A,B,C);if(keep[i][1])idx.push(B,D,C);}
  }
  // bỏ đỉnh không dùng
  const map=new Int32Array(pos.length/3).fill(-1),np=[];let c=0;
  const ni=idx.map(i=>{if(map[i]<0){map[i]=c++;np.push(pos[i*3],pos[i*3+1],pos[i*3+2]);}return map[i];});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(np,3));g.setIndex(ni);g.computeVertexNormals();
  if(keepProfiles)Object.defineProperty(g,'profiles',{value:profiles});return g;
}

// Điểm (hệ tọa độ quay theo trục vít) có nằm trong vật liệu thân vít không. Dùng để kiểm tra va chạm.
export function insideScrew(kin,x,rho,alpha,rHub) {
  const {R1,L,A,pitch,sTip,sweep,gMax}=kin;if(Math.abs(x)>L/2||rho>R1||rho<(rHub??R1*.36))return false;
  const base=kin.toothAngle(alpha,0);
  for(let j=Math.floor((-gMax-.1-base)/pitch);j<=Math.ceil((gMax+.1-base)/pitch);j++){
    const g=base+j*pitch,sg=Math.sin(g),cg=Math.cos(g),s=x*sg-(rho-A)*cg,q=x*cg+(rho-A)*sg;
    if(s<=sTip&&Math.abs(q)<=sweep.at(s))return false;}
  return true;
}

// Biên dạng phẳng hình sao: cạnh răng thẳng (nửa bề rộng hw(s)), đỉnh cung tròn, chân răng bo cung.
export function starShape({teeth,rRoot,sTip,hw,fillet=.02,hole=.1,boltR=0,bolts=0,boltHole=.018}) {
  const s=new THREE.Shape(),pitch=Math.PI*2/teeth,ang=p=>Math.atan2(p[1],p[0]),list=[];
  for(let j=0;j<teeth;j++){
    const phi=Math.PI/2+j*pitch,D=[Math.cos(phi),Math.sin(phi)],N=[-Math.sin(phi),Math.cos(phi)];
    const pt=(r,q)=>[r*D[0]+q*N[0],r*D[1]+q*N[1]];
    const sK=Math.sqrt(Math.max(1e-6,rRoot*rRoot-hw(rRoot)**2)),sE=Math.sqrt(sTip*sTip-hw(sTip)**2);
    const Kr=pt(sK,-hw(sK)),Kl=pt(sK,hw(sK)),Cr=pt(sE,-hw(sE)),Cl=pt(sE,hw(sE));
    const unit=(A,B)=>{const d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d);return [d[0]/l,d[1]/l];},ur=unit(Kr,Cr),ul=unit(Kl,Cl);
    list.push({Kr,Kl,Cr,Cl,a1:ang(Kr)-fillet/rRoot,a4:ang(Kl)+fillet/rRoot,F2:[Kr[0]+ur[0]*fillet,Kr[1]+ur[1]*fillet],F3:[Kl[0]+ul[0]*fillet,Kl[1]+ul[1]*fillet]});
  }
  s.moveTo(Math.cos(list[0].a1)*rRoot,Math.sin(list[0].a1)*rRoot);
  list.forEach((t,j)=>{
    s.quadraticCurveTo(...t.Kr,...t.F2);s.lineTo(...t.Cr);s.absarc(0,0,sTip,ang(t.Cr),ang(t.Cl),false);s.lineTo(...t.F3);
    s.quadraticCurveTo(...t.Kl,Math.cos(t.a4)*rRoot,Math.sin(t.a4)*rRoot);s.absarc(0,0,rRoot,t.a4,list[(j+1)%teeth].a1,false);
  });
  if(hole>0){const hp=new THREE.Path();hp.absarc(0,0,hole,0,Math.PI*2,true);s.holes.push(hp);}
  for(let i=0;i<bolts;i++){const a=i/bolts*Math.PI*2+pitch/2,hp=new THREE.Path();hp.absarc(Math.cos(a)*boltR,Math.sin(a)*boltR,boltHole,0,Math.PI*2,true);s.holes.push(hp);}
  return s;
}
// Đĩa hình sao, trục quay Y, bề dày từ −t/2 đến +t/2; răng thứ 0 hướng về −Z.
export function starGeometry(shapeOpts,thickness,bevel=.006) {
  const g=new THREE.ExtrudeGeometry(starShape(shapeOpts),{depth:thickness-2*bevel,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelOffset:-bevel,bevelSegments:1,curveSegments:6});
  g.translate(0,0,-(thickness-2*bevel)/2);g.rotateX(-Math.PI/2);return g;
}

// Hình học trục vít kiểu cũ: bán kính thay đổi tuần hoàn theo góc và chiều dọc trục X.
// Đây là biên dạng trực quan, KHÔNG phải biên dạng bao đã tính cho chế tạo.
export function screwGeometry({radius=.83,length=2.75,grooves=6,depth=.31,twist=1.9,axial=160,radial=240}={}) {
  const p=[],uv=[],idx=[];
  for(let j=0;j<=axial;j++){const t=j/axial,x=(t-.5)*length;
    for(let i=0;i<=radial;i++){const a=i/radial*Math.PI*2;const v=(grooves*(a+twist*(t-.5)))%(2*Math.PI);
      const d=Math.abs(Math.atan2(Math.sin(v),Math.cos(v)))/Math.PI;
      const cut=Math.exp(-Math.pow(d/.55,4));
      const rr=radius-depth*cut;
      p.push(x,rr*Math.cos(a),rr*Math.sin(a));uv.push(t,i/radial);
      if(j<axial&&i<radial){const k=j*(radial+1)+i;idx.push(k,k+1,k+radial+1,k+1,k+radial+2,k+radial+1);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function gateGeometry(teeth=11,ro=.93,rr=.59,thickness=.13) {
  const s=new THREE.Shape();const vertices=[];
  for(let j=0;j<teeth;j++)for(const [u,r] of [[0,rr],[.15,rr],[.27,ro],[.61,ro],[.77,rr]]){
    const a=(j+u)/teeth*Math.PI*2;vertices.push([Math.cos(a)*r,Math.sin(a)*r]);
  }s.moveTo(...vertices[0]);vertices.slice(1).forEach(p=>s.lineTo(...p));s.closePath();
  const hole=new THREE.Path();hole.absarc(0,0,.105,0,2*Math.PI,true);s.holes.push(hole);
  const g=new THREE.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:true,bevelSegments:2,bevelSize:.012,bevelThickness:.012,curveSegments:12});
  g.translate(0,0,-thickness/2);g.rotateX(-Math.PI/2);return g;
}
export function pleats(radius,inner,height,count=80,axis='y') {
  const p=[],idx=[];const n=count*2;
  for(let j=0;j<2;j++)for(let i=0;i<=n;i++){const a=i/n*2*Math.PI,r=i%2?radius:inner;p.push(Math.cos(a)*r,(j-.5)*height,Math.sin(a)*r);}
  for(let i=0;i<n;i++)idx.push(i,i+n+1,i+1,i+1,i+n+1,i+n+2);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();
  if(axis==='x')g.rotateZ(-Math.PI/2);return g;
}
export function instances(geo,material,transforms,parent,name='Chi tiết lặp') {
  const o=new THREE.InstancedMesh(geo,material,transforms.length);o.name=name;const d=new THREE.Object3D();
  transforms.forEach((v,i)=>{d.position.set(...v.p);d.rotation.set(...(v.r??[0,0,0]));d.scale.set(...(v.s??[1,1,1]));d.updateMatrix();o.setMatrixAt(i,d.matrix);});
  o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
export function fan(m,pos,r=1,parent=m.root,name='Quạt') {
  const rotor=part(m,name,pos,parent);cyl(r*.2,.22,[0,0,0],M.steel,rotor);
  for(let i=0;i<7;i++){
    const s=new THREE.Shape();s.moveTo(.13,-.07);s.bezierCurveTo(.42,-.18,.85,-.17,.98,.02);s.bezierCurveTo(.91,.25,.47,.19,.15,.08);s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:1,curveSegments:12});g.rotateX(-Math.PI/2);g.scale(r,1,r);
    const blade=mesh(g,M.dark,[0,0,0],rotor);blade.rotation.y=i/7*Math.PI*2;blade.rotation.z=.09;
  }m.motions.push({object:rotor,axis:'y',ratio:2.8});return rotor;
}
export function fanGuard(pos,r,parent) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);
  for(let i=1;i<=6;i++)torus(r*i/6,.009,[0,0,0],M.steel,g);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;rod([0,0,0],[Math.cos(a)*r,0,Math.sin(a)*r],.009,M.steel,g);}
  return g;
}
