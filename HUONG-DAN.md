# Mã Three.js dựng chi tiết máy nén trục vít đơn phun nước

Thư viện mô hình 3D các cụm của máy nén khí trục vít đơn (một trục vít, hai bánh sao), không dầu trong buồng nén, dùng nước để bôi trơn, làm kín và giải nhiệt; giải nhiệt nước bằng két gió có quạt. Mọi chi tiết là hình học 3D thật: xoay, phóng to, cắt vỏ, tách cụm, chạy cơ cấu, chỉnh tham số và xuất GLB.

Bản 2.0 nâng cấp chi tiết bốn cụm: `rotor`, `airend`, `motor`, `separator`; thêm cổng nối cho cả 18 cụm, chiều gió đảo được ở `cooler`, nhãn “minh họa” cho kết cấu không có bản vẽ. ID của 18 cụm giữ nguyên.

## 1. Mở nhanh

1. Giải nén toàn bộ gói vào một thư mục (hoặc tải repo về).
2. Nhấp đúp **MO-NGAY.html**, mở bằng Chrome hoặc Edge trên máy tính có WebGL 2.
3. Chọn một cụm ở cột trái, ví dụ **02 — Đầu nén cắt mở**.

MO-NGAY.html (khoảng 8 MB) chứa sẵn Three.js, thư viện CSG, mã mô hình, giao diện và mười ảnh tham chiếu; không tải gì từ mạng, không cần API key. Sau khi sửa mã nguồn, chạy lại lệnh dựng ở phần 9 để cập nhật tệp này.

## 2. Chạy bản nguồn để sửa mã

Cần Python 3, không cần cài thêm gói.

- Windows: nhấp đúp **CHAY-WINDOWS.bat**.
- macOS/Linux: mở Terminal trong thư mục, chạy `python3 run.py`.

Chương trình mở `http://127.0.0.1:8000` (hoặc cổng trống tiếp theo đến 8010). Mở **index.html** qua địa chỉ này để dùng giao diện đầy đủ, **vi-du-toi-gian.html** để xem ví dụ gọi thư viện bằng ít dòng mã. Mở index.html trực tiếp bằng `file://` có thể bị trình duyệt chặn mô-đun.

## 3. Cách thao tác

| Thao tác | Kết quả |
| --- | --- |
| Kéo chuột trái / cuộn / kéo chuột phải | Xoay / thu phóng / dịch khung nhìn |
| Bấm tên hoặc bấm vào chi tiết | Làm nổi bật, xem mô tả; nhóm có nhãn **MINH HỌA** là kết cấu không có bản vẽ |
| Biểu tượng mắt trong danh sách | Ẩn/hiện nhóm chi tiết (nhóm con thụt lề dưới nhóm cha) |
| Lắp hoàn chỉnh | Trả cụm về vị trí lắp |
| Mặt cắt vỏ | Cắt thật vỏ đúc, nắp, thân bình bằng CSG; mặt cắt tô màu cam. Vỏ mỏng còn lại dùng mặt phẳng cắt |
| Tách cụm / thanh Tách cụm | Dịch chi tiết theo hướng tháo lắp |
| Chạy cơ cấu | Quay trục vít và hai bánh sao đúng tỷ số, quay động cơ, quạt; chạy van |
| Cổng nối | Hiện dấu các cổng khí (xanh dương), nước (xanh ngọc), cơ khí (cam), điện (tím) |
| Thông số có thể chỉnh | Ở cụm 01, 02 (trục vít) và 05 (chiều gió); đổi số sẽ dựng lại hình học |
| Đảo chiều gió | Đổi chiều hạt gió và chiều quay quạt ở cụm 05 |
| Bản vẽ gốc | Xem ảnh tham chiếu ứng với cụm |
| Xuất mô hình GLB | Tải GLB của cụm lắp hoàn chỉnh với tham số đang dùng, kèm các nút “Cổng: …” |
| Chụp ảnh góc nhìn | Tải PNG góc nhìn hiện tại |

