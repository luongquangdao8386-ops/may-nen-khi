import { THREE,M,modelBase,part,explode,cover,solid,mesh,box,roundedBox,cyl,ball,rod,ring,torus,tube,bolt,boltCircle,thread,pipe,dome,gauge,flange,screwGeometry,gateGeometry,pleats,instances,fan,fanGuard,
 revolve,revolveGeometry,threadGeometry,keyedShaftGeometry,keyGeometry,bearing,lipSeal,circlipGeometry,lockNut,csgGeometry,placed,boxG,rboxG,cylG,revG,port,orientObject,
 screwKinematics,singleScrewGeometry,starGeometry,resetGeometryCache,sectionGeometry } from './geometry.js';
import { ROTOR_DEFAULTS } from './geometry.js';
export { ROTOR_DEFAULTS };

export const REFERENCES={H1:'Tổng thể máy',H2:'Mặt cắt đầu nén',H3:'Trục vít và hai bánh sao',H4:'Tuyến khí / đầu nén',H5:'Két gió và vòng nước',H6:'Van / bộ chia; sơ đồ giải nhiệt nước',H7:'Nước bù / cảm biến / van',H8:'Tháo lọc khí',H9:'Tháo lọc nước nhỏ',H10:'Lọc nước tổ hợp'};
export const CATALOG=[
 {id:'rotor',name:'Trục vít · hai bánh sao',group:'Đầu nén',refs:['H3','H2'],tag:'01',params:'rotor',note:'1 trục vít, 2 bánh sao trên trục vuông góc. Rãnh sinh từ chuyển động của răng bánh sao (mô hình động học lý tưởng), chưa phải biên dạng bao chế tạo.',detail:'Mỗi rãnh là vùng răng bánh sao quét qua khi trục vít quay, với tỷ số số rãnh/số răng. Răng coi là dải phẳng cạnh thẳng; khe hở được phóng đại. Đổi số rãnh, số răng, bán kính, chiều sâu rãnh ở bảng Thông số. Góc xoắn là đại lượng dẫn xuất, chỉ đặt tay ở kiểu biên dạng minh họa.'},
 {id:'airend',name:'Đầu nén cắt mở',group:'Đầu nén',refs:['H2','H3','H4'],tag:'02',params:'rotor',note:'Vỏ đúc rỗng có độ dày, hai khoang bánh sao, nắp hông, nắp ổ, ổ đỡ, phớt, chuông nối động cơ, cửa hút trên và cửa xả dưới.',detail:'Mặt cắt cắt thật vỏ đúc và nắp (mặt cắt tô màu cam). Tách cụm dịch nắp, ổ đỡ, bánh sao theo hướng tháo lắp. Ổ lăn, phớt, vòi phun và giá đỡ bánh sao là cấu tạo minh họa vì bản vẽ không ghi loại và kích thước.'},
 {id:'motor',name:'Động cơ · khớp nối',group:'Truyền động',refs:['H1','H4'],tag:'03',note:'Thân gang có gân, nắp đầu mặt bích, chân đế, hộp đấu điện và đầu cáp, nắp quạt có lưới, khớp nối vấu hai nửa với đệm đàn hồi và nắp che tháo được.',detail:'Mặt bích và đầu trục khớp với chuông nối của cụm đầu nén để ghép sau. Mặt cắt cho thấy stato, roto, ổ bi và quạt (cấu tạo minh họa). Tỷ lệ ước lượng từ H1/H4.'},
 {id:'separator',name:'Bình tách khí–nước',group:'Nước & bình',refs:['H1','H4','H6','H7'],tag:'04',note:'Bình tách trong máy (khác bình tích áp bên ngoài): vỏ rỗng hai đáy elip, chân đỡ, cổ nối có mặt bích, van an toàn, đồng hồ, công tắc mức, kính mức, van xả đáy, cửa nước ra két và nước bù.',detail:'Mặt cắt cắt thật vỏ và chân bình. Vách hướng dòng, vách ngăn ngang, lưới tách giọt, tấm chống xoáy và que dò mức là cấu tạo minh họa vì bản vẽ không có mặt cắt bình; vị trí cổ nối và mực nước là ước lượng.'},
 {id:'cooler',name:'Két nóc · hai quạt',group:'Giải nhiệt',refs:['H1','H5'],tag:'05',params:'cooler',note:'Két đặt trên nóc, hai quạt bên dưới (H1/H5). Chiều gió là tham số đảo được; mặc định từ dưới lên là giả định.',detail:'H1 và H5 không có mũi tên chiều gió nên chưa xác định được. Bấm “Đảo chiều gió” hoặc đổi tham số. Đây là két nước giải nhiệt bằng quạt; không thêm bộ trao đổi nhiệt dạng tấm của phương án giải nhiệt nước ở H6.'},
 {id:'air-filter',name:'Lọc khí đầu hút',group:'Bộ lọc',refs:['H8','H4'],tag:'06',note:'Có vỏ, lõi xếp nếp, nắp, gioăng, trục giữ và đai ốc tai.',detail:'Mặt cắt chỉ cắt vỏ; lõi vẫn nhìn được nguyên vẹn. Tách cụm để xem trình tự các chi tiết.'},
 {id:'water-filter',name:'Lọc nước nhỏ',group:'Bộ lọc',refs:['H9','H5'],tag:'07',note:'Đầu lọc cố định, cốc tháo xuống, lõi và trục giữ tách riêng.',detail:'Phương án lọc mặc định phù hợp hình tổng thể H1/H5. Thông số kích thước là ước lượng.'},
 {id:'combined-filter',name:'Lọc nước tổ hợp',group:'Bộ lọc',refs:['H10'],tag:'08',note:'Nắp bắt bu lông, đĩa ép, đai ốc, lõi dài và đế giữ.',detail:'Một phương án tham khảo riêng; không mặc định lắp nối tiếp với lọc nước nhỏ. Mặt cắt cho thấy lõi và vỏ rỗng.'},
 {id:'softener',name:'Nước bù · làm mềm',group:'Nước & bình',refs:['H7'],tag:'09',note:'Bình làm mềm, đầu điều khiển, van điện từ, van tay và lọc Y.',detail:'Đường ống được giản lược để quan sát từng cụm; không phải sơ đồ đấu nối xác nhận của nhà sản xuất.'},
 {id:'inlet',name:'Van hút khí',group:'Van & bộ chia',refs:['H4','H7'],tag:'10',note:'Thân van, mặt bích, đĩa van và cơ cấu chấp hành.',detail:'Hình ngoài bám theo ảnh; cơ cấu bên trong minh họa. Nhấn Chạy để quan sát đĩa van.'},
 {id:'minimum',name:'Van áp suất tối thiểu',group:'Van & bộ chia',refs:['H1','H4'],tag:'11',note:'Thân van, nắp lò xo, cửa ra và đầu lắp đồng hồ.',detail:'Mặt cắt cho thấy lò xo và đĩa van minh họa. Không đưa ra áp suất chỉnh thực tế.'},
 {id:'check',name:'Van một chiều',group:'Van & bộ chia',refs:['H4','H6'],tag:'12',note:'Mặt bích, thân, đĩa và lò xo hồi.',detail:'Trạng thái đĩa mở/đóng là hoạt ảnh giáo dục; kích thước và kết cấu trong chưa có bản vẽ chế tạo.'},
 {id:'water-valve',name:'Van ngắt nước',group:'Van & bộ chia',refs:['H6','H7'],tag:'13',note:'Cuộn điện, thân van, đầu nối và ty van.',detail:'Cụm mô hình tham chiếu hình ngoài. Hoạt ảnh ty van cho thấy chuyển động tịnh tiến.'},
 {id:'distributor',name:'Bộ chia nước',group:'Van & bộ chia',refs:['H5','H6'],tag:'14',note:'Thân chia nhỏ, đầu cấp và các nhánh ra.',detail:'Số cổng được đặt để minh họa; cần đối chiếu máy thật trước khi dùng làm sơ đồ lắp.'},
 {id:'chassis',name:'Khung · tủ điện',group:'Khung & điện',refs:['H1'],tag:'15',note:'Bệ máy, cột, dầm nóc, tủ điện và bảng điều khiển.',detail:'Bộ khung giúp xem tương quan vị trí; chưa phải mô hình lắp toàn bộ máy. Màn hình là hình học đơn giản, không ảnh nền.'},
 {id:'receiver',name:'Bình tích áp khí nén',group:'Thiết bị ngoài',refs:[],tag:'16',note:'Mẫu tổng quát; bộ ảnh chưa có bản vẽ riêng của bình này.',detail:'Bình rỗng có đồng hồ, van an toàn và xả đáy; không có túi khí thủy lực. Tỷ lệ và vị trí phụ kiện là giả định.'},
 {id:'dryer',name:'Máy sấy lạnh',group:'Thiết bị ngoài',refs:[],tag:'17',note:'Mẫu cấu tạo tổng quát; gồm máy nén lạnh, dàn ngưng, quạt và trao đổi nhiệt.',detail:'Ẩn vỏ để xem cơ cấu. Đây là mô hình bộ phận, chưa mô phỏng đầy đủ nhiệt động và môi chất.'},
 {id:'desiccant',name:'Sấy hấp phụ hai tháp',group:'Thiết bị ngoài',refs:[],tag:'18',note:'Hai tháp, vật liệu hút ẩm, van, đường tái sinh và bộ giảm thanh.',detail:'Mặt cắt cho thấy lớp hạt. Hình học tổng quát; chưa phải sơ đồ van của một model xác định.'},
];

// Thông số chỉnh được trong trình xem. Khóa trùng tên trong ROTOR_DEFAULTS (geometry.js) hoặc tham số của cụm.
export const PARAM_SPECS={
 rotor:[
  {key:'grooves',label:'Số rãnh trục vít',type:'int',min:3,max:8},
  {key:'gateTeeth',label:'Số răng bánh sao',type:'int',min:7,max:15},
  {key:'screwRadius',label:'Bán kính trục vít',min:.6,max:1.1,step:.01},
  {key:'gateRadius',label:'Bán kính bánh sao',min:.6,max:1.1,step:.01},
  {key:'grooveDepth',label:'Chiều sâu rãnh',min:.15,max:.5,step:.01},
  {key:'screwLength',label:'Dài thân vít (0 = tự tính)',min:0,max:2.5,step:.01},
  {key:'toothWidth',label:'Bề rộng đỉnh răng',min:.08,max:.25,step:.005},
  {key:'toothRootWidth',label:'Bề rộng chân răng',min:.08,max:.3,step:.005},
  {key:'clearance',label:'Khe hở cạnh rãnh',min:.01,max:.08,step:.005},
  {key:'profile',label:'Kiểu biên dạng',type:'select',options:[['dong-hoc','Sinh theo động học'],['minh-hoa','Minh họa hình sin']]},
  {key:'twist',label:'Góc xoắn (rad, kiểu minh họa)',min:.5,max:4,step:.05},
 ],
 cooler:[{key:'airflow',label:'Chiều gió qua két',type:'select',options:[['len','Từ dưới lên (giả định)'],['xuong','Từ trên xuống']]}],
};
export const PARAM_DEFAULTS={rotor:ROTOR_DEFAULTS,cooler:{airflow:'len'}};

const fmt=v=>(+v).toLocaleString('vi',{maximumFractionDigits:2});

// ================= Trục vít và hai bánh sao =================
// Tọa độ: trục vít theo X; hai bánh sao nằm trên mặt phẳng ngang Y = 0, tâm tại Z = ±A, trục quay song song Y (theo H2, H3).
// Đầu −X là phía xả (cặp ổ bi đỡ chặn, đai ốc khóa); đầu +X là phía hút và truyền động (rãnh then nối khớp).
const SCREW_SPEED=-.45; // rad/s ở tốc độ xem 1×; dấu âm để răng đi từ đầu hút (+X) về đầu xả (−X)

function screwShaft(m,parent,kin){
 const s=kin.sc,e=kin.L/2,R1=kin.R1,D=d=>e+d*s,N=d=>-(e+d*s),r=v=>v*s,mh=kin.p.profile==='minh-hoa';
 const g=part(m,'Trục vít chính',[0,0,0],parent,`Một trục vít ${kin.z1} rãnh, bán kính ${fmt(R1)}, thân dài ${fmt(kin.L)}. `+(mh?'Rãnh hình sin minh họa (góc xoắn đặt tay), không ăn khớp với bánh sao.'
   :`Rãnh sinh từ răng bánh sao quét qua theo tỷ số ${kin.z1}/${kin.z2}; mỗi rãnh quấn khoảng ${Math.round(kin.wrapDeg)}°. Biên dạng động học lý tưởng (răng thẳng, mỏng), chưa phải biên dạng chế tạo.`));
 const body=mh?screwGeometry({radius:R1,length:kin.L,grooves:kin.z1,depth:kin.h,twist:+kin.p.twist}):singleScrewGeometry(kin,{rHub:r(.30)});
 mesh(body,M.stainless,[0,0,0],g,'Thân vít có rãnh xoắn');
 // Bậc trục: ngõng phớt, ngõng ổ, rãnh vòng giữ, vai trục; đoạn ren phía xả; đầu truyền động có rãnh then.
 revolve([[N(.88),0],[N(.88),r(.175)],[N(.86),r(.195)],[N(.65),r(.195)],[N(.65),r(.24)],[N(.27),r(.24)],[N(.27),r(.30)],[N(.045),r(.30)],[N(.045),r(.36)],[-e+.02,r(.36)],[-e+.02,r(.30)],
   [e-.02,r(.30)],[e-.02,r(.36)],[D(.045),r(.36)],[D(.045),r(.30)],[D(.27),r(.30)],[D(.27),r(.26)],[D(.53),r(.26)],[D(.53),r(.245)],[D(.55),r(.245)],[D(.55),r(.26)],[D(.62),r(.26)],[D(.62),r(.23)],[D(.84),r(.23)],[D(.84),r(.21)],[D(.92),r(.21)],[D(.92),0]],
   [0,0,0],M.stainless,g,'x',{segments:64,name:'Bậc trục và vai trục'});
 mesh(keyedShaftGeometry({r:r(.21),length:r(.56),keyWidth:r(.06),keyDepth:r(.035)}),M.stainless,[D(.92),0,0],g,'Đầu trục truyền động có rãnh then');
 mesh(threadGeometry({r:r(.21),depth:r(.015),pitch:r(.03),length:r(.18)}),M.stainless,[N(.75),0,0],g,'Đoạn ren đai ốc khóa');
 const key=part(m,'Then truyền động',[D(1.2),r(.205),0],g,'Then bằng đầu tròn nằm trong rãnh then hở đầu, truyền mô-men từ khớp nối.');
 mesh(keyGeometry(r(.06),r(.06),r(.45)),M.bright,[0,0,0],key);explode(m,key,[0,.35*s,0]);
 const nut=part(m,'Đai ốc khóa đầu xả',[N(.70),0,0],g,'Đai ốc khóa có rãnh vặn và vòng đệm hãm, giữ cặp ổ đỡ chặn phía xả. Cấu tạo minh họa.',{minhHoa:true});
 lockNut(nut,{ri:r(.2),ro:r(.31),w:r(.07)});explode(m,nut,[-.5*s,0,0]);
 const clip=part(m,'Vòng giữ phía truyền động',[D(.54),0,0],g,'Vòng giữ chữ C nằm trong rãnh trên trục, chặn vòng trong ổ đũa. Cấu tạo minh họa.',{minhHoa:true});
 mesh(circlipGeometry(r(.245),r(.295),r(.018)),M.dark,[0,0,0],clip);explode(m,clip,[.45*s,0,0]);
 m.motions.push({object:g,axis:'x',ratio:SCREW_SPEED});
 return g;
}

