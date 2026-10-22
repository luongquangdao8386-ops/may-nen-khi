# Mã Three.js dựng chi tiết máy nén phun nước

Đây là mã dựng hình học 3D thật: trục vít có rãnh xoắn, bánh sao có răng, két có lá tản nhiệt, lõi lọc có nếp gấp và các cụm có chi tiết mang tên riêng. Bạn có thể xoay, phóng to, ẩn vỏ, tách cụm, xem chuyển động và xuất mô hình.

## 1. Mở nhanh

1. Giải nén toàn bộ gói ZIP vào một thư mục.
2. Nhấp đúp **MO-NGAY.html**, mở bằng Chrome hoặc Edge trên máy tính có WebGL 2.
3. Chọn một cụm ở cột trái, ví dụ **02 — Đầu nén cắt mở** hoặc **05 — Két nóc · hai quạt**.

MO-NGAY.html chứa sẵn Three.js, mã mô hình, giao diện và mười ảnh tham chiếu. Tệp này không tải thư viện từ mạng, không cần API key hay cài Three.js. Các tệp nguồn bên ngoài không tự cập nhật vào bản này; sau khi sửa mã, chạy lệnh dựng lại ở phần 5.

Nếu trình duyệt không cho mở mô-đun nhúng từ tệp, dùng bản nguồn qua máy chủ cục bộ ở phần 2.

## 2. Chạy bản nguồn để sửa mã

Cần Python 3. Không cần cài thêm gói Python hoặc npm.

- Windows: nhấp đúp **CHAY-WINDOWS.bat**.
- macOS/Linux: mở Terminal trong thư mục và chạy `python3 run.py`.
- Nếu Windows nhận lệnh `python`: chạy `python run.py`.

Chương trình tự mở địa chỉ `http://127.0.0.1:8000` hoặc cổng trống tiếp theo đến 8010. Giữ cửa sổ lệnh mở khi dùng; nhấn Ctrl+C để dừng. Máy chủ chỉ lắng nghe trên máy của bạn.

Mở **index.html** bằng địa chỉ trên để dùng giao diện đầy đủ. Mở **vi-du-toi-gian.html** qua cùng địa chỉ để xem ví dụ dựng một cụm bằng ít dòng mã. Mở trực tiếp index.html bằng file:// có thể bị trình duyệt chặn các mô-đun bên ngoài.

## 3. Cách thao tác

| Thao tác | Kết quả |
| --- | --- |
| Kéo chuột trái trên mô hình | Xoay góc nhìn |
| Cuộn chuột | Phóng to, thu nhỏ |
| Kéo chuột phải | Dịch chuyển khung nhìn |
| Bấm tên hoặc bấm vào chi tiết | Làm nổi bật và xem tên |
| Bấm biểu tượng mắt trong danh sách | Ẩn/hiện nhóm chi tiết |
| Lắp hoàn chỉnh | Trả cụm về vị trí lắp |
| Mặt cắt vỏ | Cắt phần vỏ đã đánh dấu để thấy bên trong |
| Tách cụm / thanh Tách cụm | Dịch các chi tiết được cấu hình sẵn |
| Chạy cơ cấu | Quay trục vít, bánh sao, quạt hoặc chạy van ở cụm có hoạt ảnh |
| Lưới tam giác | Xem lưới hình học |
| Bản vẽ gốc | Xem ảnh người dùng cung cấp, ứng với cụm đang chọn |
| Xuất mô hình GLB | Tải mô hình 3D tĩnh của cụm lắp hoàn chỉnh |
| Chụp ảnh góc nhìn | Tải PNG của góc nhìn hiện tại |

Mặt cắt chỉ tác động lên các vỏ được gán trong mã; đây là mặt cắt hiển thị, chưa có mặt bịt tại biên cắt. Khi tách cụm, bấm nút vừa khung ↺ nếu chi tiết ra ngoài khung nhìn. Nút chuyển động bị mờ khi cụm không có hoạt ảnh.

## 4. Danh sách 18 cụm và ID để gọi trong mã