## 4. Danh sách 18 cụm và ID

| ID | Cụm | Chi tiết đáng chú ý |
| --- | --- | --- |
| `rotor` | Một trục vít, hai bánh sao | Rãnh sinh theo động học từ răng bánh sao; bậc trục, vai trục, ngõng phớt/ổ, rãnh then hở đầu và then, ren xoắn thật và đai ốc khóa, vòng giữ chữ C; đĩa răng (chân răng bo, đỉnh cung tròn, mép vát), giá đỡ, moay-ơ, vòng kẹp, trục đỡ |
| `airend` | Đầu nén | Vỏ đúc rỗng dựng bằng CSG: khoang trục vít, hai khoang bánh sao, khoang hút, bậc lắp ổ/phớt, cửa hút trên, cửa xả dưới, gân; nắp hông có gioăng, nắp ổ bánh sao, nắp đầu xả có gân và chân đỡ, nắp ổ gân, chuông nối động cơ có cửa sổ; ổ lăn, phớt, vòi phun nước |
| `motor` | Động cơ và khớp nối | Thân gang 28 gân, nắp đầu mặt bích, nắp đầu sau có gân, 4 chân đế có lỗ neo, hộp đấu điện rỗng có nắp và cầu đấu, đầu cáp và cáp, bu lông vòng, biển tên, nắp quạt có lưới nan, quạt làm mát, stato/roto/ổ bi minh họa, khớp nối vấu hai nửa + đệm sao, nắp che hai nửa |
| `separator` | Bình tách khí–nước (trong máy) | Vỏ rỗng hai đáy elip 2:1, cổ nối hàn xuyên vỏ, chân và giằng, tai cẩu, mặt bích, van an toàn, đồng hồ, công tắc mức, kính mức có van góc và thước, van xả đáy, cổ nước ra két có van chặn, cửa nước bù; vách hướng dòng, vách ngăn, lưới tách giọt, tấm chống xoáy (minh họa) |
| `cooler` | Két nóc và hai quạt | 145 lá, 24 ống, hai quạt dưới két, lưới; chiều gió là tham số |
| `air-filter` | Lọc khí hút | Lõi 96 nếp, vỏ, nắp, gioăng, đai ốc tai, trục giữ |
| `water-filter` | Lọc nước nhỏ (H9) | Đầu cố định, cốc tháo xuống, lõi 64 nếp, đai khóa, trục |
| `combined-filter` | Lọc nước tổ hợp (H10) | Nắp bắt bu lông, lõi 96 nếp, đĩa ép, đai ốc, đế |
| `softener` | Nước bù và làm mềm (H7) | Bình, hạt nhựa minh họa, đầu điều khiển, van điện từ, nhánh van tay, lọc Y |
| `inlet` | Van hút | Thân, mặt bích, đĩa (minh họa), chấp hành |
| `minimum` | Van áp suất tối thiểu | Thân, nắp, lò xo và đĩa (minh họa), đồng hồ |
| `check` | Van một chiều | Thân, mặt bích, đĩa và lò xo (minh họa) |
| `water-valve` | Van ngắt nước | Thân, cuộn điện, ty van (minh họa) |
| `distributor` | Bộ chia nước | Thân chia và các cổng |
| `chassis` | Khung và tủ điện | Bệ, cột, dầm, cửa tủ, bảng điều khiển |
| `receiver` | Bình tích áp khí nén (bên ngoài) | Bình rỗng, chân, mặt bích, đồng hồ, van an toàn, xả đáy |
| `dryer` | Máy sấy lạnh | Vỏ cắt mở, các khối bên trong (minh họa), ống, xả ngưng |
| `desiccant` | Máy sấy hấp phụ hai tháp | Hai tháp cắt mở, hạt hút ẩm, van, bộ điều khiển |

Đây vẫn là thư viện các cụm riêng để kiểm tra cấu tạo. Các cụm chưa ghép thành trạm hoàn chỉnh; cổng nối đã chuẩn bị sẵn cho bước ghép (phần 8).