// Một bánh sao gồm đĩa răng, giá đỡ, moay-ơ, vòng kẹp và trục đỡ. side=1: bánh A (Z+); side=−1: bánh B (Z−) lắp xoay 180° quanh trục vít.
function gaterotor(m,parent,kin,side){
 const s=kin.sc,t=+kin.p.gateThickness,label=side>0?'A':'B',r=v=>v*s,y0=t/2;
 const g=part(m,`Bánh sao ${label}`,[0,0,side*kin.A],parent,`Bánh sao ${kin.z2} răng, trục quay vuông góc trục vít, tâm cách trục vít ${fmt(kin.A)}. Quay ngược chiều bánh sao còn lại; tốc độ bằng ${kin.z1}/${kin.z2} tốc độ trục vít.`);
 const inner=new THREE.Group();inner.name=`Khung lắp bánh sao ${label}`;if(side<0)inner.rotation.x=Math.PI;g.add(inner);
 const disk=part(m,`Đĩa răng bánh sao ${label}`,[0,0,0],inner,`${kin.z2} răng riêng biệt: chân răng bo cung, cạnh răng thẳng, đỉnh răng là cung tròn bán kính ${fmt(kin.R2)}, dày ${fmt(t)}, mép vát. Vật liệu nhựa kỹ thuật là giả định thường gặp; màu minh họa.`);
 // hình học đĩa răng và giá đỡ dựng một lần, hai bánh sao dùng chung
 kin.gateGeo??={disk:starGeometry({teeth:kin.z2,rRoot:kin.rRoot,sTip:kin.R2,hw:kin.tooth.at,fillet:r(.02),hole:r(.15),boltR:r(.2),bolts:6,boltHole:r(.016)},t,.012),
  support:starGeometry({teeth:kin.z2,rRoot:kin.rRoot,sTip:kin.R2-r(.07),hw:v=>Math.max(r(.02),kin.tooth.at(v)-r(.035)),fillet:r(.02),hole:r(.15)},r(.035),.004)};
 mesh(kin.gateGeo.disk,M.peek,[0,0,0],disk);
 explode(m,disk,[0,.32*s,0]);
 const ts=r(.035),sup=part(m,`Giá đỡ bánh sao ${label}`,[0,-y0-ts/2-.001,0],inner,'Giá đỡ thép tựa mặt sau từng răng; ngón đỡ hẹp và ngắn hơn răng để không chạm rãnh. Cấu tạo minh họa.',{minhHoa:true});
 mesh(kin.gateGeo.support,M.support,[0,0,0],sup);
 revolve([[0,r(.15)],[0,r(.28)],[r(.05),r(.28)],[r(.05),r(.15)]],[0,-ts/2,0],M.support,sup,'-y',{segments:48});
 explode(m,sup,[0,-.3*s,0]);
 const hub=part(m,`Moay-ơ và trục bánh sao ${label}`,[0,0,0],inner,'Moay-ơ kẹp đĩa răng và giá đỡ bằng vòng kẹp sáu vít; trục đỡ có ngõng ổ hai đầu và đoạn ren đai ốc khóa.');
 revolve([[r(-.86),0],[r(-.86),r(.055)],[r(-.84),r(.07)],[r(-.52),r(.07)],[r(-.52),r(.09)],[r(-.2),r(.09)],[r(-.2),r(.15)],[y0+r(.03),r(.15)],[y0+r(.03),r(.09)],[r(.5),r(.09)],[r(.5),r(.07)],[r(.8),r(.07)],[r(.8),r(.05)],[r(.88),r(.05)],[r(.88),0]],[0,0,0],M.steel,hub,'y',{segments:48});
 mesh(threadGeometry({r:r(.06),depth:r(.008),pitch:r(.018),length:r(.08),axis:'y'}),M.steel,[0,r(.84),0],hub);
 ring(r(.24),r(.15),r(.026),[0,y0+r(.014),0],M.support,hub,'y',48);
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2+kin.pitch/2;bolt([Math.cos(a)*r(.2),y0+r(.027),-Math.sin(a)*r(.2)],hub,r(.022),'y',r(.1));}
 lockNut(hub,{ri:r(.055),ro:r(.1),w:r(.04)},[0,r(.835),0],'-y','Đai ốc khóa trục bánh sao');
 // Góc quay: bánh A = −(z1/z2)·θ; bánh B lắp đối xứng 180° quanh trục vít nên lệch thêm (z1/z2)·π.
 g.rotation.y=side>0?0:kin.k*Math.PI;
 m.motions.push({object:g,axis:'y',ratio:-side*kin.k*SCREW_SPEED});
 return g;
}
function rotorInfo(kin){return `A = ${fmt(kin.A)} · L = ${fmt(kin.L)} · ${kin.z1}/${kin.z2} · `+(kin.p.profile==='minh-hoa'?`rãnh minh họa, góc xoắn ${fmt(kin.p.twist)} rad`:`quấn ≈ ${Math.round(kin.wrapDeg)}°`)+(kin.lengthClamped?' · chiều dài đã nâng lên mức tối thiểu':'');}
function rotor(params){
 const m=modelBase('rotor'),kin=screwKinematics(params);m.info.kin=kin;m.info.summary=rotorInfo(kin);
 screwShaft(m,m.root,kin);
 for(const sd of [1,-1])explode(m,gaterotor(m,m.root,kin,sd),[0,0,sd*1.1*kin.sc]);
 port(m,'Đầu trục truyền động',[kin.L/2+1.48*kin.sc,0,0],[1,0,0],{kind:'co-khi',size:.21*kin.sc});
 return m;
}

