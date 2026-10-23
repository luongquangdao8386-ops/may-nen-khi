import { THREE,M,modelBase,part,explode,cover,solid,mesh,box,roundedBox,cyl,ball,rod,ring,torus,tube,bolt,boltCircle,thread,pipe,dome,gauge,flange,screwGeometry,gateGeometry,pleats,instances,fan,fanGuard,
 revolve,revolveGeometry,threadGeometry,keyedShaftGeometry,keyGeometry,bearing,lipSeal,circlipGeometry,lockNut,csgGeometry,placed,boxG,rboxG,cylG,revG,port,orientObject,
 screwKinematics,singleScrewGeometry,starGeometry,resetGeometryCache,sectionGeometry,springGeometry,hoseGeometry,orientX } from './geometry.js';
import { ROTOR_DEFAULTS } from './geometry.js';
export { ROTOR_DEFAULTS };

export const REFERENCES={H1:'Tổng thể máy',H2:'Mặt cắt đầu nén',H3:'Trục vít và hai bánh sao',H4:'Tuyến khí / đầu nén',H5:'Két gió và vòng nước',H6:'Van / bộ chia; sơ đồ giải nhiệt nước',H7:'Nước bù / cảm biến / van',H8:'Tháo lọc khí',H9:'Tháo lọc nước nhỏ',H10:'Lọc nước tổ hợp'};
export const CATALOG=[
 {id:'station',name:'Trạm hoàn chỉnh',group:'Trạm',refs:['H1','H4','H5','H6','H7','H9'],tag:'00',params:'station',note:'Ghép 16 cụm thành trạm (trục vít và bánh sao nằm trong đầu nén): gói máy (bệ, giá chống rung, đầu nén – động cơ, bình tách, van, lọc, bộ chia, két nóc, tủ điện) có đủ ống khí, ống nước, cáp; ngoài gói là cụm nước bù – làm mềm và chuỗi bình tích áp → máy sấy lạnh → máy sấy hấp phụ.',detail:'Vị trí cụm theo H1; tuyến khí theo H4, vòng nước theo H5/H6, nước bù và xả theo H7. Cao độ, khoảng cách, đường đi ống và cáp là ước lượng. Mặt cắt cắt bỏ góc trên – trước của gói máy để nhìn vào trong. Tách cụm nâng két nóc và mở vỏ, cửa tủ điện. Nhóm gắn nhãn minh họa là kết cấu không có bản vẽ.'},
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
 {id:'chassis',name:'Khung · tủ điện',group:'Khung & điện',refs:['H1','H9'],tag:'15',params:'chassis',note:'Bệ máy, cột, dầm nóc, tủ điện và bảng điều khiển.',detail:'Bộ khung giúp xem tương quan vị trí; chưa phải mô hình lắp toàn bộ máy. Màn hình là hình học đơn giản, không ảnh nền.'},
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
 chassis:[{key:'enclosure',label:'Vỏ bao che',type:'select',options:[['mo','Khung hở (H1)'],['dong','Có vỏ bao che (H9)']]}],
 station:[{key:'enclosure',label:'Vỏ bao che',type:'select',options:[['mo','Khung hở (H1)'],['dong','Có vỏ bao che (H9)']]},{key:'airflow',label:'Chiều gió qua két',type:'select',options:[['len','Từ dưới lên (giả định)'],['xuong','Từ trên xuống']]},{key:'external',label:'Thiết bị ngoài',type:'select',options:[['co','Bình tích áp, sấy lạnh, sấy hấp phụ'],['khong','Chỉ gói máy và nước bù']]}],
};
export const PARAM_DEFAULTS={rotor:ROTOR_DEFAULTS,cooler:{airflow:'len'},chassis:{enclosure:'mo'},station:{enclosure:'mo',airflow:'len',external:'co'}};

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
 // Đầu nối nước bôi trơn ổ: H6 ghi bộ chia nước chia nước tới các bộ phận của đầu nén; vị trí từng điểm là giả định.
 const lub=part(m,'Đầu nối nước bôi trơn ổ (minh họa)',[0,0,0],m.root,'Ba đầu nối nhận nước từ bộ chia (H6): hai nắp ổ trên của bánh sao và nắp ổ đầu xả. Vị trí và số điểm là giả định; cấu tạo minh họa.',{minhHoa:true});
 const lubPts=[['Nước bôi trơn ổ bánh sao A',[r(.22),r(1.11),A]],['Nước bôi trơn ổ bánh sao B',[r(.22),r(1.11),-A]],['Nước bôi trơn ổ đầu xả',[N(.87),r(.44),0]]];
 for(const [name,[x,y,z]] of lubPts){cyl(r(.045),r(.05),[x,y+r(.025),z],M.brass,lub,'y',6);cyl(r(.03),r(.08),[x,y+r(.09),z],M.brass,lub,'y',16);port(m,name,[x,y+r(.13),z],[0,1,0],{kind:'nuoc',size:r(.03),note:'vị trí giả định'});}
 cover(m,lub);
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
// Kích thước chính (đơn vị quy ước, 1 ≈ 100 mm, ước lượng): R bán kính thân, fin chiều cao gân, L dài thân, H chiều cao tâm trục.
// Mặt bích (R 1,5, gờ định tâm R 1,16, 12 lỗ R 1,38) và đầu trục (R 0,16) giữ cố định để khớp chuông nối của đầu nén.
// params.guard=false: bỏ nắp che khớp nối (khi lắp vào chuông nối trong trạm).
function motor(params={}){
 const m=modelBase('motor'),R=1.1,fin=.14,L=3.1,H=1.5,xE=L/2,xF=xE+.29,tip=xF+1.03,FR=1.5;
 const finSkip=[[-Math.PI/2,.8],[Math.PI/2,.37]],finCount=48;
 const nFins=Array.from({length:finCount},(_,i)=>i/finCount*Math.PI*2).filter(a=>!finSkip.some(([c,w])=>Math.abs(Math.atan2(Math.sin(a-c),Math.cos(a-c)))<w)).length;
 m.info.summary=`Tâm trục cao ${fmt(H)} · thân R ${fmt(R)} có ${nFins} gân · mặt bích R ${fmt(FR)} khớp chuông nối đầu nén · khớp vấu 3+3, đệm sao 6 cánh`;
 // ---- Thân, chân đế, nắp đầu ----
 const frame=part(m,'Thân động cơ (vỏ gang có gân)',[0,0,0],m.root,`Vỏ gang hình trụ có ${nFins} gân tản nhiệt dọc trục, bỏ gân ở vùng chân đế và đệm hộp đấu điện. Số gân và kích thước ước lượng từ H1.`);
 solid(m,mesh(finnedFrameGeometry({R,fin,thick:.04,count:finCount,length:L,bore:R-.14,skip:finSkip}),M.motor,[0,0,0],frame,'Vỏ có gân'));
 solid(m,mesh(csgGeometry([rboxG([.9,.18,.8],[.15,R+.03,0],.03)],[cylG(R-.005,1,[.15,0,0],'x',64)]),M.motor,[0,0,0],frame,'Đệm hộp đấu điện'));
 const eye=part(m,'Bu lông vòng nâng',[-.8,R-.01,0],frame,'Bu lông vòng để nâng động cơ.');
 cyl(.1,.06,[0,.03,0],M.steel,eye);torus(.14,.035,[0,.27,0],M.steel,eye,'z');cyl(.04,.14,[0,.1,0],M.steel,eye);
 const name=part(m,'Biển tên động cơ',[-.5,.15,-(R+fin+.025)],frame,'Biển tên thông số; nội dung không lấy từ bản vẽ.');
 box([.62,.34,.01],[0,0,0],M.label,name);for(let i=0;i<6;i++)box([.5-(i%2)*.14,.014,.002],[-.03,.12-i*.05,-.006],M.dark,name);for(const x of [-.27,.27])for(const y of [-.13,.13])cyl(.012,.01,[x,y,-.006],M.steel,name,'z',8);
 const feet=part(m,'Chân đế',[0,0,0],m.root,`Bốn chân đúc liền thân, đế có lỗ bắt bu lông neo; chiều cao tâm trục ${fmt(H)} (ước lượng).`);
 const fx=xE-.5,fz=R*.56,fadd=[],fsub=[];
 for(const x of [-fx,fx])for(const sz of [-1,1]){fadd.push(boxG([.5,H-.35,.3],[x,-(H+.35)/2,sz*fz]),boxG([.62,.09,.7],[x,-H+.045,sz*(fz+.23)]),placed(new THREE.BoxGeometry(.08,.5,.45),[x,-H+.3,sz*(fz+.22)],[sz*.6,0,0]));fsub.push(cylG(.06,.3,[x,-H+.045,sz*(fz+.4)],'y',20));}
 fsub.push(cylG(R-.01,L,[0,0,0],'x',64));
 solid(m,mesh(csgGeometry(fadd,fsub),M.motor,[0,0,0],feet,'Chân đúc'));
 const anchors=new THREE.Group();feet.add(anchors);for(const x of [-fx,fx])for(const z of [-(fz+.4),fz+.4])bolt([x,-H+.09,z],anchors,.07,'y',.25);cover(m,anchors);
 const de=part(m,'Nắp đầu phía truyền động (mặt bích)',[0,0,0],m.root,'Nắp đầu có gân, gờ định tâm và mặt bích mười hai lỗ, khớp với mặt bích chuông nối của đầu nén (kiểu chân đế + mặt bích).');
 const holes=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2+Math.PI/12;holes.push(cylG(.045,.3,[xE+.2,Math.cos(a)*1.38,Math.sin(a)*1.38],'x',16));}
 const deRibs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;deRibs.push(placed(new THREE.BoxGeometry(.15,.3,.06),[xE+.075,Math.cos(a)*(R+.12),Math.sin(a)*(R+.12)],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[xE,.38],[xE,R],[xE+.15,R],[xE+.15,FR],[xE+.25,FR],[xE+.25,1.16],[xE+.29,1.16],[xE+.29,.46],[xE+.35,.44],[xE+.35,.26],[xE+.25,.26],[xE+.25,.36],[xE+.02,.36],[xE+.02,.38]],[0,0,0],'x',96),...deRibs],holes),M.motor,[0,0,0],de,'Thân nắp đầu'));
 const fb=new THREE.Group();de.add(fb);boltCircle(fb,'-x',xE+.15,1.38,12,.045,Math.PI/12);cover(m,fb);
 const nde=part(m,'Nắp đầu phía quạt',[0,0,0],m.root,'Nắp đầu có gân hướng kính và moay-ơ ổ bi; bốn bu lông giữ vào thân.');
 const ndeRibs=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ndeRibs.push(placed(new THREE.BoxGeometry(.08,.5,.05),[-(xE+.2),Math.cos(a)*.75,Math.sin(a)*.75],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[-xE,.32],[-xE,R],[-(xE+.15),R],[-(xE+.18),R-.05],[-(xE+.18),.5],[-(xE+.28),.45],[-(xE+.28),.22],[-(xE+.2),.22],[-(xE+.2),.32]],[0,0,0],'x',96),...ndeRibs]),M.motor,[0,0,0],nde,'Thân nắp đầu'));
 const nb=new THREE.Group();nde.add(nb);for(const a of [Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4])bolt([-(xE+.15),Math.cos(a)*(R-.12),Math.sin(a)*(R-.12)],nb,.05,'-x',.18);cover(m,nb);
 explode(m,nde,[-.7,0,0]);explode(m,de,[.75,0,0]);
 // ---- Bên trong (minh họa) ----
 const stator=part(m,'Stato và cuộn dây (minh họa)',[0,0,0],m.root,'Lõi thép lá stato và đầu cuộn dây. Không có bản vẽ bên trong động cơ; cấu tạo minh họa.',{minhHoa:true});
 revolve([[-(xE-.4),.75],[-(xE-.4),R-.14],[xE-.4,R-.14],[xE-.4,.75]],[0,0,0],M.lamination,stator,'x',{segments:72});
 for(const x of [-(xE-.25),xE-.25]){const w=mesh(new THREE.TorusGeometry(.86,.1,10,56),M.winding,[x,0,0],stator,'Đầu cuộn dây');w.rotation.y=Math.PI/2;w.scale.set(1,1,1.4);}
 const brg=part(m,'Ổ bi hai đầu trục (minh họa)',[0,0,0],m.root,'Ổ bi đỡ hai đầu trục động cơ. Loại và cỡ ổ là giả định; cấu tạo minh họa.',{minhHoa:true});
 bearing(brg,{type:'bi',ri:.2,ro:.36,w:.18},[xE+.13,0,0],'x','Ổ bi phía truyền động');bearing(brg,{type:'bi',ri:.17,ro:.32,w:.15},[-(xE+.1),0,0],'x','Ổ bi phía quạt');
 // ---- Trục, roto, quạt, khớp nối (quay cùng nhau) ----
 const shaft=part(m,'Trục động cơ',[0,0,0],m.root,'Trục có ngõng ổ hai đầu, đoạn lắp quạt phía sau và đầu trục ra có rãnh then hở đầu.');
 revolve([[-(xE+.64),0],[-(xE+.64),.13],[-(xE+.62),.14],[-(xE+.2),.14],[-(xE+.2),.17],[-(xE-.05),.17],[-(xE-.05),.24],[xE-.05,.24],[xE-.05,.2],[xE+.27,.2],[xE+.27,.18],[xF+.08,.18],[xF+.08,.16],[xF+.45,.16],[xF+.45,0]],[0,0,0],M.bright,shaft,'x',{segments:48,name:'Trục'});
 mesh(keyedShaftGeometry({r:.16,length:tip-xF-.45,keyWidth:.05,keyDepth:.03}),M.bright,[xF+.45,0,0],shaft,'Đầu trục có rãnh then');
 const k=part(m,'Then đầu trục động cơ',[(xF+.45+tip)/2,.16,0],shaft,'Then bằng truyền mô-men sang nửa khớp nối.');mesh(keyGeometry(.05,.05,tip-xF-.55),M.steel,[0,0,0],k);explode(m,k,[0,.3,0]);
 const rot=part(m,'Roto lồng sóc (minh họa)',[0,0,0],shaft,'Lõi roto và vòng ngắn mạch hai đầu. Cấu tạo minh họa.',{minhHoa:true});
 revolve([[-(xE-.4),.24],[-(xE-.4),.72],[xE-.4,.72],[xE-.4,.24]],[0,0,0],M.lamination,rot,'x',{segments:72});for(const x of [-(xE-.35),xE-.35])revolve([[x-.05,.42],[x-.05,.71],[x+.05,.71],[x+.05,.42]],[0,0,0],M.brass,rot,'x',{segments:48});
 const fanP=part(m,'Quạt làm mát động cơ',[-(xE+.42),0,0],shaft,'Quạt ly tâm cánh thẳng lắp sau trục, hút gió qua lưới và thổi dọc các gân thân.');
 revolve([[-.1,.14],[-.1,.21],[.1,.21],[.1,.14]],[0,0,0],M.black,fanP,'x',{segments:32});revolve([[.08,.2],[.08,.95],[.1,.95],[.1,.2]],[0,0,0],M.black,fanP,'x',{segments:64});
 const blades=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;blades.push({p:[-.02,Math.cos(a)*.58,Math.sin(a)*.58],r:[a,0,0]});}instances(new THREE.BoxGeometry(.19,.74,.025),M.black,blades,fanP,'Cánh quạt');
 const cpl=part(m,'Khớp nối vấu cong',[0,0,0],shaft,'Hai nửa khớp nối bằng thép, mỗi nửa ba vấu; đệm đàn hồi hình sao nằm giữa các vấu. Kiểu khớp là giả định thường gặp; cấu tạo minh họa.',{minhHoa:true});
 const h1=part(m,'Nửa khớp nối phía động cơ',[0,0,0],cpl,'Lắp trên đầu trục động cơ bằng then, khóa bằng vít chìm.');jawHub(h1,{bore:.16,ro:.34,len:.46,jaw:.12,phase:0,dir:1},tip-.46,'Nửa khớp');
 const spider=part(m,'Đệm đàn hồi hình sao',[0,0,0],cpl,'Đệm sáu cánh bằng vật liệu đàn hồi, truyền mô-men và bù lệch trục nhỏ.');
 {const s=new THREE.Shape(),n=6,ro=.335,ri=.19,w=.09;s.moveTo(Math.cos(-w)*ro,Math.sin(-w)*ro);for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.PI/6;s.absarc(0,0,ro,a-w,a+w,false);const b=a+w,c=a+Math.PI*2/n-w;s.lineTo(Math.cos(b)*ri,Math.sin(b)*ri);s.absarc(0,0,ri,b,c,false);s.lineTo(Math.cos(c)*ro,Math.sin(c)*ro);}
  const h=new THREE.Path();h.absarc(0,0,.12,0,Math.PI*2,true);s.holes.push(h);mesh(extrudeX(s,.12,tip,.01),M.handle,[0,0,0],spider,'Đệm sao');}
 const h2=part(m,'Nửa khớp nối phía đầu nén',[0,0,0],cpl,'Lắp trên đầu trục vít (bán kính 0,21 như cụm đầu nén); ba vấu xen kẽ với vấu nửa phía động cơ.');jawHub(h2,{bore:.21,ro:.34,len:.5,jaw:.12,phase:Math.PI/3,dir:-1},tip+.12+.5,'Nửa khớp');
 explode(m,h2,[.75,0,0]);explode(m,spider,[.38,0,0]);
 m.motions.push({object:shaft,axis:'x',ratio:1.2});
 // ---- Nắp quạt và lưới bảo vệ ----
 const c0=-(xE+.06),c1=-(xE+.74),cr=R+.1;
 const cowl=part(m,'Nắp quạt và lưới bảo vệ',[0,0,0],m.root,'Nắp tôn bao quạt; mặt sau là lưới nan hướng kính và vòng tròn (theo hình động cơ ở H1).');
 solid(m,revolve([[c0,cr-.025],[c0,cr],[c1+.1,cr],[c1,cr-.1],[c1,1.0],[c1+.02,1.0],[c1+.02,cr-.105],[c1+.11,cr-.025]],[0,0,0],M.motorDark,cowl,'x',{segments:96,name:'Vỏ nắp quạt'}));
 const grille=new THREE.Group();grille.name='Lưới bảo vệ';cowl.add(grille);
 for(const rr of [.32,.52,.72,.92])torus(rr,.013,[c1+.01,0,0],M.motorDark,grille,'x');
 const bars=[];for(let i=0;i<52;i++){const a=i/52*Math.PI*2;bars.push({p:[c1+.01,Math.cos(a)*.6,Math.sin(a)*.6],r:[a,0,0]});}instances(new THREE.BoxGeometry(.024,.8,.016),M.motorDark,bars,grille,'Nan lưới');
 cyl(.2,.024,[c1+.01,0,0],M.motorDark,grille,'x',32);cover(m,grille);
 const cb=new THREE.Group();cowl.add(cb);for(const a of [Math.PI/2,Math.PI/2+Math.PI*2/3,Math.PI/2+Math.PI*4/3])bolt([c0-.12,Math.cos(a)*cr,Math.sin(a)*cr],cb,.035,'y',.06).quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(0,Math.cos(a),Math.sin(a)));cover(m,cb);
 explode(m,cowl,[-1.3,0,0]);explode(m,fanP,[-.6,0,0]);
 // ---- Hộp đấu điện và đầu cáp ----
 const tb=part(m,'Hộp đấu điện',[.15,R+.12,0],m.root,'Hộp đấu dây đúc trên đỉnh thân, có nắp bắt bốn vít; đầu cáp ở mặt bên.');
 solid(m,mesh(csgGeometry([rboxG([.85,.46,.75],[0,.23,0],.04)],[rboxG([.73,.44,.63],[0,.3,0],.03),cylG(.07,.2,[.15,.2,.37],'z',20),cylG(.07,.2,[-.15,.2,.37],'z',20)]),M.motor,[0,0,0],tb,'Thân hộp'));
 const block=part(m,'Cầu đấu dây (minh họa)',[0,.13,0],tb,'Tấm cách điện và sáu bu lông đấu dây. Cấu tạo minh họa.',{minhHoa:true});
 box([.5,.05,.32],[0,0,0],M.white,block);for(const x of [-.16,0,.16])for(const z of [-.08,.08]){cyl(.024,.1,[x,.06,z],M.brass,block,'y',12);cyl(.04,.025,[x,.075,z],M.brass,block,'y',6);}
 cyl(.03,.06,[-.3,.05,-.2],M.brass,block,'y',6);
 const lid=part(m,'Nắp hộp đấu điện',[0,.49,0],tb,'Nắp có gioăng, bốn vít góc.');
 solid(m,roundedBox([.89,.06,.79],[0,0,0],M.motor,lid,.03));for(const x of [-.36,.36])for(const z of [-.31,.31])bolt([x,.03,z],lid,.03,'y',.08);explode(m,lid,[0,.6,0]);
 const gl=part(m,'Đầu cáp và cáp nguồn',[0,0,0],tb,'Hai đầu cáp xiết kín và cáp nguồn đi ra; hướng cáp là minh họa.');
 for(const x of [.15,-.15]){cyl(.085,.05,[x,.2,.4],M.brass,gl,'z',6);cyl(.07,.08,[x,.2,.46],M.brass,gl,'z',24);if(params.cable!==false)pipe([[x,.2,.49],[x,.2,.75],[x,.1,1.2],[x-.1,-1.2,1.45]],.042,M.black,gl);}
 cover(m,gl);explode(m,gl,[0,0,.45]);
 port(m,'Mặt bích nối chuông đầu nén',[xF,0,0],[1,0,0],{kind:'co-khi',size:FR,note:'gờ định tâm bán kính 1,16; 12 lỗ trên vòng bán kính 1,38'});
 port(m,'Đầu trục động cơ',[tip,0,0],[1,0,0],{kind:'co-khi',size:.16});
 port(m,'Nửa khớp nối phía đầu nén',[tip+.62,0,0],[1,0,0],{kind:'co-khi',size:.21,note:'lỗ trục bán kính 0,21'});
 port(m,'Đầu cáp nguồn',[.15+.15,R+.12+.2,.5],[0,0,1],{kind:'dien',size:.08});
 for(const x of [-fx,fx])for(const z of [-(fz+.4),fz+.4])port(m,`Lỗ chân đế ${x<0?'sau':'trước'} ${z<0?'phải':'trái'}`,[x,-H,z],[0,-1,0],{kind:'co-khi',size:.06});
 // ---- Nắp che khớp nối tháo được (khi dùng động cơ riêng, không có chuông nối) ----
 if(params.guard!==false){
  const guard=part(m,'Nắp che khớp nối',[0,0,0],m.root,'Nắp che hai nửa bằng tôn có cửa sổ, bắt bu lông ở mặt phân đôi; tháo được để kiểm tra khớp nối. Khi lắp với đầu nén, chuông nối thay vai trò nắp che.');
  const g0=xF,g1=tip+.66,tubeG=()=>revG([[g0,.44],[g0,.5],[g0+.04,.5],[g0+.04,.47],[g1,.47],[g1,.44]],[0,0,0],'x',72);
  for(const v of [1,-1]){const half=part(m,`Nửa nắp che ${v>0?'trên':'dưới'}`,[0,0,0],guard,'');
    const sub=[boxG([g1-g0+.4,1.2,1.2],[(g0+g1)/2,-v*.6,0])];if(v>0)for(const x of [g0+.5,g0+1.1])sub.push(rboxG([.4,.5,.36],[x,.45,0],.06));
    solid(m,mesh(csgGeometry([tubeG(),boxG([g1-g0-.04,.03,.12],[(g0+g1)/2+.02,v*.015,.5]),boxG([g1-g0-.04,.03,.12],[(g0+g1)/2+.02,v*.015,-.5])],sub),M.housingDark,[0,0,0],half,'Tôn nắp che'));
    if(v>0)for(const x of [g0+.35,g0+.95,g1-.15])for(const z of [-.5,.5])bolt([x,.03,z],half,.025,'y',.08);
    explode(m,half,[0,v*.9,0]);}
 }
 return m;
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
 const wp=new THREE.Vector3(...N.water.b).addScaledVector(new THREE.Vector3(...wd),.42);pipe([wp.toArray(),[wp.x*1.25,wp.y,wp.z*1.25],[wp.x*1.25,wp.y+.5,wp.z*1.25]],.05,M.blue,wo);explode(m,wo,[-.4,0,.15]);
 const mk=part(m,'Cửa nước bù',[0,0,0],m.root,'Cổ nhỏ nhận nước bù từ van điện từ nước bù (H7). Vị trí ước lượng.');
 const md=new THREE.Vector3(...polar(1,35,0)).normalize();cyl(.06,.07,new THREE.Vector3(...N.makeup.b).addScaledVector(md,.02).toArray(),M.brass,mk,'y',6).quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),md);
 pipe([new THREE.Vector3(...N.makeup.b).addScaledVector(md,.05).toArray(),new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray(),[...new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray()].map((v,i)=>i===1?v-.5:v)],.03,M.blue,mk);cover(m,mk);explode(m,mk,[.3,0,.2]);
 const plate=part(m,'Giá biển tên',polar(R+.02,60,y1-.55),m.root,'Tấm giá biển tên hàn trên thân (H6).');
 box([.26,.36,.02],[0,0,0],M.frame,plate).rotation.y=-Math.PI/3+Math.PI/2;cover(m,plate);
 // Bên trong (minh họa)
 const intl=part(m,'Cơ cấu tách bên trong (minh họa)',[0,0,0],m.root,'Vách hướng dòng tại cửa vào, vách ngăn ngang, lưới tách giọt dưới cổ khí ra và tấm chống xoáy ở đáy. Không có mặt cắt xác nhận trong bản vẽ: chỉ là cấu tạo minh họa thường gặp ở bình tách kiểu ly tâm – va đập.',{minhHoa:true});
 const sheet=M.steel.clone();sheet.side=THREE.DoubleSide;sheet.clippingPlanes=[];
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
 port(m,'Nước ra (tới két giải nhiệt)',[wp.x*1.25,wp.y+.5,wp.z*1.25],[0,1,0],{kind:'nuoc',size:.05});
 port(m,'Nước bù vào (từ van điện từ)',[...new THREE.Vector3(...N.makeup.b).addScaledVector(md,.3).toArray()].map((v,i)=>i===1?v-.5:v),[0,-1,0],{kind:'nuoc',size:.03});
 port(m,'Xả đáy',[.55,bot-.56,.55],[1,0,1],{kind:'nuoc',size:.035});
 port(m,'Van an toàn – cửa thoát',[N.safety.b[0]+.15,N.safety.b[1]+.13,N.safety.b[2]],[1,0,0],{kind:'khi',size:.035});
 for(const deg of [45,135,225,315]){const [x,,z]=polar(R+.09,deg,0);port(m,`Đế chân ${deg}°`,[x,0,z],[0,-1,0],{kind:'co-khi',size:.06});}
 m.section={min:[.02,-Infinity,-Infinity],max:[Infinity,Infinity,Infinity]};
 return m;
}

