import { THREE,M,modelBase,part,explode,cover,mesh,box,roundedBox,cyl,ball,rod,ring,torus,tube,bolt,boltCircle,thread,pipe,dome,gauge,flange,screwGeometry,gateGeometry,pleats,instances,fan,fanGuard } from './geometry.js';

export const REFERENCES={H1:'Tổng thể máy',H2:'Mặt cắt đầu nén',H3:'Trục vít và hai bánh sao',H4:'Tuyến khí / đầu nén',H5:'Két gió và vòng nước',H6:'Van / bộ chia; sơ đồ giải nhiệt nước',H7:'Nước bù / cảm biến / van',H8:'Tháo lọc khí',H9:'Tháo lọc nước nhỏ',H10:'Lọc nước tổ hợp'};
export const CATALOG=[
 {id:'rotor',name:'Trục vít · hai bánh sao',group:'Đầu nén',refs:['H3','H2'],tag:'01',note:'1 trục vít; 2 bánh sao. Biên dạng 6 rãnh / 11 răng là tham số minh họa, chưa phải biên dạng bao chế tạo.',detail:'Rãnh xoắn là BufferGeometry gồm hàng chục nghìn đỉnh. Hai bánh sao quay quanh trục vuông góc với trục vít. Khe hở và hình học ăn khớp được giản lược.'},
 {id:'airend',name:'Đầu nén cắt mở',group:'Đầu nén',refs:['H2','H3','H4'],tag:'02',note:'Vỏ, nắp, gối đỡ và cơ cấu bên trong tách thành từng đối tượng.',detail:'Bật Mặt cắt để mở vỏ. Kéo Tách cụm để dịch nắp và các cụm bánh sao. Cổng nước và cổng hút có hình học riêng.'},
 {id:'motor',name:'Động cơ · khớp nối',group:'Truyền động',refs:['H1','H4'],tag:'03',note:'Gân tản nhiệt, vỏ quạt, hộp cực, chân đỡ và khớp nối có tên riêng.',detail:'Tỷ lệ động cơ ước lượng từ ảnh tổng thể. Các chi tiết nhỏ là minh họa cơ khí.'},
 {id:'separator',name:'Bình tách khí–nước',group:'Nước & bình',refs:['H1','H4','H7'],tag:'04',note:'Có vỏ, vách hướng dòng, nước, kính quan sát, cảm biến và cụm van đỉnh.',detail:'Đây là bình tách bên trong máy, phân biệt với bình tích áp bên ngoài. Vách trong là giả định trực quan vì bản vẽ không có mặt cắt bình.'},
 {id:'cooler',name:'Két nóc · hai quạt',group:'Giải nhiệt',refs:['H1','H5'],tag:'05',note:'Hai quạt ở dưới két. Hạt gió minh họa hướng từ dưới lên.',detail:'Giữ bố trí quạt theo H1/H5. Chiều gió là giả định cần xác nhận từ tài liệu máy. Lõi này minh họa két nước, không tự gán thêm lõi khí.'},
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

function shaftCore(m,parent=m.root){
 const g=part(m,'Trục vít chính',[0,0,0],parent,'Một trục vít chính; biên dạng xoắn trực quan.');
 mesh(screwGeometry(),M.bright,[0,0,0],g);
 for(const x of [-1.4,1.4]){cyl(.84,.055,[x,0,0],M.steel,g,'x');cyl(.56,.17,[x*1.045,0,0],M.steel,g,'x');}
 cyl(.245,4.75,[0,0,0],M.bright,g,'x');thread(.245,.5,[2.18,0,0],g,'x');
 box([.5,.035,.1],[-2.1,.246,0],M.dark,g,'Rãnh then minh họa');
 m.motions.push({object:g,axis:'x',ratio:.45});
 for(let i=0;i<2;i++){
   const gate=part(m,`Bánh sao ${i?'B':'A'}`,[i?.35:-.35,0,i?-1.65:1.65],parent,'Bánh sao có trục vuông góc trục vít. Số răng mặc định 11.');
   mesh(gateGeometry(),M.gate,[0,0,0],gate);cyl(.22,.29,[0,.055,0],M.steel,gate);cyl(.12,.9,[0,0,0],M.bright,gate);
   for(const y of [-.27,.27])ring(.19,.125,.05,[0,y,0],M.steel,gate);
   m.motions.push({object:gate,axis:'y',ratio:(i?1:-1)*.45*6/11});explode(m,gate,[0,0,i?-1.2:1.2]);
 }
 return g;
}
function rotor(){const m=modelBase('rotor');shaftCore(m);return m;}

function airend(){
 const m=modelBase('airend');shaftCore(m);
 const base=part(m,'Bệ và chân đầu nén',[0,-1.16,0]);box([3.45,.2,4.7],[0,0,0],M.casting,base);
 for(const x of [-1.25,1.25])for(const z of [-2.05,2.05]){box([.58,.17,.55],[x,-.14,z],M.casting,base);bolt([x,.11,z],base,.1);}
 const body=part(m,'Vỏ đúc đầu nén');
 cover(m,tube(1.10,.21,3.05,[0,0,0],M.casting,body,'x'));
 cover(m,roundedBox([3.05,.18,2.0],[0,1.03,0],M.casting,body,.07));
 for(const z of [-1.65,1.65]){
   const x=z>0?-.35:.35;
   cover(m,tube(1.03,.09,1.45,[x,0,z],M.casting,body));
   cover(m,cyl(1.03,.12,[x,.77,z],M.casting,body));
   cover(m,roundedBox([1.65,1.85,.14],[x,0,z+Math.sign(z)*.63],M.casting,body,.06));
   for(const dx of [-.65,.65])for(const y of [-.65,.65])bolt([x+dx,y,z+Math.sign(z)*.73],body,.05,'z');
 }
 for(const x of [-1.56,1.56]){
   const cap=part(m,x<0?'Nắp đầu sau':'Mặt bích truyền động',[x,0,0]);
   ring(1.11,.275,.17,[0,0,0],M.casting,cap,'x');ring(.9,.28,.11,[x<0?-.12:.12,0,0],M.steel,cap,'x');
   boltCircle(cap,'x',x<0?-.12:.12,.97,12,.07);explode(m,cap,[x<0?-.7:.7,0,0]);
 }
 for(const z of [-1.65,1.65])for(const y of [-.65,.68]){
   const g=part(m,`Gối bánh sao ${z>0?'A':'B'} ${y>0?'trên':'dưới'}`,[z>0?-.35:.35,y,z]);
   ring(.43,.15,.17,[0,0,0],M.casting,g);ring(.25,.125,.2,[0,.04,0],M.steel,g);boltCircle(g,'y',.13,.34,6,.05);
 }
 const water=part(m,'Mặt bích cấp nước',[-.9,1.24,.6]);box([.72,.15,.72],[0,0,0],M.casting,water);tube(.24,.055,.27,[0,.18,0],M.casting,water);for(const x of [-.27,.27])for(const z of [-.27,.27])bolt([x,.1,z],water,.055);
 const intake=part(m,'Cổng hút khí',[.8,1.24,-.7]);ring(.43,.27,.15,[0,0,0],M.casting,intake);tube(.32,.055,.35,[0,.2,0],M.casting,intake);boltCircle(intake,'y',.1,.36,8,.045);
 const front=part(m,'Nắp bảo trì phía trước',[-.35,0,2.48]);cover(m,roundedBox([1.58,1.65,.12],[0,0,0],M.casting,front,.05));
 for(const x of [-.64,.64])for(const y of [-.65,.65])bolt([x,y,.085],front,.06,'z');explode(m,front,[0,0,1]);
 return m;
}

function motor(){
 const m=modelBase('motor');const body=part(m,'Thân động cơ');cyl(.65,2.2,[0,0,0],M.paint,body,'x');
 const fins=[];for(let i=0;i<32;i++){const a=i/32*Math.PI*2;fins.push({p:[0,Math.cos(a)*.69,Math.sin(a)*.69],r:[a,0,0]});}
 instances(new THREE.BoxGeometry(1.94,.13,.025),M.paint,fins,body,'32 gân tản nhiệt');
 for(const x of [-1.04,1.04]){cyl(.73,.14,[x,0,0],M.casting,body,'x');boltCircle(body,'x',x+Math.sign(x)*.09,.59,8,.06);}
 const back=part(m,'Nắp quạt động cơ',[-1.3,0,0]);cover(m,tube(.7,.035,.42,[0,0,0],M.dark,back,'x'));ring(.7,.15,.03,[-.22,0,0],M.dark,back,'x');
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2;rod([-.24,.14*Math.cos(a),.14*Math.sin(a)],[-.24,.67*Math.cos(a),.67*Math.sin(a)],.012,M.steel,back);}
 explode(m,back,[-.65,0,0]);
 const terminal=part(m,'Hộp cực',[.05,.86,0]);cover(m,box([.78,.36,.67],[0,0,0],M.paint,terminal));box([.84,.065,.73],[0,.21,0],M.dark,terminal);for(const x of [-.31,.31])for(const z of [-.27,.27])bolt([x,.26,z],terminal,.035);
 cyl(.095,.19,[.47,0,0],M.black,terminal,'x');
 for(const x of [-.7,.7])for(const z of [-.5,.5]){box([.44,.2,.28],[x,-.75,z],M.paint,body);bolt([x,-.63,z],body,.07);}
 const coupling=part(m,'Khớp nối',[1.75,0,0]);cyl(.2,1.2,[0,0,0],M.bright,coupling,'x');
 for(const x of [-.18,.18]){cyl(.43,.2,[x,0,0],M.steel,coupling,'x');boltCircle(coupling,'x',x+.11,.31,6,.045);}
 cyl(.37,.16,[0,0,0],M.rubber,coupling,'x');explode(m,coupling,[.7,0,0]);
 const guard=part(m,'Nắp che khớp nối',[1.73,0,0]);cover(m,tube(.51,.035,1,[0,0,0],M.paint,guard,'x'));explode(m,guard,[0,.8,.4]);return m;
}