// ================= Đầu nén =================
// Hình ngoài theo H2/H4/H7: thân trụ chứa trục vít, hai khoang bánh sao hai bên có nắp hông, cửa hút vuông phía trên,
// cửa xả phía dưới (nối van một chiều theo H4/H6), đầu xả có nắp ổ gân và chân đỡ, đầu truyền động có chuông nối động cơ.
function airend(params){
 const m=modelBase('airend'),kin=screwKinematics(params),s=kin.sc,e=kin.L/2,A=kin.A,R1=kin.R1,R2=kin.R2,r=v=>v*s,D=d=>e+d*s,N=d=>-(e+d*s);
 m.info.kin=kin;m.info.summary=rotorInfo(kin);
 screwShaft(m,m.root,kin);
 for(const sd of [1,-1])explode(m,gaterotor(m,m.root,kin,sd),[0,0,sd*2.6*s]);
 const Rb=R1+r(.02),Ro=Rb+r(.19),xN=N(.25),xD=D(.25),Rc=R2+r(.06),zl0=r(.55),zl1=A+Rc+r(.1),zm=(zl0+zl1)/2,xIn=e*.55,xOut=-e*.6,xW=-r(.32),zW=r(.64);
 // ---- Vỏ đúc: hợp các khối ngoài, trừ khoang trục vít, khoang bánh sao, lỗ ổ, cửa hút/xả ----
 const add=[cylG(Ro,xD-xN,[0,0,0],'x',96),cylG(r(1.1),r(.1),[xN+r(.05),0,0],'x',96),cylG(r(1.1),r(.1),[xD-r(.05),0,0],'x',96),cylG(r(.56),r(.36),[D(.40),0,0],'x',64)];
 for(const sd of [1,-1]){
  add.push(rboxG([xD-xN,r(1.6),zl1-zl0],[0,0,sd*zm],r(.1)),cylG(r(.27),r(2.12),[0,0,sd*A],'y',48));
  for(const y of [r(.83),-r(.83)]){add.push(boxG([xD-xN-r(.2),r(.1),r(.07)],[0,y,sd*A]),boxG([r(.07),r(.1),zl1-zl0-r(.2)],[0,y,sd*zm]));for(const x of [-r(.62),r(.62)])add.push(boxG([r(.06),r(.08),zl1-zl0-r(.3)],[x,y,sd*zm]));}
 }
 add.push(rboxG([r(.66),r(.62),r(.66)],[xIn,r(.88),0]),rboxG([r(.84),r(.08),r(.84)],[xIn,r(1.16),0],r(.04)));
 add.push(rboxG([r(.6),r(.62),r(.6)],[xOut,-r(.88),0]),rboxG([r(.76),r(.08),r(.76)],[xOut,-r(1.16),0],r(.04)));
 add.push(cylG(r(.13),r(.5),[xW,r(.93),zW],'y',32),rboxG([r(.34),r(.06),r(.34)],[xW,r(1.15),zW],r(.03)));
 const sub=[cylG(Rb,2*(e+r(.06)),[0,0,0],'x',128),
  cylG(r(.33),r(.12),[N(.10),0,0],'x',64),cylG(r(.40),r(.14),[N(.20),0,0],'x',64),
  cylG(r(.33),r(.12),[D(.10),0,0],'x',64),cylG(r(.40),r(.14),[D(.20),0,0],'x',64),cylG(r(.44),r(.36),[D(.43),0,0],'x',64),
  cylG(r(.93),r(.3),[e-r(.1),0,0],'x',96),
  cylG(r(.26),r(1),[xIn,r(.75),0],'y',48),cylG(r(.2),r(1),[xOut,-r(.75),0],'y',48),cylG(r(.05),r(.8),[xW,r(.85),zW],'y',16)];
 for(const sd of [1,-1]){
  sub.push(cylG(Rc,r(.3),[0,0,sd*A],'y',128),cylG(r(.32),r(.5),[0,0,sd*A],'y',48),cylG(r(.11),r(1),[0,0,sd*A],'y',24));
  sub.push(cylG(r(.15),r(.6),[0,r(.78),sd*A],'y',48),cylG(r(.15),r(.6),[0,-r(.78),sd*A],'y',48));
  sub.push(rboxG([r(1.64),r(.84),r(1)],[0,0,sd*(zl1-r(.3))],r(.08)));
 }
 const casing=part(m,'Vỏ đúc đầu nén',[0,0,0],m.root,'Vỏ rỗng có thành dày: khoang trục vít, hai khoang bánh sao thông với khoang trục vít qua khe răng, bậc lắp ổ và phớt, khoang hút quanh đầu hút, cửa hút phía trên, cửa xả phía dưới, gân tăng cứng. Hình ngoài bám H2/H4/H7; kích thước và kết cấu khoang trong là ước lượng.');
 solid(m,mesh(csgGeometry(add,sub),M.housing,[0,0,0],casing,'Vỏ đúc'));
 const fb=new THREE.Group();fb.name='Bu lông mặt bích cửa hút và cửa xả';casing.add(fb);
 for(const z of [-r(.31),r(.31)])for(const dx of [-r(.31),r(.31)])bolt([xIn+dx,r(1.2),z],fb,r(.045),'y',r(.16));
 for(const z of [-r(.27),r(.27)])for(const dx of [-r(.27),r(.27)])bolt([xOut+dx,-r(1.2),z],fb,r(.045),'-y',r(.16));cover(m,fb);
 // ---- Nắp hông, gioăng và nắp ổ bánh sao ----
 for(const sd of [1,-1]){
  const lab=sd>0?'A':'B',W=xD-xN-r(.06),H=r(1.5);
  const c=part(m,`Nắp hông bánh sao ${lab}`,[0,0,sd*(zl1+r(.006))],m.root,'Nắp bảo trì phía hông có viền và gân, mở để kiểm tra bánh sao. Gioăng phẳng nằm giữa nắp và mặt ghép (theo H4, H7).');
  const cg=csgGeometry([rboxG([W,H,r(.05)],[0,0,r(.025)],r(.07)),rboxG([W-r(.36),H-r(.36),r(.05)],[0,0,r(.06)],r(.06)),boxG([W-r(.5),r(.05),r(.05)],[0,r(.3),r(.1)]),boxG([W-r(.5),r(.05),r(.05)],[0,-r(.3),r(.1)]),cylG(r(.15),r(.06),[0,0,r(.1)],'z',32)]);
  if(sd<0)cg.rotateY(Math.PI);solid(m,mesh(cg,M.housingDark,[0,0,0],c,'Tấm nắp hông'));
  const gk=csgGeometry([rboxG([W,H,r(.006)],[0,0,0],r(.07))],[rboxG([r(1.64),r(.84),r(.02)],[0,0,0],r(.08))]);solid(m,mesh(gk,M.seal,[0,0,-sd*r(.003)],c,'Gioăng nắp hông'));
  const bp=[];for(const x of [-W/2+r(.08),W/2-r(.08)])for(const y of [-.45,-.15,.15,.45])bp.push([x,r(y)]);for(const y of [-H/2+r(.08),H/2-r(.08)])for(const x of [-.5,0,.5])bp.push([r(x),y]);
  const bg=new THREE.Group();c.add(bg);for(const [x,y] of bp)bolt([x,y,sd*r(.05)],bg,r(.045),sd>0?'z':'-z',r(.16));cover(m,bg);
  explode(m,c,[0,0,sd*3.2*s]);
  const pairUp=sd>0?1:-1;
  for(const v of [1,-1]){
   const cap=part(m,`Nắp ổ bánh sao ${lab} ${v>0?'trên':'dưới'}`,[0,v*r(1.06),sd*A],m.root,'Nắp ổ có gờ định tâm, vòng O và bốn bu lông. Hình nắp tròn theo H4/H7.');
   solid(m,revolve([[r(-.04),0],[r(-.04),r(.148)],[0,r(.148)],[0,r(.28)],[r(.05),r(.28)],[r(.06),r(.18)],[r(.1),r(.15)],[r(.1),0]],[0,0,0],M.housingDark,cap,v>0?'y':'-y',{segments:48}));
   cover(m,torus(r(.15),r(.008),[0,-v*r(.02),0],M.seal,cap));
   const cb=new THREE.Group();cap.add(cb);for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4;bolt([Math.cos(a)*r(.22),v*r(.05),Math.sin(a)*r(.22)],cb,r(.035),v>0?'y':'-y',r(.12));}cover(m,cb);
   explode(m,cap,[0,v*1.1*s,0]);
   const b=part(m,`Ổ đỡ ${v===pairUp?'đôi':'đũa'} bánh sao ${lab} ${v>0?'trên':'dưới'}`,[0,0,sd*A],m.root,v===pairUp?'Cặp ổ bi đỡ chặn giữ trục bánh sao theo hướng trục. Loại ổ và kích thước là giả định; cấu tạo minh họa.':'Ổ đũa trụ đỡ hướng kính đầu còn lại của trục bánh sao. Cấu tạo minh họa.',{minhHoa:true});
   if(v===pairUp){bearing(b,{type:'bi-chan',ri:r(.07),ro:r(.15),w:r(.1)},[0,v*r(.615),0],'y');bearing(b,{type:'bi-chan',ri:r(.07),ro:r(.15),w:r(.1)},[0,v*r(.725),0],'-y');}
   else bearing(b,{type:'dua',ri:r(.07),ro:r(.15),w:r(.12)},[0,v*r(.70),0],'y');
   explode(m,b,[0,v*.75*s,0]);
  }
 }
 // ---- Đầu xả: nắp đầu, cặp ổ đỡ chặn, phớt, nắp ổ có gân và chân đỡ ----
 const endc=part(m,'Nắp đầu phía xả',[0,0,0],m.root,'Nắp đầu bắt mười hai bu lông, có gân hướng kính và moay-ơ chứa cặp ổ đỡ chặn (theo H4: nắp tròn phía trước có nắp ổ gân và chân đỡ).');
 const ribs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;ribs.push(placed(new THREE.BoxGeometry(r(.08),r(.46),r(.05)),[N(.41),Math.cos(a)*r(.79),Math.sin(a)*r(.79)],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[N(.25),r(.42)],[N(.25),r(1.1)],[N(.37),r(1.1)],[N(.37),r(.64)],[N(.42),r(.56)],[N(.70),r(.56)],[N(.70),r(.36)],[N(.67),r(.36)],[N(.67),r(.42)]],[0,0,0],'x',96),...ribs]),M.housingDark,[0,0,0],endc,'Thân nắp đầu'));
 const eb=new THREE.Group();endc.add(eb);boltCircle(eb,'-x',N(.37),r(1.0),12,r(.045),Math.PI/12);cover(m,eb);
 const foot=part(m,'Chân đỡ trước',[0,0,0],endc,'Chân đỡ bắt dưới nắp đầu, có lỗ ô-van để căn chỉnh khi lắp lên bệ (theo H4/H7). Kích thước ước lượng.');
 const fx=N(.40),fy=-r(1.42);
 solid(m,mesh(csgGeometry([boxG([r(.06),r(.86),r(.5)],[fx,-r(.99),0]),boxG([r(.5),r(.06),r(.56)],[fx-r(.19),fy,0]),placed(new THREE.BoxGeometry(r(.3),r(.04),r(.3)),[fx-r(.12),fy+r(.13),0],[0,0,Math.PI/4])],[boxG([r(.2),r(.1),r(.08)],[fx-r(.25),fy,0]),cylG(r(.04),r(.1),[fx-r(.35),fy,0],'y',16),cylG(r(.04),r(.1),[fx-r(.15),fy,0],'y',16)]),M.housingDark,[0,0,0],foot,'Chân đỡ'));
 for(const z of [-r(.14),r(.14)])bolt([fx-r(.03),-r(.75),z],foot,r(.04),'-x',r(.12));
 explode(m,foot,[0,-.5*s,0]);explode(m,endc,[-1.15*s,0,0]);
 const capN=part(m,'Nắp ổ đầu xả',[0,0,0],m.root,'Nắp ổ dạng trụ có gân dọc, che đai ốc khóa và cặp ổ phía xả (theo hình nắp ổ gân ở H4/H7).');
 const ribs2=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ribs2.push(placed(new THREE.BoxGeometry(r(.25),r(.06),r(.035)),[N(.87),Math.cos(a)*r(.46),Math.sin(a)*r(.46)],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[N(.70),r(.36)],[N(.70),r(.56)],[N(.75),r(.56)],[N(.75),r(.44)],[N(1.0),r(.44)],[N(1.04),r(.40)],[N(1.04),0],[N(1.0),0],[N(1.0),r(.36)]],[0,0,0],'x',64),...ribs2]),M.housingDark,[0,0,0],capN,'Thân nắp ổ'));
 const nb=new THREE.Group();capN.add(nb);boltCircle(nb,'-x',N(.75),r(.5),6,r(.035));cover(m,nb);explode(m,capN,[-1.9*s,0,0]);
 const brgN=part(m,'Cặp ổ bi đỡ chặn phía xả',[0,0,0],m.root,'Hai ổ bi đỡ chặn lắp đối lưng và vòng chặn ở giữa, nhận lực dọc trục của trục vít. Loại ổ là giả định; cấu tạo minh họa.',{minhHoa:true});
 bearing(brgN,{type:'bi-chan',ri:r(.24),ro:r(.42),w:r(.17)},[N(.375),0,0],'x','Ổ bi đỡ chặn trong');bearing(brgN,{type:'bi-chan',ri:r(.24),ro:r(.42),w:r(.17)},[N(.565),0,0],'-x','Ổ bi đỡ chặn ngoài');
 revolve([[N(.46),r(.24)],[N(.46),r(.30)],[N(.48),r(.30)],[N(.48),r(.24)]],[0,0,0],M.steel,brgN,'x',{segments:48,name:'Vòng chặn giữa hai ổ'});explode(m,brgN,[-.75*s,0,0]);
 const sealN=part(m,'Phớt trục phía xả',[0,0,0],m.root,'Phớt môi làm kín nước/khí giữa khoang nén và ổ đỡ. Kiểu phớt là giả định; cấu tạo minh họa.',{minhHoa:true});
 lipSeal(sealN,{ri:r(.30),ro:r(.40),w:r(.09)},[N(.20),0,0],'-x');explode(m,sealN,[-.4*s,0,0]);
 // ---- Đầu truyền động: ổ đũa, phớt, nắp ổ và chuông nối động cơ ----
 const brgD=part(m,'Ổ đũa trụ phía truyền động',[0,0,0],m.root,'Ổ đũa trụ đỡ hướng kính đầu trục phía động cơ, vòng trong chặn bằng vòng giữ. Loại ổ là giả định; cấu tạo minh họa.',{minhHoa:true});
 bearing(brgD,{type:'dua',ri:r(.26),ro:r(.44),w:r(.22)},[D(.40),0,0],'x');explode(m,brgD,[.55*s,0,0]);
 const sealD=part(m,'Phớt trục phía truyền động',[0,0,0],m.root,'Phớt môi trong vỏ và phớt ngoài trên nắp ổ. Cấu tạo minh họa.',{minhHoa:true});
 lipSeal(sealD,{ri:r(.30),ro:r(.40),w:r(.09)},[D(.20),0,0],'x');explode(m,sealD,[.3*s,0,0]);
 const capD=part(m,'Nắp ổ và phớt ngoài phía truyền động',[0,0,0],m.root,'Vòng nắp có gờ định tâm ép vòng ngoài ổ đũa; chứa phớt môi ngoài.');
 solid(m,revolve([[D(.52),r(.28)],[D(.52),r(.435)],[D(.58),r(.435)],[D(.58),r(.56)],[D(.72),r(.56)],[D(.72),r(.34)],[D(.60),r(.34)],[D(.60),r(.28)]],[0,0,0],M.housingDark,capD,'x',{segments:64}));
 lipSeal(capD,{ri:r(.23),ro:r(.34),w:r(.08)},[D(.665),0,0],'x','Phớt ngoài');
 const db=new THREE.Group();capD.add(db);boltCircle(db,'x',D(.72),r(.5),6,r(.035),Math.PI/6);cover(m,db);explode(m,capD,[.9*s,0,0]);
 const bell=part(m,'Vỏ chuông nối động cơ',[0,0,0],m.root,'Chuông nối giữa đầu nén và mặt bích động cơ, có cửa sổ thao tác khớp nối hai bên và mặt bích mười hai lỗ (theo H4/H7). Kích thước ước lượng.');
 const holes=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2+Math.PI/12;holes.push(cylG(r(.045),r(.3),[D(2.54),Math.cos(a)*r(1.38),Math.sin(a)*r(1.38)],'x',16));}
 for(const sd of [1,-1])holes.push(rboxG([r(1.0),r(.84),r(.6)],[D(1.6),0,sd*r(1.2)],r(.06)));
 solid(m,mesh(csgGeometry([revG([[D(.25),r(.62)],[D(.25),r(1.1)],[D(.33),r(1.1)],[D(.75),r(1.24)],[D(2.48),r(1.24)],[D(2.48),r(1.5)],[D(2.6),r(1.5)],[D(2.6),r(1.17)],[D(2.52),r(1.17)],[D(2.52),r(1.14)],[D(.75),r(1.14)],[D(.33),r(1.0)],[D(.33),r(.62)]],[0,0,0],'x',128)],holes),M.housingDark,[0,0,0],bell,'Thân chuông nối'));
 const bb=new THREE.Group();bell.add(bb);boltCircle(bb,'x',D(.33),r(.82),8,r(.045),Math.PI/8);cover(m,bb);explode(m,bell,[1.6*s,0,0]);
 // ---- Cửa phun nước ----
 const wat=part(m,'Cửa phun nước và vòi phun',[xW,0,zW],m.root,'Mặt bích nhỏ cấp nước bôi trơn – làm kín – giải nhiệt vào buồng nén (H2: lubricating water spray inlet). Vòi phun trong vỏ là cấu tạo minh họa.');
 box([r(.3),r(.04),r(.3)],[0,r(1.2),0],M.steel,wat);pipe([[0,r(1.22),0],[0,r(1.36),0],[r(.22),r(1.36),0]],r(.045),M.steel,wat);cyl(r(.06),r(.08),[r(.24),r(1.36),0],M.brass,wat,'x',6);
 for(const dx of [-r(.11),r(.11)])for(const dz of [-r(.11),r(.11)])bolt([dx,r(1.22),dz],wat,r(.025),'y',r(.08));
 const noz=part(m,'Vòi phun trong vỏ (minh họa)',[0,0,0],wat,'Ống phun nước vào khe răng ở vùng nén; vị trí và số vòi phun chưa có bản vẽ, chỉ minh họa.',{minhHoa:true});
 rod([0,r(.62),0],[0,r(.46),-r(.06)],r(.025),M.brass,noz);cover(m,wat);explode(m,wat,[0,.6*s,0]);
 // ---- Cổng nối ----
 port(m,'Cửa hút khí (lắp van hút)',[xIn,r(1.2),0],[0,1,0],{kind:'khi',size:r(.26)});
 port(m,'Cửa xả khí–nước (tới van một chiều)',[xOut,-r(1.2),0],[0,-1,0],{kind:'khi',size:r(.2)});
 port(m,'Cửa phun nước bôi trơn',[xW+r(.28),r(1.36),zW],[1,0,0],{kind:'nuoc',size:r(.06)});
 port(m,'Mặt bích nối động cơ',[D(2.6),0,0],[1,0,0],{kind:'co-khi',size:r(1.5),note:'12 lỗ trên vòng bán kính '+fmt(r(1.38))+'; lỗ định tâm bán kính '+fmt(r(1.17))});
 port(m,'Đầu trục truyền động',[D(1.48),0,0],[1,0,0],{kind:'co-khi',size:r(.21)});
 port(m,'Chân đỡ trước',[fx-r(.19),fy-r(.03),0],[0,-1,0],{kind:'co-khi',size:r(.2)});
 m.section={min:[-Infinity,r(.03),-Infinity],max:[Infinity,Infinity,Infinity]};
 return m;
}