## 5. Trục vít và bánh sao: mô hình động học

Cơ cấu theo H2/H3: **một trục vít** nằm theo trục X, **hai bánh sao** nằm trên mặt phẳng ngang chứa trục vít, tâm cách trục vít khoảng A ở hai phía (Z = ±A), trục quay song song Y, tức vuông góc với trục vít. Hai bánh sao ở cùng vị trí dọc trục, quay ngược chiều nhau; tốc độ mỗi bánh sao bằng z1/z2 tốc độ trục vít. Không có cơ cấu hai trục vít song song.

Rãnh trục vít không vẽ tay mà **sinh từ chuyển động của răng bánh sao**: răng được coi là dải phẳng mỏng, cạnh thẳng (rộng dần về chân), nằm trong mặt phẳng chứa trục vít; khi trục vít quay góc θ thì bánh sao quay (z1/z2)·θ. Mặt cắt rãnh trên mỗi mặt phẳng kinh tuyến chính là phần răng nằm trong trụ vít ở thời điểm kinh tuyến đó đi qua mặt phẳng bánh sao. Lưới thân vít ghép 720 mặt cắt như vậy, nên rãnh có chiều sâu, bề rộng, mép vát và đoạn thoát rãnh liên tục; răng hai bánh sao luôn nằm trong rãnh khi chạy cơ cấu. Phép thử tự động lấy mẫu hàng chục nghìn điểm trên răng và giá đỡ ở nhiều góc quay, với nhiều bộ tham số, và xác nhận không điểm nào cắt vào thân vít.

Giới hạn: đây là **mô hình động học lý tưởng**, chưa phải biên dạng bao chế tạo. Chưa tính chiều dày thật và vát cạnh hiệu chỉnh của răng, khe hở chế tạo (khe hở trong mô hình được phóng đại để nhìn thấy), biến dạng, giãn nở nhiệt, đường bao kín khí, cửa xả hình học. Rãnh thoát ra mặt trụ ở cả hai đầu thân vít để hình học khép kín; máy thật thường để rãnh hở ở đầu hút.

Tham số (bảng **Thông số** trong trình xem, hoặc `buildModel('rotor', {...})`; cụm `airend` dùng chung và tự co giãn vỏ theo):

| Khóa | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `screwRadius` | 0,83 | R1, bán kính đỉnh trục vít |
| `grooves` | 6 | z1, số rãnh |
| `gateTeeth` | 11 | z2, số răng mỗi bánh sao |
| `gateRadius` | 0,83 | R2, bán kính đỉnh răng |
| `grooveDepth` | 0,33 | h, chiều sâu rãnh lớn nhất; khoảng cách tâm A = R1 + R2 − h |
| `screwLength` | 0 | chiều dài thân vít; 0 = tự tính theo vùng ăn khớp (nhập nhỏ hơn mức tối thiểu sẽ được nâng lên) |
| `toothWidth`, `toothRootWidth` | 0,15 / 0,19 | bề rộng răng tại đỉnh / chân |
| `gateThickness` | 0,075 | chiều dày đĩa răng |
| `clearance`, `tipClearance` | 0,03 / 0,02 | khe hở cạnh rãnh / đáy rãnh |
| `profile` | `'dong-hoc'` | `'minh-hoa'` dùng rãnh hình sin như bản 1.0 (không ăn khớp) |
| `twist` | 1,9 rad | góc xoắn, **chỉ dùng cho kiểu minh họa** |

Trong mô hình động học, **góc xoắn không phải tham số độc lập**: nó là hệ quả của z1/z2, R1, R2 và h. Trình xem hiện giá trị dẫn xuất dưới tên cụm, ví dụ “A = 1,33 · L = 1,51 · 6/11 · quấn ≈ 225°” (mỗi rãnh quấn khoảng 225° quanh trục). Muốn đổi độ xoắn, đổi tỷ số rãnh/răng hoặc chiều sâu rãnh. Tham số không hợp lệ (ví dụ rãnh sâu hơn 0,7·R2, số rãnh ≥ số răng) bị từ chối kèm lý do và mô hình trở về mặc định.