// ================= Van và bộ chia (tỷ lệ trạm: 1 đơn vị ≈ 100 mm, ước lượng) =================
// Mặt bích của van khớp với cổng của đầu nén và bình tách để lắp trực tiếp trong trạm.
const holes4=(off,r,y,h=.3)=>[[-off,-off],[-off,off],[off,-off],[off,off]].map(([x,z])=>cylG(r,h,[x,y,z],'y',16));
const ringHoles=(n,R,r,y,h=.3,phase=0)=>Array.from({length:n},(_,i)=>{const a=phase+i/n*Math.PI*2;return cylG(r,h,[Math.cos(a)*R,y,Math.sin(a)*R],'y',16);});
// Cuộn điện từ: thân bọc nhựa, đầu nối DIN, ống dẫn hướng và đai ốc giữ. Gốc tại đáy cuộn, trục Y.
function solenoidCoil(parent,{w=.24,h=.28,d=.22,name='Cuộn điện từ'}={}){
 const g=new THREE.Group();g.name=name;parent.add(g);
 roundedBox([w,h,d],[0,h/2,0],M.black,g,.025);box([w*.7,h*.45,.004],[0,h*.55,d/2+.002],M.label,g);
 const din=new THREE.Group();din.position.set(w/2+.05,h*.55,0);g.add(din);roundedBox([.1,.14,.12],[0,0,0],M.dark,din,.015);cyl(.03,.06,[.07,-.02,0],M.dark,din,'x',12);bolt([0,.07,0],din,.016,'y',.04);
 cyl(.045,.06,[0,h+.03,0],M.bright,g,'y',24);cyl(.055,.04,[0,h+.07,0],M.bright,g,'y',6);return g;
}
// Thân van điện từ hai cửa bằng đồng: hai đầu lục giác ren, nắp chụp; cuộn điện bên trên. Dòng chảy theo X.
function solenoidValveBody(m,parent,{name,port=.06,coilName='Cuộn điện từ',plunger=true}){
 const g=new THREE.Group();g.name=name;parent.add(g);
 solid(m,mesh(csgGeometry([rboxG([.42,.26,.28],[0,0,0],.04),cylG(.1,.14,[-.26,0,0],'x',6),cylG(.1,.14,[.26,0,0],'x',6),cylG(.11,.12,[0,.18,0],'y',32)],
  [cylG(port*.75,1,[0,0,0],'x',24),cylG(.07,.2,[0,.1,0],'y',24)],'sv-body'+port),M.brass,[0,0,0],g,'Thân đồng'));
 for(const x of [-.36,.36])mesh(threadGeometry({r:port,depth:.008,pitch:.02,length:.08}),M.brass,[x,0,0],g,'Ren nối');
 const coil=solenoidCoil(g,{name:coilName});coil.position.y=.24;
 if(plunger){const pl=part(m,'Lõi từ và màng van (minh họa)',[0,.1,0],g,'Lõi từ di chuyển lên xuống mở màng van khi cấp điện cho cuộn. Cấu tạo bên trong minh họa.',{minhHoa:true});
  cyl(.04,.3,[0,.15,0],M.bright,pl,'y',16);cyl(.085,.015,[0,0,0],M.seal,pl,'y',32);m.motions.push({object:pl,axis:'y',ratio:.05,translate:true});}
 return g;
}

// Van hút (H4, H7): mặt bích vuông lắp lên cửa hút đầu nén, thân trụ có đĩa bướm, cổ hút có vành giữ ống mềm,
// xy lanh điều khiển bên hông kéo tay đòn đĩa, van điện từ nạp tải gắn trên xy lanh.
function inletValve(){
 const m=modelBase('inlet'),s=.84,fl=.08,yS=.42;m.info.summary='Mặt bích vuông 0,84 khớp cửa hút đầu nén · đĩa bướm Ø0,55 · xy lanh điều khiển và van điện từ nạp tải';
 const body=part(m,'Thân van hút',[0,0,0],m.root,'Thân đúc rỗng: mặt bích vuông bốn lỗ (khớp cửa hút đầu nén), khoang trụ, hai bạc trục đĩa bướm, mặt bích trên. Hình ngoài theo H4/H7; kích thước ước lượng.');
 solid(m,mesh(csgGeometry([rboxG([s,fl,s],[0,fl/2,0],.04),cylG(.42,.64,[0,fl+.32,0],'y',64),cylG(.11,1.08,[0,yS,0],'z',32),cylG(.38,.08,[0,.76,0],'y',64),boxG([.14,.5,.06],[0,.38,.4]),boxG([.14,.5,.06],[0,.38,-.4])],
  [cylG(.28,1.4,[0,.4,0],'y',64),...holes4(.31,.032,fl/2),cylG(.035,1.3,[0,yS,0],'z',16),...ringHoles(6,.33,.02,.76,.2,Math.PI/6)],'inlet-body'),M.housing,[0,0,0],body,'Thân đúc'));
 const nb=new THREE.Group();body.add(nb);for(const [x,z] of [[-.31,-.31],[-.31,.31],[.31,-.31],[.31,.31]])bolt([x,fl,z],nb,.045,'y',.16);cover(m,nb);
 const neck=part(m,'Cổ hút và vành ống mềm',[0,.8,0],m.root,'Cổ tròn có gờ cuộn mép để luồn ống mềm từ lọc khí, kẹp bằng đai siết (H4: air filtering hose).');
 solid(m,revolve([[0,.29],[0,.36],[.04,.36],[.04,.33],[.28,.33],[.3,.345],[.32,.33],[.32,.29]],[0,0,0],M.housingDark,neck,'y',{segments:64}));
 const nn=new THREE.Group();neck.add(nn);boltCircle(nn,'y',.04,.33,6,.03,Math.PI/6);cover(m,nn);
 const clamp=new THREE.Group();clamp.name='Đai siết ống';neck.add(clamp);torus(.345,.012,[0,.16,0],M.bright,clamp);box([.08,.06,.05],[.36,.16,0],M.bright,clamp);cyl(.015,.12,[.36,.16,0],M.steel,clamp,'z',8);
 explode(m,neck,[0,.6,0]);
 // trục, đĩa bướm và tay đòn quay cùng nhau
 const vane=part(m,'Đĩa bướm và trục (minh họa)',[0,yS,0],m.root,'Đĩa bướm đóng mở cửa hút để điều chỉnh lượng khí vào (H4: adjust the incoming air quantity). Kiểu đĩa bướm là giả định; cấu tạo bên trong minh họa.',{minhHoa:true});
 const disc=new THREE.Group();vane.add(disc);cyl(.272,.03,[0,0,0],M.brass,disc,'y',64);box([.06,.05,.5],[0,0,0],M.brass,disc);
 cyl(.034,1.2,[0,0,0],M.bright,vane,'z',16);
 const lever=new THREE.Group();lever.name='Tay đòn';lever.position.z=.63;vane.add(lever);
 solid(m,mesh(csgGeometry([rboxG([.08,.34,.04],[0,-.15,0],.02),cylG(.06,.05,[0,0,0],'z',24)],[rboxG([.03,.18,.1],[0,-.2,0],.012)],'inlet-lever'),M.steel,[0,0,0],lever,'Tay đòn có rãnh'));
 // xy lanh điều khiển: trục X, cần đẩy chốt trượt trong rãnh tay đòn
 const act=part(m,'Xy lanh điều khiển',[.78,yS-.2,.63],m.root,'Xy lanh khí nén điều khiển tay đòn đĩa van (H4: control cylinder). Có thanh giằng, nắp hai đầu và cổng khí điều khiển.');
 revolve([[-.32,0],[-.32,.15],[-.27,.15],[-.27,.13],[.27,.13],[.27,.15],[.32,.15],[.32,0]],[0,0,0],M.bright,act,'x',{segments:40,name:'Thân xy lanh'});
 for(const x of [-.3,.3])box([.05,.32,.32],[x,0,0],M.housingDark,act);
 for(const [y,z] of [[-.12,-.12],[-.12,.12],[.12,-.12],[.12,.12]])cyl(.012,.64,[0,y,z],M.steel,act,'x',8);
 for(const x of [-.2,.2]){cyl(.03,.06,[x,.16,0],M.brass,act,'y',6);}
 const rodG=new THREE.Group();rodG.name='Cần piston';act.add(rodG);cyl(.03,.48,[-.54,0,0],M.bright,rodG,'x',16);cyl(.045,.08,[-.76,0,0],M.steel,rodG,'x',16);cyl(.018,.12,[-.78,0,-.02],M.bright,rodG,'z',8);
 const sv=part(m,'Van điện từ nạp tải (H7)',[0,.15,0],act,'Van điện từ cấp khí điều khiển cho xy lanh để nạp tải hoặc chạy không tải (H7: load solenoid valve). Vị trí ước lượng.');
 roundedBox([.24,.12,.18],[0,.06,0],M.brass,sv,.02);const c=solenoidCoil(sv,{w:.18,h:.2,d:.16});c.position.y=.12;
 for(const sx of [-1,1])pipe([[sx*.12,.06,.06],[sx*.2,.06,.06],[sx*.2,.04,0]],.012,M.copper,sv);
 explode(m,act,[.7,0,0]);
 // hoạt ảnh: góc đĩa 0 (đóng) → 1,35 rad (mở); cần đẩy theo X bằng chiều dài tay đòn × sin(góc)
 m.motions.push({object:vane,axis:'z',ratio:.675,update(t){const a=.675-.675*Math.cos(t*.8);vane.rotation.z=a;rodG.position.x=Math.sin(a)*.2;}});
 port(m,'Mặt bích lắp lên cửa hút đầu nén',[0,0,0],[0,-1,0],{kind:'khi',size:.26,note:'mặt bích vuông 0,84; 4 lỗ cách tâm ±0,31'});
 port(m,'Gió sạch vào (từ ống mềm lọc khí)',[0,1.12,0],[0,1,0],{kind:'khi',size:.33});
 port(m,'Khí điều khiển vào van điện từ',[.78,yS+.06,.63+.2],[0,0,1],{kind:'khi',size:.02});
 port(m,'Dây điện van nạp tải',[.78+.14,yS+.2,.63],[1,0,0],{kind:'dien',size:.03});
 return m;
}

// Van một chiều (H4, H6): mặt bích vuông trên lắp dưới cửa xả đầu nén, thân hộp đúc, đĩa nấm có lò xo, mặt bích tròn dưới nối ống chính.
function checkValve(){
 const m=modelBase('check'),s=.76;m.info.summary='Mặt bích vuông 0,76 khớp cửa xả đầu nén · cửa ra tròn xuống ống chính · đĩa nấm có lò xo hồi';
 const body=part(m,'Thân van một chiều',[0,0,0],m.root,'Thân hộp đúc rỗng có mặt bích vuông phía trên (khớp cửa xả đầu nén) và cổ ra tròn phía dưới, nút xả bên hông (H4: check valve). Kích thước ước lượng.');
 solid(m,mesh(csgGeometry([rboxG([s,.08,s],[0,-.04,0],.04),rboxG([.62,.56,.62],[0,-.36,0],.07),cylG(.24,.3,[0,-.78,0],'y',48),cylG(.36,.08,[0,-.96,0],'y',64),cylG(.1,.1,[.33,-.38,0],'x',6)],
  [cylG(.2,.3,[0,0,0],'y',48),cylG(.25,.42,[0,-.37,0],'y',48),cylG(.17,.5,[0,-.85,0],'y',48),...holes4(.27,.03,-.04),...ringHoles(6,.29,.025,-.96,.2)],'check-body'),M.housing,[0,0,0],body,'Thân đúc'));
 const bb=new THREE.Group();body.add(bb);boltCircle(bb,'-y',-1.0,.29,6,.035);cover(m,bb);
 const seat=part(m,'Đế van, đĩa nấm và lò xo (minh họa)',[0,0,0],m.root,'Đế van ép ở cổ trên, đĩa nấm có cán dẫn hướng, lò xo hồi và giá dẫn hướng. Cấu tạo bên trong minh họa.',{minhHoa:true});
 revolve([[-.1,.19],[-.1,.25],[-.07,.25],[-.07,.19]],[0,0,0],M.bright,seat,'y',{segments:48});
 const disc=part(m,'Đĩa nấm',[0,-.12,0],seat,'Đĩa mở xuống khi áp suất đầu nén lớn hơn, lò xo đóng lại khi dừng máy để khí không chảy ngược.');
 revolve([[0,0],[0,.215],[-.03,.2],[-.05,.06],[-.3,.03],[-.3,0]],[0,0,0],M.brass,disc,'y',{segments:48});
 mesh(springGeometry({r:.1,length:.3,turns:5,wire:.014}),M.dark,[0,-.49,0],seat,'Lò xo hồi');
 const sp=new THREE.Group();seat.add(sp);ring(.24,.04,.03,[0,-.5,0],M.steel,sp,'y',32);
 m.motions.push({object:disc,axis:'y',ratio:-.1,translate:true});
 const plug=part(m,'Nút xả bên hông',[.39,-.38,0],m.root,'Nút ren lục giác xả nước đọng khi bảo dưỡng.');cyl(.07,.04,[0,0,0],M.steel,plug,'x',6);
 port(m,'Vào từ cửa xả đầu nén',[0,0,0],[0,1,0],{kind:'khi',size:.2,note:'mặt bích vuông 0,76; 4 lỗ cách tâm ±0,27'});
 port(m,'Ra ống chính tới bình tách',[0,-1.0,0],[0,-1,0],{kind:'khi',size:.17,note:'mặt bích tròn R 0,36; 6 lỗ trên vòng R 0,29'});
 return m;
}

// Van áp suất tối thiểu (H1, H4): lắp trên cổ khí ra của bình tách; thân trụ, nắp lò xo có vít chỉnh, cửa ra bên hông, đồng hồ.
function minimumValve(){
 const m=modelBase('minimum'),FR=.377,FB=.31;m.info.summary='Mặt bích vào R 0,377 khớp cổ khí ra bình tách (tỷ lệ 1,45 trong trạm) · cửa ra bên hông · nắp lò xo có vít chỉnh';
 const body=part(m,'Thân van áp suất tối thiểu',[0,0,0],m.root,'Thân đúc rỗng: mặt bích vào sáu lỗ, khoang piston, cổ ra bên hông có mặt bích bốn lỗ, cổng đồng hồ (H4: minimum pressure valve). Kích thước ước lượng.');
 solid(m,mesh(csgGeometry([cylG(FR,.08,[0,.04,0],'y',64),cylG(.28,.72,[0,.44,0],'y',64),cylG(.32,.06,[0,.83,0],'y',64),cylG(.15,.5,[.4,.45,0],'x',48),cylG(.28,.07,[.66,.45,0],'x',48),cylG(.07,.2,[-.32,.6,0],'x',24)],
  [cylG(.152,.4,[0,.1,0],'y',48),cylG(.21,.62,[0,.52,0],'y',48),cylG(.1,.9,[.4,.45,0],'x',32),cylG(.03,.4,[-.3,.6,0],'x',12),...ringHoles(6,FB,.025,.04,.2,Math.PI/6),...[0,1,2,3].map(i=>{const a=i*Math.PI/2+Math.PI/4;return cylG(.022,.3,[.66,.45+Math.cos(a)*.22,Math.sin(a)*.22],'x',12);})],'mpv-body'),M.housing,[0,0,0],body,'Thân đúc'));
 const fb=new THREE.Group();body.add(fb);boltCircle(fb,'y',.08,FB,6,.04,Math.PI/6);for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;bolt([.695,.45+Math.cos(a)*.22,Math.sin(a)*.22],fb,.03,'x',.12);}cover(m,fb);
 const bon=part(m,'Nắp lò xo và vít chỉnh',[0,.86,0],m.root,'Nắp chứa lò xo; vít chỉnh và đai ốc hãm đặt lực lò xo (áp suất mở không lấy từ bản vẽ).');
 solid(m,revolve([[0,.32],[.05,.32],[.05,.26],[.38,.24],[.42,.12],[.42,0]],[0,0,0],M.housingDark,bon,'y',{segments:64}));
 const bb=new THREE.Group();bon.add(bb);boltCircle(bb,'y',.05,.29,6,.03);cover(m,bb);
 mesh(threadGeometry({r:.06,depth:.008,pitch:.02,length:.22,axis:'y'}),M.bright,[0,.5,0],bon,'Vít chỉnh');cyl(.1,.05,[0,.46,0],M.bright,bon,'y',6);
 explode(m,bon,[0,.7,0]);
 const inner=part(m,'Piston, lò xo và đế van (minh họa)',[0,0,0],m.root,'Piston đóng cửa khí ra cho tới khi áp suất trong bình tách đạt mức tối thiểu, bảo đảm có áp đẩy nước bôi trơn (H4). Cấu tạo bên trong minh họa.',{minhHoa:true});
 const piston=new THREE.Group();piston.name='Piston';inner.add(piston);piston.position.y=.28;
 revolve([[0,0],[0,.2],[.06,.2],[.06,.12],[.14,.12],[.14,0]],[0,0,0],M.bright,piston,'y',{segments:48});cyl(.045,.08,[0,-.04,0],M.seal,piston,'y',24);
 mesh(springGeometry({r:.13,length:.7,turns:7,wire:.02}),M.dark,[0,.42,0],inner,'Lò xo');
 m.motions.push({object:piston,axis:'y',ratio:.08,translate:true});
 const gg=part(m,'Đồng hồ áp suất đường ra',[-.42,.6,0],m.root,'Đồng hồ áp suất sau van (vị trí ước lượng).');
 const gd=gauge([-.08,.2,0],gg,.15);gd.rotation.y=-Math.PI/2;pipe([[0,0,0],[-.08,0,0]],.025,M.brass,gg);
 port(m,'Vào từ bình tách',[0,0,0],[0,-1,0],{kind:'khi',size:.19,note:'mặt bích R 0,377; 6 lỗ trên vòng R 0,31'});
 port(m,'Khí ra (tới đường khí nén)',[.73,.45,0],[1,0,0],{kind:'khi',size:.14,note:'mặt bích R 0,28; 4 lỗ'});
 return m;
}

// Van ngắt nước điện từ (H6, H7): đóng đường nước phun cùng lúc dừng động cơ để nước không tràn vào đầu nén.
function waterValve(){
 const m=modelBase('water-valve');m.info.summary='Van điện từ hai cửa, ren nối R 0,06 · đóng khi dừng máy (H6)';
 const v=part(m,'Van ngắt nước điện từ',[0,0,0],m.root,'Thân đồng hai cửa ren, cuộn điện từ có đầu nối DIN. H6: van đóng nước ngay khi dừng động cơ để tránh nước làm sặc đầu nén ở lần khởi động sau.');
 solenoidValveBody(m,v,{name:'Cụm thân và cuộn',port:.06,coilName:'Cuộn điện từ'});
 port(m,'Nước vào',[-.4,0,0],[-1,0,0],{kind:'nuoc',size:.06});port(m,'Nước ra (tới bộ chia nước)',[.4,0,0],[1,0,0],{kind:'nuoc',size:.06});
 port(m,'Dây điện cuộn van',[.25,.39,0],[1,0,0],{kind:'dien',size:.03});
 return m;
}

// Bộ chia nước (H5, H6): khối đồng một cửa vào, bốn cửa ra chia nước tới các điểm bôi trơn – làm kín của đầu nén.
function distributor(){
 const m=modelBase('distributor');m.info.summary='Khối chia một vào bốn ra · ren nối vào R 0,06, ra R 0,04';
 const b=part(m,'Thân bộ chia',[0,0,0],m.root,'Khối đồng có rãnh góp dọc và bốn lỗ ra; tai bắt giá phía sau. Số cửa ra theo hình H6 (ước lượng).');
 const outs=[-.21,-.07,.07,.21];
 solid(m,mesh(csgGeometry([rboxG([.62,.26,.26],[0,0,0],.03),cylG(.08,.08,[0,.17,0],'y',6),...outs.map(x=>cylG(.06,.06,[x,0,.16],'z',6)),boxG([.8,.18,.04],[0,0,-.15])],
  [cylG(.035,.56,[0,0,0],'x',16),cylG(.035,.3,[0,.08,0],'y',16),...outs.map(x=>cylG(.025,.3,[x,0,.12],'z',12)),cylG(.025,.1,[-.35,0,-.15],'z',12),cylG(.025,.1,[.35,0,-.15],'z',12)],'distributor-body'),M.brass,[0,0,0],b,'Khối chia'));
 mesh(threadGeometry({r:.06,depth:.008,pitch:.02,length:.08,axis:'y'}),M.brass,[0,.25,0],b,'Ren cửa vào');
 for(const x of outs){mesh(threadGeometry({r:.04,depth:.006,pitch:.016,length:.06,axis:'z'}),M.brass,[x,0,.22],b,'Ren cửa ra');}
 for(const x of [-.35,.35])bolt([x,0,-.13],b,.03,'-z',.1);
 for(const x of [-.31,.31])cyl(.03,.04,[x,0,0],M.steel,b,'x',6);
 port(m,'Nước vào (từ van ngắt nước)',[0,.29,0],[0,1,0],{kind:'nuoc',size:.06});
 outs.forEach((x,i)=>port(m,`Nhánh ra ${i+1}`,[x,0,.25],[0,0,1],{kind:'nuoc',size:.04}));
 return m;
}