// ================= Động cơ và khớp nối =================
// Động cơ ba pha vỏ gang làm mát bằng quạt ngoài (kiểu thường gặp), chân đế + mặt bích, trục ra theo +X.
// Hình ngoài ước lượng từ H1/H4; mặt bích khớp với chuông nối của cụm đầu nén. Stato, roto, ổ bi là cấu tạo minh họa.
// Mặt cắt thân có gân: vòng tròn và các gân hướng kính (bỏ gân ở vùng chân đế và đệm hộp đấu điện).
function finnedFrameGeometry({R,fin,thick,count,length,bore,skip}){
 const s=new THREE.Shape(),list=[];
 for(let i=0;i<count;i++){const a=i/count*Math.PI*2;if(skip.some(([c,w])=>Math.abs(Math.atan2(Math.sin(a-c),Math.cos(a-c)))<w))continue;list.push(a);}
 const P=(r,a,q)=>[r*Math.cos(a)-q*Math.sin(a),r*Math.sin(a)+q*Math.cos(a)],base=Math.sqrt(R*R-thick*thick/4),half=thick/2/R;
 s.moveTo(...P(R,list[0]+half,0));
 list.forEach((a,i)=>{const next=list[(i+1)%list.length];s.absarc(0,0,R,a+half,next-half+(i===list.length-1?Math.PI*2:0),false);
   s.lineTo(...P(base,next,-thick/2));s.lineTo(...P(R+fin,next,-thick/2));s.lineTo(...P(R+fin+thick*.4,next,0));s.lineTo(...P(R+fin,next,thick/2));s.lineTo(...P(base,next,thick/2));});
 const h=new THREE.Path();h.absarc(0,0,bore,0,Math.PI*2,true);s.holes.push(h);
 const g=new THREE.ExtrudeGeometry(s,{depth:length-.02,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelOffset:-.01,bevelSegments:1,curveSegments:14});
 g.translate(0,0,-(length-.02)/2);g.rotateY(Math.PI/2);return g;
}
// Vành khuyên hình quạt đùn dọc trục X (vấu khớp nối, cánh đệm sao).
function sectorShape(ri,ro,a0,a1){const s=new THREE.Shape();s.moveTo(Math.cos(a0)*ro,Math.sin(a0)*ro);s.absarc(0,0,ro,a0,a1,false);s.lineTo(Math.cos(a1)*ri,Math.sin(a1)*ri);s.absarc(0,0,ri,a1,a0,true);s.closePath();return s;}
function extrudeX(shape,depth,x0=0,bevel=0){const g=new THREE.ExtrudeGeometry(shape,{depth:depth-2*bevel,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelOffset:-bevel,bevelSegments:1,curveSegments:16});g.translate(0,0,bevel);g.rotateY(Math.PI/2);g.translate(x0,0,0);return g;}
// Nửa khớp nối vấu cong: moay-ơ trụ, ba vấu nhô theo trục; dir = hướng vấu (+1 hoặc −1 theo X).
function jawHub(parent,{bore,ro,len,jaw,phase,dir},x,name){
 const g=new THREE.Group();g.name=name;g.position.x=x;parent.add(g);
 const hubEnd=dir>0?len:-len,parts=[revG([[0,bore],[0,ro],[hubEnd*.92,ro],[hubEnd,ro-.02],[hubEnd,bore]],[0,0,0],'x',64)];
 for(let i=0;i<3;i++){const a=phase+i*Math.PI*2/3;parts.push(extrudeX(sectorShape(bore+.03,ro-.005,a-.36,a+.36),jaw+.02,dir>0?len-.01:-len-jaw-.01,.008));}
 mesh(csgGeometry(parts),M.steel,[0,0,0],g,'Moay-ơ và vấu');
 for(const a of [Math.PI/2,Math.PI/2+Math.PI*2/3]){const sc=cyl(.025,.06,[dir*len*.45,Math.cos(a)*(ro+.01),Math.sin(a)*(ro+.01)],M.dark,g,'y',12);sc.rotation.x=a-Math.PI/2;}
 return g;
}
function motor(){
 const m=modelBase('motor'),R=.78,fin=.11,L=2.3,xF=1.44,tip=2.47;m.info.summary='Tâm trục cao 1 · thân R 0,78 có 28 gân · mặt bích R 1,5 khớp chuông nối đầu nén · khớp vấu 3+3, đệm sao 6 cánh';
 // ---- Thân, chân đế, nắp đầu ----
 const frame=part(m,'Thân động cơ (vỏ gang có gân)',[0,0,0],m.root,'Vỏ gang hình trụ có gân tản nhiệt dọc trục, bỏ gân ở vùng chân đế và đệm hộp đấu điện. Số gân và kích thước ước lượng từ H1.');
 solid(m,mesh(finnedFrameGeometry({R,fin,thick:.032,count:44,length:L,bore:.66,skip:[[-Math.PI/2,.8],[Math.PI/2,.36]]}),M.motor,[0,0,0],frame,'Vỏ có gân'));
 solid(m,mesh(csgGeometry([rboxG([.64,.12,.58],[.1,R+.02,0],.02)],[cylG(R-.005,.7,[.1,0,0],'x',64)]),M.motor,[0,0,0],frame,'Đệm hộp đấu điện'));
 const eye=part(m,'Bu lông vòng nâng',[-.55,R-.01,0],frame,'Bu lông vòng để nâng động cơ.');
 cyl(.07,.05,[0,.025,0],M.steel,eye);torus(.1,.026,[0,.2,0],M.steel,eye,'z');cyl(.03,.1,[0,.07,0],M.steel,eye);
 const name=part(m,'Biển tên động cơ',[-.35,.12,-(R+fin+.02)],frame,'Biển tên thông số; nội dung không lấy từ bản vẽ.');
 box([.46,.26,.008],[0,0,0],M.label,name);for(let i=0;i<5;i++)box([.36-(i%2)*.1,.012,.002],[-.02,.08-i*.04,-.005],M.dark,name);
 const feet=part(m,'Chân đế',[0,0,0],m.root,'Bốn chân đúc liền thân, đế có lỗ bắt bu lông neo; chiều cao tâm trục 1,0 đơn vị (ước lượng).');
 const fadd=[],fsub=[];for(const x of [-.72,.72])for(const sz of [-1,1]){fadd.push(boxG([.36,.7,.24],[x,-.65,sz*.42]),boxG([.46,.07,.5],[x,-.965,sz*.55]));fsub.push(cylG(.05,.2,[x,-.965,sz*.68],'y',20));}
 fsub.push(cylG(R-.01,L,[0,0,0],'x',64));
 solid(m,mesh(csgGeometry(fadd,fsub),M.motor,[0,0,0],feet,'Chân đúc'));
 const anchors=new THREE.Group();feet.add(anchors);for(const x of [-.72,.72])for(const z of [-.68,.68])bolt([x,-.93,z],anchors,.055,'y',.2);cover(m,anchors);
 const de=part(m,'Nắp đầu phía truyền động (mặt bích)',[0,0,0],m.root,'Nắp đầu có gờ định tâm và mặt bích mười hai lỗ, khớp với mặt bích chuông nối của đầu nén (kiểu chân đế + mặt bích).');
 const holes=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2+Math.PI/12;holes.push(cylG(.045,.3,[1.35,Math.cos(a)*1.38,Math.sin(a)*1.38],'x',16));}
 const deRibs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;deRibs.push(placed(new THREE.BoxGeometry(.13,.36,.05),[1.235,Math.cos(a)*1.02,Math.sin(a)*1.02],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[1.15,.32],[1.15,.80],[1.30,.80],[1.30,1.5],[1.40,1.5],[1.40,1.16],[1.44,1.16],[1.44,.42],[1.50,.40],[1.50,.24],[1.40,.24],[1.40,.32]],[0,0,0],'x',96),...deRibs],holes),M.motor,[0,0,0],de,'Thân nắp đầu'));
 const fb=new THREE.Group();de.add(fb);boltCircle(fb,'-x',1.30,1.38,12,.045,Math.PI/12);cover(m,fb);
 const nde=part(m,'Nắp đầu phía quạt',[0,0,0],m.root,'Nắp đầu có gân hướng kính và moay-ơ ổ bi; bốn bu lông giữ vào thân.');
 const ndeRibs=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ndeRibs.push(placed(new THREE.BoxGeometry(.06,.36,.04),[-1.31,Math.cos(a)*.56,Math.sin(a)*.56],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[-1.15,.28],[-1.15,.80],[-1.27,.80],[-1.30,.76],[-1.30,.40],[-1.38,.36],[-1.38,.18],[-1.32,.18],[-1.32,.28]],[0,0,0],'x',96),...ndeRibs]),M.motor,[0,0,0],nde,'Thân nắp đầu'));
 const nb=new THREE.Group();nde.add(nb);for(const a of [Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4])bolt([-1.27,Math.cos(a)*.7,Math.sin(a)*.7],nb,.04,'-x',.14);cover(m,nb);
 explode(m,nde,[-.55,0,0]);explode(m,de,[.6,0,0]);
 // ---- Bên trong (minh họa) ----
 const stator=part(m,'Stato và cuộn dây (minh họa)',[0,0,0],m.root,'Lõi thép lá stato và đầu cuộn dây. Không có bản vẽ bên trong động cơ; cấu tạo minh họa.',{minhHoa:true});
 revolve([[-.82,.53],[-.82,.66],[.82,.66],[.82,.53]],[0,0,0],M.lamination,stator,'x',{segments:72});
 for(const x of [-.93,.93]){const w=mesh(new THREE.TorusGeometry(.6,.075,10,48),M.winding,[x,0,0],stator,'Đầu cuộn dây');w.rotation.y=Math.PI/2;w.scale.set(1,1,1.5);}
 const brg=part(m,'Ổ bi hai đầu trục (minh họa)',[0,0,0],m.root,'Ổ bi đỡ hai đầu trục động cơ. Loại và cỡ ổ là giả định; cấu tạo minh họa.',{minhHoa:true});
 bearing(brg,{type:'bi',ri:.17,ro:.32,w:.16},[1.27,0,0],'x','Ổ bi phía truyền động');bearing(brg,{type:'bi',ri:.15,ro:.28,w:.14},[-1.23,0,0],'x','Ổ bi phía quạt');
 // ---- Trục, roto, quạt, khớp nối (quay cùng nhau) ----
 const shaft=part(m,'Trục động cơ',[0,0,0],m.root,'Trục có ngõng ổ hai đầu, đoạn lắp quạt phía sau và đầu trục ra có rãnh then hở đầu.');
 revolve([[-1.82,0],[-1.82,.11],[-1.80,.12],[-1.34,.12],[-1.34,.15],[-1.12,.15],[-1.12,.2],[1.12,.2],[1.12,.17],[1.40,.17],[1.40,.165],[1.50,.165],[1.50,.16],[1.95,.16],[1.95,0]],[0,0,0],M.bright,shaft,'x',{segments:48,name:'Trục'});
 mesh(keyedShaftGeometry({r:.16,length:tip-1.95,keyWidth:.05,keyDepth:.03}),M.bright,[1.95,0,0],shaft,'Đầu trục có rãnh then');
 const k=part(m,'Then đầu trục động cơ',[2.21,.16,0],shaft,'Then bằng truyền mô-men sang nửa khớp nối.');mesh(keyGeometry(.05,.05,.4),M.steel,[0,0,0],k);explode(m,k,[0,.3,0]);
 const rot=part(m,'Roto lồng sóc (minh họa)',[0,0,0],shaft,'Lõi roto và vòng ngắn mạch hai đầu. Cấu tạo minh họa.',{minhHoa:true});
 revolve([[-.82,.2],[-.82,.5],[.82,.5],[.82,.2]],[0,0,0],M.lamination,rot,'x',{segments:72});for(const x of [-.86,.86])revolve([[x-.04,.3],[x-.04,.49],[x+.04,.49],[x+.04,.3]],[0,0,0],M.brass,rot,'x',{segments:48});
 const fanP=part(m,'Quạt làm mát động cơ',[-1.58,0,0],shaft,'Quạt ly tâm cánh thẳng lắp sau trục, hút gió qua lưới và thổi dọc các gân thân.');
 revolve([[-.09,.11],[-.09,.16],[.09,.16],[.09,.11]],[0,0,0],M.black,fanP,'x',{segments:32});revolve([[.07,.15],[.07,.66],[.09,.66],[.09,.15]],[0,0,0],M.black,fanP,'x',{segments:64});
 const blades=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;blades.push({p:[-.02,Math.cos(a)*.41,Math.sin(a)*.41],r:[a,0,0]});}instances(new THREE.BoxGeometry(.17,.5,.022),M.black,blades,fanP,'Cánh quạt');
 const cpl=part(m,'Khớp nối vấu cong',[0,0,0],shaft,'Hai nửa khớp nối bằng thép, mỗi nửa ba vấu; đệm đàn hồi hình sao nằm giữa các vấu. Kiểu khớp là giả định thường gặp; cấu tạo minh họa.',{minhHoa:true});
 const h1=part(m,'Nửa khớp nối phía động cơ',[0,0,0],cpl,'Lắp trên đầu trục động cơ bằng then, khóa bằng vít chìm.');jawHub(h1,{bore:.16,ro:.34,len:.46,jaw:.12,phase:0,dir:1},tip-.46,'Nửa khớp');
 const spider=part(m,'Đệm đàn hồi hình sao',[0,0,0],cpl,'Đệm sáu cánh bằng vật liệu đàn hồi, truyền mô-men và bù lệch trục nhỏ.');
 {const s=new THREE.Shape(),n=6,ro=.335,ri=.19,w=.09;s.moveTo(Math.cos(-w)*ro,Math.sin(-w)*ro);for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.PI/6;s.absarc(0,0,ro,a-w,a+w,false);const b=a+w,c=a+Math.PI*2/n-w;s.lineTo(Math.cos(b)*ri,Math.sin(b)*ri);s.absarc(0,0,ri,b,c,false);s.lineTo(Math.cos(c)*ro,Math.sin(c)*ro);}
  const h=new THREE.Path();h.absarc(0,0,.12,0,Math.PI*2,true);s.holes.push(h);mesh(extrudeX(s,.12,tip-.0,.01),M.handle,[0,0,0],spider,'Đệm sao');}
 const h2=part(m,'Nửa khớp nối phía đầu nén',[0,0,0],cpl,'Lắp trên đầu trục vít (bán kính 0,21 như cụm đầu nén); ba vấu xen kẽ với vấu nửa phía động cơ.');jawHub(h2,{bore:.21,ro:.34,len:.5,jaw:.12,phase:Math.PI/3,dir:-1},tip+.12+.5,'Nửa khớp');
 explode(m,h2,[.75,0,0]);explode(m,spider,[.38,0,0]);
 m.motions.push({object:shaft,axis:'x',ratio:1.2});
 // ---- Nắp quạt và lưới bảo vệ ----
 const cowl=part(m,'Nắp quạt và lưới bảo vệ',[0,0,0],m.root,'Nắp tôn bao quạt; mặt sau là lưới nan hướng kính và vòng tròn (theo hình động cơ ở H1).');
 solid(m,revolve([[-1.20,.85],[-1.20,.875],[-1.78,.875],[-1.865,.79],[-1.865,.70],[-1.845,.70],[-1.845,.78],[-1.77,.855],[-1.20,.855]],[0,0,0],M.motorDark,cowl,'x',{segments:96,name:'Vỏ nắp quạt'}));
 const grille=new THREE.Group();grille.name='Lưới bảo vệ';cowl.add(grille);
 for(const rr of [.24,.38,.52,.66])torus(rr,.011,[-1.856,0,0],M.motorDark,grille,'x');
 const bars=[];for(let i=0;i<40;i++){const a=i/40*Math.PI*2;bars.push({p:[-1.856,Math.cos(a)*.42,Math.sin(a)*.42],r:[a,0,0]});}instances(new THREE.BoxGeometry(.02,.56,.014),M.motorDark,bars,grille,'Nan lưới');
 cyl(.14,.02,[-1.856,0,0],M.motorDark,grille,'x',32);cover(m,grille);
 const cb=new THREE.Group();cowl.add(cb);for(const a of [Math.PI/2,Math.PI/2+Math.PI*2/3,Math.PI/2+Math.PI*4/3])bolt([-1.3,Math.cos(a)*.875,Math.sin(a)*.875],cb,.03,'y',.06).quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(0,Math.cos(a),Math.sin(a)));cover(m,cb);
 explode(m,cowl,[-1.1,0,0]);explode(m,fanP,[-.5,0,0]);
 // ---- Hộp đấu điện và đầu cáp ----
 const tb=part(m,'Hộp đấu điện',[.1,R+.08,0],m.root,'Hộp đấu dây đúc trên đỉnh thân, có nắp bắt bốn vít; đầu cáp ở mặt bên.');
 solid(m,mesh(csgGeometry([rboxG([.6,.34,.54],[0,.17,0],.03)],[rboxG([.5,.32,.44],[0,.22,0],.02),cylG(.05,.2,[.08,.15,.27],'z',20),cylG(.05,.2,[-.12,.15,.27],'z',20)]),M.motor,[0,0,0],tb,'Thân hộp'));
 const block=part(m,'Cầu đấu dây (minh họa)',[0,.1,0],tb,'Tấm cách điện và sáu bu lông đấu dây. Cấu tạo minh họa.',{minhHoa:true});
 box([.36,.04,.24],[0,0,0],M.white,block);for(const x of [-.12,0,.12])for(const z of [-.06,.06]){cyl(.018,.08,[x,.05,z],M.brass,block,'y',12);cyl(.03,.02,[x,.06,z],M.brass,block,'y',6);}
 const lid=part(m,'Nắp hộp đấu điện',[0,.37,0],tb,'Nắp có gioăng, bốn vít góc.');
 solid(m,roundedBox([.64,.05,.58],[0,0,0],M.motor,lid,.025));for(const x of [-.25,.25])for(const z of [-.22,.22])bolt([x,.025,z],lid,.025,'y',.06);explode(m,lid,[0,.5,0]);
 const gl=part(m,'Đầu cáp và cáp nguồn',[0,0,0],tb,'Hai đầu cáp xiết kín và cáp nguồn đi ra; hướng cáp là minh họa.');
 for(const x of [.08,-.12]){cyl(.065,.04,[x,.15,.29],M.brass,gl,'z',6);cyl(.055,.06,[x,.15,.34],M.brass,gl,'z',24);pipe([[x,.15,.36],[x,.15,.55],[x,-.35,.62],[x-.1,-.9,.68]],.032,M.black,gl);}
 cover(m,gl);explode(m,gl,[0,0,.35]);
 port(m,'Mặt bích nối chuông đầu nén',[xF,0,0],[1,0,0],{kind:'co-khi',size:1.5,note:'gờ định tâm bán kính 1,16; 12 lỗ trên vòng bán kính 1,38'});
 port(m,'Đầu trục động cơ',[tip,0,0],[1,0,0],{kind:'co-khi',size:.16});
 port(m,'Nửa khớp nối phía đầu nén',[tip+.62,0,0],[1,0,0],{kind:'co-khi',size:.21,note:'lỗ trục bán kính 0,21'});
 port(m,'Đầu cáp nguồn',[.08+.1,R+.23,.36],[0,0,1],{kind:'dien',size:.06});
 for(const x of [-.72,.72])for(const z of [-.68,.68])port(m,`Lỗ chân đế ${x<0?'sau':'trước'} ${z<0?'phải':'trái'}`,[x,-1.0,z],[0,-1,0],{kind:'co-khi',size:.06});
 // ---- Nắp che khớp nối tháo được (khi dùng động cơ riêng, không có chuông nối) ----
 const guard=part(m,'Nắp che khớp nối',[0,0,0],m.root,'Nắp che hai nửa bằng tôn có cửa sổ, bắt bu lông ở mặt phân đôi; tháo được để kiểm tra khớp nối. Khi lắp với đầu nén, chuông nối thay vai trò nắp che.');
 const tubeG=()=>revG([[1.44,.44],[1.44,.5],[1.48,.5],[1.48,.47],[tip+.66,.47],[tip+.66,.44]],[0,0,0],'x',72);
 for(const v of [1,-1]){const half=part(m,`Nửa nắp che ${v>0?'trên':'dưới'}`,[0,0,0],guard,'');
   const sub=[boxG([2.4,1.2,1.2],[2.3,-v*.6,0])];if(v>0)for(const x of [1.95,2.55])sub.push(rboxG([.4,.5,.36],[x,.45,0],.06));
   solid(m,mesh(csgGeometry([tubeG(),boxG([tip+.66-1.48,.03,.12],[(tip+.66+1.48)/2,v*.015,.5]),boxG([tip+.66-1.48,.03,.12],[(tip+.66+1.48)/2,v*.015,-.5])],sub),M.housingDark,[0,0,0],half,'Tôn nắp che'));
   if(v>0)for(const x of [1.8,2.4,3.0])for(const z of [-.5,.5])bolt([x,.03,z],half,.025,'y',.08);
   explode(m,half,[0,v*.9,0]);}
 return m;
}