## 6. Sửa mã vẽ ở đâu?

| Tệp | Nội dung |
| --- | --- |
| `geometry.js` | Vật liệu; khối tròn xoay `revolveGeometry`; ren xoắn `threadGeometry`; trục có rãnh then, then; ổ lăn, phớt môi, vòng giữ, đai ốc khóa; CSG `csgGeometry` và cắt mặt cắt `sectionGeometry`; cổng nối `port`; mô hình động học trục vít `ROTOR_DEFAULTS`, `screwKinematics`, `singleScrewGeometry`, `insideScrew`, đĩa sao `starGeometry`; các hàm cũ (`screwGeometry`, `pleats`, `fan`…) |
| `models.js` | Danh mục, tham số chỉnh được, mã lắp từng cụm, cổng nối, hướng tách cụm, hoạt ảnh; `setSection`, `showPorts`, `setAirflow` |
| `viewer.js` | Camera, ánh sáng môi trường, chọn chi tiết, mặt cắt, bảng tham số, cổng nối, xuất GLB |
| `index.html`, `style.css` | Giao diện |
| `vendor/` | Three.js 0.180.0, OrbitControls, GLTFExporter; three-mesh-bvh 0.9.7 và three-bvh-csg 0.0.18 (đường dẫn nhập đã đổi sang tệp cục bộ) |
| `tests/models.test.mjs` | 13 phép thử tự động (phần 9) |
| `export-models.mjs` | Xuất GLB và `manifest.json` (có cổng nối) |
| `build-standalone.py` | Gói MO-NGAY.html |

Mỗi cụm là một hàm trong models.js (`rotor`, `airend`, `motor`, `separator`, `cooler`…). Kích thước trong cụm `rotor`/`airend` tính theo R1, R2, A và chiều dài thân vít, nên đổi tham số thì vỏ, ổ, nắp co giãn theo. Kích thước động cơ và bình tách là hằng số ở đầu hàm.

## 7. Đưa vào dự án Three.js

### Cách A: dựng bằng mã

Sao chép `geometry.js`, `models.js` và thư mục `vendor/` (cần cả hai tệp three-bvh) vào dự án; dùng cùng một bản Three.js 0.180.0.

```js
import { THREE } from './geometry.js';
import { buildModel, setExplosion, updateMotion, setSection, showPorts, setAirflow } from './models.js';

const model = buildModel('airend', { grooves: 6, gateTeeth: 11, grooveDepth: 0.33 });
scene.add(model.root);
setExplosion(model, 0.5);          // 0…1
setSection(model, true);           // cắt vỏ; cần renderer.localClippingEnabled = true cho vỏ mỏng
showPorts(model, true);            // hiện dấu cổng nối
updateMotion(model, elapsedSeconds); // gọi trong vòng lặp vẽ

const cooler = buildModel('cooler', { airflow: 'len' });
setAirflow(cooler, 'xuong');       // đảo chiều gió
```

Trường của mô hình: `parts` (nhóm có tên, `userData.minhHoa` đánh dấu cấu tạo minh họa), `solids` (vỏ cắt bằng CSG), `covers` (vỏ mỏng dùng mặt phẳng cắt), `explodables`, `motions`, `ports`, `info` (`kin` là kết quả động học, `summary` là dòng tóm tắt).