// ================= Bộ lọc và cụm làm mềm nước (tỷ lệ trạm: 1 đơn vị ≈ 100 mm, ước lượng) =================
// Lọc Y: thân ống theo X, nhánh nghiêng 45° chứa lưới lọc, nắp lục giác và nút xả. Gốc tại tâm thân.
function yStrainer(m,parent,pos,{r=.06,name='Lọc Y'}={}){
 const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);
 const leg=new THREE.Matrix4().makeRotationZ(-Math.PI/4);
 const legG=r2=>{const c=new THREE.CylinderGeometry(r2,r2,r*7,32);c.translate(0,-r*3.5,0);c.applyMatrix4(leg);return c;};
 solid(m,mesh(csgGeometry([cylG(r*1.5,r*7,[0,0,0],'x',32),cylG(r*1.6,r*1.6,[-r*3.6,0,0],'x',6),cylG(r*1.6,r*1.6,[r*3.6,0,0],'x',6),legG(r*1.35)],[cylG(r,r*10,[0,0,0],'x',24),legG(r*1.05)],'ystrainer'+r),M.brass,[0,0,0],g,'Thân lọc Y'));
 const cap=new THREE.Group();cap.name='Nắp lọc Y';cap.position.set(r*4.95,-r*4.95,0);cap.rotation.z=-Math.PI/4;g.add(cap);cyl(r*1.5,r*.8,[0,0,0],M.brass,cap,'y',6);cyl(r*.4,r*.6,[0,-r*.6,0],M.brass,cap,'y',6);
 const scr=new THREE.Mesh(new THREE.CylinderGeometry(r*.95,r*.95,r*6,20,1,true),M.mesh);scr.name='Lưới lọc (minh họa)';scr.position.set(r*2.1,-r*2.1,0);scr.rotation.z=-Math.PI/4;g.add(scr);
 return g;
}
// Lọc khí đầu hút (H8): vỏ trụ, nắp đầu có gân giữ bằng đai ốc tai, lõi giấy xếp nếp có nắp và ống lưới, trục giữ, cửa vào tiếp tuyến, cổ ra ống mềm.
function airFilter(){
 const m=modelBase('air-filter'),R=1.0,L=2.4,t=.03;m.info.summary='Vỏ Ø 2,0 dài 2,4 · lõi 120 nếp · cửa ra R 0,33 tới ống mềm van hút (H4, H8)';
 const shell=part(m,'Vỏ lọc khí',[0,0,0],m.root,'Vỏ thép trụ, đáy chỏm có cổ ra; cửa vào tiếp tuyến có lưới chắn; hai đai ôm và chân bắt. Thứ tự tháo theo H8: nắp, lõi, trục giữ.');
 solid(m,mesh(csgGeometry([revG([[-L/2,R-t],[-L/2,R],[L/2,R],[L/2+.18,R*.9],[L/2+.32,.5],[L/2+.32,.36],[L/2+.72,.36],[L/2+.74,.38],[L/2+.78,.36],[L/2+.78,.33],[L/2+.3,.33],[L/2+.3,.48],[L/2+.16,R*.9-t],[L/2-t,R-t]],[0,0,0],'x',96),
   placed(new THREE.CylinderGeometry(.34,.34,.7,40),[-.25,R*.62,R*.62],[Math.PI/4,0,0])],[placed(new THREE.CylinderGeometry(.3,.3,1.2,40),[-.25,R*.62,R*.62],[Math.PI/4,0,0]),cylG(R-t,L+.02,[-.02,0,0],'x',96)],'af-shell'),M.housingDark,[0,0,0],shell,'Vỏ có cổ ra'));
 const hood=new THREE.Group();hood.name='Lưới chắn cửa vào';shell.add(hood);hood.position.set(-.25,R*.62+.33*Math.SQRT1_2,R*.62+.33*Math.SQRT1_2);hood.rotation.x=Math.PI/4;
 const scr=new THREE.Mesh(new THREE.CircleGeometry(.3,32),M.mesh);scr.rotation.x=-Math.PI/2;hood.add(scr);for(let i=-3;i<=3;i++)box([.012,.012,Math.sqrt(.09-(i*.08)**2)*2],[i*.08,.005,0],M.steel,hood);cover(m,hood);
 for(const x of [-.6,.6]){const band=new THREE.Group();band.name='Đai ôm';shell.add(band);torus(R+.03,.025,[x,0,0],M.steel,band,'x');box([.08,.1,.14],[x,-R-.06,0],M.steel,band);bolt([x,-R-.12,0],band,.03,'-y',.08);cover(m,band);}
 const foot=new THREE.Group();foot.name='Chân bắt';shell.add(foot);for(const x of [-.6,.6])box([.1,.5,.5],[x,-R-.3,0],M.frame,foot);box([1.5,.06,.6],[0,-R-.55,0],M.frame,foot);
 const cover_=part(m,'Nắp lọc có gân',[-L/2,0,0],m.root,'Nắp chỏm có gân hướng kính và gioăng, giữ bằng đai ốc tai ở tâm (H8 bước 1: vặn đai ốc tai để tháo nắp).');
 const ribs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ribs.push(placed(new THREE.BoxGeometry(.18,.62,.04),[-.16,Math.cos(a)*.62,Math.sin(a)*.62],[a,0,0]));}
 solid(m,mesh(csgGeometry([revG([[.1,R-.005],[.1,R+.035],[-.05,R+.035],[-.18,R*.75],[-.25,.25],[-.25,0],[-.21,0],[-.21,.25],[-.15,R*.72],[-.02,R-.005]],[0,0,0],'x',96),...ribs],[],'af-cover'),M.housingDark,[0,0,0],cover_,'Vỏ nắp'));
 cover(m,torus(R-.01,.02,[.06,0,0],M.seal,cover_,'x'));
 const wing=part(m,'Đai ốc tai',[-.3,0,0],cover_,'Đai ốc tai (元宝螺帽) vặn tay giữ nắp lọc.');
 cyl(.11,.12,[0,0,0],M.brass,wing,'x',24);for(const z of [-1,1])roundedBox([.08,.16,.22],[-.02,0,z*.2],M.brass,wing,.03);
 explode(m,wing,[-.6,0,0]);explode(m,cover_,[-1.0,0,0]);
 const el=part(m,'Lõi lọc giấy xếp nếp',[0,0,0],m.root,'Lõi giấy 120 nếp, hai nắp cao su ép kín và ống lưới bên trong; có đai ốc giữ lõi (H8 bước 2–4: tháo đai ốc lõi, xoay nhẹ để rút lõi, thổi bụi từ trong ra).');
 mesh(pleats(R-.12,R-.3,L-.3,120,'x'),M.paper,[0,0,0],el,'Giấy xếp nếp');
 for(const x of [-(L-.3)/2-.04,(L-.3)/2+.04])solid(m,revolve([[x-.05,R-.35],[x-.05,R-.08],[x+.05,R-.08],[x+.05,R-.35]],[0,0,0],M.black,el,'x',{segments:64}));
 mesh(new THREE.CylinderGeometry(R-.32,R-.32,L-.3,40,1,true).rotateZ(Math.PI/2),M.mesh,[0,0,0],el,'Ống lưới trong');
 const en=part(m,'Đai ốc giữ lõi',[-(L-.3)/2-.16,0,0],el,'Đai ốc chụp giữ lõi lọc trên trục (空滤芯螺帽).');cyl(.07,.08,[0,0,0],M.brass,en,'x',6);
 explode(m,en,[-.35,0,0]);explode(m,el,[-2.6,0,0]);
 const tie=part(m,'Trục giữ lõi',[0,0,0],m.root,'Trục ren ở tâm, bắt vào đáy vỏ, giữ lõi và nắp.');mesh(threadGeometry({r:.04,depth:.008,pitch:.03,length:L+.5}),M.steel,[-.15,0,0],tie,'Trục ren');cyl(.12,.05,[L/2-.05,0,0],M.steel,tie,'x',24);
 explode(m,tie,[-3.6,0,0]);
 port(m,'Gió vào (cửa tiếp tuyến có lưới)',[-.25,R*.62+.36*Math.SQRT1_2,R*.62+.36*Math.SQRT1_2],[0,Math.SQRT1_2,Math.SQRT1_2],{kind:'khi',size:.3});
 port(m,'Gió sạch ra (tới ống mềm van hút)',[L/2+.78,0,0],[1,0,0],{kind:'khi',size:.33});
 return m;
}

// Lọc nước nhỏ (H9): đầu lọc cố định có giá bắt, đai giữ (keeper) siết cốc lọc, lõi xếp nếp trên trục ren, đế giữ lõi, nút xả đáy.
function waterFilter(){
 const m=modelBase('water-filter'),R=.5,Lb=4.0;m.info.summary='Cốc Ø 1,0 dài 4,0 · lõi 72 nếp · cửa vào/ra R 0,06 (H5, H9)';
 const head=part(m,'Đầu lọc cố định',[0,0,0],m.root,'Đầu đúc có hai cửa ren vào/ra, vít xả khí trên nắp và tấm giá bắt khung (H9: filter cover).');
 solid(m,mesh(csgGeometry([cylG(.58,.36,[0,.18,0],'y',64),cylG(.5,.12,[0,.42,0],'y',64),rboxG([1.3,.24,.3],[0,.18,0],.06),cylG(.1,.14,[-.68,.18,0],'x',6),cylG(.1,.14,[.68,.18,0],'x',6),cylG(.62,.06,[0,.03,0],'y',64)],
  [cylG(.44,.3,[0,0,0],'y',64),cylG(.045,1.6,[0,.18,0],'x',16)],'wf-head'),M.steel,[0,0,0],head,'Thân đầu lọc'));
 for(const x of [-.79,.79])mesh(threadGeometry({r:.06,depth:.008,pitch:.02,length:.1}),M.steel,[x,.18,0],head,'Ren nối');
 cyl(.05,.08,[0,.52,0],M.brass,head,'y',6);cyl(.025,.06,[0,.58,0],M.brass,head,'y',12);
 const br=new THREE.Group();br.name='Giá bắt';head.add(br);box([.9,.9,.05],[0,.1,-.66],M.frame,br);box([.3,.08,.5],[0,.32,-.42],M.frame,br);for(const x of [-.3,.3])for(const y of [-.15,.35])bolt([x,y,-.63],br,.03,'z',.08);
 const keeper=part(m,'Đai giữ cốc (keeper)',[0,-.05,0],m.root,'Đai kẹp hai nửa siết vành cốc lọc vào đầu lọc; mở bằng cờ lê (H9 bước 1, 4).');
 solid(m,mesh(csgGeometry([revG([[-.08,.53],[-.08,.66],[.08,.66],[.08,.53]],[0,0,0],'y',64),boxG([.12,.16,.24],[.7,0,0])],[cylG(.025,.4,[.7,0,0],'z',12)],'wf-keeper'),M.bright,[0,0,0],keeper,'Đai'));
 bolt([.7,0,.15],keeper,.03,'z',.32);cyl(.04,.03,[.7,0,-.14],M.bright,keeper,'z',6);
 explode(m,keeper,[.9,0,0]);
 const bowl=part(m,'Cốc lọc tháo xuống',[0,-.05,0],m.root,'Cốc lọc thép không gỉ, vành trên để đai giữ siết, đáy chỏm có nút xả; tháo xuống để thay lõi (H9 bước 2: đặt chậu hứng nước).');
 solid(m,revolve([[0,R-.03],[0,R+.08],[-.1,R+.08],[-.12,R],[-Lb+.1,R],[-Lb,R*.75],[-Lb-.08,.1],[-Lb-.08,.04],[-Lb-.05,.04],[-Lb-.05,.1],[-Lb+.03,R*.72],[-Lb+.1,R-.03]].map(([y,r])=>[y,r]),[0,0,0],M.vessel,bowl,'y',{segments:72}));
 torus(R-.02,.018,[0,.0,0],M.seal,bowl);cyl(.07,.06,[0,-Lb-.11,0],M.steel,bowl,'y',6);
 explode(m,bowl,[0,-2.4,0]);
 const el=part(m,'Lõi lọc nước',[0,-.15-Lb/2,0],m.root,'Lõi giấy 72 nếp có nắp hai đầu, luồn trên trục ren (丝杆) và tựa trên đế giữ lõi (H9 bước 3).');
 mesh(pleats(R-.1,R-.2,Lb-.5,72),M.paper,[0,0,0],el,'Giấy xếp nếp');
 for(const y of [-(Lb-.5)/2-.03,(Lb-.5)/2+.03])solid(m,revolve([[y-.03,.08],[y-.03,R-.07],[y+.03,R-.07],[y+.03,.08]],[0,0,0],M.dark,el,'y',{segments:48}));
 explode(m,el,[0,-1.2,0]);
 const screw=part(m,'Trục ren và đế giữ lõi',[0,0,0],m.root,'Trục ren vặn vào nắp lọc; đế giữ lõi (滤芯固定座) vặn ở đầu dưới.');
 mesh(threadGeometry({r:.04,depth:.006,pitch:.025,length:Lb-.2,axis:'y'}),M.steel,[0,-.1-(Lb-.2)/2,0],screw,'Trục ren');
 const seat=new THREE.Group();seat.name='Đế giữ lõi';seat.position.y=-Lb+.15;screw.add(seat);revolve([[0,0],[0,.22],[.05,.24],[.08,.24],[.08,.06],[.18,.05],[.18,0]],[0,0,0],M.steel,seat,'y',{segments:40});
 explode(m,screw,[0,-.5,0]);
 port(m,'Nước vào (từ két)',[-.84,.18,0],[-1,0,0],{kind:'nuoc',size:.06});
 port(m,'Nước đã lọc ra',[.84,.18,0],[1,0,0],{kind:'nuoc',size:.06});
 port(m,'Nút xả đáy',[0,-Lb-.2,0],[0,-1,0],{kind:'nuoc',size:.04});
 return m;
}

// Lọc nước tổ hợp (H10): phương án tham khảo riêng, không mặc định lắp nối tiếp với lọc H9.
function combinedFilter(){
 const m=modelBase('combined-filter'),R=1.1,y0=1.5,y1=4.7,t=.04;m.info.summary='Thùng Ø 2,2 trên ba chân · nắp chỏm 16 bu lông · lõi lọc sâu trên khay (H10). Phương án riêng, không nối tiếp với lọc H9.';
 const sh=part(m,'Thùng lọc ngoài',[0,0,0],m.root,'Thùng trụ đáy chỏm, vành mặt bích trên mười sáu lỗ, cổ vào thấp và cổ ra cao có cút (H10: outer bucket of filter).');
 const prof=[[y0-.45,0],[y0-.4,R*.55],[y0-.15,R*.92],[y0,R],[y1,R],[y1,R+.2],[y1+.08,R+.2],[y1+.08,R-t],[y0,R-t],[y0-.13,R*.92-t],[y0-.37,R*.55-t],[y0-.42,0]];
 const N1={a:[-.8,y0+.5,0],b:[-1.45,y0+.5,0]},N2={a:[.8,y1-.6,0],b:[1.4,y1-.6,0]},neck=(n,r)=>{const a=new THREE.Vector3(...n.a),b=new THREE.Vector3(...n.b),d=b.clone().sub(a);const g=new THREE.CylinderGeometry(r,r,d.length(),36);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());return g;};
 solid(m,mesh(csgGeometry([revG(prof,[0,0,0],'y',96),neck(N1,.16),neck(N2,.16),cylG(.07,.3,[0,y0-.55,0],'y',24)],[revG([[y0-.42,0],[y0-.37,R*.55-t],[y0-.13,R*.92-t],[y0,R-t],[y1+.2,R-t],[y1+.2,0]],[0,0,0],'y',96),neck(N1,.12),neck(N2,.12),cylG(.045,.5,[0,y0-.5,0],'y',16),...ringHoles(16,R+.12,.03,y1+.04,.3)],'cf-shell'),M.vessel,[0,0,0],sh,'Thùng'));
 weldFlange(sh,{r:.3,ri:.12,bolts:4},N1.b,[-1,0,0],'Mặt bích cửa vào');
 pipe([N2.b,[1.75,y1-.6,0],[1.75,y1+.0,0]],.16,M.vessel,sh,.3);weldFlange(sh,{r:.3,ri:.12,bolts:4},[1.75,y1,0],[0,1,0],'Mặt bích cửa ra');
 const legs=part(m,'Ba chân đỡ',[0,0,0],m.root,'Ba chân thép góc hàn vào thân, tấm đế có lỗ neo (H10).');
 const la=[];for(const deg of [90,210,330]){const a=deg*Math.PI/180,x=Math.cos(a)*(R+.05),z=Math.sin(a)*(R+.05);la.push(placed(new THREE.BoxGeometry(.14,y0+.9,.14),[x,(y0+.9)/2,z],[0,-a,0]),boxG([.36,.04,.36],[x*1.08,.02,z*1.08]));}
 solid(m,mesh(csgGeometry(la,[],'cf-legs'),M.frame,[0,0,0],legs,'Chân'));
 const dr=part(m,'Van xả đáy',[0,0,0],m.root,'Van bi xả cặn ở đáy thùng.');ballValve(dr,[0,y0-.8,0],[0,-1,0],.045,'Van bi');explode(m,dr,[0,-.4,0]);
 const cap=part(m,'Nắp trên và bu lông',[0,y1+.08,0],m.root,'Nắp chỏm có vành mặt bích, mười sáu bu lông, van xả khí và tay nắm (H10 bước 1: tháo bu lông nắp).');
 solid(m,mesh(csgGeometry([revG([[0,R+.2],[.08,R+.2],[.08,R-.02],[.2,R*.8],[.42,R*.4],[.5,.1],[.5,0],[0,0]],[0,0,0],'y',96)],[...ringHoles(16,R+.12,.03,.04,.3)],'cf-cap'),M.vessel,[0,0,0],cap,'Nắp'));
 const cb=new THREE.Group();cap.add(cb);boltCircle(cb,'y',.08,R+.12,16,.045);cover(m,cb);
 cyl(.05,.1,[0,.55,0],M.brass,cap,'y',6);cyl(.02,.08,[.08,.55,0],M.brass,cap,'x',8);
 for(const x of [-.3,.3])rod([x,.38,0],[x,.55,0],.02,M.steel,cap);rod([-.3,.55,0],[.3,.55,0],.025,M.steel,cap);
 explode(m,cap,[0,1.6,0]);
 const inner=part(m,'Bộ giữ lõi',[0,0,0],m.root,'Khay đỡ lõi, trục ren khóa, đệm mềm định vị, đĩa ép định vị và đai ốc cố định (H10 bước 2–4).');
 revolve([[y0-.12,.05],[y0-.12,R-.08],[y0-.02,R-.08],[y0-.02,.62],[y0+.05,.62],[y0+.05,.05]],[0,0,0],M.steel,inner,'y',{segments:64,name:'Khay đỡ lõi'});
 mesh(threadGeometry({r:.05,depth:.008,pitch:.03,length:y1-y0+.1,axis:'y'}),M.steel,[0,(y0+y1)/2,0],inner,'Trục ren khóa');
 const el=part(m,'Lõi lọc sâu',[0,y0+.05,0],m.root,'Lõi lọc dạng sợi xốp có lỗ giữa, đặt khớp rãnh tâm khay (H10 bước 3). Lõi bị bẩn tháo ra thay mới.');
 revolve([[0,.08],[0,.62],[y1-y0-.55,.62],[y1-y0-.55,.08]],[0,0,0],M.resin,el,'y',{segments:64});explode(m,el,[0,3.8,0]);
 const press=part(m,'Đệm mềm, đĩa ép và đai ốc',[0,y1-.48,0],m.root,'Đệm mềm định vị, đĩa ép định vị và đai ốc cố định ép lõi xuống khay (H10 bước 4).');
 revolve([[0,.08],[0,.6],[.04,.6],[.04,.08]],[0,0,0],M.rubber,press,'y',{segments:48});revolve([[.04,.06],[.04,.75],[.08,.75],[.08,.06]],[0,0,0],M.bright,press,'y',{segments:48});
 for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;cyl(.06,.05,[Math.cos(a)*.45,.06,Math.sin(a)*.45],M.dark,press,'y',16);}cyl(.1,.1,[0,.13,0],M.brass,press,'y',6);
 explode(m,press,[0,2.6,0]);
 port(m,'Nước vào',[-1.45-.006,y0+.5,0],[-1,0,0],{kind:'nuoc',size:.12});
 port(m,'Nước đã lọc ra',[1.75,y1+.006,0],[0,1,0],{kind:'nuoc',size:.12});
 port(m,'Xả đáy',[0,y0-1.0,0],[0,-1,0],{kind:'nuoc',size:.045});
 for(const deg of [90,210,330]){const a=deg*Math.PI/180;port(m,`Đế chân ${deg}°`,[Math.cos(a)*(R+.05)*1.08,0,Math.sin(a)*(R+.05)*1.08],[0,-1,0],{kind:'co-khi',size:.06});}
 return m;
}