function vesselBase(m,name,{r=.83,h=2.45}={}){
 const shell=part(m,name);cover(m,tube(r,.055,h,[0,h/2+.55,0],M.steel,shell));
 cover(m,dome(r,.33,[0,h+.55,0],M.steel,shell));cover(m,dome(r,.33,[0,.55,0],M.steel,shell,true));
 for(const a of [0,2*Math.PI/3,4*Math.PI/3]){const x=Math.cos(a)*r*.8,z=Math.sin(a)*r*.8;box([.2,.5,.2],[x,.22,z],M.dark,shell);box([.44,.07,.36],[x,-.035,z],M.steel,shell);bolt([x,.02,z],shell,.065);}
 torus(r,.016,[0,.6,0],M.dark,shell);torus(r,.016,[0,h+.5,0],M.dark,shell);return shell;
}
// ================= Bình tách khí–nước (trong máy) =================
// Bình đứng hai đáy elip 2:1, bốn chân, các cổ nối có mặt bích. Bố trí phụ kiện theo H4/H6/H7: cửa vào phía trên thân,
// khí ra ở đỉnh tới van áp suất tối thiểu, kính mức bên hông, xả đáy, cửa nước ra két và nước bù. Kết cấu trong là minh họa.
const polar=(r,deg,y)=>{const a=deg*Math.PI/180;return [Math.cos(a)*r,y,Math.sin(a)*r];};
// Mặt bích cổ hàn có mặt tì nổi, dựng theo trục X rồi xoay theo hướng nozzle.
function weldFlange(parent,{r,ri,t=.05,bolts=4,boltR},pos,dir,name='Mặt bích'){
 const g=new THREE.Group();g.name=name;g.position.set(...pos);g.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),new THREE.Vector3(...dir).normalize());parent.add(g);
 revolve([[-t*1.6,ri],[-t*1.6,ri+.025],[-t,r*.72],[-t,r],[0,r],[0,r*.7],[t*.25,r*.68],[t*.25,ri]],[0,0,0],M.steel,g,'x',{segments:48});
 boltCircle(g,'x',.004,boltR??r*.82,bolts,Math.max(.022,r*.11),Math.PI/bolts);return g;
}
// Van bi tay gạt: thân cầu, hai đầu lục giác, cần gạt đỏ. Trục ống theo X cục bộ.
function ballValve(parent,pos,dir,size=.06,name='Van bi'){
 const g=new THREE.Group();g.name=name;g.position.set(...pos);g.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),new THREE.Vector3(...dir).normalize());parent.add(g);
 revolve([[-size*2.2,0],[-size*2.2,size*1.05],[-size*1.3,size*1.05],[-size*1.1,size*1.45],[size*1.1,size*1.45],[size*1.3,size*1.05],[size*2.2,size*1.05],[size*2.2,0]],[0,0,0],M.brass,g,'x',{segments:32});
 for(const x of [-size*1.75,size*1.75])cyl(size*1.2,size*.7,[x,0,0],M.brass,g,'x',6);
 cyl(size*.25,size*.9,[0,size*1.8,0],M.steel,g,'y',12);box([size*4.2,size*.22,size*.7],[size*1.7,size*2.3,0],M.handle,g);return g;
}
function separator(){
 const m=modelBase('separator'),R=.83,t=.035,y0=1.15,y1=3.6,hd=R/2,top=y1+hd,bot=y0-hd,yw=y0+.9,hy=r=>y1+hd*Math.sqrt(1-(r/R)**2);
 m.info.summary=`Bình đứng R ${fmt(R)} · thân trụ ${fmt(y1-y0)} · đáy elip 2:1 · thành ${fmt(t)} (phóng đại) · mực nước minh họa ${fmt(yw)}`;
 const head=(yc,rr,hh,from,to,n=16)=>{const out=[];for(let i=0;i<=n;i++){const a=from+(to-from)*i/n;out.push([yc+hh*Math.sin(a),rr*Math.cos(a)]);}return out;};
 const prof=[...head(y0,R,hd,-Math.PI/2,0),...head(y1,R,hd,0,Math.PI/2),...head(y1,R-t,hd-t,Math.PI/2,0),...head(y0,R-t,hd-t,0,-Math.PI/2)];
 // cổ nối: [tên, điểm trong, điểm ngoài, bán kính ngoài, bán kính trong]
 const N={
  out:{a:[0,top-.12,0],b:[0,top+.24,0],ro:.13,ri:.105},
  inlet:{a:[-.5,y1-.3,.3],b:[-1.12,y1-.3,.3],ro:.14,ri:.115},
  water:{a:polar(.55,160,y0+.25),b:polar(1.1,160,y0+.25),ro:.085,ri:.065},
  drain:{a:[0,bot+.06,0],b:[0,bot-.2,0],ro:.06,ri:.042},
  sgLo:{a:polar(.6,90,y0+.2),b:polar(.99,90,y0+.2),ro:.045,ri:.03},sgHi:{a:polar(.6,90,y0+1.4),b:polar(.99,90,y0+1.4),ro:.045,ri:.03},
  makeup:{a:polar(.6,35,y0+1.65),b:polar(1.0,35,y0+1.65),ro:.055,ri:.04},
  safety:{a:polar(.42,30,y1+.25),b:polar(.42,30,hy(.42)+.16),ro:.06,ri:.04},
  gaugeN:{a:polar(.42,110,y1+.25),b:polar(.42,110,hy(.42)+.14),ro:.045,ri:.03},
  level:{a:polar(.42,250,y1+.2),b:polar(.42,250,hy(.42)+.16),ro:.09,ri:.07},
 };
 const neck=(n,r)=>{const a=new THREE.Vector3(...n.a),b=new THREE.Vector3(...n.b),d=b.clone().sub(a),g=new THREE.CylinderGeometry(r,r,d.length(),40);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());return g;};
 const vessel=part(m,'Vỏ bình tách',[0,0,0],m.root,'Thân trụ rỗng và hai đáy elip 2:1 có độ dày, các cổ nối hàn xuyên vỏ. Đây là bình tách trong máy (khác bình tích áp bên ngoài). Kích thước ước lượng từ H4/H6.');
 solid(m,mesh(csgGeometry([revG(prof,[0,0,0],'y',96),...Object.values(N).map(n=>neck(n,n.ro))],[revG([...head(y1,R-t,hd-t,Math.PI/2,0),...head(y0,R-t,hd-t,0,-Math.PI/2)].map(([y,r])=>[y,r-.0005]),[0,0,0],'y',96),...Object.values(N).map(n=>{const e={...n,a:n.a,b:n.b};return neck(e,n.ri);})]),M.vessel,[0,0,0],vessel,'Vỏ có độ dày'));
 for(const y of [y0,y1])cover(m,torus(R+.002,.009,[0,y,0],M.steel,vessel));
 // Chân đỡ và đế
 const legs=part(m,'Chân đỡ bình',[0,0,0],m.root,'Bốn chân thép hàn vào thân dưới, tấm đế có lỗ bắt neo và hai thanh giằng (theo hình chân bình ở H4, H6).');
 const ladd=[],lsub=[];
 for(const deg of [45,135,225,315]){const [x,,z]=polar(R+.055,deg,0),[bx,,bz]=polar(R+.09,deg,0);ladd.push(placed(new THREE.BoxGeometry(.12,y0+.5,.12),[x,(y0+.5)/2,z],[0,-deg*Math.PI/180,0]),boxG([.3,.03,.3],[bx,.015,bz]));lsub.push(cylG(.03,.1,[bx+Math.sign(bx)*.07,.015,bz+Math.sign(bz)*.07],'y',16));}
 for(const z of [-1,1])ladd.push(boxG([1.24,.06,.05],[0,.28,z*(R+.055)*Math.SQRT1_2]));
 solid(m,mesh(csgGeometry(ladd,lsub),M.frame,[0,0,0],legs,'Khung chân'));
 const lugs=part(m,'Tai cẩu',[0,0,0],vessel,'Hai tai cẩu hàn trên đáy trên.');
 for(const deg of [0,180]){const [x,,z]=polar(.6,deg,0),y=hy(.6);solid(m,mesh(csgGeometry([placed(new THREE.BoxGeometry(.2,.2,.03),[x,y+.06,z],[0,-deg*Math.PI/180,0])],[placed(new THREE.CylinderGeometry(.035,.035,.1,20).rotateX(Math.PI/2),[x,y+.1,z],[0,-deg*Math.PI/180,0])]),M.frame,[0,0,0],lugs));}
 // Cụm khí ra ở đỉnh và phụ kiện an toàn
 const outlet=part(m,'Cổ khí ra và mặt bích',[0,0,0],m.root,'Cổ nối đỉnh có mặt bích, dẫn khí đã tách tới van áp suất tối thiểu (H4).');
 weldFlange(outlet,{r:.26,ri:.105,bolts:6},N.out.b,[0,1,0],'Mặt bích khí ra');explode(m,outlet,[0,.5,0]);
 const sv=part(m,'Van an toàn',N.safety.b,m.root,'Van an toàn lò xo lắp trên đỉnh bình. Áp suất đặt không lấy từ bản vẽ.');
 revolve([[0,0],[0,.06],[.05,.06],[.06,.08],[.2,.08],[.24,.05],[.34,.05],[.36,.03],[.36,0]],[0,0,0],M.brass,sv,'y',{segments:24});cyl(.035,.12,[.09,.13,0],M.brass,sv,'x',16);cyl(.04,.05,[0,.39,0],M.handle,sv,'y',16);box([.16,.02,.03],[.06,.36,0],M.handle,sv);cover(m,sv);explode(m,sv,[0,.45,0]);
 const gg=part(m,'Đồng hồ áp suất',N.gaugeN.b,m.root,'Đồng hồ áp suất trên đỉnh bình (H1 ghi Pressure gauge ở cụm đỉnh). Vị trí ước lượng.');
 cyl(.03,.12,[0,.06,0],M.brass,gg,'y',12);gauge([0,.33,0],gg,.17).rotation.y=Math.PI*.15;explode(m,gg,[0,.45,0]);
 const lv=part(m,'Công tắc mức nước',N.level.b,m.root,'Công tắc mức kiểu đầu hộp và que dò (H7: Level gauge), tự điều khiển xả nước và bù nước. Que dò trong bình là minh họa.');
 weldFlange(lv,{r:.16,ri:.04,bolts:4},[0,0,0],[0,1,0],'Mặt bích công tắc mức');box([.22,.2,.18],[0,.16,0],M.dark,lv);box([.24,.03,.2],[0,.27,0],M.black,lv);cyl(.03,.05,[.13,.14,0],M.brass,lv,'x',6);
 const probe=part(m,'Que dò mức (minh họa)',[0,0,0],lv,'Que dò và phao trong bình; chiều dài và kiểu dò chưa có bản vẽ.',{minhHoa:true});
 cyl(.012,2.0,[0,-1.0,0],M.steel,probe,'y',10);for(const y of [-1.65,-2.0])cyl(.05,.08,[0,y,0],M.white,probe,'y',20);explode(m,lv,[0,.6,0]);
 // Cửa vào hỗn hợp
 const inl=part(m,'Cổ vào hỗn hợp khí–nước',[0,0,0],m.root,'Cổ nối phía trên thân, đặt lệch tâm để dòng vào đi tiếp tuyến thành bình (giả định); nối ống chính từ đầu nén qua van một chiều (H4, H6).');
 weldFlange(inl,{r:.27,ri:.115,bolts:6},N.inlet.b,[-1,0,0],'Mặt bích cửa vào');explode(m,inl,[-.45,0,0]);
 // Kính mức
 const sg=part(m,'Kính mức nước',[0,0,0],m.root,'Ống thủy tinh giữa hai van góc, có thanh bảo vệ và thước chia; mực nước trong ống bằng mực trong bình (H1: Water level sight glass).');
 const [sx,,sz]=polar(1.06,90,0);
 for(const n of [N.sgLo,N.sgHi]){const y=n.b[1];cyl(.05,.1,[sx,y,sz-.03],M.brass,sg,'z',6);revolve([[-.06,0],[-.06,.045],[.06,.045],[.06,0]],[sx,y,sz+.06],M.brass,sg,'y',{segments:20});box([.12,.02,.025],[sx+.06,y+(y<2?-.06:.06),sz+.06],M.handle,sg);}
 const gy0=N.sgLo.b[1]+.07,gy1=N.sgHi.b[1]-.07;
 mesh(new THREE.CylinderGeometry(.03,.03,gy1-gy0,24,1,true),M.glass,[sx,(gy0+gy1)/2,sz+.06],sg,'Ống thủy tinh');
 mesh(new THREE.CylinderGeometry(.022,.022,yw-gy0,16),M.water,[sx,(gy0+yw)/2,sz+.06],sg,'Cột nước trong ống');
 for(const dx of [-.045,.045])for(const dz of [-.04,.04])cyl(.006,gy1-gy0,[sx+dx,(gy0+gy1)/2,sz+.06+dz],M.steel,sg,'y',8);
 box([.06,gy1-gy0,.006],[sx+.1,(gy0+gy1)/2,sz+.02],M.white,sg);for(let i=0;i<=10;i++)box([i%5?.025:.045,.004,.003],[sx+.09,gy0+i*(gy1-gy0)/10,sz+.024],M.dark,sg);
 explode(m,sg,[0,0,.5]);
 // Xả đáy, nước ra két, nước bù
 const dr=part(m,'Van xả đáy và đường xả',[0,0,0],m.root,'Van bi tay ở đáy bình và ống xả nằm ngang (H7: Manual drain valve). Hướng ống xả là minh họa.');
 ballValve(dr,[0,bot-.32,0],[0,-1,0],.045,'Van xả đáy');pipe([[0,bot-.44,0],[0,bot-.56,0],[.55,bot-.56,.55]],.035,M.steel,dr);explode(m,dr,[0,-.35,0]);
 const wo=part(m,'Cổ nước ra két và van chặn',[0,0,0],m.root,'Cổ nước ra ở phần dưới thân, có van chặn và ống tới két giải nhiệt (H5: đường nước từ bình tách lên két).');
 const wd=new THREE.Vector3(...polar(1,160,0)).normalize().toArray();weldFlange(wo,{r:.17,ri:.065,bolts:4},N.water.b,wd,'Mặt bích nước ra');
 const wv=new THREE.Vector3(...N.water.b).addScaledVector(new THREE.Vector3(...wd),.25).toArray();ballValve(wo,wv,wd,.055,'Van chặn nước ra');
 const wp=new THREE.Vector3(...N.water.b).addScaledVector(new THREE.Vector3(...wd),.42);pipe([wp.toArray(),[wp.x*1.25,1.1,wp.z*1.25],[wp.x*1.25,1.6,wp.z*1.25]],.05,M.blue,wo);explode(m,wo,[-.4,0,.15]);
 const mk=part(m,'Cửa nước bù',[0,0,0],m.root,'Cổ nhỏ nhận nước bù từ van điện từ nước bù (H7). Vị trí ước lượng.');
 const md=new THREE.Vector3(...polar(1,35,0)).normalize();cyl(.06,.07,new THREE.Vector3(...N.makeup.b).addScaledVector(md,.02).toArray(),M.brass,mk,'y',6).quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),md);
 pipe([new THREE.Vector3(...N.makeup.b).addScaledVector(md,.05).toArray(),new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray(),[...new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray()].map((v,i)=>i===1?v-.5:v)],.03,M.blue,mk);cover(m,mk);explode(m,mk,[.3,0,.2]);
 const plate=part(m,'Giá biển tên',polar(R+.02,60,y1-.55),m.root,'Tấm giá biển tên hàn trên thân (H6).');
 box([.26,.36,.02],[0,0,0],M.frame,plate).rotation.y=-Math.PI/3+Math.PI/2;cover(m,plate);
 // Bên trong (minh họa)
 const intl=part(m,'Cơ cấu tách bên trong (minh họa)',[0,0,0],m.root,'Vách hướng dòng tại cửa vào, vách ngăn ngang, lưới tách giọt dưới cổ khí ra và tấm chống xoáy ở đáy. Không có mặt cắt xác nhận trong bản vẽ: chỉ là cấu tạo minh họa thường gặp ở bình tách kiểu ly tâm – va đập.',{minhHoa:true});
 const sheet=M.steel.clone();sheet.side=THREE.DoubleSide;
 mesh(new THREE.CylinderGeometry(.62,.62,.6,48,1,true,-Math.PI*5/6,Math.PI*2/3),sheet,[0,y1-.35,0],intl,'Vách hướng dòng cửa vào');
 pipe([[-.5,y1-.3,.3],[-.35,y1-.3,.3]],.115,M.steel,intl);
 revolve([[y1-.88,.38],[y1-.88,R-t-.01],[y1-.85,R-t-.01],[y1-.85,.38]],[0,0,0],M.steel,intl,'y',{segments:64,name:'Vách ngăn ngang'});
 const pad=part(m,'Lưới tách giọt',[0,y1-.18,0],intl,'Đệm lưới kim loại giữ lại giọt nước trước khi khí ra cổ đỉnh. Cấu tạo minh họa.',{minhHoa:true});
 mesh(new THREE.CylinderGeometry(R-t-.02,R-t-.02,.16,48),M.mesh,[0,0,0],pad,'Đệm lưới');
 const gridBars=[];for(let i=-6;i<=6;i++)for(const y of [-.085,.085]){const w=2*Math.sqrt(Math.max(0,(R-t-.03)**2-(i*.11)**2));if(w>.05)gridBars.push({p:[i*.11,y,0],s:[1,1,w/1]});}
 instances(new THREE.BoxGeometry(.012,.012,1),M.steel,gridBars,pad,'Lưới đỡ đệm');
 for(const y of [-.09,.09])revolve([[y-.008,R-t-.05],[y-.008,R-t-.002],[y+.008,R-t-.002],[y+.008,R-t-.05]],[0,0,0],M.steel,pad,'y',{segments:48});
 explode(m,pad,[0,.6,0]);
 const vb=part(m,'Tấm chống xoáy cửa xả',[0,bot+.2,0],intl,'Hai tấm chữ thập trên lỗ xả đáy. Cấu tạo minh họa.',{minhHoa:true});
 box([.36,.12,.012],[0,0,0],M.steel,vb);box([.012,.12,.36],[0,0,0],M.steel,vb);
 const water=part(m,'Nước bôi trơn trong bình',[0,0,0],m.root,`Mực nước minh họa ở cao độ ${fmt(yw)}; mực thật do công tắc mức điều khiển.`);
 revolve([...head(y0,R-t-.004,hd-t-.004,-Math.PI/2,0,12),[yw,R-t-.004],[yw,0]],[0,0,0],M.water,water,'y',{segments:64});
 // Cổng nối
 port(m,'Vào hỗn hợp khí–nước (từ đầu nén qua ống chính)',[N.inlet.b[0]-.006,N.inlet.b[1],N.inlet.b[2]],[-1,0,0],{kind:'khi',size:.14});
 port(m,'Khí ra (tới van áp suất tối thiểu)',[0,N.out.b[1]+.006,0],[0,1,0],{kind:'khi',size:.13});
 port(m,'Nước ra (tới két giải nhiệt)',[wp.x*1.25,1.6,wp.z*1.25],[0,1,0],{kind:'nuoc',size:.05});
 port(m,'Nước bù vào (từ van điện từ)',[...new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray()].map((v,i)=>i===1?v-.5:v),[0,-1,0],{kind:'nuoc',size:.03});
 port(m,'Xả đáy',[.55,bot-.56,.55],[1,0,1],{kind:'nuoc',size:.035});
 port(m,'Van an toàn – cửa thoát',[N.safety.b[0]+.15,N.safety.b[1]+.13,N.safety.b[2]],[1,0,0],{kind:'khi',size:.035});
 for(const deg of [45,135,225,315]){const [x,,z]=polar(R+.09,deg,0);port(m,`Đế chân ${deg}°`,[x,0,z],[0,-1,0],{kind:'co-khi',size:.06});}
 m.section={min:[.02,-Infinity,-Infinity],max:[Infinity,Infinity,Infinity]};
 return m;
}