| ID | Cụm | Chi tiết đáng chú ý |
| --- | --- | --- |
| `rotor` | Một trục vít, hai bánh sao | Rãnh xoắn, trục, rãnh then, ren đầu trục, hai bánh sao và vòng giữ |
| `airend` | Đầu nén | Vỏ dạng ống và buồng bánh sao, gối đỡ, nắp, chân đế, cổng nước và cổng hút |
| `motor` | Động cơ và khớp nối | 32 gân, hộp cực, nắp quạt, chân đỡ và khớp nối tháo rời |
| `separator` | Bình tách khí–nước | Vỏ rỗng, vách trong minh họa, lớp nước, kính mức và van đỉnh |
| `cooler` | Két nóc và hai quạt | 145 lá tản nhiệt, 24 ống, hai quạt bảy cánh, chụp, lưới và hạt gió |
| `air-filter` | Lọc khí hút | Lõi 96 nếp, vỏ, nắp, gioăng, đai ốc tai và trục giữ |
| `water-filter` | Lọc nước nhỏ | Đầu cố định, cốc tháo xuống, lõi 64 nếp, đai khóa và trục |
| `combined-filter` | Lọc nước tổ hợp | Nắp bắt bu lông, lõi 96 nếp, đĩa ép, đai ốc và đế |
| `softener` | Nước bù và làm mềm | Bình, hạt nhựa, đầu điều khiển, van điện từ, nhánh van tay và lọc Y |
| `inlet` | Van hút | Thân, mặt bích, đĩa và chấp hành |
| `minimum` | Van áp suất tối thiểu | Thân, nắp, lò xo, đĩa và đồng hồ |
| `check` | Van một chiều | Thân, mặt bích, đĩa chuyển động và lò xo |
| `water-valve` | Van ngắt nước | Thân, cuộn điện và ty van chuyển động |
| `distributor` | Bộ chia nước | Thân chia và các cổng |
| `chassis` | Khung và tủ điện | Bệ, cột, dầm, cửa tủ tháo được và bảng điều khiển |
| `receiver` | Bình tích áp khí nén | Bình rỗng, chân, mặt bích, đồng hồ, van an toàn và xả đáy |
| `dryer` | Máy sấy lạnh | Vỏ cắt mở, máy nén môi chất, dàn ngưng, quạt, khối trao đổi nhiệt, ống và xả ngưng |
| `desiccant` | Máy sấy hấp phụ | Hai tháp cắt mở, hạt hút ẩm, đồng hồ, van, ống và bộ điều khiển |

Đây là thư viện các cụm riêng để kiểm tra hình dạng trước. Bản này chưa lắp chúng thành một trạm máy nén hoàn chỉnh với tất cả đường ống.

## 5. Sửa mã vẽ ở đâu?

| Tệp | Nội dung |
| --- | --- |
| `geometry.js` | Hình học trục vít, bánh sao, ren, lõi xếp nếp, cánh quạt, ống, mặt bích, bu lông và vật liệu |
| `models.js` | Mã lắp từng cụm, tọa độ, kích thước, tên chi tiết, tham số tách cụm và hoạt ảnh |
| `viewer.js` | Camera, ánh sáng, chọn chi tiết, mặt cắt, giao diện và xuất GLB |
| `vi-du-toi-gian.html` | Ví dụ gọi thư viện mô hình trong một cảnh Three.js nhỏ |
| `index.html`, `style.css` | Giao diện trình xem đầy đủ |
| `vendor/` | Three.js 0.180.0, OrbitControls, GLTFExporter và giấy phép |
| `references/` | Mười ảnh bản vẽ tham chiếu đã cung cấp |
| `models-glb/` | 18 mô hình GLB đã xuất sẵn |

Ví dụ, hàm `shaftCore()` trong models.js gọi `screwGeometry()` và `gateGeometry()`. Thay các tham số để đổi hình học. Tham số mặc định của trục vít trong geometry.js:

```js
screwGeometry({
  radius: 0.83,
  length: 2.75,
  grooves: 6,
  depth: 0.31,
  twist: 1.9,   // Góc xoắn toàn chiều dài, radian.
  axial: 160,   // Số đoạn dọc trục.
  radial: 240   // Số đoạn quanh chu vi.
});
```

Số rãnh, góc xoắn và số răng bánh sao đang là tham số minh họa. Nếu thay số rãnh/răng, cập nhật tỷ số chuyển động ở `shaftCore()`. Việc thay tham số này chưa tạo ra biên dạng ăn khớp chính xác.

Sau khi sửa nguồn, tải lại trang chạy bằng run.py. Muốn cập nhật bản một tệp, chạy:

```bash
python3 build-standalone.py
```

Trên Windows có thể dùng `python build-standalone.py`.

## 6. Đưa vào dự án Three.js

### Cách A: Dùng hình học được dựng bằng mã

Sao chép geometry.js, models.js và thư mục vendor vào dự án. Bảo đảm chỉ dùng cùng một bản Three.js 0.180.0 cho cảnh và các mô hình. Ví dụ tối thiểu đã có trong vi-du-toi-gian.html.

```js
import { THREE } from './geometry.js';
import { buildModel, setExplosion, updateMotion } from './models.js';

const model = buildModel('airend');
scene.add(model.root); // scene là cảnh Three.js của bạn.
setExplosion(model, 0.5);

// Gọi trong vòng lặp vẽ của dự án; elapsedSeconds là thời gian tính bằng giây.
updateMotion(model, elapsedSeconds);

// Chi tiết là các Group có tên, có thể tìm và ẩn riêng:
const mainScrew = model.root.getObjectByName('Trục vít chính');
if (mainScrew) mainScrew.visible = false;
```

Nếu dự án đang dùng npm, thay dòng nhập Three.js đầu geometry.js từ đường dẫn vendor sang `import * as THREE from 'three'`. Đảm bảo ứng dụng và thư viện cùng sử dụng một phiên bản. Trường hợp dự án đã có renderer/camera/vòng lặp, dùng models.js và geometry.js rồi thêm model.root vào cảnh hiện có; viewer.js là trình xem đầy đủ riêng.