// Cụm nước bù và làm mềm (H7): lọc Y đầu vào, bình làm mềm có đầu điều khiển, van điện từ nước bù song song van tay, ống ra bình tách.
// Bình làm mềm đặt ngoài máy (vị trí ước lượng); nhựa trao đổi ion và ống phân phối bên trong là minh họa. Không phải hệ RO.
function softener(){
 const m=modelBase('softener'),R=1.0,H=7.4,b=.5;m.info.summary='Bình làm mềm Ø 2,0 cao 7,4 · lọc Y đầu vào · van điện từ nước bù song song van tay (H7)';
 const tank=part(m,'Bình làm mềm nước',[0,0,0],m.root,'Bình composite đứng có đế nhựa; khử canxi, magiê để giảm độ cứng nước bôi trơn (H7: water softener). Không phải hệ thẩm thấu ngược.');
 const prof=[[b,0],[b,R*.6],[b+.25,R*.95],[b+.5,R],[b+H-.5,R],[b+H-.25,R*.95],[b+H,R*.6],[b+H+.05,.3],[b+H+.05,0]];
 solid(m,mesh(csgGeometry([revG([...prof,[b+H-.05,0],[b+H-.05,.28],[b+H-.08,R*.58],[b+H-.3,R*.93-.03],[b+H-.5,R-.04],[b+.5,R-.04],[b+.27,R*.93-.04],[b+.05,R*.58-.04],[b+.05,0]],[0,0,0],'y',96)],[],'sof-tank'),M.white,[0,0,0],tank,'Vỏ bình'));
 revolve([[0,0],[0,R*.98],[b+.3,R*.98],[b+.3,R*.7],[b+.05,R*.62],[b,0]],[0,0,0],M.black,tank,'y',{segments:64,name:'Đế bình'});
 for(const y of [b+1.2,b+H-1.2])torus(R+.002,.012,[0,y,0],M.label,tank);
 const inner=part(m,'Ống phân phối và nhựa trao đổi ion (minh họa)',[0,0,0],tank,'Ống trung tâm, chụp lọc đáy và lớp hạt nhựa. Cấu tạo bên trong minh họa.',{minhHoa:true});
 cyl(.06,H-.2,[0,b+H/2,0],M.white,inner,'y',16);revolve([[b+.12,0],[b+.12,.3],[b+.3,.3],[b+.3,.06]],[0,0,0],M.dark,inner,'y',{segments:32});
 const beads=[];for(let i=0;i<900;i++){const a=i*2.39996,r=(R-.1)*Math.sqrt(((i*41)%899)/899),y=b+.4+((i*29)%899)/899*(H*.62);if(r>.1)beads.push({p:[Math.cos(a)*r,y,Math.sin(a)*r]});}
 instances(new THREE.SphereGeometry(.05,6,5),M.resin,beads,inner,'Hạt nhựa');
 const head=part(m,'Đầu điều khiển',[0,b+H+.05,0],m.root,'Van nhiều cửa có bộ định thời tái sinh, cửa vào/ra và cửa xả rửa ngược. Kiểu đầu điều khiển là giả định thường gặp.');
 revolve([[0,.22],[0,.3],[.25,.3],[.25,.22]],[0,0,0],M.dark,head,'y',{segments:48});roundedBox([1.0,.55,.7],[0,.52,0],M.dark,head,.08);roundedBox([.72,.42,.08],[0,.58,.38],M.motorDark,head,.04);
 cyl(.16,.06,[0,.6,.43],M.white,head,'z',40);box([.02,.12,.01],[0,.64,.465],M.red,head);
 for(const x of [-.36,.36]){cyl(.08,.3,[x,.3,0],M.dark,head,'x',24);cyl(.1,.06,[x*1.5,.3,0],M.dark,head,'x',6);}cyl(.05,.2,[0,.3,-.4],M.dark,head,'z',16);
 explode(m,head,[0,.9,0]);
 // đường vào: nước cấp → lọc Y → cửa vào đầu điều khiển
 const xin=-.36*1.5-.06,yh=b+H+.35;
 const inl=part(m,'Lọc Y và ống cấp',[0,0,0],m.root,'Lọc Y bảo vệ đầu điều khiển (H7: Y-type filter) và ống cấp nước.');
 pipe([[xin,yh,0],[xin-.4,yh,0],[xin-.4,2.4,0],[xin-.6,2.4,0]],.06,M.steel,inl);yStrainer(m,inl,[xin-.86,2.4,0],{r:.06});
 // đường ra: đầu điều khiển → van điện từ nước bù ‖ van tay → ống ra
 const xo=.36*1.5+.06,ym=4.4;
 const mk=part(m,'Van điện từ nước bù và van tay song song',[0,0,0],m.root,'Van điện từ mở khi mực nước bình tách thấp (do công tắc mức điều khiển); van tay song song để bù nước bằng tay khi dừng máy (H7: water supplement solenoid valve, manual water supplement valve).');
 pipe([[xo,yh,0],[xo+.5,yh,0],[xo+.5,ym+.44,0]],.06,M.steel,mk);
 const sv=new THREE.Group();sv.position.set(xo+.5,ym,.0);mk.add(sv);const svb=solenoidValveBody(m,sv,{name:'Van điện từ nước bù',port:.06,coilName:'Cuộn van nước bù',plunger:false});svb.rotation.z=Math.PI/2;
 pipe([[xo+.5,ym+.62,0],[xo+.5,ym+.62,.6],[xo+.5,ym+.13,.6]],.05,M.steel,mk);ballValve(mk,[xo+.5,ym,.6],[0,-1,0],.05,'Van tay nước bù');pipe([[xo+.5,ym-.13,.6],[xo+.5,ym-.62,.6],[xo+.5,ym-.62,0]],.05,M.steel,mk);
 pipe([[xo+.5,ym-.44,0],[xo+.5,ym-.9,0],[xo+1.4,ym-.9,0]],.06,M.blue,mk);
 const drn=part(m,'Ống xả rửa ngược',[0,0,0],m.root,'Ống mềm xả nước rửa ngược của đầu điều khiển ra rãnh thoát.');pipe([[0,yh,-.5],[0,yh,-1.2],[0,.3,-1.2]],.035,M.black,drn);
 port(m,'Nước cấp vào (H7: áp lực ≥ 0,2 MPa)',[xin-.86-.27,2.4,0],[-1,0,0],{kind:'nuoc',size:.06});
 port(m,'Nước bù ra (tới bình tách)',[xo+1.4,ym-.9,0],[1,0,0],{kind:'nuoc',size:.06});
 port(m,'Xả rửa ngược',[0,.3,-1.2],[0,-1,0],{kind:'nuoc',size:.035});
 port(m,'Dây điện van nước bù',[xo+.5+.3,ym,0],[1,0,0],{kind:'dien',size:.03});
 return m;
}

// ================= Két nóc, khung bệ, tủ điện, vỏ bao che (tỷ lệ trạm: 1 đơn vị ≈ 100 mm, ước lượng) =================
// Kích thước chung của gói máy: bệ dài X 19, sâu Z 12,5; khung cao tới mặt lắp két y = 11; két cao 2,8 (H1, H9).
const PKG={X:9.5,Z:6.25,base:1.2,top:11,post:.3,outlet:[9.5,8.5,-4.6]};
// Cánh quạt hướng trục cong: dựng nằm ngang (trục quay Y), gốc tại tâm moay-ơ.
function axialFanRotor(parent,{R,hub,blades=6,pitch=.35,name='Cánh quạt'}){
 const g=new THREE.Group();g.name=name;parent.add(g);
 revolve([[-.16,0],[-.16,hub],[.12,hub],[.18,hub*.7],[.18,0]],[0,0,0],M.dark,g,'y',{segments:48});
 const s=new THREE.Shape(),r0=hub*.9,r1=R;s.moveTo(r0,-.2*R/2.5);s.bezierCurveTo(r0+(r1-r0)*.35,-.34*R/2.5,r1*.85,-.6*R/2.5,r1,-.45*R/2.5);s.quadraticCurveTo(r1*1.02,.1*R/2.5,r1*.97,.42*R/2.5);s.bezierCurveTo(r1*.8,.38*R/2.5,r0+(r1-r0)*.3,.3*R/2.5,r0,.22*R/2.5);s.closePath();
 const bg=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:1,curveSegments:14});bg.translate(0,0,-.0125);bg.rotateX(Math.PI/2);
 for(let i=0;i<blades;i++){const b=new THREE.Group();b.rotation.y=i/blades*Math.PI*2;g.add(b);const bl=mesh(bg,M.motorDark,[0,0,0],b,'Cánh');bl.rotation.x=pitch;}
 return g;
}
function cooler(params={}){
 const m=modelBase('cooler'),dir0=params.airflow==='xuong'?'xuong':'len',X=PKG.X-.2,Z=PKG.Z-.15,hP=1.4,hR=1.4,fanX=4.4,fanR=2.55;
 const frame=part(m,'Vỏ két và hộp quạt',[0,0,0],m.root,'Vỏ tôn hai tầng: hộp quạt phía dưới có hai lỗ tròn, hộp két phía trên ôm lõi; mép gấp bắt vít (H5). Kích thước theo khung gói máy (ước lượng).');
 const wall=(sx,sy,sz,p)=>solid(m,mesh(new THREE.BoxGeometry(sx,sy,sz),M.housingDark,p,frame,'Tấm vỏ'));
 for(const sz of [-1,1])wall(2*X,hP+hR,.05,[0,(hP+hR)/2,sz*Z]);for(const sx of [-1,1])wall(.05,hP+hR,2*Z,[sx*X,(hP+hR)/2,0]);
 solid(m,mesh(csgGeometry([boxG([2*X,.05,2*Z],[0,.025,0])],[cylG(fanR+.08,.2,[-fanX,.025,0],'y',96),cylG(fanR+.08,.2,[fanX,.025,0],'y',96),cylG(.16,.2,[-(X-.55),.025,-Z*.5],'y',24),cylG(.16,.2,[-(X-.55),.025,Z*.5],'y',24)],'cooler-plate2'),M.housingDark,[0,0,0],frame,'Tấm đáy hộp quạt'));
 solid(m,mesh(csgGeometry([boxG([2*X,.05,2*Z],[0,hP,0])],[boxG([2*X-.6,.2,2*Z-.6],[0,hP,0])],'cooler-flange'),M.housingDark,[0,0,0],frame,'Gờ đỡ lõi'));
 const screws=[];for(let x=-X+.3;x<=X-.29;x+=.6)for(const sz of [-1,1])for(const y of [.1,hP+hR-.1,hP])screws.push({p:[x,y,sz*(Z+.03)],r:[Math.PI/2,0,0]});
 for(let z=-Z+.3;z<=Z-.29;z+=.6)for(const sx of [-1,1])for(const y of [.1,hP+hR-.1,hP])screws.push({p:[sx*(X+.03),y,z],r:[0,0,Math.PI/2]});
 instances(new THREE.CylinderGeometry(.035,.035,.02,8),M.bright,screws,frame,'Vít mép vỏ');
 for(const [sx,sz] of [[-1,-1],[-1,1],[1,-1],[1,1]])box([.25,hP+hR,.25],[sx*(X-.1),(hP+hR)/2,sz*(Z-.1)],M.frame,frame,'Thép góc');
 // Lõi két ống – lá: ống nước nằm theo X giữa hai hộp góp, lá tản nhiệt mỏng vuông góc ống; gió đi theo Y qua khe lá.
 const core=part(m,'Lõi két và lá tản nhiệt',[0,hP,0],m.root,'Lõi két nước kiểu ống – lá: 241 lá nhôm, ba hàng × 28 ống, hai hộp góp; vào/ra cùng phía trái (két hai lượt, có vách ngăn trong hộp góp trái). Hai cổ nước đi xuống từ đáy hộp góp trái, xuyên đáy hộp quạt để nối ống trong khung (hướng cổ là giả định; H5 chỉ cho thấy hai cổ ở đầu trái). Số lá, số ống là minh họa.');
 const cX=X-.9,cH=.95,cY=hR/2,fins=[];for(let i=0;i<=240;i++)fins.push({p:[-cX+i*2*cX/240,cY,0]});
 instances(new THREE.BoxGeometry(.012,cH,2*Z-.9),M.casting,fins,core,'241 lá tản nhiệt');
 const tubes=[];for(const y of [cY-.3,cY,cY+.3])for(let j=0;j<28;j++)tubes.push({p:[0,y,-Z+.6+j*(2*Z-1.2)/27],r:[0,0,Math.PI/2]});
 instances(new THREE.CylinderGeometry(.05,.05,2*cX+.2,12),M.bright,tubes,core,'84 ống nước');
 for(const sx of [-1,1]){solid(m,roundedBox([.5,cH+.25,2*Z-.6],[sx*(cX+.35),cY,0],M.steel,core,.08));}
 box([.46,cH+.2,.03],[-(cX+.35),cY,0],M.dark,core,'Vách ngăn hộp góp trái');
 cyl(.12,.15,[-(cX+.35),cY+.68,0],M.brass,core,'y',6);cyl(.08,.1,[-(cX+.35),cY+.8,0],M.red,core,'y',16);
 const nz=Z*.5,noz=new THREE.Group();noz.name='Cổ nước két';core.add(noz);
 for(const sz of [-1,1]){pipe([[-(cX+.35),cY-cH/2-.1,sz*nz],[-(cX+.35),-hP-.2,sz*nz]],.13,M.steel,noz);weldFlange(noz,{r:.28,ri:.11,bolts:4},[-(cX+.35),-hP-.22,sz*nz],[0,-1,0],'Mặt bích');}
 // Lưới nóc (H1): khung, thanh chính và thanh phụ ô vuông.
 const top=part(m,'Lưới nóc',[0,hP+hR,0],m.root,'Lưới thép ô vuông phủ toàn bộ nóc két (H1: air cooled radiator).');
 solid(m,mesh(csgGeometry([boxG([2*X+.1,.12,2*Z+.1],[0,.06,0])],[boxG([2*X-.4,.4,2*Z-.4],[0,.06,0])],'cooler-topframe'),M.frame,[0,0,0],top,'Khung lưới'));
 const bars=[];for(let x=-X+.2;x<=X-.19;x+=.31)bars.push({p:[x,.06,0],s:[1,1,1]});const barsZ=[];for(let z=-Z+.2;z<=Z-.19;z+=.31)barsZ.push({p:[0,.06,z]});
 instances(new THREE.BoxGeometry(.025,.1,2*Z-.4),M.dark,bars,top,'Thanh lưới dọc');instances(new THREE.BoxGeometry(2*X-.4,.1,.025),M.dark,barsZ,top,'Thanh lưới ngang');
 const mainBars=[];for(let i=1;i<6;i++)mainBars.push({p:[-X+i*2*X/6,.08,0]});instances(new THREE.BoxGeometry(.07,.14,2*Z-.4),M.frame,mainBars,top,'Thanh chính');
 cover(m,top);explode(m,top,[0,1.4,0]);explode(m,core,[0,.7,0]);
 // Hai quạt dưới hộp quạt (H1, H5): vành hướng gió, cánh, động cơ, giá treo và lưới bảo vệ.
 const fanMotions=[],cables=[];
 for(const x of [-fanX,fanX]){
  const lab=x<0?'A':'B',fa=part(m,`Cụm quạt ${lab}`,[x,0,0],m.root,'Quạt hướng trục đặt dưới két (H1: cooling fan; H5): vành hướng gió, cánh cong sáu lá, động cơ treo trên giá, lưới bảo vệ.');
  solid(m,revolve([[.05,fanR+.3],[0,fanR+.3],[0,fanR+.14],[-.62,fanR+.1],[-.62,fanR+.04],[-.08,fanR+.04],[0,fanR+.1],[.05,fanR+.1]],[0,0,0],M.paint,fa,'y',{segments:96,name:'Vành hướng gió'}));
  const rot=part(m,`Cánh quạt ${lab}`,[0,-.33,0],fa,'Cánh quạt hướng trục sáu lá cong, góc đặt cánh minh họa.');axialFanRotor(rot,{R:fanR-.05,hub:.42});fanMotions.push(rot);
  m.motions.push({object:rot,axis:'y',ratio:2.8});
  const mot=part(m,`Động cơ quạt ${lab}`,[0,-.95,0],fa,'Động cơ quạt treo trên giá, có hộp đấu dây và cáp.');
  revolve([[-.38,0],[-.38,.42],[.3,.42],[.36,.3],[.36,.08],[.5,.06],[.5,0]],[0,0,0],M.motorDark,mot,'y',{segments:48});
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;box([.04,.6,.06],[Math.cos(a)*.44,-.05,Math.sin(a)*.44],M.motorDark,mot).rotation.y=-a;}
  roundedBox([.3,.24,.22],[.52,0,0],M.motorDark,mot,.03);
  const guard=new THREE.Group();guard.name='Giá treo và lưới bảo vệ';guard.position.y=-.64;fa.add(guard);
  for(let i=1;i<=7;i++)torus(i*(fanR+.04)/7,.012,[0,0,0],M.steel,guard);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;rod([Math.cos(a)*.45,0,Math.sin(a)*.45],[Math.cos(a)*(fanR+.06),0,Math.sin(a)*(fanR+.06)],.012,M.steel,guard,6);}
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4;box([fanR,.08,.08],[Math.cos(a)*fanR/2,-.02,Math.sin(a)*fanR/2],M.frame,guard).rotation.y=-a;}
  cyl(.5,.06,[0,-.04,0],M.frame,guard,'y',32);cover(m,guard);
  explode(m,fa,[0,-1.6,0]);cables.push([x+.67,-.95,0]);
 }
 const cab=part(m,'Cáp quạt',[0,0,0],m.root,'Cáp hai động cơ quạt đi dọc đáy hộp quạt về phía tủ điện.');
 pipe([[-fanX+.67,-.95,0],[-fanX+.67,-.1,0],[fanX-3,-.1,.3],[fanX+.67,-.1,.3],[fanX+.67,-.95,0]],.03,M.black,cab);pipe([[fanX+.67,-.1,.3],[X-.3,-.1,.3],[X-.3,-.1,Z-.6]],.035,M.black,cab);
 const flow=part(m,'Hạt gió minh họa');flow.userData.noExport=true;
 const N=220,positions=new Float32Array(N*3),colors=new Float32Array(N*3);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
 flow.add(new THREE.Points(geo,new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.8,depthWrite:false})));
 // Hạt lạnh (xanh) đi vào két, hạt nóng (cam) sau khi qua lõi.
 const yLo=-2.4,yHi=hP+hR+1.6,span=yHi-yLo,yCore=hP+cY;let last=0;
 m.flow={object:flow,direction:dir0,update(t){last=t;const up=this.direction==='len';for(let i=0;i<N;i++){const u=(t*1.6+i/N*span)%span,y=up?yLo+u:yHi-u,side=i%2?1:-1,a=i*2.4,rr=(fanR-.3)*Math.sqrt(((i*37)%N)/N);
   const inFan=y<.2,px=inFan?side*fanX+Math.cos(a)*rr:-cX+((i*31)%N)/N*2*cX,pz=inFan?Math.sin(a)*rr:-Z+.6+((i*17)%N)/N*(2*Z-1.2);
   positions.set([px,y,pz],i*3);const hot=up?y>yCore:y<yCore;colors.set(hot?[.95,.55,.3]:[.25,.7,.9],i*3);}geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;},
  setDirection(d){this.direction=d==='xuong'?'xuong':'len';for(const f of m.motions.filter(a=>fanMotions.includes(a.object)))f.ratio=Math.abs(f.ratio)*(this.direction==='len'?1:-1);m.info.summary=airflowText(this.direction);this.update(last);}};
 m.flow.setDirection(dir0);
 port(m,'Nước nóng vào két',[-(cX+.35),-.23,-nz],[0,-1,0],{kind:'nuoc',size:.12,note:'Hai cổ nước cùng phía trái, hướng xuống; cổ sau là vào, cổ trước là ra (giả định).'});
 port(m,'Nước đã làm mát ra',[-(cX+.35),-.23,nz],[0,-1,0],{kind:'nuoc',size:.12});
 port(m,'Cáp quạt về tủ điện',[X-.3,-.1,Z-.6],[0,0,1],{kind:'dien',size:.04});
 for(const sx of [-1,1])for(const sz of [-1,1])port(m,`Gối đỡ két ${sx<0?'trái':'phải'} ${sz<0?'sau':'trước'}`,[sx*(X-.1),0,sz*(Z-.1)],[0,-1,0],{kind:'co-khi',size:.15});
 return m;
}
const airflowText=d=>d==='len'?'Chiều gió: từ dưới lên qua két (giả định, bản vẽ không có mũi tên)':'Chiều gió: từ trên xuống qua két (phương án đảo)';