function vesselBase(m,name,{r=.83,h=2.45}={}){
 const shell=part(m,name);cover(m,tube(r,.055,h,[0,h/2+.55,0],M.steel,shell));
 cover(m,dome(r,.33,[0,h+.55,0],M.steel,shell));cover(m,dome(r,.33,[0,.55,0],M.steel,shell,true));
 for(const a of [0,2*Math.PI/3,4*Math.PI/3]){const x=Math.cos(a)*r*.8,z=Math.sin(a)*r*.8;box([.2,.5,.2],[x,.22,z],M.dark,shell);box([.44,.07,.36],[x,-.035,z],M.steel,shell);bolt([x,.02,z],shell,.065);}
 torus(r,.016,[0,.6,0],M.dark,shell);torus(r,.016,[0,h+.5,0],M.dark,shell);return shell;
}
function separator(){
 const m=modelBase('separator');vesselBase(m,'Vỏ bình tách');
 const internals=part(m,'Vách tách và nước');cyl(.765,.48,[0,.85,0],M.water,internals);box([1.22,.045,.8],[0,1.7,-.1],M.dark,internals);
 pipe([[-1.3,1.8,0],[-.6,1.8,0],[-.6,1.6,-.3]],.16,M.steel,internals);flange([-1.3,1.8,0],internals,'x',.25);
 const head=part(m,'Cụm van đỉnh',[0,3.25,0]);ring(.32,.17,.09,[0,0,0],M.steel,head);boltCircle(head,'y',.06,.26,6,.038);
 cyl(.19,.5,[0,.28,0],M.brass,head);pipe([[0,.3,0],[.65,.3,0]],.11,M.steel,head);flange([.65,.3,0],head,'x',.2);
 gauge([.35,.53,.17],head,.18);cyl(.06,.28,[-.25,.28,0],M.brass,head);cyl(.095,.07,[-.25,.44,0],M.red,head);explode(m,head,[0,.75,0]);
 const sight=part(m,'Kính mức và cảm biến',[.56,.7,.73]);tube(.055,.009,1.45,[0,.73,0],M.glass,sight);cyl(.032,.7,[0,.38,0],M.water,sight);
 for(const y of [0,1.45]){cyl(.09,.13,[0,y,0],M.brass,sight);rod([0,y,0],[-.14,y,-.18],.04,M.steel,sight);}
 box([.10,1.6,.045],[.15,.73,0],M.white,sight);for(let i=0;i<12;i++)box([.08,.008,.005],[.15,.06+i*.12,.026],M.dark,sight);
 pipe([[.4,.5,0],[1.05,.5,0],[1.05,.2,.25]],.075,M.blue,m.root);return m;
}