Các nhóm trong `model.parts` có tên; `model.covers` là các mesh vỏ để gán clippingPlanes; `model.explodables` chứa hướng dịch khi tháo; `model.motions` chứa đối tượng chuyển động. `updateMotion()` nhận thời gian tuyệt đối tính bằng giây.

### Cách B: Nạp file GLB đã xuất

Trong dự án đã có Three.js và GLTFLoader cùng phiên bản:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

new GLTFLoader().load('/models/airend.glb', gltf => {
  scene.add(gltf.scene);
});
```

Sao chép airend.glb từ models-glb vào đường dẫn public tương ứng của dự án. GLTFLoader không được đóng kèm trong gói này; ví dụ trên dùng bản đi cùng thư viện Three.js trong dự án của bạn.

GLB chứa hình học, nhóm mang tên và vật liệu ở trạng thái lắp nguyên cụm. Hoạt ảnh JavaScript, mặt cắt của trình xem, vị trí tách cụm và hạt gió không được ghi vào GLB. Muốn giữ các chức năng đó, dùng cách A hoặc lập trình lại theo tên nhóm trong GLB.

Các cụm có tỷ lệ quy ước riêng, không có chuẩn chiều dài chung đã xác nhận. Khi ghép chúng vào một hệ thống, cần đặt scale và vị trí theo kích thước thật; không diễn giải một đơn vị trong GLB là một mét thực tế.

## 7. Căn cứ theo bản vẽ và giới hạn

| Ảnh | Cách sử dụng |
| --- | --- |
| H1 | Bố trí tổng thể, khung, động cơ, bình tách và két nóc |
| H2 | Vỏ và mặt cắt đầu nén |
| H3 | Cấu trúc **một trục vít chính và hai bánh sao trên trục vuông góc** |
| H4 | Đầu nén, truyền động và các phụ kiện đường khí |
| H5 | Két gió, hai quạt và các cụm vòng nước |
| H6 | Tham khảo van/bộ chia; phần trao đổi nhiệt nước thuộc phương án khác, chưa thêm vào cụm két gió |
| H7 | Nước bù, làm mềm nước và các van; chưa diễn giải thành bộ RO |
| H8 | Thứ tự các chi tiết lọc khí |
| H9 | Đầu, cốc, lõi và chi tiết giữ của lọc nước nhỏ |
| H10 | Phương án lọc nước tổ hợp riêng, chưa mặc định nối tiếp với lọc H9 |

Hình học được dựng lại từ ảnh không ghi đủ kích thước. Biên dạng rãnh/răng, khe hở, ren, lò xo và các kết cấu không nhìn thấy trong ảnh là mô hình trực quan, chưa phải biên dạng chế tạo hoặc tính toán ăn khớp. Chuyển động chỉ thể hiện cơ cấu, chưa có giải va chạm hay mô phỏng nén khí và bôi trơn bằng nước.

Hai quạt được đặt dưới két theo ảnh. Hạt gió đang đi từ dưới lên để minh họa; phải xác nhận chiều gió của máy thực tế trước khi dùng làm tài liệu kỹ thuật. Bình tích áp, máy sấy lạnh và sấy hấp phụ là mẫu tổng quát vì bộ ảnh chưa có bản vẽ chi tiết các thiết bị này.

Muốn đạt mức chính xác theo máy thật, cần kích thước, số rãnh/răng xác nhận và/hoặc STEP, IGES, DXF hay bản vẽ có mặt cắt. Tệp hiện tại phục vụ xem cấu tạo và phát triển mô phỏng, chưa dùng để gia công hay chọn áp suất làm việc.

## 8. Kiểm tra và xuất lại

Các thư viện đã đóng kèm, không cần npm install. Cần Node.js từ 18 trở lên cho các lệnh sau:

```bash
node --test tests/models.test.mjs
node export-models.mjs
```

Kiểm tra bao gồm: cả 18 cụm có hình học hữu hạn và chỉ số hợp lệ; đúng một trục vít và hai bánh sao vuông góc; đúng hai quạt dưới két; tách cụm trả được về vị trí lắp; chuyển động hữu hạn; pháp tuyến hình học tùy chỉnh hướng ra ngoài. Bộ xuất GLB dùng GLTFExporter chính thức, tạo lại toàn bộ models-glb.

Trong môi trường tạo gói, đã kiểm tra hình học, liên kết mô-đun, xuất và cấu trúc GLB, đồng thời xem ảnh chiếu từ lưới của một số cụm. Chưa xác nhận tương tác và hiển thị WebGL trong trình duyệt vì dịch vụ xem thử không khả dụng ở phiên này.

## Giấy phép

Mã ứng dụng: LICENSE-APP.txt. Three.js và addon: vendor/LICENSE.txt. Các ảnh trong references là ảnh người dùng cung cấp để đối chiếu, không thuộc giấy phép MIT của mã.