// Khung gói máy (H1, H9): bệ thép có rãnh xe nâng và khay hứng, cột góc, dầm đỉnh đỡ két, tủ điện có cửa và lá gió,
// bảng điều khiển có màn hình và nút dừng khẩn cấp, cổng nước bôi trơn ra/vào ở hông bệ. params.enclosure='dong': thêm vỏ bao che.
function chassis(params={}){
 const m=modelBase('chassis'),{X,Z,base,top,post}=PKG,closed=params.enclosure==='dong',out=params.outlet??PKG.outlet;
 m.info.summary=`Bệ ${fmt(2*X)} × ${fmt(2*Z)} cao ${fmt(base)} · khung tới ${fmt(top)} · tủ điện, bảng điều khiển · ${closed?'có vỏ bao che (H9)':'khung hở (H1)'}`;
 const bp=part(m,'Bệ máy',[0,0,0],m.root,'Bệ thép chữ U hàn, hai rãnh xe nâng ở mặt trước và sau, dầm ngang và khay hứng nước có lỗ xả (H1: pedestal).');
 const slots=[];for(const sz of [-1,1])for(const x of [-4.6,4.6])slots.push(boxG([1.7,.62,.6],[x,.42,sz*(Z-.12)]));
 const ch=[];for(const sz of [-1,1])ch.push(boxG([2*X,base,.05],[0,base/2,sz*(Z-.025)]),boxG([2*X,.07,.32],[0,base-.035,sz*(Z-.16)]),boxG([2*X,.07,.32],[0,.035,sz*(Z-.16)]));
 for(const sx of [-1,1])ch.push(boxG([.05,base,2*Z-.1],[sx*(X-.025),base/2,0]),boxG([.32,.07,2*Z-.1],[sx*(X-.16),base-.035,0]),boxG([.32,.07,2*Z-.1],[sx*(X-.16),.035,0]));
 solid(m,mesh(csgGeometry(ch,slots,'chassis-base'),M.paint,[0,0,0],bp,'Khung bệ chữ U'));
 for(const x of [-4.6,4.6]){box([1.7,.04,2*Z-.1],[x,.75,0],M.paint,bp,'Ống xe nâng');for(const sx of [-1,1])box([.04,.62,2*Z-.1],[x+sx*.85,.42,0],M.paint,bp,'Ống xe nâng');}
 for(const x of [-6.6,-2.2,2.2,6.6])box([.22,base-.25,2*Z-.4],[x,(base-.25)/2+.12,0],M.paint,bp,'Dầm ngang');
 solid(m,mesh(csgGeometry([boxG([2*X-.1,.05,2*Z-.1],[0,base-.025,0]),boxG([2*X-.1,.12,.05],[0,base+.035,Z-.08]),boxG([2*X-.1,.12,.05],[0,base+.035,-(Z-.08)])],[cylG(.12,.3,[-7.5,base,4.6],'y',24)],'chassis-tray'),M.steel,[0,0,0],bp,'Khay hứng nước'));
 // cổng nước bôi trơn ra/vào ở hông trái bệ (H1)
 const bk=part(m,'Cổng nước bôi trơn ra/vào',[0,0,0],bp,'Hai đầu nối xuyên vách ở hông trái bệ: nước bôi trơn vào (nước cấp/bù) và ra (xả) (H1: lubricating water inlet/outlet).');
 for(const [z,lab] of [[4.9,'vào'],[3.9,'ra']]){cyl(.09,.12,[-X-.04,.6,z],M.brass,bk,'x',6);cyl(.06,.4,[-X+.1,.6,z],M.brass,bk,'x',16);mesh(threadGeometry({r:.06,depth:.008,pitch:.02,length:.12}),M.brass,[-X-.16,.6,z],bk,'Ren');box([.01,.18,.5],[-X-.005,.95,z],M.label,bk,'Nhãn '+lab);}
 // khung
 const fr=part(m,'Cột và dầm đỉnh',[0,0,0],m.root,'Bốn cột góc ống vuông, cột giữa phía sau và dầm đỉnh đỡ két nóc.');
 const pz=Z-post/2,px=X-post/2;
 for(const sx of [-1,1])for(const sz of [-1,1])box([post,top-base,post],[sx*px,(base+top)/2,sz*pz],M.paint,fr,'Cột góc');
 box([post,top-base,post],[0,(base+top)/2,-pz],M.paint,fr,'Cột giữa sau');
 for(const sz of [-1,1])box([2*X,post,post],[0,top-post/2,sz*pz],M.paint,fr,'Dầm đỉnh dọc');for(const sx of [-1,1])box([post,post,2*Z],[sx*px,top-post/2,0],M.paint,fr,'Dầm đỉnh ngang');
 const gus=[];for(const sx of [-1,1])for(const sz of [-1,1])gus.push({p:[sx*(px-.25),top-.55,sz*(pz-.25)],r:[0,Math.atan2(sz,sx)+Math.PI/4,0]});instances(new THREE.BoxGeometry(.04,.5,.5),M.paint,gus,fr,'Ke góc');
 // tủ điện
 const ex0=4.0,ex1=X-.3,ez0=.6,ez1=Z-.25,ey0=base+.05,ey1=top-.4,ew=ex1-ex0,ed=ez1-ez0,eh=ey1-ey0,ecx=(ex0+ex1)/2,ecz=(ez0+ez1)/2,ecy=(ey0+ey1)/2;
 const eb=part(m,'Tủ điện',[0,0,0],m.root,'Tủ điện thép có cửa trước, lá gió hông phải phía sau, đế cáp; chứa thiết bị đóng cắt và khởi động (H1: electric control box). Thiết bị bên trong là minh họa.');
 const louv=[];for(let i=0;i<9;i++)louv.push(boxG([.3,.08,1.6],[ex1,ey1-1.2-i*.22,ez0+1.2]));
 solid(m,mesh(csgGeometry([boxG([ew,eh,ed],[ecx,ecy,ecz])],[boxG([ew-.1,eh-.1,ed],[ecx,ecy,ecz+.06]),...louv,cylG(.12,.3,[ecx-1,ey0,ecz],'y',16),cylG(.12,.3,[ecx+1,ey0,ecz],'y',16)],'chassis-ebox'),M.white,[0,0,0],eb,'Vỏ tủ'));
 const lv=[];for(let i=0;i<9;i++)lv.push({p:[ex1+.02,ey1-1.2-i*.22,ez0+1.2],r:[0,0,-.5]});instances(new THREE.BoxGeometry(.03,.16,1.6),M.white,lv,eb,'Lá gió hông tủ');
 const door=part(m,'Cửa tủ điện',[ecx,ecy,ez1+.03],eb,'Cửa bản lề phải, tay nắm khóa, khe thông gió phía dưới.');
 solid(m,mesh(csgGeometry([rboxG([ew-.04,eh-.04,.05],[0,0,0],.03),rboxG([ew-.4,eh-.4,.04],[0,0,.03],.03)],[...Array.from({length:12},(_,i)=>boxG([.08,.5,.3],[-1.6+i*.3,-eh/2+.6,0]))],'chassis-door'),M.white,[0,0,0],door,'Tấm cửa'));
 const hd=new THREE.Group();hd.name='Tay nắm và bản lề';door.add(hd);roundedBox([.12,.6,.06],[-ew/2+.35,0,.08],M.dark,hd,.03);cyl(.05,.05,[-ew/2+.35,.2,.1],M.bright,hd,'z',16);
 for(const y of [-eh/2+.8,0,eh/2-.8])cyl(.05,.35,[ew/2-.02,y,.02],M.bright,hd,'y',12);cover(m,hd);
 box([1.4,.8,.01],[0,eh/2-1.1,.055],M.label,door,'Sơ đồ đấu dây (minh họa)');explode(m,door,[0,0,2.4]);
 const inn=part(m,'Thiết bị trong tủ (minh họa)',[0,0,0],eb,'Tấm gá, áp tô mát tổng, công tắc tơ, rơ le nhiệt, bộ khởi động mềm, biến áp điều khiển, cầu đấu, máng cáp. Bố trí minh họa, không lấy từ sơ đồ điện.',{minhHoa:true});
 const iz=ez0+.12;box([ew-.6,eh-1,.04],[ecx,ecy,iz],M.steel,inn,'Tấm gá');
 roundedBox([.9,1.4,.6],[ex0+1.0,ey1-1.6,iz+.32],M.dark,inn,.04);box([.12,.3,.05],[ex0+1.0,ey1-1.4,iz+.64],M.red,inn,'Cần áp tô mát');
 for(let i=0;i<3;i++){roundedBox([.55,.75,.5],[ex0+2.2+i*.7,ey1-1.7,iz+.27],M.white,inn,.03);box([.3,.12,.02],[ex0+2.2+i*.7,ey1-1.5,iz+.53],M.dark,inn);}
 roundedBox([1.4,1.9,.55],[ex0+1.4,ecy-.4,iz+.3],M.motorDark,inn,.05);box([.5,.3,.02],[ex0+1.4,ecy+.1,iz+.58],M.blue,inn,'Màn khởi động mềm');
 revolve([[0,.0],[0,.4],[.6,.4],[.6,0]],[ex0+3.6,ecy-.2,iz+.5],M.copper,inn,'x',{segments:24,name:'Biến áp điều khiển'});
 box([ew-.8,.12,.15],[ecx,ey0+1.0,iz+.1],M.steel,inn,'Thanh DIN');const tm=[];for(let i=0;i<28;i++)tm.push({p:[ex0+.6+i*(ew-1.2)/27,ey0+1.08,iz+.2]});instances(new THREE.BoxGeometry(.1,.3,.25),M.blue,tm,inn,'Cầu đấu');
 for(const y of [ey0+.6,ey1-.6])box([ew-.6,.3,.3],[ecx,y,iz+.17],M.white,inn,'Máng cáp');box([.3,eh-1.2,.3],[ex1-.45,ecy,iz+.17],M.white,inn,'Máng cáp đứng');
 // bảng điều khiển trên mặt trước hộp két (H1: control panel, emergency button)
 const cp=part(m,'Bảng điều khiển',[6.0,top+.75,Z-.015],m.root,'Hộp bảng điều khiển gắn mặt trước hộp két: màn hình, phím bấm, đèn báo; nút dừng khẩn cấp bên phải (H1). Nội dung màn hình là minh họa.');
 roundedBox([2.8,1.15,.22],[0,0,0],M.motorDark,cp,.06);box([1.25,.72,.02],[-.5,.05,.12],M.black,cp,'Viền màn hình');box([1.12,.6,.01],[-.5,.05,.135],M.blue,cp,'Màn hình');
 const keys=[];for(let i=0;i<4;i++)for(let j=0;j<2;j++)keys.push({p:[.5+i*.2,.15-j*.28,.12]});instances(new THREE.BoxGeometry(.15,.15,.05),M.white,keys,cp,'Phím bấm');
 for(const [x,c] of [[.5,M.green??M.blue],[.75,M.red]])cyl(.04,.03,[x,-.42,.12],c,cp,'z',16);
 const es=part(m,'Nút dừng khẩn cấp',[1.75,0,.1],cp,'Nút nấm đỏ trên đế vàng (H1: emergency button).');cyl(.22,.06,[0,0,0],M.brass,es,'z',32);cyl(.1,.12,[0,0,.08],M.dark,es,'z',24);revolve([[0,0],[0,.17],[.05,.18],[.1,.12],[.11,0]],[0,0,.13],M.handle,es,'z',{segments:32});
 const br=new THREE.Group();br.name='Giá bảng điều khiển';cp.add(br);box([2.6,.62,.04],[0,-.82,-.09],M.paint,br);
 // vỏ bao che (tùy chọn, H9)
 if(closed){
  const enc=part(m,'Vỏ bao che',[0,0,0],m.root,'Tấm vỏ bao che (H9): hai cửa trước có tay nắm, lá gió hông trái và hông phải, lỗ xuyên ống khí ra ở hông phải phía sau. Bố trí ước lượng theo H9.');
  const ph=top-base-.1,py=(top+base)/2;
  const panel=(w,h,cx,cy,cz,axis,name,{louver=false,cut=null}={})=>{
   const thin=.045,size=axis==='z'?[w,h,thin]:[thin,h,w],pos=[cx,cy,cz],sub=[];
   const ly=louver?Array.from({length:Math.floor((h-1.2)/.25)},(_,i)=>cy-h/2+.6+i*.25).filter(y=>!cut||Math.abs(y-cut.pos[1])>cut.r+.3):[];
   for(const y of ly)sub.push(boxG(axis==='z'?[w-1,.12,.3]:[.3,.12,w-1],[cx,y,cz]));
   if(cut)sub.push(cylG(cut.r,.5,cut.pos,axis,32));
   const p=solid(m,mesh(csgGeometry([boxG(size,pos)],sub,'enc-'+name+[w,h,cx,cy,cz]+(cut?'-'+cut.pos:'')),M.motor,[0,0,0],enc,name));
   if(louver){const sl=ly.map(y=>({p:axis==='z'?[cx,y,cz+.05]:[cx+(cx>0?.05:-.05),y,cz],r:axis==='z'?[-.6,0,0]:[0,0,cx>0?.6:-.6]}));instances(new THREE.BoxGeometry(axis==='z'?w-1:.03,.03,axis==='z'?.03:w-1),M.motor,sl,enc,'Lá gió '+name);}
   return p;};
  const dw=(ex0-(-X+post))/2;
  for(let i=0;i<2;i++){const cx=-X+post+dw/2+i*dw,d=part(m,`Cửa trước ${i+1}`,[0,0,0],enc,'Cửa bản lề có tay nắm khóa.');
   solid(m,mesh(csgGeometry([boxG([dw-.08,ph,.045],[cx,py,Z+.03])],[],'enc-door'+i),M.motor,[0,0,0],d,'Tấm cửa'));roundedBox([.1,.7,.07],[cx+dw/2-.35,py,Z+.09],M.dark,d,.03);for(const y of [py-ph/2+.8,py+ph/2-.8])cyl(.05,.3,[cx-dw/2+.06,y,Z+.05],M.bright,d,'y',12);explode(m,d,[0,0,2.5]);}
  const lp=part(m,'Tấm hông trái có lá gió',[0,0,0],enc,'Tấm hông trái, lá gió cho gió làm mát vào (H9).');panel(2*Z-.7,ph,-X-.03,py,0,'x','hông trái',{louver:true});explode(m,lp,[-2.5,0,0]);
  const rp=part(m,'Tấm hông phải sau tủ điện',[0,0,0],enc,'Tấm hông phải phía sau tủ điện, có lá gió và lỗ xuyên ống khí nén ra.');panel(ez0+Z-.4,ph,X+.03,py,(ez0-Z)/2,'x','hông phải',{louver:true,cut:{r:.4,pos:[X+.03,out[1],out[2]]}});explode(m,rp,[2.5,0,0]);
  const bk2=part(m,'Tấm sau',[0,0,0],enc,'Tấm sau kín.');panel(2*X-.7,ph,0,py,-Z-.03,'z','sau');explode(m,bk2,[0,0,-2.5]);
 }
 port(m,'Cáp nguồn vào tủ điện',[ecx-1,base,ecz],[0,-1,0],{kind:'dien',size:.12});
 port(m,'Cáp động cơ ra (tới hộp đấu điện)',[ecx+1,base,ecz],[0,-1,0],{kind:'dien',size:.12});
 port(m,'Nước bôi trơn vào (xuyên vách bệ)',[-X-.22,.6,4.9],[-1,0,0],{kind:'nuoc',size:.06});port(m,'Nước bôi trơn vào – phía trong',[-X+.3,.6,4.9],[1,0,0],{kind:'nuoc',size:.06});
 port(m,'Nước bôi trơn ra (xuyên vách bệ)',[-X-.22,.6,3.9],[-1,0,0],{kind:'nuoc',size:.06});port(m,'Nước bôi trơn ra – phía trong',[-X+.3,.6,3.9],[1,0,0],{kind:'nuoc',size:.06});
 port(m,'Lỗ xả khay hứng',[-7.5,base-.05,4.6],[0,-1,0],{kind:'nuoc',size:.12});
 for(const sx of [-1,1])for(const sz of [-1,1])port(m,`Chân bệ ${sx<0?'trái':'phải'} ${sz<0?'sau':'trước'}`,[sx*(X-.3),0,sz*(Z-.3)],[0,-1,0],{kind:'co-khi',size:.15});
 port(m,'Mặt lắp két nóc',[0,top,0],[0,1,0],{kind:'co-khi',size:.5});
 port(m,'Lỗ xuyên ống khí nén ra',out,[1,0,0],{kind:'khi',size:.4,note:'Lỗ trên tấm hông phải khi có vỏ bao che'});
 return m;
}

// ================= Thiết bị ngoài: bình tích áp, máy sấy lạnh, máy sấy hấp phụ (tỷ lệ trạm, mẫu tổng quát) =================
// Bộ ảnh không có bản vẽ riêng các thiết bị này: hình dạng là mẫu thường gặp, kích thước ước lượng, kết cấu trong là minh họa.
// Vỏ bình áp lực đứng hai đáy elip 2:1 có cổ nối hàn xuyên vỏ. nozzles: {tên:{a:điểm trong,b:điểm ngoài,ro,ri}}.
function pressureShell({R,t,y0,y1,nozzles,key,seg=96}){
 const hd=R/2,head=(yc,rr,hh,from,to,n=16)=>{const out=[];for(let i=0;i<=n;i++){const a=from+(to-from)*i/n;out.push([yc+hh*Math.sin(a),rr*Math.cos(a)]);}return out;};
 const outer=[...head(y0,R,hd,-Math.PI/2,0),...head(y1,R,hd,0,Math.PI/2)],inner=[...head(y1,R-t,hd-t,Math.PI/2,0),...head(y0,R-t,hd-t,0,-Math.PI/2)];
 const neck=(n,r)=>{const a=new THREE.Vector3(...n.a),b=new THREE.Vector3(...n.b),d=b.clone().sub(a),g=new THREE.CylinderGeometry(r,r,d.length(),40);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());return g;};
 const list=Object.values(nozzles);
 return csgGeometry([revG([...outer,...inner],[0,0,0],'y',seg),...list.map(n=>neck(n,n.ro))],[revG(inner.map(([y,r])=>[y,Math.max(0,r-.0005)]),[0,0,0],'y',seg),...list.map(n=>neck(n,n.ri))],key);
}
const headY=(R,y1,r)=>y1+R/2*Math.sqrt(Math.max(0,1-(r/R)**2));
// Van xả tự động: van điện từ nhỏ và hộp hẹn giờ.
function autoDrain(m,parent,pos,name='Van xả tự động hẹn giờ'){
 const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);
 solenoidValveBody(m,g,{name:'Thân van xả',port:.05,coilName:'Cuộn van xả',plunger:false});
 const tm=new THREE.Group();tm.name='Hộp hẹn giờ';tm.position.set(.32,.36,0);g.add(tm);roundedBox([.24,.3,.2],[0,0,0],M.dark,tm,.03);cyl(.06,.02,[0,.03,.11],M.white,tm,'z',24);box([.08,.04,.01],[0,-.08,.105],M.green,tm);
 return g;
}

// Bình tích áp khí nén (bên ngoài máy): bình đứng có cửa vào thấp, cửa ra cao, cửa thăm, van an toàn, đồng hồ, xả đáy tay và tự động.
function receiver(){
 const m=modelBase('receiver'),R=2.6,t=.06,y0=2.4,y1=10.4,hd=R/2,top=y1+hd,bot=y0-hd,ym=(y0+y1)/2;
 m.info.summary=`Bình đứng Ø ${fmt(2*R)} · thân ${fmt(y1-y0)} · đáy elip 2:1 · cửa vào thấp, ra cao · ba chân (mẫu tổng quát)`;
 const rS=.9,yS=headY(R,y1,rS);
 const N={
  inlet:{a:[-(R-.3),y0+1.3,0],b:[-(R+.75),y0+1.3,0],ro:.3,ri:.24},outlet:{a:[R-.3,y1-1.0,0],b:[R+.75,y1-1.0,0],ro:.3,ri:.24},
  hand:{a:[0,ym,R-.3],b:[0,ym,R+.42],ro:.62,ri:.54},safety:{a:[rS,y1+.6,0],b:[rS,yS+.32,0],ro:.12,ri:.08},
  gaugeN:{a:[-rS*.7,y1+.6,rS*.7],b:[-rS*.7,yS+.3,rS*.7],ro:.08,ri:.05},drain:{a:[0,bot+.2,0],b:[0,bot-.35,0],ro:.1,ri:.07},
 };
 const shell=part(m,'Vỏ bình tích áp',[0,0,0],m.root,'Thân trụ và hai đáy elip có độ dày, cổ nối hàn xuyên vỏ. Bình tích áp đặt ngoài máy, khác bình tách khí–nước bên trong máy. Mẫu tổng quát, kích thước ước lượng.');
 solid(m,mesh(pressureShell({R,t,y0,y1,nozzles:N,key:'receiver-shell'}),M.vessel,[0,0,0],shell,'Vỏ có độ dày'));
 for(const y of [y0,y1])cover(m,torus(R+.003,.025,[0,y,0],M.steel,shell));
 const legs=part(m,'Ba chân đỡ',[0,0,0],m.root,'Ba chân thép hàn vào thân dưới, tấm đế có lỗ neo.');
 const la=[];for(const deg of [90,210,330]){const a=deg*Math.PI/180,x=Math.cos(a)*(R+.12),z=Math.sin(a)*(R+.12);la.push(placed(new THREE.BoxGeometry(.3,y0+1,.3),[x,(y0+1)/2,z],[0,-a,0]),placed(new THREE.BoxGeometry(.8,.06,.8),[x*1.04,.03,z*1.04],[0,-a,0]));}
 solid(m,mesh(csgGeometry(la,[],'receiver-legs'),M.frame,[0,0,0],legs,'Chân'));
 const lug=part(m,'Tai cẩu',[0,0,0],shell,'Hai tai cẩu trên đáy trên.');
 for(const deg of [90,270]){const a=deg*Math.PI/180,x=Math.cos(a)*1.6,z=Math.sin(a)*1.6;solid(m,mesh(csgGeometry([placed(new THREE.BoxGeometry(.6,.6,.08),[x,headY(R,y1,1.6)+.18,z],[0,-a+Math.PI/2,0])],[placed(new THREE.CylinderGeometry(.11,.11,.3,20).rotateX(Math.PI/2),[x,headY(R,y1,1.6)+.28,z],[0,-a+Math.PI/2,0])],'receiver-lug'+deg),M.frame,[0,0,0],lug));}
 const io=part(m,'Cổ vào, cổ ra và mặt bích',[0,0,0],m.root,'Cửa vào phía dưới, cửa ra phía trên ở hai phía đối diện để khí đi qua toàn bình.');
 weldFlange(io,{r:.62,ri:.24,bolts:8,t:.08},N.inlet.b,[-1,0,0],'Mặt bích vào');weldFlange(io,{r:.62,ri:.24,bolts:8,t:.08},N.outlet.b,[1,0,0],'Mặt bích ra');
 const hh=part(m,'Cửa thăm',[0,ym,R+.42],m.root,'Cửa thăm tròn có mặt bích mù, tám bu lông và tay cầm để kiểm tra bên trong bình.');
 const hb=new THREE.Group();hb.rotation.x=Math.PI/2;hh.add(hb);cyl(.85,.12,[0,.06,0],M.vessel,hb,'y',64);cyl(.75,.03,[0,-.01,0],M.seal,hb,'y',64);boltCircle(hb,'y',.12,.72,8,.07);
 rod([-.3,.12,0],[-.3,.35,0],.03,M.steel,hb);rod([.3,.12,0],[.3,.35,0],.03,M.steel,hb);rod([-.3,.35,0],[.3,.35,0],.03,M.steel,hb);explode(m,hh,[0,0,1.2]);
 const sv=part(m,'Van an toàn',N.safety.b,m.root,'Van an toàn lò xo trên đỉnh bình; áp suất đặt không lấy từ bản vẽ.');
 revolve([[0,0],[0,.13],[.08,.13],[.1,.17],[.42,.17],[.5,.1],[.72,.1],[.76,.06],[.76,0]],[0,0,0],M.brass,sv,'y',{segments:24});cyl(.07,.25,[.2,.28,0],M.brass,sv,'x',16);cyl(.08,.08,[0,.8,0],M.handle,sv,'y',16);box([.32,.035,.05],[.12,.74,0],M.handle,sv);
 explode(m,sv,[0,.8,0]);
 const gg=part(m,'Đồng hồ áp suất và ống xi phông',N.gaugeN.b,m.root,'Đồng hồ áp suất trên ống xi phông và van khóa.');
 const coil=[];for(let i=0;i<=60;i++){const a=i/60*Math.PI*2*1.5;coil.push(new THREE.Vector3(Math.cos(a)*.12,.1+i/60*.3,Math.sin(a)*.12));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coil),60,.02,6,false),M.brass,[0,0,0],gg,'Ống xi phông');
 ballValve(gg,[0,.55,0],[0,1,0],.035,'Van khóa đồng hồ');const gd=gauge([0,1.05,0],gg,.32);gd.rotation.y=Math.PI/4;explode(m,gg,[0,.8,0]);
 const dr=part(m,'Xả đáy tay và tự động',[0,0,0],m.root,'Ống xả đáy có van bi tay và van xả tự động hẹn giờ đặt song song.');
 pipe([[0,bot-.35,0],[0,bot-.7,0],[1.2,bot-.7,0]],.07,M.steel,dr);ballValve(dr,[.6,bot-.7,0],[1,0,0],.05,'Van xả tay');
 pipe([[.25,bot-.7,0],[.25,bot-.7,.6],[1.6,bot-.7,.6]],.05,M.steel,dr);autoDrain(m,dr,[.95,bot-.7,.6]);pipe([[1.2,bot-.7,0],[1.6,bot-.7,0],[1.6,bot-.7,.6],[1.9,bot-.7,.6]],.05,M.steel,dr);explode(m,dr,[.8,-.3,0]);
 const np=part(m,'Biển tên bình',[0,y1-1.6,0],shell,'Biển tên bình áp lực (nội dung minh họa).');const pl=box([.9,.6,.02],[Math.cos(-.5)*(R+.02),0,Math.sin(-.5)*(R+.02)],M.label,np);pl.rotation.y=.5+Math.PI/2;cover(m,np);
 port(m,'Khí nén vào',[N.inlet.b[0]-.008,N.inlet.b[1],0],[-1,0,0],{kind:'khi',size:.3});port(m,'Khí nén ra',[N.outlet.b[0]+.008,N.outlet.b[1],0],[1,0,0],{kind:'khi',size:.3});
 port(m,'Xả nước ngưng',[1.9,bot-.7,.6],[1,0,0],{kind:'nuoc',size:.05});
 for(const deg of [90,210,330]){const a=deg*Math.PI/180;port(m,`Đế chân ${deg}°`,[Math.cos(a)*(R+.12)*1.04,0,Math.sin(a)*(R+.12)*1.04],[0,-1,0],{kind:'co-khi',size:.1});}
 return m;
}

