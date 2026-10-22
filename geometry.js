import * as THREE from './vendor/three.module.js';
export { THREE };

// Mọi chi tiết dưới đây là hình học 3D thật, có đỉnh, mặt, pháp tuyến và tên.
export const M = {
  steel: new THREE.MeshStandardMaterial({ color: 0xb4c1ca, metalness: .78, roughness: .3 }),
  casting: new THREE.MeshStandardMaterial({ color: 0x9facb7, metalness: .55, roughness: .56 }),
  bright: new THREE.MeshStandardMaterial({ color: 0xdde5ea, metalness: .9, roughness: .2 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x303d49, metalness: .4, roughness: .45 }),
  gate: new THREE.MeshStandardMaterial({ color: 0x435765, metalness: .2, roughness: .42 }),
  paint: new THREE.MeshStandardMaterial({ color: 0x265870, metalness: .4, roughness: .4 }),
  black: new THREE.MeshStandardMaterial({ color: 0x17212a, metalness: .15, roughness: .6 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x1e272d, metalness: 0, roughness: .85 }),
  paper: new THREE.MeshStandardMaterial({ color: 0xe8d4a4, metalness: 0, roughness: .9 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb69b60, metalness: .72, roughness: .35 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xb97f59, metalness: .75, roughness: .35 }),
  white: new THREE.MeshStandardMaterial({ color: 0xe6ebeb, metalness: .12, roughness: .45 }),
  water: new THREE.MeshStandardMaterial({ color: 0x37a9c1, transparent: true, opacity: .5, depthWrite: false, metalness: .1, roughness: .2 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x91c7d6, transparent: true, opacity: .18, depthWrite: false, side: THREE.DoubleSide, roughness: .15 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x367faa, metalness: .4, roughness: .4 }),
  red: new THREE.MeshStandardMaterial({ color: 0xd96b59, metalness: .25, roughness: .4 }),
  resin: new THREE.MeshStandardMaterial({ color: 0xbaa16f, roughness: .9 }),
};
const UP = new THREE.Vector3(0,1,0);
export function modelBase(id) { const root=new THREE.Group(); root.name=id; return { id,root,parts:[],covers:[],explodables:[],motions:[],flow:null }; }
export function part(m,name,pos=[0,0,0],parent=m.root,description='') {
  const g=new THREE.Group(); g.name=name; g.position.set(...pos); g.userData.part=true; g.userData.description=description;
  parent.add(g); m.parts.push(g); return g;
}
export function explode(m,g,offset) { m.explodables.push({ object:g,base:g.position.clone(),offset:new THREE.Vector3(...offset) }); return g; }
export function cover(m,obj) {
  obj.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.side=THREE.DoubleSide;m.covers.push(o);}});return obj;
}
export function mesh(geo,mat,pos,parent,name='') { const o=new THREE.Mesh(geo,mat);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;o.name=name;parent.add(o);return o; }
export function box(size,pos,mat,parent,name='') { return mesh(new THREE.BoxGeometry(...size),mat,pos,parent,name); }
export function roundedBox(size,pos,mat,parent,radius=.06,name='') {
  const r=Math.min(radius,...size.map(v=>v*.45)),g=new THREE.BoxGeometry(...size,6,6,6),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i));const inner=new THREE.Vector3(...v.toArray().map((x,j)=>THREE.MathUtils.clamp(x,-size[j]/2+r,size[j]/2-r)));const n=v.clone().sub(inner);if(n.lengthSq()>0)v.copy(inner).add(n.normalize().multiplyScalar(r));p.setXYZ(i,v.x,v.y,v.z);}
  g.computeVertexNormals();return mesh(g,mat,pos,parent,name);
}
export function cyl(r,h,pos,mat,parent,axis='y',segments=48,r2=r) {
  const o=mesh(new THREE.CylinderGeometry(r,r2,h,segments),mat,pos,parent);
  if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;
}
export function ball(r,pos,mat,parent) { return mesh(new THREE.SphereGeometry(r,20,14),mat,pos,parent); }
export function rod(a,b,r,mat,parent,segments=16) {
  const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),v=q.clone().sub(p);
  if(v.length()<1e-7)throw new Error('Đoạn trụ cần có chiều dài');
  const o=cyl(r,v.length(),p.add(q).multiplyScalar(.5).toArray(),mat,parent,'y',segments);o.quaternion.setFromUnitVectors(UP,v.normalize());return o;
}
export function ring(ro,ri,h,pos,mat,parent,axis='y',segments=64) {
  const s=new THREE.Shape();s.absarc(0,0,ro,0,Math.PI*2,false);
  const hole=new THREE.Path();hole.absarc(0,0,ri,0,Math.PI*2,true);s.holes.push(hole);
  const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:segments});geo.translate(0,0,-h/2);
  const o=mesh(geo,mat,pos,parent);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=-Math.PI/2;return o;
}
export function torus(r,t,pos,mat,parent,axis='y') {
  const o=mesh(new THREE.TorusGeometry(r,t,8,64),mat,pos,parent);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=Math.PI/2;return o;
}
export function tube(r,thickness,h,pos,mat,parent,axis='y') { return ring(r,r-thickness,h,pos,mat,parent,axis,32); }
export function bolt(pos,parent,scale=.075,axis='y',long=.18) {
  const g=new THREE.Group();g.position.set(...pos);parent.add(g);
  cyl(scale*.53,long,[0,-long/2,0],M.steel,g,'y',12);
  ring(scale*1.25,scale*.62,scale*.18,[0,.005,0],M.bright,g,'y',12);
  cyl(scale,scale*.65,[0,scale*.35,0],M.bright,g,'y',6);
  cyl(scale*.38,.003,[0,scale*.685,0],M.dark,g,'y',6);
  if(axis==='x')g.rotation.z=-Math.PI/2;if(axis==='z')g.rotation.x=Math.PI/2;return g;
}
export function boltCircle(parent,axis,at,r,n=12,size=.065) {
  for(let i=0;i<n;i++){const a=i*Math.PI*2/n;
    const pos=axis==='x'?[at,Math.cos(a)*r,Math.sin(a)*r]:axis==='y'?[Math.cos(a)*r,at,Math.sin(a)*r]:[Math.cos(a)*r,Math.sin(a)*r,at];
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

// Hình học trục vít: bán kính thay đổi tuần hoàn theo góc và chiều dọc trục X.
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