function cooler(){
 const m=modelBase('cooler');const frame=part(m,'Khung két nóc');
 for(const x of [-2.8,2.8])box([.13,.58,3.65],[x,.08,0],M.steel,frame);
 for(const z of [-1.77,1.77])box([5.7,.58,.13],[0,.08,z],M.steel,frame);
 const core=part(m,'Lõi két và lá tản nhiệt');const fins=[];
 for(let i=0;i<145;i++)fins.push({p:[-2.65+i*5.3/144,.1,0]});
 instances(new THREE.BoxGeometry(.013,.40,3.22),M.casting,fins,core,'145 lá tản nhiệt');
 for(const y of [-.03,.22])for(let j=0;j<12;j++)rod([-2.7,y,-1.47+j*.267],[2.7,y,-1.47+j*.267],.033,M.bright,core);
 for(const x of [-2.72,2.72])rod([x,.1,-1.65],[x,.1,1.65],.10,M.steel,core);
 for(const x of [-2.8,2.8]){pipe([[x,.1,-1.1],[x+.33*Math.sign(x),.1,-1.1]],.095,M.blue,frame);flange([x+.33*Math.sign(x),.1,-1.1],frame,'x',.18);}
 const top=part(m,'Lưới và tấm che phía trên',[0,.43,0]);
 for(const x of [-2.85,2.85])box([.08,.06,3.7],[x,0,0],M.dark,top);for(const z of [-1.82,1.82])box([5.7,.06,.08],[0,0,z],M.dark,top);
 const bars=[];for(let i=0;i<36;i++)bars.push({p:[-2.7+i*5.4/35,0,0]});cover(m,instances(new THREE.BoxGeometry(.018,.018,3.48),M.dark,bars,top,'Lưới bảo vệ'));explode(m,top,[0,.8,0]);
 for(const x of [-1.36,1.36]){
   const assembly=part(m,`Cụm quạt ${x<0?'A':'B'}`,[x,-.65,0]);
   cover(m,tube(1.25,.045,.52,[0,0,0],M.paint,assembly));fan(m,[0,-.10,0],1.16,assembly,`Rotor quạt ${x<0?'A':'B'}`);
   cyl(.23,.4,[0,-.38,0],M.dark,assembly);fanGuard([0,-.29,0],1.2,assembly);
   for(const z of [-1.1,1.1])rod([-.75,-.52,z],[.75,-.52,z],.035,M.steel,assembly);
   explode(m,assembly,[0,-.75,0]);
 }
 const flow=part(m,'Hạt gió minh họa');flow.userData.noExport=true;
 const positions=new Float32Array(80*3),colors=new Float32Array(80*3);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const points=new THREE.Points(geo,new THREE.PointsMaterial({size:.06,vertexColors:true,transparent:true,opacity:.75,depthWrite:false}));flow.add(points);
 m.flow={object:flow,update:t=>{for(let i=0;i<80;i++){const y=((t*.8+i/80*2.7)%2.7)-1.5;positions[i*3]=-2.4+((i*31)%79)/79*4.8;positions[i*3+1]=y;positions[i*3+2]=-1.35+((i*17)%79)/79*2.7;const c=y>.15?[.95,.55,.3]:[.25,.7,.9];colors.set(c,i*3);}geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;}};
 m.flow.update(0);return m;
}

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

export function buildModel(id){
 const builders={rotor,airend,motor,separator,cooler,'air-filter':airFilter,'water-filter':waterFilter,'combined-filter':combinedFilter,softener,chassis,receiver,dryer,desiccant};
 const model=builders[id]?builders[id]():valve(id);
 model.meta=CATALOG.find(p=>p.id===id);if(!model.meta)throw new Error('Không có mô hình '+id);
 model.root.updateMatrixWorld(true);
 for(const motion of model.motions){motion.initial=motion.object.rotation[motion.axis];motion.origin=motion.object.position[motion.axis];}
 return model;
}
export function setExplosion(model,value){for(const e of model.explodables)e.object.position.copy(e.base).addScaledVector(e.offset,value);model.root.updateMatrixWorld(true);}
export function updateMotion(model,t){for(const a of model.motions){if(a.translate)a.object.position[a.axis]=a.origin+(Math.sin(t)+1)*.5*a.ratio;else a.object.rotation[a.axis]=a.initial+(a.oscillate?Math.sin(t)*a.ratio:t*a.ratio);}model.flow?.update(t);}