// Máy sấy lạnh: tủ tôn, máy nén lạnh kín, dàn ngưng có quạt, khối trao đổi nhiệt khí–khí và bay hơi bọc cách nhiệt,
// bộ tách nước có van xả tự động, phin lọc, van tiết lưu, van nhánh nóng, bảng điều khiển. Cấu tạo bên trong minh họa.
function dryer(){
 const m=modelBase('dryer'),W=5.6,H=8.6,D=7.0,b=.4;m.info.summary=`Tủ ${fmt(W)} × ${fmt(H)} × ${fmt(D)} · cửa khí vào/ra phía sau trên · mẫu tổng quát`;
 const x0=-W/2,x1=W/2,z0=-D/2,z1=D/2;
 const cab=part(m,'Vỏ tủ máy sấy',[0,0,0],m.root,'Khung tủ, tấm nóc, tấm hông có lá gió phía dàn ngưng, tấm trước có bảng điều khiển; tấm tháo được để bảo dưỡng.');
 solid(m,mesh(csgGeometry([boxG([W,b,D],[0,b/2,0])],[boxG([W-.4,b-.12,D+1],[0,b/2,0])],'dryer-base'),M.frame,[0,0,0],cab,'Đế tủ'));
 for(const sx of [-1,1])for(const sz of [-1,1])box([.12,H-b,.12],[sx*(W/2-.06),(H+b)/2,sz*(D/2-.06)],M.frame,cab,'Cột tủ');
 const pnl=(name,size,pos,opts={})=>{const p=part(m,name,[0,0,0],cab,opts.desc??'Tấm vỏ tháo được.');solid(m,mesh(csgGeometry([boxG(size,pos)],opts.sub??[],'dryer-'+name),opts.mat??M.white,[0,0,0],p,'Tấm'));if(opts.explode)explode(m,p,opts.explode);return p;};
 const lvSub=[];for(let i=0;i<20;i++)lvSub.push(boxG([.4,.12,D-1.4],[x1,b+1+i*.3,0]));
 pnl('Tấm nóc',[W,.06,D],[0,H+.03,0],{explode:[0,1.4,0]});
 pnl('Tấm hông phải có lá gió',[.05,H-b,D],[x1+.025,(H+b)/2,0],{sub:lvSub,explode:[1.6,0,0],desc:'Tấm hông phía dàn ngưng có khe gió.'});
 pnl('Tấm hông trái',[.05,H-b,D],[x0-.025,(H+b)/2,0],{explode:[-1.6,0,0]});
 pnl('Tấm sau',[W,H-b,.05],[0,(H+b)/2,z0-.025],{sub:[cylG(.32,.4,[-1.2,H-1.0,z0],'z',32),cylG(.32,.4,[1.2,H-1.0,z0],'z',32),cylG(.1,.4,[1.8,b+.6,z0],'z',16)],explode:[0,0,-1.6]});
 const front=pnl('Tấm trước và bảng điều khiển',[W,H-b,.05],[0,(H+b)/2,z1+.025],{explode:[0,0,1.6],desc:'Tấm trước có bộ điều khiển, đồng hồ điểm sương, công tắc nguồn.'});
 const ctl=new THREE.Group();ctl.name='Bộ điều khiển';ctl.position.set(0,H-1.4,z1+.06);front.add(ctl);roundedBox([2.4,1.2,.12],[0,0,0],M.motorDark,ctl,.05);box([1.0,.5,.01],[-.5,.15,.065],M.blue,ctl,'Màn hình');gauge([.7,.05,.02],ctl,.32);cyl(.12,.06,[-.5,-.35,.07],M.handle,ctl,'z',24);cyl(.06,.04,[-.15,-.35,.07],M.green,ctl,'z',16);
 const lv=[];for(let i=0;i<20;i++)lv.push({p:[x1+.06,b+1+i*.3,0],r:[0,0,-.5]});instances(new THREE.BoxGeometry(.03,.2,D-1.4),M.white,lv,cab,'Lá gió');
 const inn=part(m,'Hệ lạnh bên trong (minh họa)',[0,0,0],m.root,'Các khối bên trong theo kiểu máy sấy lạnh thường gặp; không có bản vẽ, chỉ minh họa.',{minhHoa:true});
 const comp=part(m,'Máy nén môi chất lạnh',[-1.2,b,1.4],inn,'Máy nén kín đặt trên đệm cao su, ống hút và ống đẩy bằng đồng.',{minhHoa:true});
 box([1.6,.08,1.6],[0,.04,0],M.frame,comp);for(const [x,z] of [[-.6,-.6],[-.6,.6],[.6,-.6],[.6,.6]])cyl(.1,.12,[x,.14,z],M.rubber,comp,'y',16);
 revolve([[0,0],[0,.75],[.3,.8],[2.0,.8],[2.3,.6],[2.45,.2],[2.47,0]],[0,.2,0],M.black,comp,'y',{segments:48});roundedBox([.45,.4,.25],[0,1.6,.82],M.dark,comp,.04);
 const cond=part(m,'Dàn ngưng và quạt',[x1-.6,b+.4,0],inn,'Dàn ngưng ống đồng cánh nhôm sát tấm hông có lá gió; quạt hút gió qua dàn.',{minhHoa:true});
 const fins=[];for(let i=0;i<90;i++)fins.push({p:[0,2.0,-2.4+i*4.8/89]});instances(new THREE.BoxGeometry(.6,3.6,.012),M.casting,fins,cond,'Lá dàn ngưng');
 const ct=[];for(let i=0;i<8;i++)for(const x of [-.15,.15])ct.push({p:[x,.4+i*.45,0],r:[Math.PI/2,0,0]});instances(new THREE.CylinderGeometry(.04,.04,4.9,10),M.copper,ct,cond,'Ống dàn ngưng');
 const fanG=new THREE.Group();fanG.name='Quạt dàn ngưng';fanG.position.set(-.9,2.0,0);fanG.rotation.z=-Math.PI/2;cond.add(fanG);
 revolve([[0,1.3],[0,1.35],[-.4,1.35],[-.4,1.3]],[0,0,0],M.dark,fanG,'y',{segments:64});const fr=part(m,'Cánh quạt dàn ngưng',[0,-.2,0],fanG,'');axialFanRotor(fr,{R:1.22,hub:.25,blades:5});m.motions.push({object:fr,axis:'y',ratio:3});
 cyl(.3,.5,[0,-.6,0],M.motorDark,fanG,'y',24);
 const hx=part(m,'Khối trao đổi nhiệt khí–khí và bay hơi',[-1.0,H-3.4,-1.2],inn,'Khối bọc cách nhiệt gồm trao đổi nhiệt khí–khí, bay hơi và tách nước; ống khí vào/ra đi lên tấm sau.',{minhHoa:true});
 roundedBox([2.6,4.2,2.6],[0,0,0],M.black,hx,.2);for(const x of [-.2,1.2])box([.02,4.0,2.62],[x-.5,0,0],M.dark,hx);
 pipe([[-.2,2.1,-.8],[-.2,2.4,-.8],[-.2,2.4,-2.3]],.24,M.steel,hx);pipe([[.6,2.1,-.8],[.6,2.4,-.8],[2.2,2.4,-.8],[2.2,2.4,-2.3]],.24,M.steel,hx);
 const sep=part(m,'Bộ tách nước và xả tự động',[0,0,0],inn,'Bình tách nước ngưng dưới khối trao đổi nhiệt, van xả điện từ hẹn giờ.',{minhHoa:true});
 revolve([[0,0],[0,.35],[1.4,.35],[1.6,.15],[1.6,0]],[-1.0,H-7.1,-1.2],M.steel,sep,'y',{segments:32});pipe([[-1.0,H-7.1,-1.2],[-1.0,b+.6,-1.2],[.6,b+.6,-1.2],[.6,b+.6,-2.4]],.05,M.steel,sep);autoDrain(m,sep,[1.3,b+.6,-2.4]);pipe([[1.6,b+.6,-2.4],[1.8,b+.6,-2.4],[1.8,b+.6,z0-.1]],.05,M.steel,sep);
 const ref=part(m,'Ống môi chất, phin lọc, van tiết lưu, van nhánh nóng',[0,0,0],inn,'Ống đồng nối máy nén – dàn ngưng – phin lọc – van tiết lưu – bay hơi, van nhánh nóng giữ nhiệt độ bay hơi.',{minhHoa:true});
 pipe([[-1.2,b+2.9,1.4],[-1.2,b+3.4,1.4],[2.0,b+3.4,1.4],[2.0,b+3.4,0]],.05,M.copper,ref);pipe([[2.0,b+.8,0],[2.0,b+.8,1.8],[.3,b+.8,1.8],[.3,b+3.0,1.8],[.3,b+3.0,-.2]],.04,M.copper,ref);
 revolve([[0,0],[0,.12],[.7,.12],[.7,0]],[.3,b+1.4,1.8],M.copper,ref,'y',{segments:24,name:'Phin lọc'});
 const tx=new THREE.Group();tx.name='Van tiết lưu';tx.position.set(.3,b+2.6,1.8);ref.add(tx);cyl(.12,.24,[0,0,0],M.brass,tx,'y',16);cyl(.14,.06,[0,.2,0],M.brass,tx,'y',24);
 const hg=new THREE.Group();hg.name='Van nhánh nóng';hg.position.set(1.0,b+3.4,1.4);ref.add(hg);cyl(.1,.3,[0,.1,0],M.brass,hg,'y',16);cyl(.14,.12,[0,.3,0],M.brass,hg,'y',6);
 pipe([[-.9,b+2.3,1.4],[-.9,b+2.3,.3],[-.3,b+3.0,.3],[-.3,H-5.4,-.2]],.06,M.copper,ref);
 port(m,'Khí nén ẩm vào',[-1.2,H-1.0,z0-.3],[0,0,-1],{kind:'khi',size:.24});port(m,'Khí khô ra',[1.2,H-1.0,z0-.3],[0,0,-1],{kind:'khi',size:.24});
 port(m,'Xả nước ngưng',[1.8,b+.6,z0-.1],[0,0,-1],{kind:'nuoc',size:.05});port(m,'Cáp nguồn',[-1.8,b+.6,z0-.05],[0,0,-1],{kind:'dien',size:.06});
 for(const sx of [-1,1])for(const sz of [-1,1])port(m,`Chân tủ ${sx<0?'trái':'phải'} ${sz<0?'sau':'trước'}`,[sx*(W/2-.2),0,sz*(D/2-.2)],[0,-1,0],{kind:'co-khi',size:.08});
 // ống khí từ khối trao đổi nhiệt ra tấm sau
 pipe([[-1.2,H-1.0,-3.5],[-1.2,H-1.0,z0-.3]],.24,M.steel,inn);pipe([[1.2,H-1.0,-3.5],[1.2,H-1.0,z0-.3]],.24,M.steel,inn);
 return m;
}

// Máy sấy hấp phụ hai tháp: hai tháp hạt hút ẩm, cụm van vào và van xả tái sinh có giảm âm ở dưới, van một chiều và đường tái sinh ở trên,
// đồng hồ từng tháp, bộ điều khiển, khung đế. Cấu tạo bên trong (hạt, lưới phân phối) là minh họa.
function desiccant(){
 const m=modelBase('desiccant'),R=1.05,t=.04,y0=2.6,y1=10.2,dx=1.7,hd=R/2;m.info.summary=`Hai tháp Ø ${fmt(2*R)} cao ${fmt(y1-y0)} · van vào/xả dưới, van một chiều trên · mẫu tổng quát`;
 const fr=part(m,'Khung đế',[0,0,0],m.root,'Khung thép đỡ hai tháp và cụm van, chân có lỗ neo.');
 solid(m,mesh(csgGeometry([boxG([2*dx+2.6,.3,2.4],[0,.15,0])],[boxG([2*dx+2.2,.2,2.8],[0,.15,0]),boxG([2*dx+3,.2,2.0],[0,.15,0])],'des-frame'),M.frame,[0,0,0],fr,'Khung chữ nhật'));
 for(const x of [-dx,dx])for(const deg of [0,120,240]){const a=deg*Math.PI/180+Math.PI/6;box([.18,y0+.4,.18],[x+Math.cos(a)*(R*.75),(y0+.4)/2,Math.sin(a)*(R*.75)],M.frame,fr,'Chân tháp');}
 const towers=[];
 for(const [i,x] of [[0,-dx],[1,dx]]){
  const lab=i?'B':'A',tw=part(m,`Tháp ${lab}`,[x,0,0],m.root,`Tháp ${lab}: vỏ áp lực hai đáy elip, lưới phân phối trên dưới, cửa nạp hạt trên và xả hạt dưới, đồng hồ áp suất.`);towers.push(tw);
  const N={bot:{a:[0,y0-hd+.2,0],b:[0,y0-hd-.5,0],ro:.22,ri:.17},top:{a:[0,y1+hd-.2,0],b:[0,y1+hd+.45,0],ro:.22,ri:.17},fill:{a:[-i*.0+(i?-.55:.55),y1+.3,0],b:[i?-.55:.55,headY(R,y1,.55)+.2,0],ro:.12,ri:.08},
   empty:{a:[0,y0+.4,R-.2],b:[0,y0+.4,R+.25],ro:.1,ri:.07},gauge:{a:[0,y1-.6,R-.2],b:[0,y1-.6,R+.3],ro:.06,ri:.04}};
  solid(m,mesh(pressureShell({R,t,y0,y1,nozzles:N,key:'des-tower'+i}),M.vessel,[0,0,0],tw,'Vỏ tháp'));
  const intl=part(m,`Hạt hút ẩm và lưới tháp ${lab} (minh họa)`,[0,0,0],tw,'Hạt nhôm hoạt tính và lưới phân phối hai đầu. Cấu tạo minh họa.',{minhHoa:true});
  const beads=[];for(let k=0;k<900;k++){const a=k*2.39996,r=(R-.1)*Math.sqrt(((k*47)%899)/899);beads.push({p:[Math.cos(a)*r,y0+.3+((k*31)%899)/899*(y1-y0-.6),Math.sin(a)*r]});}
  instances(new THREE.SphereGeometry(.055,6,5),M.white,beads,intl,'Hạt hút ẩm');for(const y of [y0+.15,y1-.15])cyl(R-t-.02,.03,[0,y,0],M.mesh,intl,'y',48);
  cyl(.14,.12,[N.fill.b[0],N.fill.b[1]+.06,0],M.steel,tw,'y',6);cyl(.12,.1,[0,y0+.4,R+.3],M.steel,tw,'z',6);
  const gg=new THREE.Group();gg.position.set(0,y1-.6,R+.3);tw.add(gg);const gd=gauge([0,.38,0],gg,.26);
  for(const y of [y0,y1])cover(m,torus(R+.003,.018,[0,y,0],M.steel,tw));
 }
 // cụm van dưới: ống góp vào, hai van vào, hai van xả tái sinh dẫn tới bộ giảm âm
 const yb=y0-hd-.5,vb=part(m,'Cụm van vào và van xả tái sinh',[0,0,0],m.root,'Ống góp khí ẩm vào với hai van điều khiển dẫn vào đáy hai tháp; hai van xả tái sinh dẫn khí tái sinh qua bộ giảm âm. Kiểu van là minh họa.',{minhHoa:true});
 for(const x of [-dx,dx]){pipe([[x,yb,0],[x,yb-.35,0],[x*.45,yb-.35,0]],.17,M.steel,vb);pipe([[x,yb-.35,0],[x,yb-.35,.8],[x,yb-.9,.8]],.12,M.steel,vb);}
 pipe([[-dx*.45,yb-.35,0],[dx*.45,yb-.35,0]],.17,M.steel,vb);pipe([[0,yb-.35,0],[0,yb-.35,-1.6]],.17,M.steel,vb);
 for(const x of [-dx*.65,dx*.65]){const v=new THREE.Group();v.name='Van vào';v.position.set(x,yb-.35,0);vb.add(v);cyl(.26,.42,[0,0,0],M.housing,v,'x',6);cyl(.2,.3,[0,.32,0],M.dark,v,'y',24);const c=solenoidCoil(v,{w:.2,h:.22,d:.18});c.position.y=.48;}
 for(const x of [-dx,dx]){const ms=new THREE.Group();ms.name='Bộ giảm âm';ms.position.set(x,yb-1.4,.8);vb.add(ms);cyl(.3,.9,[0,0,0],M.mesh,ms,'y',32);cyl(.32,.06,[0,.45,0],M.steel,ms,'y',32);cyl(.32,.06,[0,-.45,0],M.steel,ms,'y',32);
  const v=new THREE.Group();v.name='Van xả tái sinh';v.position.set(x,yb-.35,.8);vb.add(v);cyl(.2,.3,[0,0,0],M.housing,v,'y',6);const c=solenoidCoil(v,{w:.18,h:.2,d:.16});c.position.set(.3,0,0);}
 // cụm trên: van một chiều, ống ra, đường tái sinh có van chỉnh và đồng hồ
 const yt=y1+hd+.45,vt=part(m,'Van một chiều, ống ra và đường tái sinh',[0,0,0],m.root,'Hai van một chiều dẫn khí khô ra ống chung; nhánh tái sinh có van chỉnh lưu lượng, lỗ tiết lưu và đồng hồ. Cấu tạo minh họa.',{minhHoa:true});
 for(const x of [-dx,dx]){pipe([[x,yt,0],[x,yt+.35,0],[x*.45,yt+.35,0]],.17,M.steel,vt);const cv=new THREE.Group();cv.position.set(x*.68,yt+.35,0);vt.add(cv);cyl(.24,.42,[0,0,0],M.brass,cv,'x',32);}
 pipe([[-dx*.45,yt+.35,0],[dx*.45,yt+.35,0]],.17,M.steel,vt);pipe([[0,yt+.35,0],[0,yt+.35,-1.6]],.17,M.steel,vt);
 pipe([[-dx,yt+.15,0],[-dx,yt+.15,.6],[dx,yt+.15,.6],[dx,yt+.15,0]],.06,M.steel,vt);ballValve(vt,[0,yt+.15,.6],[1,0,0],.05,'Van chỉnh tái sinh');gauge([.6,yt+.55,.6],vt,.2);
 const ctl=part(m,'Bộ điều khiển',[0,4.6,R*.4],m.root,'Hộp điều khiển chu kỳ hấp phụ – tái sinh, màn hình và đèn báo.');roundedBox([1.4,1.8,.5],[0,0,0],M.white,ctl,.06);box([.8,.5,.01],[0,.35,.26],M.blue,ctl,'Màn hình');for(const [x,c] of [[-.3,M.green],[0,M.red],[.3,M.blue]])cyl(.06,.03,[x,-.3,.26],c,ctl,'z',16);
 rod([0,-.9,0],[0,-4.3,0],.06,M.frame,ctl);
 port(m,'Khí ẩm vào',[0,yb-.35,-1.6],[0,0,-1],{kind:'khi',size:.17});port(m,'Khí khô ra',[0,yt+.35,-1.6],[0,0,-1],{kind:'khi',size:.17});
 for(const x of [-dx,dx])port(m,`Xả tái sinh tháp ${x<0?'A':'B'}`,[x,yb-1.85,.8],[0,-1,0],{kind:'khi',size:.3});
 for(const sx of [-1,1])for(const sz of [-1,1])port(m,`Chân khung ${sx<0?'trái':'phải'} ${sz<0?'sau':'trước'}`,[sx*(dx+1.2),0,sz*1.1],[0,-1,0],{kind:'co-khi',size:.08});
 return m;
}

// ================= Trạm hoàn chỉnh: ghép các cụm (tỷ lệ trạm: 1 đơn vị ≈ 100 mm, ước lượng) =================
// Bố trí trong gói máy theo H1: đầu nén bên trái phía sau, động cơ nối liền qua chuông nối, lọc khí trên động cơ, bình tách
// phía trước đầu nén, lọc nước treo dưới két ở góc trái, tủ điện phía trước bên phải, két nóc hai quạt trên khung.
// Tuyến khí và vòng nước theo H4, H5, H6, H7. Ngoài gói: cụm nước bù – làm mềm (H7) bên trái; bên phải là chuỗi khí nén
// bình tích áp → máy sấy lạnh → máy sấy hấp phụ (mẫu tổng quát, không có bản vẽ). Không thêm bơm hay thiết bị bản vẽ không có.
const ST={xA:-4.5,zA:-2.6,mount:.45,rail:.4,riser:.4,sepScale:1.45};
const v3=a=>a.isVector3?a.clone():new THREE.Vector3(...a);
const clean=v=>v.set(...v.toArray().map(x=>Math.abs(x)<1e-9?0:+x.toFixed(9)));
// Cổng của cụm con, đổi sang hệ tọa độ trạm (gốc trạm không xoay, không dời).
function portOf(sub,name){
 const p=sub.ports.find(q=>q.userData.port.name===name)??sub.ports.find(q=>q.userData.port.name.startsWith(name));
 if(!p)throw new Error(`Cụm ${sub.id} không có cổng “${name}”`);
 p.updateWorldMatrix(true,false);
 return {pos:clean(p.getWorldPosition(new THREE.Vector3())),dir:clean(new THREE.Vector3(0,0,1).applyQuaternion(p.getWorldQuaternion(new THREE.Quaternion())).normalize()),
  size:p.userData.port.size*sub.root.scale.x,kind:p.userData.port.kind,label:`${sub.root.name} · ${p.userData.port.name}`};
}
// Đặt cụm con vào trạm. Cụm con giữ nguyên chi tiết, nhãn minh họa và chuyển động; phần tách cụm riêng của cụm con không dùng.
function place(st,sub,{pos=[0,0,0],rot=[0,0,0],scale=1,name,desc,lift}={}){
 const r=sub.root;r.position.set(...pos);r.rotation.set(...rot.map(d=>d*Math.PI/180));r.scale.setScalar(scale);
 r.name=name??sub.meta.name;r.userData.part=true;r.userData.module=sub.id;r.userData.description=desc??`Cụm ${sub.meta.tag} – ${sub.meta.name}: ${sub.meta.note}`;
 st.root.add(r);st.root.updateMatrixWorld(true);st.parts.push(r,...sub.parts);st.motions.push(...sub.motions);if(lift)explode(st,r,lift);
 st.info.modules.push({id:sub.id,name:r.name,scale});return sub;
}
// Dời cụm con để cổng của nó trùng điểm đích.
function mateTo(st,sub,name,target){const p=portOf(sub,name);sub.root.position.add(v3(target.pos??target).sub(p.pos));st.root.updateMatrixWorld(true);}
function link(st,a,b,via){st.info.links.push({from:a.label,to:b.label,via,gap:+a.pos.distanceTo(b.pos).toFixed(4)});}
const axisOf=d=>Math.abs(d.x)>.99?'x':Math.abs(d.y)>.99?'y':'z';
function cylAlong(r,h,pos,dir,mat,parent,seg=24,name=''){const o=mesh(new THREE.CylinderGeometry(r,r,h,seg),mat,v3(pos).toArray(),parent,name);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v3(dir).normalize());return o;}
// Đầu nối ống ở cổng: mặt bích cổ hàn có gioăng ('bich'), rắc co lục giác ('ren') hoặc đuôi chuột có đai siết ('mem').
function fitting(grp,p,r,end,fr){
 const d=p.dir;
 if(end==='bich'){const R=fr??Math.max(r*2.1,.14);cylAlong(R*.92,.012,p.pos.clone().addScaledVector(d,.006),d,M.seal,grp,32,'Gioăng mặt bích');weldFlange(grp,{r:R,ri:r*.92,bolts:R>.3?8:4},p.pos.clone().addScaledVector(d,.024).toArray(),d.clone().negate().toArray(),'Mặt bích đối');}
 else if(end==='ren'){cylAlong(r*1.75,r*1.5,p.pos.clone().addScaledVector(d,r*.75),d,M.brass,grp,6,'Rắc co');cylAlong(r*1.3,r*1.1,p.pos.clone().addScaledVector(d,r*2),d,M.brass,grp,16);}
 else if(end==='mem'){cylAlong(r*1.25,r*3,p.pos.clone().addScaledVector(d,r*1.5),d,M.brass,grp,16,'Đuôi nối ống mềm');const c=mesh(new THREE.TorusGeometry(r*1.35,r*.22,6,24),M.steel,p.pos.clone().addScaledVector(d,r*2.2).toArray(),grp,'Đai siết');c.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d);}
}
const dedupe=pts=>pts.filter((p,i)=>i===0||p.distanceTo(pts[i-1])>1e-4);
// Ống cứng gấp khúc giữa hai cổng; mids là các điểm góc (tọa độ trạm).
function run(st,grp,a,b,mids,{r,mat=M.steel,lead,end='bich',endB,fr,frB,bend,via}={}){
 const la=lead??Math.max(.25,r*2.6),pts=dedupe([a.pos.clone().addScaledVector(a.dir,.03),a.pos.clone().addScaledVector(a.dir,la),...mids.map(v3),b.pos.clone().addScaledVector(b.dir,la),b.pos.clone().addScaledVector(b.dir,.03)]);
 pipe(pts.map(p=>p.toArray()),r,mat,grp,bend);fitting(grp,a,r,end,fr);fitting(grp,b,r,endB??end,frB??fr);link(st,a,b,via??grp.name);return pts;
}
// Ống mềm, ống nhỏ hoặc cáp đi cong trơn qua các điểm.
function curve(grp,pts,r,mat,name=''){const c=new THREE.CatmullRomCurve3(dedupe(pts.map(v3)),false,'centripetal');return mesh(new THREE.TubeGeometry(c,Math.max(40,pts.length*24),r,10,false),mat,[0,0,0],grp,name);}
function hose(st,grp,a,b,mids,{r,mat=M.rubber,lead=.2,end='ren',via}={}){
 curve(grp,[a.pos,a.pos.clone().addScaledVector(a.dir,lead*.5),a.pos.clone().addScaledVector(a.dir,lead),...mids,b.pos.clone().addScaledVector(b.dir,lead),b.pos.clone().addScaledVector(b.dir,lead*.5),b.pos],r,mat);
 fitting(grp,a,r,end);fitting(grp,b,r,end);link(st,a,b,via??grp.name);
}
// Cáp điện có đầu cáp xiết kín ở thiết bị.
function cableRun(grp,a,pts,r=.03,{gland=true}={}){if(gland)cylAlong(r*1.8,r*2.6,a.pos.clone().addScaledVector(a.dir,r*1.3),a.dir,M.brass,grp,6,'Đầu cáp');curve(grp,[a.pos,a.pos.clone().addScaledVector(a.dir,r*4),...pts],r,M.cable,'Cáp');}
// Cổ dề ôm ống trên cột đỡ đứng từ mặt sàn hoặc khay (yBase).
function pipeStand(grp,pos,r,yBase,axis='x'){
 const [x,y,z]=v3(pos).toArray(),h=y-r-.06-yBase;
 box([.36,.03,.36],[x,yBase+.015,z],M.steel,grp,'Đế cột đỡ');for(const dx of [-.12,.12])for(const dz of [-.12,.12])bolt([x+dx,yBase+.03,z+dz],grp,.025,'y',.06);
 box([.12,h,.12],[x,yBase+.03+h/2,z],M.frame,grp,'Cột đỡ ống');box(axis==='x'?[.2,.04,r*2+.16]:[r*2+.16,.04,.2],[x,y-r-.04,z],M.steel,grp,'Đế yên ống');
 const u=mesh(new THREE.TorusGeometry(r+.02,.014,6,24,Math.PI),M.bright,[x,y-r*.0,z],grp,'Cổ dề chữ U');u.rotation.set(0,axis==='x'?Math.PI/2:0,0);
}
// Giá chống rung: đế thép, cao su, chén trên, bu lông cấy và đai ốc (cao ST.mount).
function avMount(grp,x,y,z){
 const g=new THREE.Group();g.name='Giá chống rung';g.position.set(x,y,z);grp.add(g);
 box([.52,.04,.34],[0,.02,0],M.steel,g);for(const dx of [-.19,.19])bolt([dx,.04,0],g,.03,'y',.06);
 revolve([[.04,0],[.04,.16],[.08,.17],[.27,.17],[.31,.13],[.31,0]],[0,0,0],M.rubber,g,'y',{segments:32,name:'Đệm cao su'});
 revolve([[.31,0],[.31,.2],[.35,.2],[.35,0]],[0,0,0],M.steel,g,'y',{segments:32,name:'Chén trên'});cyl(.03,.12,[0,.4,0],M.bright,g,'y',12);cyl(.055,.04,[0,.38,0],M.steel,g,'y',6);
 return g;
}
// Thép chữ C nằm dọc trục ax ('x' hoặc 'z'), bụng thẳng đứng; y0 là mặt dưới.
function channel(grp,ax,c0,c1,cross,y0,h,w,name){
 const L=c1-c0,mid=(c0+c1)/2,P=(along,y,acr)=>ax==='x'?[along,y,acr]:[acr,y,along],S=(l,hh,ww)=>ax==='x'?[l,hh,ww]:[ww,hh,l];
 const g=new THREE.Group();g.name=name;grp.add(g);
 box(S(L,h,.035),P(mid,y0+h/2,cross),M.paint,g);for(const yy of [y0+.0175,y0+h-.0175])box(S(L,.035,w),P(mid,yy,cross+w/2-.0175),M.paint,g);
 return g;
}