// Két nóc và hai quạt dưới két (H1, H5). Bản vẽ không có mũi tên chiều gió nên chiều gió là tham số:
// 'len' (mặc định, giả định quạt đẩy gió từ trong máy lên qua két, thoát ra lưới nóc) hoặc 'xuong'.
function cooler(params={}){
 const m=modelBase('cooler'),dir0=params.airflow==='xuong'?'xuong':'len';const frame=part(m,'Khung két nóc');
 for(const x of [-2.8,2.8])box([.13,.58,3.65],[x,.08,0],M.steel,frame);
 for(const z of [-1.77,1.77])box([5.7,.58,.13],[0,.08,z],M.steel,frame);
 const core=part(m,'Lõi két và lá tản nhiệt',[0,0,0],m.root,'Lõi két nước kiểu ống – lá: 145 lá tản nhiệt mỏng, hai hàng ống và hai ống góp hai đầu. Số lá và ống là minh họa.');const fins=[];
 for(let i=0;i<145;i++)fins.push({p:[-2.65+i*5.3/144,.1,0]});
 instances(new THREE.BoxGeometry(.013,.40,3.22),M.casting,fins,core,'145 lá tản nhiệt');
 for(const y of [-.03,.22])for(let j=0;j<12;j++)rod([-2.7,y,-1.47+j*.267],[2.7,y,-1.47+j*.267],.033,M.bright,core);
 for(const x of [-2.72,2.72])rod([x,.1,-1.65],[x,.1,1.65],.10,M.steel,core);
 for(const x of [-2.8,2.8]){pipe([[x,.1,-1.1],[x+.33*Math.sign(x),.1,-1.1]],.095,M.blue,frame);flange([x+.33*Math.sign(x),.1,-1.1],frame,'x',.18);}
 const top=part(m,'Lưới và tấm che phía trên',[0,.43,0]);
 for(const x of [-2.85,2.85])box([.08,.06,3.7],[x,0,0],M.dark,top);for(const z of [-1.82,1.82])box([5.7,.06,.08],[0,0,z],M.dark,top);
 const bars=[];for(let i=0;i<36;i++)bars.push({p:[-2.7+i*5.4/35,0,0]});cover(m,instances(new THREE.BoxGeometry(.018,.018,3.48),M.dark,bars,top,'Lưới bảo vệ'));explode(m,top,[0,.8,0]);
 const fanMotions=[];
 for(const x of [-1.36,1.36]){
   const assembly=part(m,`Cụm quạt ${x<0?'A':'B'}`,[x,-.65,0],m.root,'Quạt hướng trục đặt dưới két theo H1/H5: chụp quạt, cánh, động cơ quạt, lưới bảo vệ và thanh treo.');
   cover(m,tube(1.25,.045,.52,[0,0,0],M.paint,assembly));fan(m,[0,-.10,0],1.16,assembly,`Rotor quạt ${x<0?'A':'B'}`);fanMotions.push(m.motions.at(-1));
   cyl(.23,.4,[0,-.38,0],M.dark,assembly);fanGuard([0,-.29,0],1.2,assembly);
   for(const z of [-1.1,1.1])rod([-.75,-.52,z],[.75,-.52,z],.035,M.steel,assembly);
   explode(m,assembly,[0,-.75,0]);
 }
 const flow=part(m,'Hạt gió minh họa');flow.userData.noExport=true;
 const positions=new Float32Array(80*3),colors=new Float32Array(80*3);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const points=new THREE.Points(geo,new THREE.PointsMaterial({size:.06,vertexColors:true,transparent:true,opacity:.75,depthWrite:false}));flow.add(points);
 // Hạt lạnh (xanh) đi vào két, hạt nóng (cam) sau khi qua lõi két.
 let last=0;
 m.flow={object:flow,direction:dir0,update(t){last=t;const up=this.direction==='len';for(let i=0;i<80;i++){const u=(t*.8+i/80*2.7)%2.7,y=up?u-1.5:1.2-u;positions[i*3]=-2.4+((i*31)%79)/79*4.8;positions[i*3+1]=y;positions[i*3+2]=-1.35+((i*17)%79)/79*2.7;const hot=up?y>.15:y<.05;colors.set(hot?[.95,.55,.3]:[.25,.7,.9],i*3);}geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;},
  setDirection(d){this.direction=d==='xuong'?'xuong':'len';for(const f of fanMotions)f.ratio=Math.abs(f.ratio)*(this.direction==='len'?1:-1);m.info.summary=airflowText(this.direction);this.update(last);}};
 m.flow.setDirection(dir0);
 for(const sx of [-1,1])port(m,sx<0?'Nước nóng vào két':'Nước đã làm mát ra',[sx*3.2,.1,-1.1],[sx,0,0],{kind:'nuoc',size:.12,note:'Chiều nước vào/ra là giả định; hai mặt bích đối xứng.'});
 for(const x of [-2.8,2.8])for(const z of [-1.77,1.77])port(m,`Gối đỡ két ${x<0?'trái':'phải'} ${z<0?'sau':'trước'}`,[x,-.21,z],[0,-1,0],{kind:'co-khi',size:.08});
 return m;
}
const airflowText=d=>d==='len'?'Chiều gió: từ dưới lên qua két (giả định, bản vẽ không có mũi tên)':'Chiều gió: từ trên xuống qua két (phương án đảo)';