### Cách B: nạp GLB

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
new GLTFLoader().load('/models/airend.glb', gltf => scene.add(gltf.scene));
```

GLB chứa hình học, nhóm có tên, vật liệu ở trạng thái lắp nguyên cụm, cùng các nút rỗng “Cổng: …” (hướng nối là trục +Z cục bộ của nút; thông tin ở `extras.port`) và cờ `extras.minhHoa`. Hoạt ảnh, mặt cắt, tách cụm và hạt gió không ghi vào GLB.

## 8. Cổng nối và vị trí lắp để ghép hệ thống sau

Mỗi cụm có danh sách cổng (`model.ports`, nút “Cổng: …” trong GLB, mục `ports` trong `models-glb/manifest.json` với tọa độ và hướng theo hệ của cụm). Loại cổng: `khi`, `nuoc`, `co-khi`, `dien`. Ví dụ:

| Cụm | Cổng | Vị trí (x, y, z) | Hướng |
| --- | --- | --- | --- |
| `airend` | Cửa hút khí (lắp van hút) | (0,41; 1,20; 0) | +Y |
| `airend` | Cửa xả khí–nước (tới van một chiều) | (−0,45; −1,20; 0) | −Y |
| `airend` | Mặt bích nối động cơ | (3,35; 0; 0) | +X |
| `motor` | Mặt bích nối chuông đầu nén | (1,44; 0; 0) | +X |
| `separator` | Vào hỗn hợp khí–nước | (−1,13; 3,30; 0,30) | −X |
| `separator` | Khí ra (tới van áp suất tối thiểu) | (0; 4,26; 0) | +Y |
| `cooler` | Nước nóng vào két / nước ra | (∓3,2; 0,1; −1,1) | ∓X |

Mặt bích động cơ và mặt bích chuông nối có cùng bán kính (1,5), cùng vòng lỗ (12 lỗ, bán kính 1,38) và gờ định tâm, nửa khớp nối phía đầu nén có lỗ bằng đầu trục vít. Để ghép: đặt cổng của hai cụm trùng vị trí và ngược hướng. Các cụm vẫn dùng tỷ lệ quy ước riêng; cần đặt tỷ lệ theo kích thước thật trước khi ghép thành trạm.

## 9. Kiểm tra và xuất lại

Cần Node.js 18 trở lên; thư viện đã đóng kèm, không cần `npm install`.

```bash
node --test tests/models.test.mjs        # 13 phép thử
node export-models.mjs                    # xuất lại 18 GLB và manifest.json
node export-models.mjs rotor airend --tham-so '{"grooves":5}' --ra ./ket-qua   # xuất riêng với tham số
python3 build-standalone.py               # dựng lại MO-NGAY.html
```

Phép thử gồm: 18 cụm có hình học hữu hạn, chỉ số hợp lệ; đúng một trục vít và hai bánh sao trục vuông góc, cùng vị trí dọc trục, đối xứng, quay ngược chiều đúng tỷ số; răng và giá đỡ bánh sao không cắt vào thân vít khi quay với bốn bộ tham số; biên dạng rãnh không chồng lấn, tham số sai bị từ chối; vỏ đầu nén và bình tách rỗng (tia xuyên qua gặp đủ mặt trong và ngoài), mặt cắt CSG có mặt cắt riêng; động cơ có khớp nối hai nửa, đệm đàn hồi, nắp che, nắp quạt tháo được và mặt bích khớp với đầu nén; két có hai quạt dưới lõi, đảo chiều gió đổi chiều hạt và quạt; mọi cụm có cổng nối và dấu cổng không lọt vào GLB; không có bơm nước, không có RO; tách cụm trả đúng vị trí; pháp tuyến hướng ra ngoài.

Trong môi trường tạo gói đã chạy đủ các phép thử trên, xuất GLB và kiểm tra cấu trúc tệp, mở index.html và MO-NGAY.html bằng Chromium không giao diện (WebGL phần mềm) để chụp ảnh các chế độ lắp, mặt cắt, tách cụm, đổi tham số, đảo chiều gió và xuất GLB trong trình duyệt. Thời gian dựng `airend` khoảng 2–3 giây do CSG.

## 10. Căn cứ theo bản vẽ, giả định và giới hạn

| Ảnh | Cách sử dụng |
| --- | --- |
| H1 | Bố trí tổng thể: két gió trên nóc, quạt dưới két, động cơ có nắp quạt lưới nan, bình tách, các phụ kiện đỉnh bình |
| H2 | Mặt cắt đầu nén: bánh sao nằm ngang trong khoang bên, ổ đỡ trên dưới trục bánh sao, đầu trục vít có ren, cửa phun nước và cửa hút |
| H3 | **Một trục vít và hai bánh sao trên trục vuông góc**, đầu trục có rãnh then và đầu có ren |
| H4 | Hình ngoài đầu nén (nắp hông, nắp ổ tròn trên đỉnh, cửa hút vuông, nắp đầu có nắp ổ gân và chân, chuông nối có cửa sổ); van hút phía trên, van một chiều phía dưới; bình tách |
| H5 | Két gió hai quạt dưới két; các cụm vòng nước |
| H6 | Van ngắt nước, bộ chia, lọc nước; phần trao đổi nhiệt dạng tấm thuộc **phương án giải nhiệt nước**, không đưa vào cụm két gió |
| H7 | Nước bù, làm mềm nước, van điện từ, công tắc mức; **không diễn giải thành RO** |
| H8 | Thứ tự tháo lọc khí |
| H9 | Lọc nước nhỏ: đầu, cốc, lõi, chi tiết giữ |
| H10 | Lọc nước tổ hợp, **cụm tham khảo riêng**, không mặc định nối tiếp với lọc H9 |

Giả định và giới hạn chính:

- **Chiều gió**: H1/H5 không có mũi tên. Mặc định gió đi từ dưới lên qua két (quạt dưới đẩy gió ra lưới nóc) là giả định; đổi bằng tham số `airflow` hoặc nút Đảo chiều gió. Cần xác nhận theo tài liệu máy.
- **Bình tách** (trong máy) và **bình tích áp** (bên ngoài) là hai cụm riêng.
- Không thêm bơm nước hay thiết bị không có trong ảnh.
- **Cấu tạo minh họa** (gắn nhãn trong trình xem và cờ `minhHoa` trong GLB): giá đỡ bánh sao, loại và cỡ ổ lăn, phớt, đai ốc khóa, vòng giữ, vòi phun nước trong vỏ, stato/roto/ổ bi động cơ, khớp nối vấu và cầu đấu dây (kiểu thường gặp), nội thất bình tách (vách hướng dòng, vách ngăn, lưới tách giọt, tấm chống xoáy, que dò mức), bên trong các van và máy sấy.
- Kích thước được ước lượng từ ảnh không ghi kích thước; độ dày thành được phóng đại vừa đủ để nhìn thấy. Màu là màu minh họa, chọn hài hòa với bản vẽ (gang sơn xám xanh, thép sáng, bánh sao màu nhựa kỹ thuật).
- Bình tích áp, máy sấy lạnh, máy sấy hấp phụ là mẫu tổng quát vì bộ ảnh chưa có bản vẽ riêng.

Muốn chính xác theo máy thật cần kích thước, số rãnh/răng xác nhận, bản vẽ mặt cắt hoặc tệp STEP/IGES/DXF. Mô hình phục vụ xem cấu tạo và phát triển mô phỏng; không dùng để gia công, tính bền hay chọn áp suất làm việc.

## Lịch sử

- **2.0**: rãnh trục vít sinh theo động học và kiểm tra không va chạm; trục có bậc, rãnh then, ren xoắn, vòng giữ; bánh sao có răng riêng, giá đỡ, moay-ơ; vỏ đầu nén rỗng dựng bằng CSG với nắp, ổ, phớt, chuông nối; động cơ và khớp nối chi tiết; bình tách chi tiết; mặt cắt CSG có tô mặt cắt; tham số chỉnh trong trình xem; cổng nối cho 18 cụm; chiều gió đảo được; nhãn minh họa; ánh sáng môi trường cho kim loại.
- **1.0**: 18 cụm, trình xem, xuất GLB, bản một tệp.

## Giấy phép

Mã ứng dụng: LICENSE-APP.txt. Three.js và addon: vendor/LICENSE.txt. three-mesh-bvh, three-bvh-csg: vendor/LICENSE-three-bvh.txt (MIT). Các ảnh trong `references/` là ảnh người dùng cung cấp để đối chiếu, không thuộc giấy phép MIT của mã.