function station(params={}){
 const st=modelBase('station'),{X,Z,base,top}=PKG,{xA,zA}=ST,closed=params.enclosure==='dong',ext=params.external!=='khong',airflow=params.airflow==='xuong'?'xuong':'len';
 st.info.modules=[];st.info.links=[];
 const yRail=base+ST.mount,yTop=yRail+ST.rail,yA=yTop+ST.riser+1.5;
 const grp=(name,desc,opts)=>part(st,name,[0,0,0],st.root,desc,opts);

 // ---- Đầu nén và động cơ ----
 const ae=place(st,assemble('airend'),{pos:[xA,yA,zA],name:'Đầu nén (cụm 02)'});
 const mo=place(st,assemble('motor',{guard:false,cable:false}),{pos:[0,yA,zA],rot:[0,180,0],name:'Động cơ (cụm 03)',desc:'Động cơ chân đế + mặt bích, quay 180° để mặt bích ghép vào chuông nối của đầu nén; khớp nối nằm trong chuông nối nên không lắp nắp che riêng.'});
 mateTo(st,mo,'Mặt bích nối chuông đầu nén',portOf(ae,'Mặt bích nối động cơ'));
 link(st,portOf(ae,'Mặt bích nối động cơ'),portOf(mo,'Mặt bích nối chuông đầu nén'),'ghép trực tiếp');
 // trục động cơ quay cùng tốc độ trục vít (động cơ quay 180° nên đổi dấu)
 const shaftM=mo.motions.find(a=>a.object.name==='Trục động cơ');if(shaftM)shaftM.ratio=-SCREW_SPEED;
 const iv=place(st,assemble('inlet'),{pos:portOf(ae,'Cửa hút khí').pos.toArray(),rot:[0,90,0],name:'Van hút khí (cụm 10)'});
 link(st,portOf(ae,'Cửa hút khí'),portOf(iv,'Mặt bích lắp lên cửa hút'),'ghép trực tiếp');
 const ck=place(st,assemble('check'),{pos:portOf(ae,'Cửa xả khí–nước').pos.toArray(),name:'Van một chiều (cụm 12)'});
 link(st,portOf(ae,'Cửa xả khí–nước'),portOf(ck,'Vào từ cửa xả'),'ghép trực tiếp');

 // ---- Giá máy: hai thanh thép C trên sáu giá chống rung, đế nâng động cơ, ghế đỡ đầu nén (H4: support seat) ----
 const skid=grp('Giá máy chống rung','Hai thanh thép chữ C dọc đặt trên sáu giá chống rung cao su; thanh ngang đỡ ghế đỡ đầu nén; bốn khối đệm nâng chân động cơ. Kết cấu giá và loại giá chống rung là minh họa (H1 không có chi tiết).',{minhHoa:true});
 const feet=['Lỗ chân đế sau phải','Lỗ chân đế sau trái','Lỗ chân đế trước phải','Lỗ chân đế trước trái'].map(n=>portOf(mo,n).pos),aeFoot=portOf(ae,'Chân đỡ trước').pos;
 const zR=[zA-.95,zA+.95],x0=aeFoot.x-.55,x1=Math.max(...feet.map(f=>f.x))+.55;
 for(const z of zR){channel(skid,'x',x0,x1,z-.15,yRail,ST.rail,.3,'Thanh dọc giá máy');for(const x of [x0+.3,(x0+x1)/2,x1-.3])avMount(skid,x,base,z);}
 for(const x of [x0+.12,x1-.12])channel(skid,'z',zR[0],zR[1],x-.11,yRail,ST.rail-.04,.22,'Thanh ngang giá máy');
 channel(skid,'z',zR[0],zR[1],aeFoot.x-.11,yRail,ST.rail-.04,.22,'Thanh ngang đỡ ghế');
 for(const f of feet){const fz=f.z<zA?zA-.846:zA+.846;box([.66,ST.riser,.72],[f.x,yTop+ST.riser/2,fz],M.frame,skid,'Khối đệm chân động cơ');for(const dz of [-.25,.25])bolt([f.x+.22,yTop+ST.riser,fz+dz],skid,.035,'y',.08);}
 const seat=part(st,'Ghế đỡ đầu nén',[aeFoot.x,yTop,aeFoot.z],skid,'Ghế đỡ dưới chân trước đầu nén (H4, H6: support seat): bu lông cấy ren, hai đai ốc chỉnh cao và đĩa tì, giữ đầu nén cân bằng khi chạy.');
 {const hS=aeFoot.y-yTop;box([.5,.04,.5],[0,.02,0],M.steel,seat);mesh(threadGeometry({r:.05,depth:.01,pitch:.03,length:hS-.1,axis:'y'}),M.bright,[0,.04+(hS-.1)/2,0],seat,'Bu lông cấy');
  for(const y of [.12,hS-.16])cyl(.09,.06,[0,y,0],M.steel,seat,'y',6);revolve([[hS-.08,0],[hS-.08,.17],[hS,.17],[hS,0]],[0,0,0],M.steel,seat,'y',{segments:32,name:'Đĩa tì'});}

 // ---- Bình tách và van áp suất tối thiểu ----
 const sep=place(st,assemble('separator'),{pos:[0,base,2.6],scale:ST.sepScale,name:'Bình tách khí–nước (cụm 04)',desc:'Bình tách trong gói máy, phóng to 1,45 lần so với cụm 04 để gần tỷ lệ H1 (bình cao quá nửa khung); mặt bích đỉnh khớp mặt bích van áp suất tối thiểu. Đặt trên khay đáy, phía trước đầu nén.'});
 const ckOut=portOf(ck,'Ra ống chính');sep.root.position.x+=ckOut.pos.x+.85-portOf(sep,'Vào hỗn hợp').pos.x;st.root.updateMatrixWorld(true);
 const sepIn=portOf(sep,'Vào hỗn hợp'),sepOut=portOf(sep,'Khí ra');
 const mp=place(st,assemble('minimum'),{pos:sepOut.pos.toArray(),name:'Van áp suất tối thiểu (cụm 11)'});
 link(st,sepOut,portOf(mp,'Vào từ bình tách'),'ghép trực tiếp');
 const mpOut=portOf(mp,'Khí ra'),outlet=[X,mpOut.pos.y,-4.6];

 // ---- Khung, tủ điện, két nóc ----
 const ch=place(st,assemble('chassis',{enclosure:closed?'dong':'mo',outlet}),{name:'Khung, bệ, tủ điện (cụm 15)'});st.explodables.push(...ch.explodables);
 const co=place(st,assemble('cooler',{airflow}),{pos:portOf(ch,'Mặt lắp két nóc').pos.toArray(),name:'Két nóc hai quạt (cụm 05)',lift:[0,4.5,0]});
 // hạt gió và chiều gió lấy từ két; tóm tắt của trạm cập nhật khi đảo chiều
 st.flow={object:co.flow.object,get direction(){return co.flow.direction;},update:t=>co.flow.update(t),setDirection(d){co.flow.setDirection(d);st.info.summary=summary(co.flow.direction);}};

 // ---- Tuyến khí: ống chính (H4/H6), lọc khí và ống mềm hút, ống khí ra ----
 const trunk=grp('Ống chính','Ống chính từ van một chiều xuống, đi ngang dưới giá máy rồi lên cửa vào bình tách; đoạn chữ U giúp giảm ứng suất giãn nở nhiệt (H4: main trunk). Có mặt bích giữa đoạn đứng như H4.');
 const yLow=base+.22;
 run(st,trunk,ckOut,sepIn,[[ckOut.pos.x,yLow,ckOut.pos.z],[ckOut.pos.x,yLow,sepIn.pos.z],[ckOut.pos.x,sepIn.pos.y,sepIn.pos.z]],{r:.16,lead:.12,fr:.36,frB:.43,via:'Ống chính'});
 {const ym=(yLow+sepIn.pos.y)/2,p={pos:new THREE.Vector3(ckOut.pos.x,ym,sepIn.pos.z),dir:new THREE.Vector3(0,1,0)};fitting(trunk,p,.16,'bich',.33);fitting(trunk,{pos:p.pos,dir:new THREE.Vector3(0,-1,0)},.16,'bich',.33);
  box([.5,yLow-.16-base,.36],[ckOut.pos.x,(yLow-.16+base)/2,(ckOut.pos.z+sepIn.pos.z)/2+1.2],M.frame,trunk,'Gối đỡ ống chính');}
 const af=place(st,assemble('air-filter'),{rot:[0,180,0],name:'Lọc khí đầu hút (cụm 06)'});
 const ivIn=portOf(iv,'Gió sạch vào');mateTo(st,af,'Gió sạch ra',[ivIn.pos.x+1.25,ivIn.pos.y+1.35,ivIn.pos.z]);
 const afOut=portOf(af,'Gió sạch ra');
 const hp=grp('Ống mềm hút khí','Ống gân cao su nối cổ ra lọc khí với miệng van hút; hai đầu có măng sông và đai siết (H1, H4: air filtering hose).');
 {const pts=[ivIn.pos.clone().addScaledVector(ivIn.dir,.12),[ivIn.pos.x,afOut.pos.y,ivIn.pos.z],afOut.pos.clone().addScaledVector(afOut.dir,.14)].map(v3);
  mesh(hoseGeometry(pts.map(p=>p.toArray()),.31,{pitch:.11,depth:.07,bend:.75}),M.rubber,[0,0,0],hp,'Ống gân');
  for(const p of [ivIn,afOut]){cylAlong(.345,.26,p.pos.clone().addScaledVector(p.dir,.13),p.dir,M.rubber,hp,40,'Măng sông');for(const k of [.06,.2]){const c=mesh(new THREE.TorusGeometry(.36,.018,6,40),M.bright,p.pos.clone().addScaledVector(p.dir,k).toArray(),hp,'Đai siết');c.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),p.dir);}}
  link(st,ivIn,afOut,'Ống mềm hút khí');}
 {const afb=part(st,'Giá đỡ lọc khí',[0,0,0],st.root,'Dầm ngang bắt vào cột giữa sau và hai tay đỡ dưới đế lọc khí. Kết cấu giá là minh họa.',{minhHoa:true});
  const yb=afOut.pos.y-1.58-.06,xs=[afOut.pos.x+1.98-.6,afOut.pos.x+1.98+.6],zb=-Z+PKG.post+.08;
  box([Math.abs(xs[1]-xs[0])+.4,.12,.12],[(xs[0]+xs[1])/2,yb,zb],M.frame,afb,'Dầm ngang');box([.3,.5,.06],[0,yb,zb-.05],M.steel,afb,'Bản mã bắt cột');
  for(const x of xs){box([.12,.12,Math.abs(zA-.4-zb)],[x,yb,(zA-.4+zb)/2],M.frame,afb,'Tay đỡ');box([.12,.12,.9],[x,yb,zA],M.frame,afb,'Tay đỡ');}
  for(const x of xs)for(const z of [zA-.2,zA+.2])bolt([x,yb+.06,z],afb,.03,'y',.06);}
 const airOut=grp('Ống khí ra','Ống khí nén từ van áp suất tối thiểu (H1: air-out pipe) đi trên động cơ ra lỗ xuyên vách hông phải phía sau tủ điện; có cột đỡ và mặt bích xuyên vách.');
 const pkgOut={pos:new THREE.Vector3(...outlet).add(new THREE.Vector3(.06,0,0)),dir:new THREE.Vector3(1,0,0),label:'Trạm · lỗ ống khí ra',kind:'khi'};
 run(st,airOut,mpOut,{...pkgOut,dir:new THREE.Vector3(-1,0,0),pos:pkgOut.pos},[[2.8,mpOut.pos.y,mpOut.pos.z],[2.8,mpOut.pos.y,outlet[2]]],{r:.13,end:'bich',endB:'none',fr:.28,via:'Ống khí ra'});
 pipeStand(airOut,[2.8,mpOut.pos.y,outlet[2]+.5],.13,base,'z');
 {const g=new THREE.Group();g.name='Bích xuyên vách';g.position.set(outlet[0]+.05,outlet[1],outlet[2]);airOut.add(g);revolve([[-.04,.13],[-.04,.36],[.04,.36],[.04,.13]],[0,0,0],M.steel,g,'x',{segments:40});boltCircle(g,'x',.04,.28,6,.03);}
 // nhánh khí điều khiển cho van điện từ nạp tải (H7: load solenoid valve)
 {const ctl=grp('Ống khí điều khiển','Ống nhỏ lấy khí sau van áp suất tối thiểu tới van điện từ nạp tải trên van hút (H7). Điểm trích là giả định.',{minhHoa:true});
  const tee=mpOut.pos.clone().add(new THREE.Vector3(.45,0,0));cylAlong(.17,.14,tee.clone().add(new THREE.Vector3(0,-.15,0)),[0,1,0],M.brass,ctl,6,'Đầu trích');
  const c=portOf(iv,'Khí điều khiển');curve(ctl,[tee.clone().add(new THREE.Vector3(0,-.2,0)),tee.clone().add(new THREE.Vector3(0,-.6,0)),[tee.x,c.pos.y+2.1,c.pos.z+2.4],[c.pos.x+.7,c.pos.y+.9,c.pos.z+.9],c.pos.clone().addScaledVector(c.dir,.3),c.pos],.025,M.copper);
  fitting(ctl,c,.025,'ren');link(st,mpOut,c,'Ống khí điều khiển');}

 // ---- Vòng nước: bình tách → két → lọc nước → van ngắt nước → bộ chia → đầu nén (H5, H6) ----
 const wf=place(st,assemble('water-filter'),{name:'Lọc nước nhỏ (cụm 07)'});
 const cIn=portOf(co,'Nước nóng vào két'),cOut=portOf(co,'Nước đã làm mát ra');
 mateTo(st,wf,'Nước vào (từ két)',[cOut.pos.x+.8,9.4,cOut.pos.z]);
 const wfIn=portOf(wf,'Nước vào'),wfOut=portOf(wf,'Nước đã lọc ra');
 const wv=place(st,assemble('water-valve'),{rot:[0,0,-90],name:'Van ngắt nước (cụm 13)'});
 mateTo(st,wv,'Nước vào',[wfOut.pos.x+.65,wfOut.pos.y-.7,wfOut.pos.z]);
 const wvIn=portOf(wv,'Nước vào'),wvOut=portOf(wv,'Nước ra');
 const di=place(st,assemble('distributor'),{rot:[90,0,0],name:'Bộ chia nước (cụm 14)'});
 mateTo(st,di,'Nước vào',[xA-.8,yA+2.35,zA+.29]);
 const sw=portOf(sep,'Nước ra (tới két'),hot=grp('Ống nước nóng lên két','Ống từ cổ nước ra của bình tách lên cổ vào két (H5), đi dọc vách trái.');
 const yW=sw.pos.y+.45;
 run(st,hot,sw,cIn,[[sw.pos.x,yW,sw.pos.z],[cIn.pos.x,yW,sw.pos.z],[cIn.pos.x,yW,cIn.pos.z]],{r:.07,lead:.2,end:'ren',endB:'bich',frB:.28,via:'Ống nước nóng'});
 pipeStand(hot,[cIn.pos.x,yW,(sw.pos.z+cIn.pos.z)/2],.07,base,'z');
 const cold=grp('Ống nước mát tới lọc','Ống từ cổ ra của két xuống đầu lọc nước (H5).');
 run(st,cold,cOut,wfIn,[[cOut.pos.x,wfIn.pos.y,cOut.pos.z]],{r:.07,lead:.2,end:'bich',endB:'ren',fr:.28,via:'Ống nước mát'});
 const toValve=grp('Ống lọc – van ngắt','Đoạn ống ngắn từ đầu lọc xuống van ngắt nước điện từ (H6).');
 run(st,toValve,wfOut,wvIn,[[wvIn.pos.x,wfOut.pos.y,wfOut.pos.z]],{r:.055,lead:.18,end:'ren',via:'Ống lọc – van ngắt'});
 const diIn=portOf(di,'Nước vào'),dl=grp('Ống mềm tới bộ chia','Ống mềm từ van ngắt nước xuống bộ chia nước trên đầu nén (H6).');
 hose(st,dl,wvOut,diIn,[[wvOut.pos.x,wvOut.pos.y-.9,wvOut.pos.z-.4],[diIn.pos.x-.3,diIn.pos.y+1.0,diIn.pos.z+1.6]].map(v3),{r:.05,lead:.3,end:'ren',via:'Ống mềm tới bộ chia'});
 // bộ chia → bốn điểm trên đầu nén
 {const br=grp('Ống chia nước vào đầu nén','Bốn ống nhỏ từ bộ chia tới cửa phun nước và ba điểm bôi trơn ổ (H6: bộ chia chia đều nước tới các bộ phận của đầu nén). Điểm nối trên đầu nén là giả định.',{minhHoa:true});
  const outs=[1,2,3,4].map(i=>portOf(di,'Nhánh ra '+i)).sort((a,b)=>a.pos.x-b.pos.x);
  const tg=[portOf(ae,'Nước bôi trơn ổ đầu xả'),portOf(ae,'Nước bôi trơn ổ bánh sao B'),portOf(ae,'Cửa phun nước'),portOf(ae,'Nước bôi trơn ổ bánh sao A')];
  const via=[[[outs[0].pos.x-.25,outs[0].pos.y-.55,zA]],[[outs[1].pos.x+.1,outs[1].pos.y-.45,zA-.7],[tg[1].pos.x-.55,tg[1].pos.y+.5,tg[1].pos.z-.1]],[[outs[2].pos.x+.25,outs[2].pos.y-.4,zA+.35],[tg[2].pos.x+.45,tg[2].pos.y+.25,tg[2].pos.z+.2]],[[outs[3].pos.x+.3,outs[3].pos.y-.25,zA+.6],[tg[3].pos.x-.25,tg[3].pos.y+.55,tg[3].pos.z]]];
  outs.forEach((o,i)=>hose(st,br,o,tg[i],via[i].map(v3),{r:.022,mat:M.copper,lead:.12,end:'ren',via:'Ống chia nước'}));
  const bk=part(st,'Giá bắt bộ chia nước',[0,0,0],br,'Bản thép bắt trên vỏ đầu nén, đỡ bộ chia (minh họa).',{minhHoa:true});
  box([.06,diIn.pos.y-yA-1.0,.5],[diIn.pos.x,(diIn.pos.y+yA+1.0)/2-.12,zA-.38],M.frame,bk);box([.6,.04,.5],[diIn.pos.x,yA+1.0,zA-.38],M.frame,bk);}
 // giá treo lọc nước và van ngắt nước dưới dầm đỉnh trái
 {const hb=part(st,'Giá treo lọc nước',[0,0,0],st.root,'Tay treo bắt dưới dầm đỉnh trái, đỡ đầu lọc nước và van ngắt nước (vị trí theo H1, H9; kết cấu giá là minh họa).',{minhHoa:true});
  const yH=10.2,zH=wfIn.pos.z-.8,xE=wvIn.pos.x+.15,wfTop=wfIn.pos.y-.18+.64;
  box([xE-(-X+.15),.1,.12],[(-X+.15+xE)/2,yH,zH],M.frame,hb,'Tay treo');box([.12,top-PKG.post-yH+.05,.12],[-X+.2,(yH+top-PKG.post)/2,zH],M.frame,hb,'Thanh bắt dầm');
  for(const [x,y0] of [[wfIn.pos.x+.84,wfTop],[wvIn.pos.x,wvIn.pos.y-.4]]){box([.1,yH-y0,.08],[x,(yH+y0)/2,zH],M.frame,hb,'Thanh treo');box([.4,.06,.75],[x,y0,zH+.36],M.steel,hb,'Bản kẹp');}}

 // ---- Nước bù và xả (H7) ----
 const mk=portOf(sep,'Nước bù vào'),chIn=portOf(ch,'Nước bôi trơn vào – phía trong'),chOut=portOf(ch,'Nước bôi trơn ra – phía trong');
 const mkL=grp('Ống nước bù trong máy','Ống từ cổng nước bôi trơn vào ở hông bệ lên cửa nước bù của bình tách (H7). Đi trong bệ rồi xuyên khay đáy.');
 const xM=chIn.pos.x+.9;run(st,mkL,chIn,mk,[[xM,chIn.pos.y,chIn.pos.z],[xM,base+.3,chIn.pos.z],[mk.pos.x,base+.3,chIn.pos.z],[mk.pos.x,base+.3,mk.pos.z]],{r:.045,end:'ren',via:'Ống nước bù'});
 const dv=place(st,assemble('water-valve'),{rot:[0,180,0],name:'Van điện từ xả nước (H7)',desc:'Van điện từ xả nước (H7: drain solenoid valve), dùng lại hình cụm 13. Công tắc mức mở van khi nước trong bình tách vượt mức cao. Nối sau van xả tay; cách nối thật (song song hay nối tiếp) chưa xác nhận.'});
 const dp=portOf(sep,'Xả đáy');mateTo(st,dv,'Nước vào',[dp.pos.x-.9,dp.pos.y,PKG.Z-.85]);
 const dvIn=portOf(dv,'Nước vào'),dvOut=portOf(dv,'Nước ra');
 const drL=grp('Ống xả nước','Ống xả từ van xả đáy bình tách qua van điện từ xả nước ra cổng nước bôi trơn ra ở hông bệ (H7).');
 run(st,drL,dp,dvIn,[[dp.pos.x+.5,dp.pos.y,dp.pos.z+.5],[dp.pos.x+.5,dp.pos.y,dvIn.pos.z]],{r:.045,lead:.12,end:'ren',via:'Ống xả nước'});
 const xD=chOut.pos.x+.5;run(st,drL,dvOut,chOut,[[xD,dvOut.pos.y,dvOut.pos.z],[xD,dvOut.pos.y,chOut.pos.z],[xD,chOut.pos.y,chOut.pos.z]],{r:.045,end:'ren',via:'Ống xả nước'});
 cylAlong(.09,.06,[xM,base,chIn.pos.z],[0,1,0],M.rubber,mkL,24,'Vòng đệm xuyên khay');cylAlong(.09,.06,[xD,base,chOut.pos.z],[0,1,0],M.rubber,drL,24,'Vòng đệm xuyên khay');

 // ---- Bộ phun (H1: ejector) ----
 {const ej=part(st,'Bộ phun (射流器)',[1.4,base+.32,zA+2.0],st.root,'Bộ phun dạng ống venturi đặt trên khay đáy trước động cơ, đúng vị trí H1 ghi “Ejector”. H1 không cho thấy đường nối nên chỉ dựng thân, cửa hút bên và hai đầu nối bịt; cấu tạo minh họa.',{minhHoa:true});
  revolve([[-.5,0],[-.5,.07],[-.42,.07],[-.4,.11],[-.25,.11],[-.08,.05],[.02,.05],[.45,.1],[.47,.07],[.55,.07],[.55,0]],[0,0,0],M.brass,ej,'x',{segments:32});
  cyl(.06,.22,[-.05,.12,0],M.brass,ej,'y',16);cyl(.08,.06,[-.05,.24,0],M.brass,ej,'y',6);for(const x of [-.55,.58])cyl(.075,.07,[x,0,0],M.brass,ej,'x',6);
  box([.9,.03,.3],[0,-.3,0],M.steel,ej);for(const x of [-.3,.3]){box([.05,.22,.2],[x,-.18,0],M.steel,ej);}}

 // ---- Máng cáp và cáp điện ----
 const cab=grp('Máng cáp và cáp điện','Máng cáp treo dưới két dẫn cáp van điện từ, công tắc mức và van nước bù vào hông tủ điện; cáp động cơ đi trong bệ; cáp nguồn vào đáy tủ. Đường đi cáp là minh họa.',{minhHoa:true});
 const tY=top-1.2,tZ=1.0,tX0=-X+.9,tX1=4.0;
 {box([tX1-tX0,.025,.3],[(tX0+tX1)/2,tY-.06,tZ],M.tray,cab,'Đáy máng');for(const s of [-1,1])box([tX1-tX0,.12,.02],[(tX0+tX1)/2,tY,tZ+s*.15],M.tray,cab,'Thành máng');
  const holes=[];for(let x=tX0+.15;x<tX1-.1;x+=.3)holes.push({p:[x,tY-.046,tZ]});instances(new THREE.BoxGeometry(.12,.012,.2),M.dark,holes,cab,'Lỗ máng');
  for(const x of [tX0+.2,0])for(const s of [-1,1])cyl(.012,top-tY+.06,[x,(top+tY)/2,tZ+s*.17],M.bright,cab,'y',8);}
 const toTray=(p,x,pts=[])=>cableRun(cab,p,[...pts.map(v3),v3([x,tY+.3,tZ+.05]),v3([x+.3,tY-.02,tZ])],.022);
 toTray(portOf(iv,'Dây điện van nạp tải'),-3.4,[[-3.4,yA+1.9,zA-1.35],[-3.4,yA+4.45,zA-1.3],[-3.4,tY-.4,zA+1.6]]);
 {const p=portOf(wv,'Dây điện cuộn van');toTray(p,p.pos.x+.2,[[p.pos.x+.15,p.pos.y-.25,p.pos.z],[p.pos.x+.2,tY-.3,tZ+.8]]);}
 {const lv=sep.parts.find(q=>q.name==='Công tắc mức nước'),w=lv.localToWorld(new THREE.Vector3(.155,.14,0)),p={pos:clean(w),dir:new THREE.Vector3(1,0,0)};toTray(p,w.x+.6,[[w.x+.4,w.y+.3,w.z-.2],[w.x+.6,tY-.3,tZ+.4]]);}
 {const p=portOf(dv,'Dây điện cuộn van');cableRun(cab,p,[[p.pos.x,p.pos.y+.3,p.pos.z],[p.pos.x+.5,p.pos.y+.35,PKG.Z-.4],[tX1-.4,p.pos.y+.35,PKG.Z-.4],[tX1+.05,p.pos.y+.6,PKG.Z-.4]].map(v3),.022);}
 // cáp động cơ: từ đáy tủ xuống bệ, chạy trong bệ, xuyên khay lên hộp đấu điện
 {const em=portOf(ch,'Cáp động cơ ra'),g=portOf(mo,'Đầu cáp nguồn');
  for(const dx of [0,.3]){const a={pos:g.pos.clone().add(new THREE.Vector3(dx,0,0)),dir:g.dir};
   cableRun(cab,a,[[a.pos.x,a.pos.y-.1,zA-1.6],[a.pos.x,yA-.6,zA-1.75],[a.pos.x,base+.3,zA-1.85],[a.pos.x,base-.4,zA-1.9],[em.pos.x+dx*.5,base-.4,zA-1.9],[em.pos.x+dx*.5,base-.4,em.pos.z],em.pos.clone().add(new THREE.Vector3(dx*.5,0,0))].map(v3),.045,{gland:false});}
  cylAlong(.13,.06,[g.pos.x+.15,base,zA-1.85],[0,1,0],M.rubber,cab,24,'Vòng đệm xuyên khay');}
 {const f=portOf(co,'Cáp quạt về tủ điện');curve(cab,[f.pos,f.pos.clone().add(new THREE.Vector3(0,0,.12)),[f.pos.x-.1,f.pos.y-.05,f.pos.z+.2],[f.pos.x-.35,top-.4+.25,f.pos.z-.2],[f.pos.x-.4,top-.4,f.pos.z-.4]].map(v3),.035,M.cable,'Cáp quạt');cylAlong(.06,.08,[f.pos.x-.4,top-.4+.02,f.pos.z-.4],[0,1,0],M.brass,cab,6,'Đầu cáp');}
 {const pin=portOf(ch,'Cáp nguồn vào tủ');curve(cab,[pin.pos,[pin.pos.x,base-.5,pin.pos.z],[pin.pos.x,.35,pin.pos.z+1.2],[pin.pos.x,.35,Z-.1],[pin.pos.x,.12,Z+.8],[pin.pos.x,.12,Z+1.8]].map(v3),.06,M.cable,'Cáp nguồn chính');
  cylAlong(.1,.06,[pin.pos.x,.35,Z-.02],[0,0,1],M.rubber,cab,24,'Vòng đệm xuyên vách bệ');
  port(st,'Cáp nguồn vào tủ điện',[pin.pos.x,.12,Z+1.8],[0,0,1],{kind:'dien',size:.06,note:'Cáp nguồn chính tới tủ điện; chưa có thông số điện'});}

 // ---- Ngoài gói máy, bên trái: nước cấp → làm mềm (H7) → cổng nước bôi trơn vào; xả → phễu thu ----
 const so=place(st,assemble('softener'),{pos:[-X-3.7,0,portOf(ch,'Nước bôi trơn vào (xuyên').pos.z],name:'Cụm nước bù – làm mềm (cụm 09)',desc:'Đặt ngoài gói máy cạnh hông trái (bình làm mềm cao gần bằng khung, H1 không có trong gói). Cấp nước bù qua cổng nước bôi trơn vào ở hông bệ (H1, H7).'});
 const soOut=portOf(so,'Nước bù ra'),chInO=portOf(ch,'Nước bôi trơn vào (xuyên'),chOutO=portOf(ch,'Nước bôi trơn ra (xuyên');
 const sl=grp('Ống nước bù ngoài máy','Ống từ cụm làm mềm (sau van điện từ nước bù) tới cổng nước bôi trơn vào ở hông bệ (H7).');
 run(st,sl,soOut,chInO,[[soOut.pos.x+.7,soOut.pos.y,soOut.pos.z],[soOut.pos.x+.7,chInO.pos.y,chInO.pos.z]],{r:.045,end:'ren',via:'Ống nước bù ngoài'});
 const sIn=portOf(so,'Nước cấp vào'),sup=grp('Đường nước cấp','Nước cấp từ mạng (H7: áp lực ≥ 0,2 MPa) có van chặn và đồng hồ áp lực, đi từ sàn lên cụm làm mềm. Van và đồng hồ là phụ kiện đường ống thông thường; vị trí minh họa.',{minhHoa:true});
 {const xs=sIn.pos.x-.8;pipe([[sIn.pos.x-.03,sIn.pos.y,sIn.pos.z],[xs,sIn.pos.y,sIn.pos.z],[xs,.15,sIn.pos.z]],.045,M.steel,sup);fitting(sup,sIn,.045,'ren');
  ballValve(sup,[xs,1.1,sIn.pos.z],[0,1,0],.05,'Van chặn nước cấp');const gg=gauge([xs-.02,1.75,sIn.pos.z+.2],sup,.14);gg.rotation.y=0;
  revolve([[0,.045],[0,.15],[.04,.15],[.04,.045]],[xs,.06,sIn.pos.z],M.steel,sup,'y',{segments:24,name:'Bích chân'});
  port(st,'Nước cấp vào trạm (≥ 0,2 MPa)',[xs,.06,sIn.pos.z],[0,-1,0],{kind:'nuoc',size:.045});link(st,{label:'Trạm · nước cấp',pos:new THREE.Vector3(xs,.06,sIn.pos.z)},sIn,'Đường nước cấp');}
 const fun=part(st,'Phễu thu nước xả bên trái',[X*-1-1.3,0,2.3],st.root,'Phễu thu có lưới trên sàn nhận nước xả từ cổng nước bôi trơn ra và nước rửa ngược của bình làm mềm. Minh họa.',{minhHoa:true});
 revolve([[0,0],[0,.28],[.25,.32],[.25,.26],[.05,.18],[.05,0]],[0,0,0],M.steel,fun,'y',{segments:40});box([.5,.02,.5],[0,.005,0],M.steel,fun);
 {const fp=new THREE.Vector3(-X-1.3,.32,2.3),dl2=grp('Ống xả ra phễu','Ống mềm từ cổng nước bôi trơn ra và ống rửa ngược làm mềm xuống phễu thu (minh họa).',{minhHoa:true});
  curve(dl2,[chOutO.pos,chOutO.pos.clone().add(new THREE.Vector3(-.3,0,0)),[fp.x+.2,.55,fp.z+.6],[fp.x+.05,.6,fp.z+.1],[fp.x+.05,.25,fp.z+.05]].map(v3),.045,M.rubber,'Ống xả');fitting(dl2,chOutO,.045,'mem');
  const bw=portOf(so,'Xả rửa ngược');curve(dl2,[bw.pos,bw.pos.clone().add(new THREE.Vector3(0,-.15,0)),[bw.pos.x+.6,.12,fp.z+.3],[fp.x-.15,.45,fp.z-.05],[fp.x-.05,.25,fp.z]].map(v3),.035,M.rubber,'Ống rửa ngược');fitting(dl2,bw,.035,'mem');
  link(st,chOutO,{label:'Phễu thu bên trái',pos:fp},'Ống xả ra phễu');link(st,bw,{label:'Phễu thu bên trái',pos:fp},'Ống xả ra phễu');
  port(st,'Thoát nước sàn bên trái',[fp.x,0,fp.z],[0,-1,0],{kind:'nuoc',size:.05});}
 {const p=portOf(so,'Dây điện van nước bù');cableRun(cab,p,[[p.pos.x+.4,p.pos.y+.3,p.pos.z],[-X-.4,tY+.2,tZ+1.2],[tX0,tY,tZ]].map(v3),.022);}

 // ---- Ngoài gói máy, bên phải: bình tích áp → máy sấy lạnh → máy sấy hấp phụ (mẫu tổng quát) ----
 let finalOut=null;
 if(ext){
  const rc=place(st,assemble('receiver'),{pos:[0,0,outlet[2]],name:'Bình tích áp (cụm 16)'});
  mateTo(st,rc,'Khí nén vào',[X+1.85,0,outlet[2]]);rc.root.position.y=0;st.root.updateMatrixWorld(true);
  const rIn=portOf(rc,'Khí nén vào'),rOut=portOf(rc,'Khí nén ra');
  const p1=grp('Ống khí ra – bình tích áp','Ống khí nén từ lỗ ra của gói máy xuống cửa vào bình tích áp, có van bi chặn sau mặt bích xuyên vách.');
  const pk={pos:pkgOut.pos.clone().add(new THREE.Vector3(.02,0,0)),dir:new THREE.Vector3(1,0,0),label:'Trạm · lỗ ống khí ra'};
  run(st,p1,pk,rIn,[[rIn.pos.x-.85,pk.pos.y,pk.pos.z],[rIn.pos.x-.85,rIn.pos.y,rIn.pos.z]],{r:.13,lead:.2,end:'none',endB:'bich',frB:.5,via:'Ống tới bình tích áp'});
  ballValve(p1,[pk.pos.x+.38,pk.pos.y,pk.pos.z],[1,0,0],.11,'Van bi chặn khí ra');
  const dr=place(st,assemble('dryer'),{rot:[0,90,0],name:'Máy sấy lạnh (cụm 17)'});
  mateTo(st,dr,'Khí nén ẩm vào',[rOut.pos.x+1.6,7.6,rOut.pos.z]);dr.root.position.y=0;st.root.updateMatrixWorld(true);
  const dIn=portOf(dr,'Khí nén ẩm vào'),dOut=portOf(dr,'Khí khô ra');
  const p2=grp('Ống bình tích áp – máy sấy lạnh','Ống từ cửa ra trên của bình tích áp tới cửa vào máy sấy lạnh.');
  run(st,p2,rOut,dIn,[[(rOut.pos.x+dIn.pos.x)/2,rOut.pos.y,rOut.pos.z],[(rOut.pos.x+dIn.pos.x)/2,dIn.pos.y,dIn.pos.z]],{r:.13,end:'bich',fr:.5,frB:.38,via:'Ống tới máy sấy lạnh'});
  const ds=place(st,assemble('desiccant'),{name:'Máy sấy hấp phụ hai tháp (cụm 18)'});
  mateTo(st,ds,'Khí ẩm vào',[dIn.pos.x+3.4,1.25,dOut.pos.z+5.7]);ds.root.position.y=0;st.root.updateMatrixWorld(true);
  const sIn2=portOf(ds,'Khí ẩm vào'),sOut2=portOf(ds,'Khí khô ra');
  const p3=grp('Ống máy sấy lạnh – máy sấy hấp phụ','Ống từ cửa ra máy sấy lạnh đi xuống thấp, vòng trước máy sấy lạnh tới cửa vào dưới của máy sấy hấp phụ.');
  const xV=dOut.pos.x-.55,zF=sIn2.pos.z-.8;
  run(st,p3,dOut,sIn2,[[xV,dOut.pos.y,dOut.pos.z],[xV,sIn2.pos.y,dOut.pos.z],[xV,sIn2.pos.y,zF],[sIn2.pos.x,sIn2.pos.y,zF]],{r:.12,end:'bich',fr:.38,frB:.36,via:'Ống tới máy sấy hấp phụ'});
  pipeStand(p3,[xV,sIn2.pos.y,(dOut.pos.z+zF)/2],.12,0,'z');
  const p4=grp('Ống khí khô ra mạng','Ống khí khô từ cửa ra trên của máy sấy hấp phụ, qua van bi chặn, tới mạng khí nén nhà máy.');
  const endX=Math.max(dIn.pos.x+7.6,sOut2.pos.x+3.5),endP=new THREE.Vector3(endX,sOut2.pos.y,sOut2.pos.z-.7);
  pipe([sOut2.pos.clone().addScaledVector(sOut2.dir,.03),sOut2.pos.clone().addScaledVector(sOut2.dir,.7),endP].map(p=>p.toArray()),.12,M.steel,p4);fitting(p4,sOut2,.12,'bich',.36);
  ballValve(p4,[endX-.6,endP.y,endP.z],[1,0,0],.1,'Van bi khí ra mạng');weldFlange(p4,{r:.3,ri:.11,bolts:6},endP.toArray(),[1,0,0],'Mặt bích ra mạng');
  pipeStand(p4,[endX-1.4,endP.y,endP.z],.12,0,'x');
  finalOut={pos:endP,dir:new THREE.Vector3(1,0,0)};link(st,sOut2,{label:'Trạm · khí khô ra mạng',pos:endP},'Ống khí khô ra mạng');
  // nước ngưng của bình tích áp và máy sấy lạnh xuống phễu thu
  const dn=grp('Ống xả nước ngưng','Ống mềm từ van xả tự động của bình tích áp và cửa xả nước ngưng máy sấy lạnh xuống phễu thu trên sàn (minh họa).',{minhHoa:true});
  for(const [sub,name,fp] of [[rc,'Xả nước ngưng',[rIn.pos.x+5.3,0,rIn.pos.z+3.0]],[dr,'Xả nước ngưng',[dIn.pos.x-.9,0,dOut.pos.z-1.2]]]){
   const a=portOf(sub,name),f=v3(fp);const fn=part(st,'Phễu thu nước ngưng',fp,dn,'Phễu thu có lưới (minh họa).',{minhHoa:true});revolve([[0,0],[0,.24],[.2,.28],[.2,.22],[.04,.15],[.04,0]],[0,0,0],M.steel,fn,'y',{segments:32});
   curve(dn,[a.pos,a.pos.clone().addScaledVector(a.dir,.25),[(a.pos.x+f.x)/2,.2,(a.pos.z+f.z)/2],[f.x,.5,f.z],[f.x,.22,f.z]].map(v3),.03,M.rubber,'Ống xả');fitting(dn,a,.03,'mem');link(st,a,{label:'Phễu thu nước ngưng',pos:f},'Ống xả nước ngưng');}
 }else finalOut={pos:pkgOut.pos,dir:new THREE.Vector3(1,0,0)};
 port(st,ext?'Khí nén khô ra mạng':'Khí nén ra (từ gói máy)',finalOut.pos.toArray(),finalOut.dir.toArray(),{kind:'khi',size:.13});

 // ---- Bu lông neo chân thiết bị, tấm bịt máng cáp, đầu cáp vào tủ ----
 {const an=part(st,'Bu lông neo',[0,0,0],st.root,'Bu lông neo, vòng đệm và đai ốc ở chân bệ máy, chân bình và chân thiết bị ngoài. Cỡ bu lông là minh họa.',{minhHoa:true});
  const subs=st.root.children.filter(o=>['chassis','separator','receiver','dryer','desiccant'].includes(o.userData.module));
  for(const r of subs)r.traverse(o=>{const pd=o.userData.port;if(!pd||!/^(Đế chân|Chân bệ|Chân tủ|Chân khung)/.test(pd.name))return;
   const w=clean(o.getWorldPosition(new THREE.Vector3())),y=w.y+(r.userData.module==='chassis'?.07:r.userData.module==='separator'?.05:.03);
   cyl(.075,.015,[w.x,y+.0075,w.z],M.steel,an,'y',20);cyl(.06,.06,[w.x,y+.045,w.z],M.steel,an,'y',6);cyl(.028,.16,[w.x,y+.08,w.z],M.bright,an,'y',12);});
  const tb=part(st,'Đầu máng và đầu cáp vào tủ',[0,0,0],cab,'Tấm bịt đầu máng cáp bắt vào hông tủ điện và đầu cáp xiết kín nơi cáp xuyên vỏ tủ (minh họa).',{minhHoa:true});
  box([.04,.32,.5],[tX1-.02,tY,tZ],M.tray,tb,'Tấm bịt đầu máng');cylAlong(.06,.08,[tX1-.04,portOf(dv,'Dây điện cuộn van').pos.y+.6,PKG.Z-.4],[1,0,0],M.brass,tb,6,'Đầu cáp');}
 // ---- Nền trạm ----
 {const b=new THREE.Box3();for(const c of st.root.children)if(c.userData.module)b.expandByObject(c);
  const fl=part(st,'Nền trạm (minh họa)',[0,0,0],st.root,'Sàn bê tông đặt trạm; chỉ để định vị, không phải thiết kế móng.',{minhHoa:true});
  box([b.max.x-b.min.x+2.4,.3,b.max.z-b.min.z+2.4],[(b.min.x+b.max.x)/2,-.15,(b.min.z+b.max.z)/2],M.concrete,fl,'Sàn');}

 const nIll=st.parts.filter(p=>p.userData.minhHoa).length;
 function summary(dir){return `Gói máy ${fmt(2*X)} × ${fmt(2*Z)} · ${closed?'có vỏ bao che':'khung hở'} · tâm trục đầu nén cao ${fmt(yA)} · ${airflowText(dir).toLowerCase()} · ${ext?'bình tích áp → sấy lạnh → sấy hấp phụ':'chưa ghép thiết bị ngoài'} · ${st.info.links.length} mối nối · ${nIll} nhóm minh họa`;}
 st.info.summary=summary(airflow);
 // Mặt cắt của trạm: cắt bỏ góc phần tư trên – trước của gói máy (từ tâm trục đầu nén) bằng mặt phẳng cắt, không cắt thiết bị ngoài.
 st.section={min:[-X-.7,yA,zA],max:[X+.7,Infinity,Infinity],clip:true};
 return st;
}