function airFilter(){
 const m=modelBase('air-filter');const shell=part(m,'Vỏ lọc khí');cover(m,tube(.63,.035,1.95,[0,0,0],M.dark,shell,'x'));cyl(.63,.07,[.99,0,0],M.dark,shell,'x');
 pipe([[.9,0,0],[1.5,0,0],[1.5,-.6,0]],.17,M.black,shell);for(const x of [-.7,.7]){ring(.66,.61,.06,[x,0,0],M.steel,shell,'x');box([.18,.13,.23],[x,-.66,0],M.steel,shell);}
 const filter=part(m,'Lõi lọc xếp nếp');mesh(pleats(.50,.42,1.64,96,'x'),M.paper,[0,0,0],filter);for(const x of [-.84,.84])ring(.51,.15,.07,[x,0,0],M.dark,filter,'x');explode(m,filter,[-1.45,0,0]);
 const cap=part(m,'Nắp đầu và đai ốc tai',[-1.03,0,0]);cyl(.64,.07,[0,0,0],M.dark,cap,'x');torus(.59,.022,[.043,0,0],M.rubber,cap,'x');
 thread(.055,.2,[-.12,0,0],cap,'x');cyl(.115,.08,[-.24,0,0],M.brass,cap,'x');for(const z of [-.13,.13])box([.05,.06,.19],[-.25,0,z],M.brass,cap);explode(m,cap,[-2.25,0,0]);
 const tie=part(m,'Trục giữ lõi');thread(.045,1.8,[0,0,0],tie,'x',.12);return m;
}
function waterFilter(){
 const m=modelBase('water-filter');const head=part(m,'Đầu lọc cố định',[0,2.35,0]);cyl(.38,.23,[0,0,0],M.steel,head);for(const x of [-.52,.52]){tube(.10,.02,.35,[x,0,0],M.steel,head,'x');cyl(.15,.07,[x*.75,0,0],M.brass,head,'x',6);}
 const cup=part(m,'Cốc lọc tháo xuống',[0,1.13,0]);cover(m,tube(.34,.03,2.2,[0,0,0],M.white,cup));cover(m,dome(.34,.16,[0,-1.1,0],M.white,cup,true));explode(m,cup,[.45,-1.55,0]);
 const clamp=part(m,'Đai khóa',[0,2.25,0]);ring(.4,.33,.10,[0,0,0],M.steel,clamp);box([.22,.12,.15],[.38,0,0],M.steel,clamp);bolt([.4,.08,0],clamp,.045);explode(m,clamp,[.75,.2,0]);
 const cartridge=part(m,'Lõi lọc nước',[0,1.18,0]);mesh(pleats(.24,.205,1.85,64),M.paper,[0,0,0],cartridge);for(const y of [-.94,.94])ring(.25,.065,.05,[0,y,0],M.dark,cartridge);explode(m,cartridge,[-.6,-.5,0]);
 const screw=part(m,'Trục giữ và gioăng',[0,1.28,0]);thread(.045,1.96,[0,0,0],screw);torus(.325,.02,[0,1,0],M.rubber,screw);return m;
}
function combinedFilter(){
 const m=modelBase('combined-filter');vesselBase(m,'Vỏ lọc tổ hợp',{r:.72,h:2.15});
 const cap=part(m,'Nắp trên và mặt bích',[0,2.8,0]);ring(.81,.13,.1,[0,0,0],M.steel,cap);dome(.72,.22,[0,.05,0],M.steel,cap);boltCircle(cap,'y',.08,.735,12,.055);explode(m,cap,[0,1.2,0]);
 const filter=part(m,'Lõi lọc dài',[0,1.63,0]);mesh(pleats(.32,.27,1.9,96),M.paper,[0,0,0],filter);for(const y of [-.97,.97])ring(.34,.07,.07,[0,y,0],M.dark,filter);explode(m,filter,[0,.6,0]);
 const clamp=part(m,'Đĩa ép và đai ốc',[0,2.7,0]);ring(.43,.07,.07,[0,0,0],M.bright,clamp);cyl(.11,.1,[0,.1,0],M.brass,clamp,'y',6);explode(m,clamp,[0,1,0]);
 const tie=part(m,'Trục giữ và đế lõi',[0,1.6,0]);thread(.055,2.1,[0,0,0],tie);ring(.39,.06,.08,[0,-.98,0],M.steel,tie);
 for(const x of [-.95,.95]){pipe([[Math.sign(x)*.6,1.1,0],[x,1.1,0]],.12,M.steel,m.root);flange([x,1.1,0],m.root,'x',.23);}return m;
}

function solenoid(m,name,pos,parent=m.root){
 const g=part(m,name,pos,parent);cyl(.15,.38,[0,0,0],M.brass,g,'x',6);tube(.095,.02,.65,[0,0,0],M.brass,g,'x');
 box([.28,.36,.28],[0,.29,0],M.dark,g);cyl(.065,.14,[0,.52,0],M.steel,g);bolt([0,.6,0],g,.045);box([.12,.18,.15],[.17,.29,0],M.black,g);return g;
}
function softener(){
 const m=modelBase('softener');const tank=part(m,'Bình làm mềm nước');cover(m,tube(.63,.04,2.6,[0,1.55,0],M.white,tank));cover(m,dome(.63,.33,[0,2.85,0],M.white,tank));cover(m,dome(.63,.25,[0,.25,0],M.white,tank,true));cyl(.58,.12,[0,.12,0],M.dark,tank);
 const beads=[];for(let i=0;i<360;i++){const a=i*2.39996,r=.52*Math.sqrt(((i*41)%359)/359);beads.push({p:[Math.cos(a)*r,.4+((i*29)%359)/359*2.2,Math.sin(a)*r]});}
 instances(new THREE.SphereGeometry(.045,6,5),M.resin,beads,tank,'Hạt nhựa minh họa');
 const head=part(m,'Đầu điều khiển',[0,3.15,0]);box([.77,.32,.48],[0,0,0],M.dark,head);cyl(.18,.17,[0,-.21,0],M.brass,head);explode(m,head,[0,.7,0]);
 const valves=part(m,'Van nước bù và nhánh tay',[1.8,1.7,0]);solenoid(m,'Van điện từ nước bù',[0,0,0],valves);pipe([[-.35,0,0],[-.65,0,0],[-.65,-.55,0],[.65,-.55,0],[.65,0,0],[.35,0,0]],.07,M.steel,valves);
 box([.35,.05,.08],[0,-.34,0],M.blue,valves);rod([0,-.55,0],[0,-.34,0],.045,M.brass,valves);
 pipe([[.37,3.15,0],[1,3.15,0],[1,1.7,0],[1.45,1.7,0]],.07,M.blue,m.root);
 const strainer=part(m,'Lọc Y và van xả',[2.7,.6,0]);tube(.11,.025,.65,[0,0,0],M.brass,strainer,'x');const branch=tube(.10,.02,.4,[0,-.15,0],M.brass,strainer);branch.rotation.z=-.6;cyl(.14,.07,[.12,-.35,0],M.brass,strainer,'y',6);solenoid(m,'Van xả minh họa',[0,.9,0],strainer);return m;
}

function valve(type){
 const m=modelBase(type);const body=part(m,'Thân van');
 if(type==='inlet'){
   cover(m,tube(.52,.08,.68,[0,0,0],M.casting,body));ring(.67,.45,.1,[0,-.36,0],M.steel,body);boltCircle(body,'y',-.29,.57,8,.05);
   const disc=part(m,'Đĩa van hút');cyl(.43,.055,[0,0,0],M.brass,disc);rod([-.58,0,0],[.58,0,0],.065,M.steel,body);m.motions.push({object:disc,axis:'z',ratio:.25,oscillate:true});
   const actuator=part(m,'Cơ cấu chấp hành',[.76,0,0]);cyl(.25,.65,[0,0,0],M.dark,actuator,'x');cyl(.12,.22,[-.35,0,0],M.steel,actuator,'x');explode(m,actuator,[.6,0,0]);
 }else if(type==='minimum'){
   cover(m,tube(.33,.065,.9,[0,.15,0],M.brass,body));ring(.5,.25,.10,[0,-.34,0],M.steel,body);boltCircle(body,'y',-.27,.42,6,.055);
   pipe([[0,.12,0],[.8,.12,0]],.16,M.brass,body);flange([.8,.12,0],body,'x',.27);
   const cap=part(m,'Nắp lò xo',[0,.7,0]);cyl(.38,.18,[0,0,0],M.steel,cap);cyl(.14,.22,[0,.18,0],M.steel,cap,'y',6);explode(m,cap,[0,.6,0]);
   const spring=part(m,'Lò xo và đĩa van');const pts=[];for(let i=0;i<=220;i++){const a=i/220*7*Math.PI*2;pts.push(new THREE.Vector3(.18*Math.cos(a),-.05+i/220*.6,.18*Math.sin(a)));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),220,.022,6,false),M.dark,[0,0,0],spring);cyl(.27,.065,[0,-.1,0],M.bright,spring);gauge([.3,.58,.2],body,.17);
 }else if(type==='check'){
   cover(m,tube(.35,.07,.95,[0,0,0],M.steel,body,'x'));for(const x of [-.52,.52]){ring(.48,.28,.1,[x,0,0],M.steel,body,'x');boltCircle(body,'x',x+.06,.4,8,.045);}
   const disc=part(m,'Đĩa một chiều');cyl(.28,.065,[0,0,0],M.brass,disc,'x');m.motions.push({object:disc,axis:'x',ratio:.2,translate:true});
   const spring=part(m,'Lò xo hồi van một chiều'),points=[];
   for(let i=0;i<=144;i++){const a=i/144*6*Math.PI*2;points.push(new THREE.Vector3(.06+i/144*.35,.17*Math.cos(a),.17*Math.sin(a)));}
   mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),144,.016,6,false),M.dark,[0,0,0],spring);
 }else if(type==='water-valve'){
   solenoid(m,'Cụm van điện từ',[0,0,0]);const plunger=part(m,'Ty van',[0,.1,0]);cyl(.06,.5,[0,0,0],M.bright,plunger);m.motions.push({object:plunger,axis:'y',ratio:.13,translate:true});
 }else{
   box([.65,.4,.55],[0,0,0],M.brass,body);for(const z of [-.17,.17])for(const x of [-.4,.4]){tube(.065,.02,.28,[x,0,z],M.steel,body,'x');cyl(.1,.09,[x*.9,0,z],M.brass,body,'x',6);}tube(.11,.025,.36,[0,.32,0],M.steel,body);for(const x of [-.2,.2])bolt([x,.22,0],body,.035);
 }return m;
}

function chassis(){
 const m=modelBase('chassis');const base=part(m,'Bệ và khung thép');
 for(const z of [-1.7,1.7])box([5.7,.22,.18],[0,0,z],M.paint,base);for(const x of [-2.75,2.75])box([.18,.22,3.6],[x,0,0],M.paint,base);
 for(const x of [-2.6,2.6])for(const z of [-1.58,1.58]){box([.13,3.4,.13],[x,1.8,z],M.steel,base);box([.33,.07,.33],[x,-.15,z],M.dark,base);bolt([x,.15,z],base,.08);}
 for(const z of [-1.6,1.6])box([5.3,.1,.13],[0,3.55,z],M.steel,base);
 const cabinet=part(m,'Tủ điện',[1.8,1.55,0]);box([1.25,2.25,1.5],[0,0,0],M.white,cabinet);const door=part(m,'Cửa tủ điện',[0,0,.79],cabinet);cover(m,box([1.21,2.15,.055],[0,0,0],M.white,door));box([.065,.35,.05],[.43,0,.06],M.dark,door);for(const x of [-.5,.5])for(const y of [-.9,.9])bolt([x,y,.04],door,.025,'z');explode(m,door,[0,0,.8]);
 const panel=part(m,'Bảng điều khiển',[1.6,3.2,1.65]);box([1.45,.6,.10],[0,0,0],M.white,panel);box([.85,.39,.035],[-.13,0,.07],M.dark,panel);box([.7,.27,.01],[-.13,0,.094],M.blue,panel);cyl(.095,.08,[.55,0,.10],M.red,panel,'z');return m;
}