const BUILDERS={rotor,airend,motor,separator,cooler,'air-filter':airFilter,'water-filter':waterFilter,'combined-filter':combinedFilter,softener,inlet:inletValve,minimum:minimumValve,check:checkValve,'water-valve':waterValve,distributor,chassis,receiver,dryer,desiccant,station};
// Dựng một cụm (chưa khởi tạo chuyển động); dùng lại khi ghép trạm.
function assemble(id,params={}){
 const meta=CATALOG.find(p=>p.id===id);if(!meta)throw new Error('Không có mô hình '+id);
 const model=BUILDERS[id](params);model.meta=meta;
 if(meta.params)model.info.defaults={...PARAM_DEFAULTS[meta.params]};
 return model;
}
export function buildModel(id,params={}){
 resetGeometryCache();
 const model=assemble(id,params);
 model.root.updateMatrixWorld(true);
 for(const motion of model.motions){motion.initial=motion.object.rotation[motion.axis];motion.origin=motion.object.position[motion.axis];}
 return model;
}
export function setExplosion(model,value){for(const e of model.explodables)e.object.position.copy(e.base).addScaledVector(e.offset,value);model.root.updateMatrixWorld(true);}
export function updateMotion(model,t){for(const a of model.motions){if(a.update){a.update(t);continue;}if(a.translate)a.object.position[a.axis]=a.origin+(Math.sin(t)+1)*.5*a.ratio;else a.object.rotation[a.axis]=a.initial+(a.oscillate?Math.sin(t)*a.ratio:t*a.ratio);}model.flow?.update(t);}
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
 // Vật liệu dùng chung có thể còn mặt phẳng cắt của trạm dựng trước: gỡ ra.
 for(const m of Object.values(M))if(m.clippingPlanes?.length){m.clippingPlanes=[];m.needsUpdate=true;}
 // Trạm (section.clip): cắt mọi vật liệu bằng mặt phẳng, không dùng CSG để đổi chế độ nhanh với hàng nghìn chi tiết.
 if(model.section?.clip){const mats=new Set();model.root.traverse(o=>{if(o.isMesh&&!o.parent?.userData.portMarker)for(const m of [o.material].flat())mats.add(m);});
  for(const m of mats){m.clippingPlanes=on?planes:[];m.clipIntersection=true;m.clipShadows=true;m.needsUpdate=true;}
  model.sectionOn=on;return planes;}
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