function receiver(){
 const m=modelBase('receiver');vesselBase(m,'Vỏ bình tích áp',{r:.87,h:3.25});
 const ports=part(m,'Cổng khí và phụ kiện');for(const [x,y] of [[-1.15,1.1],[1.15,3.0]]){pipe([[Math.sign(x)*.75,y,0],[x,y,0]],.12,M.steel,ports);flange([x,y,0],ports,'x',.25);}
 pipe([[0,3.95,0],[0,4.25,0]],.07,M.brass,ports);cyl(.11,.1,[0,4.27,0],M.red,ports);gauge([.4,3.55,.7],ports,.25);
 pipe([[0,.25,0],[0,-.05,0],[.6,-.05,0]],.055,M.brass,ports);box([.28,.045,.08],[.35,.06,0],M.blue,ports);return m;
}
function dryer(){
 const m=modelBase('dryer');const shell=part(m,'Vỏ máy sấy lạnh');box([3.15,.1,2.2],[0,0,0],M.dark,shell);cover(m,box([.07,3,2.2],[-1.54,1.55,0],M.white,shell));cover(m,box([.07,3,2.2],[1.54,1.55,0],M.white,shell));cover(m,box([3.15,.08,2.2],[0,3.08,0],M.white,shell));cover(m,box([3.15,3,.06],[0,1.55,1.1],M.white,shell));
 const compressor=part(m,'Máy nén môi chất lạnh',[-.8,.65,0]);cyl(.42,.9,[0,0,0],M.black,compressor);dome(.42,.25,[0,.45,0],M.black,compressor);for(const x of [-.3,.3])box([.15,.15,.35],[x,-.52,0],M.dark,compressor);
 const hx=part(m,'Khối trao đổi nhiệt khí',[.55,2.15,0]);box([1.25,1.25,.85],[0,0,0],M.casting,hx);for(let i=0;i<12;i++)box([1.27,.012,.87],[0,-.53+i*.096,0],M.steel,hx);
 for(const x of [-.32,.32]){pipe([[x,2.8,0],[x,3.45,0]],.09,M.blue,m.root);}
 const condenser=part(m,'Dàn ngưng và quạt',[.5,.7,-.65]);const fins=[];for(let i=0;i<52;i++)fins.push({p:[-.7+i*1.4/51,0,0]});instances(new THREE.BoxGeometry(.012,.85,.3),M.casting,fins,condenser,'Lá tản nhiệt dàn ngưng');const fg=part(m,'Giá quạt máy sấy',[0,0,.45],condenser);fg.rotation.x=Math.PI/2;fan(m,[0,0,0],.48,fg,'Quạt dàn ngưng');fanGuard([0,.06,0],.5,fg);
 pipe([[-.8,1.1,0],[-.8,1.45,-.6],[.4,1.45,-.6],[.4,.7,-.6]],.04,M.copper,m.root);pipe([[.5,1,-.6],[1.13,1,-.6],[1.13,2.2,0],[.6,2.2,0]],.035,M.copper,m.root);
 const drain=part(m,'Bộ tách và xả ngưng',[.9,.65,.6]);cyl(.17,.7,[0,0,0],M.steel,drain);solenoid(m,'Van xả ngưng',[0,-.47,0],drain);return m;
}
function desiccant(){
 const m=modelBase('desiccant');box([3.4,.12,1.7],[0,0,0],M.dark,m.root);
 for(const x of [-.9,.9]){
   const t=part(m,`Tháp ${x<0?'A':'B'}`,[x,0,0]);cover(m,tube(.57,.04,2.6,[0,1.65,0],M.steel,t));cover(m,dome(.57,.25,[0,2.95,0],M.steel,t));cover(m,dome(.57,.25,[0,.35,0],M.steel,t,true));
   const beads=[];for(let i=0;i<260;i++){const a=i*2.39996,r=.49*Math.sqrt(((i*47)%259)/259);beads.push({p:[Math.cos(a)*r,.53+((i*31)%259)/259*2.2,Math.sin(a)*r]});}instances(new THREE.SphereGeometry(.045,5,4),M.paper,beads,t,'Hạt hút ẩm minh họa');
   for(const y of [.43,2.84])ring(.5,.08,.045,[0,y,0],M.dark,t);gauge([0,2.5,.6],t,.17);pipe([[0,3.2,0],[0,3.6,0],[-x,3.6,0]],.075,M.steel,t);
   solenoid(m,`Van tháp ${x<0?'A':'B'}`,[0,.25,.65],t);pipe([[0,.2,0],[0,.2,.65],[.35,.2,.65]],.07,M.steel,t);cyl(.12,.47,[.38,-.02,.65],M.dark,t);
 }
 const controls=part(m,'Bộ điều khiển',[0,1.7,.7]);box([.55,.8,.2],[0,0,0],M.dark,controls);box([.4,.3,.025],[0,.14,.12],M.blue,controls);return m;
}

// Cổng nối của các cụm chưa nâng cấp chi tiết: [tên, vị trí, hướng ra, tùy chọn]. Vị trí theo hình học hiện có, là ước lượng.
const EXTRA_PORTS={
 'air-filter':[['Gió vào qua nắp lọc',[-1.08,0,0],[-1,0,0],{kind:'khi',size:.3}],['Gió sạch ra (tới ống mềm đầu hút)',[1.5,-.6,0],[0,-1,0],{kind:'khi',size:.17}]],
 'water-filter':[['Nước vào',[.7,2.35,0],[1,0,0],{kind:'nuoc',size:.1}],['Nước đã lọc ra',[-.7,2.35,0],[-1,0,0],{kind:'nuoc',size:.1}]],
 'combined-filter':[['Nước vào',[-.98,1.1,0],[-1,0,0],{kind:'nuoc',size:.12}],['Nước đã lọc ra',[.98,1.1,0],[1,0,0],{kind:'nuoc',size:.12}]],
 softener:[['Nước cấp vào (H7: áp lực ≥ 0,2 MPa)',[3.03,.6,0],[1,0,0],{kind:'nuoc',size:.1}],['Nước bù ra (tới bình tách)',[2.13,1.7,0],[1,0,0],{kind:'nuoc',size:.08}]],
 inlet:[['Gió sạch vào (từ lọc khí)',[0,.34,0],[0,1,0],{kind:'khi',size:.44}],['Mặt bích lắp lên cửa hút đầu nén',[0,-.41,0],[0,-1,0],{kind:'khi',size:.45}]],
 minimum:[['Vào từ bình tách',[0,-.39,0],[0,-1,0],{kind:'khi',size:.25}],['Khí ra (tới đường khí nén)',[.84,.12,0],[1,0,0],{kind:'khi',size:.16}]],
 check:[['Vào từ cửa xả đầu nén',[-.58,0,0],[-1,0,0],{kind:'khi',size:.28}],['Ra ống chính tới bình tách',[.58,0,0],[1,0,0],{kind:'khi',size:.28}]],
 'water-valve':[['Nước vào',[-.33,0,0],[-1,0,0],{kind:'nuoc',size:.08}],['Nước ra (tới bộ chia nước)',[.33,0,0],[1,0,0],{kind:'nuoc',size:.08}],['Dây điện cuộn van',[.23,.29,0],[1,0,0],{kind:'dien',size:.05}]],
 distributor:[['Nước vào',[0,.5,0],[0,1,0],{kind:'nuoc',size:.09}],...[[-.54,-.17],[-.54,.17],[.54,-.17],[.54,.17]].map(([x,z],i)=>[`Nhánh ra ${i+1}`,[x,0,z],[Math.sign(x),0,0],{kind:'nuoc',size:.065}])],
 chassis:[...[[-2.6,-1.58],[-2.6,1.58],[2.6,-1.58],[2.6,1.58]].map(([x,z],i)=>[`Chân bệ ${i+1}`,[x,-.19,z],[0,-1,0],{kind:'co-khi',size:.15}])],
 receiver:[['Khí nén vào',[-1.2,1.1,0],[-1,0,0],{kind:'khi',size:.12}],['Khí nén ra',[1.2,3.0,0],[1,0,0],{kind:'khi',size:.12}],['Xả đáy',[.6,-.05,0],[1,0,0],{kind:'nuoc',size:.055}]],
 dryer:[['Khí ẩm vào',[-.32,3.45,0],[0,1,0],{kind:'khi',size:.09}],['Khí khô ra',[.32,3.45,0],[0,1,0],{kind:'khi',size:.09}],['Xả nước ngưng',[.9,.0,.6],[0,-1,0],{kind:'nuoc',size:.05}]],
 desiccant:[['Khí ẩm vào (vị trí ước lượng)',[0,.2,.95],[0,0,1],{kind:'khi',size:.08}],['Khí khô ra',[0,3.68,0],[0,1,0],{kind:'khi',size:.08}]],
};
// Nhóm có kết cấu bên trong không có bản vẽ: đánh dấu cấu tạo minh họa.
const ILLUSTRATIVE={
 inlet:['Đĩa van hút'],minimum:['Lò xo và đĩa van'],check:['Đĩa một chiều','Lò xo hồi van một chiều'],'water-valve':['Ty van'],
 softener:['Van xả minh họa'],dryer:['Máy nén môi chất lạnh','Khối trao đổi nhiệt khí','Dàn ngưng và quạt','Bộ tách và xả ngưng'],
};
export function buildModel(id,params={}){
 resetGeometryCache();
 const builders={rotor,airend,motor,separator,cooler,'air-filter':airFilter,'water-filter':waterFilter,'combined-filter':combinedFilter,softener,chassis,receiver,dryer,desiccant};
 const model=builders[id]?builders[id](params):valve(id);
 model.meta=CATALOG.find(p=>p.id===id);if(!model.meta)throw new Error('Không có mô hình '+id);
 if(model.meta.params)model.info.defaults={...PARAM_DEFAULTS[model.meta.params]};
 for(const [name,pos,dir,opts] of EXTRA_PORTS[id]??[])port(model,name,pos,dir,opts);
 for(const p of model.parts)if(ILLUSTRATIVE[id]?.includes(p.name)){p.userData.minhHoa=true;p.userData.description=(p.userData.description?p.userData.description+' ':'')+'Kết cấu bên trong không có bản vẽ: cấu tạo minh họa.';}
 model.root.updateMatrixWorld(true);
 for(const motion of model.motions){motion.initial=motion.object.rotation[motion.axis];motion.origin=motion.object.position[motion.axis];}
 return model;
}
export function setExplosion(model,value){for(const e of model.explodables)e.object.position.copy(e.base).addScaledVector(e.offset,value);model.root.updateMatrixWorld(true);}
export function updateMotion(model,t){for(const a of model.motions){if(a.translate)a.object.position[a.axis]=a.origin+(Math.sin(t)+1)*.5*a.ratio;else a.object.rotation[a.axis]=a.initial+(a.oscillate?Math.sin(t)*a.ratio:t*a.ratio);}model.flow?.update(t);}
// Vùng bị cắt bỏ khi bật mặt cắt (tọa độ mô hình). Mặc định bỏ nửa phía +Z như bản trước.
export function sectionBox(model){
 const b=new THREE.Box3().setFromObject(model.root).expandByScalar(.5),c=b.getCenter(new THREE.Vector3()),s=model.section;
 const min=s?new THREE.Vector3(...s.min):new THREE.Vector3(-Infinity,-Infinity,c.z+.02),max=s?new THREE.Vector3(...s.max):new THREE.Vector3(Infinity,Infinity,Infinity);
 return new THREE.Box3(min.max(b.min),max.min(b.max));
}
// Mặt cắt: vỏ kín (model.solids) được cắt thật bằng CSG, mặt cắt tô màu; vỏ mỏng còn lại (model.covers) dùng mặt phẳng cắt.
export function setSection(model,on){
 model.root.updateMatrixWorld(true);
 const box=sectionBox(model),full=new THREE.Box3().setFromObject(model.root).expandByScalar(.4),inv=model.root.matrixWorld.clone().invert(),planes=[];
 for(const a of ['x','y','z']){const n=new THREE.Vector3();
   if(box.min[a]>full.min[a]){n[a]=-1;planes.push(new THREE.Plane(n.clone(),box.min[a]));}
   if(box.max[a]<full.max[a]){n[a]=1;planes.push(new THREE.Plane(n.clone(),-box.max[a]));}}
 const key=box.min.toArray().concat(box.max.toArray()).map(v=>v.toFixed(3)).join();
 for(const o of model.solids){
   o.userData.original??={geometry:o.geometry,material:o.material};
   if(on){if(o.userData.sectionKey!==key){o.userData.section?.geometry.dispose();o.userData.section=sectionGeometry({geometry:o.userData.original.geometry,material:o.userData.original.material,matrixWorld:o.matrixWorld},box,inv);o.userData.sectionKey=key;}
     o.geometry=o.userData.section.geometry;o.material=o.userData.section.material;}
   else{o.geometry=o.userData.original.geometry;o.material=o.userData.original.material;}
 }
 for(const o of model.covers)for(const mat of [o.material].flat()){mat.clippingPlanes=on?planes:[];mat.clipIntersection=true;mat.clipShadows=true;mat.needsUpdate=true;}
 model.sectionOn=on;return planes;
}
// Hiện hoặc ẩn dấu cổng nối (không ghi vào GLB).
export function showPorts(model,on){for(const p of model.ports)p.traverse(o=>{if(o.userData.portMarker)o.visible=on;});}
// Đảo chiều gió của cụm có hạt gió: 'len' (từ dưới lên) hoặc 'xuong' (từ trên xuống). Quạt quay ngược theo.
export function setAirflow(model,dir){if(!model.flow?.setDirection)return;model.flow.setDirection(dir);}
