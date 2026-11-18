# Ghép mô hình máy nén khí vào trang theo dõi vận hành 3D

Thư mục này chứa mô hình máy nén khí trục vít đơn phun nước của repo `may-nen-khi`, đóng thành **một tệp** để mang sang trang Three.js khác.

| Tệp | Dùng để |
| --- | --- |
| `may-nen-khi-3d.js` | Mô hình (khoảng 280 KB). Chỉ cần Three.js của trang dùng |
| `vi-du.html` | Trang mẫu: dựng máy nén, nhãn số liệu giả lập, nút chạy/dừng, có tải/không tải, báo lỗi, mặt cắt |
| `HUONG-DAN-TICH-HOP.md` | Hướng dẫn này |

Link trên GitHub Pages:

- Tệp mô hình: https://luongquangdao8386-ops.github.io/may-nen-khi/dist/may-nen-khi-3d.js
- Trang mẫu: https://luongquangdao8386-ops.github.io/may-nen-khi/dist/vi-du.html

## Yêu cầu của trang dùng

- Three.js **dạng ES module**, bản 0.160 trở lên (đã thử 0.180 và 0.186.1), khai báo tên `"three"` trong importmap. Bản Three.js cũ dạng `three.min.js` (biến toàn cục `THREE`, ví dụ r128) **không dùng được**.
- `renderer.localClippingEnabled = true` nếu muốn dùng mặt cắt.
- Nên chép `may-nen-khi-3d.js` vào cùng thư mục với trang (chạy được khi không có mạng). Nếu máy có mạng thì có thể nhập thẳng từ link GitHub Pages ở trên.
- Trang mở bằng máy chủ tĩnh (`python -m http.server`, Node-RED, máy chủ của chương trình đọc DR302…), không mở trực tiếp bằng `file://`.

## Cách dùng

```html
<script type="importmap">
{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js" } }
</script>
<script type="module">
import * as THREE from 'three';
import { taoMayNenKhi } from './may-nen-khi-3d.js';

// scene, camera, renderer của trang đã có sẵn
const mnk = taoMayNenKhi({ phamVi: 'goi-may', tyLe: 0.1 });  // đơn vị mét
mnk.nhom.position.set(6, 0, -2);   // đặt vào phòng máy
mnk.nhom.rotation.y = Math.PI / 2;
scene.add(mnk.nhom);

// trong vòng lặp vẽ (dt: giây)
mnk.capNhat(dt, { chay: soLieu.chay, coTai: soLieu.coTai });
</script>
```

Dựng mất khoảng 4–7 giây. Nên hiện thông báo chờ và gọi `taoMayNenKhi()` sau khi trang đã vẽ khung đầu tiên.

## Tùy chọn của `taoMayNenKhi()`

| Khóa | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `phamVi` | `'goi-may'` | `'goi-may'`: gói máy và cụm làm mềm nước, khoảng 2,7 × 1,6 m, cao 1,6 m. `'tram'`: thêm bình tích áp, máy sấy lạnh, máy sấy hấp phụ, dài khoảng 4,5 m |
| `voBaoChe` | `false` | `true`: có vỏ bao che như H9 |
| `chieuGio` | `'len'` | Chiều gió qua két (giả định) |
| `tyLe` | `0.1` | Thư viện dùng 1 đơn vị ≈ 100 mm; 0,1 đổi ra mét |
| `nen` | `false` | Hiện tấm nền bê tông minh họa |
| `anBenTrong` | `true` | Ẩn chi tiết kín trong vỏ (trục vít, bánh sao, stato, ổ…) cho nhẹ; tự hiện khi bật mặt cắt |

## Các hàm

| Hàm | Làm gì |
| --- | --- |
| `nhom` | Nhóm Three.js để thêm vào cảnh, dời, xoay |
| `capNhat(dt, tt)` | Gọi mỗi khung hình. `tt`: `chay` (trục vít, bánh sao, động cơ quay), `coTai` (van hút, van một chiều, van áp suất tối thiểu mở), `quat` (quạt két, mặc định theo `chay`), `nuoc` (van ngắt nước mở, mặc định theo `chay`), `xaNuoc` (van điện từ xả mở), `maySay`, `tocDo` (hệ số tốc độ hình), `hatGio` (hiện hạt gió qua két) |
| `viTriNhan(khoa)` | Vị trí thế giới để đặt nhãn số liệu (xem bảng dưới) |
| `chiTiet(ten)` | Lấy chi tiết hoặc cụm theo tên, ví dụ `chiTiet('Bình tách')` |
| `danhSachChiTiet()` | Tên, mô tả, cờ minh họa của mọi nhóm chi tiết (dùng cho cây cấu tạo, thẻ thông tin) |
| `toSang(ten, mau)` | Tô sáng chi tiết để báo lỗi; `toSang(ten, null)` để bỏ |
| `matCat(true/false)` | Cắt bỏ góc trên – trước gói máy để nhìn vào trong |
| `tachCum(0…1)` | Nâng két nóc, mở cửa tủ điện và tấm vỏ |
| `cong()` | Cổng nối ra ngoài: khí nén ra, nước cấp, thoát nước, cáp nguồn |
| `huy()` | Gỡ khỏi cảnh, giải phóng bộ nhớ |

Điểm gắn nhãn (`viTriNhan`): `dauNen`, `dongCo`, `binhTach`, `apSuatXa`, `mucNuoc`, `ket`, `locKhi`, `locNuoc`, `tuDien`, `lamMem`; thêm `binhTichAp`, `maySayLanh`, `maySayHapPhu` khi `phamVi: 'tram'`.

Tên cụm dùng với `chiTiet()` / `toSang()`: `Đầu nén (cụm 02)`, `Động cơ (cụm 03)`, `Bình tách khí–nước (cụm 04)`, `Két nóc hai quạt (cụm 05)`, `Lọc khí đầu hút (cụm 06)`, `Lọc nước nhỏ (cụm 07)`, `Cụm nước bù – làm mềm (cụm 09)`, `Van hút khí (cụm 10)`, `Van áp suất tối thiểu (cụm 11)`, `Van một chiều (cụm 12)`, `Van ngắt nước (cụm 13)`, `Bộ chia nước (cụm 14)`, `Khung, bệ, tủ điện (cụm 15)`, `Van điện từ xả nước (H7)`; với trạm thêm `Bình tích áp (cụm 16)`, `Máy sấy lạnh (cụm 17)`, `Máy sấy hấp phụ hai tháp (cụm 18)`. Chi tiết nhỏ hơn dùng tên trong `danhSachChiTiet()`, ví dụ `Kính mức nước`, `Tủ điện`, `Nút dừng khẩn cấp`.

## Gắn dữ liệu đọc qua RS485 / DR302

Trình duyệt không đọc trực tiếp Modbus từ DR302. Chương trình trung gian (Node-RED, Python…) đọc thanh ghi rồi gửi sang trang, ví dụ qua WebSocket. Trang chỉ cần đổi số liệu nhận được thành trạng thái và nhãn:

| Dữ liệu từ bộ điều khiển máy nén | Trên mô hình |
| --- | --- |
| Đang chạy | `capNhat(dt, { chay: true, … })` |
| Có tải / không tải | `coTai` |
| Quạt két chạy | `quat` |
| Áp suất khí ra, áp suất bình | Nhãn tại `apSuatXa`, `binhTach` |
| Nhiệt độ khí xả, nhiệt độ nước | Nhãn tại `dauNen`, `ket` |
| Mức nước | Nhãn tại `mucNuoc` |
| Dòng điện, giờ chạy | Nhãn tại `dongCo`, `tuDien` |
| Báo lỗi | `toSang('Đầu nén (cụm 02)')` hoặc cụm liên quan |

Bảng thanh ghi Modbus phụ thuộc bộ điều khiển của máy nén; cần tài liệu của hãng.

## Độ nặng

Gói máy với `anBenTrong: true` có khoảng 1.900 mesh và 730 nghìn tam giác (cả trạm khoảng 2.600 mesh, 910 nghìn tam giác). Máy tính bình thường chạy ổn; điện thoại có thể chậm. Nếu trang đã nặng, có thể tắt bóng đổ của chi tiết nhỏ hoặc dùng `phamVi: 'goi-may'`.

## Giới hạn

Kích thước là ước lượng từ ảnh, không có bản vẽ kích thước. Chi tiết có cờ `minhHoa` là cấu tạo minh họa. Mã nguồn đầy đủ, tham số và giả định: `HUONG-DAN.md` của repo. Đóng gói lại sau khi sửa mã: `npm install --no-save esbuild@0.24.2 && node dong-goi.mjs`.

## Lời nhắn dán vào phiên chat làm trang theo dõi

> Tôi có mô hình 3D máy nén khí trục vít đơn đóng thành tệp ES module `may-nen-khi-3d.js` (đặt cùng thư mục với trang, hoặc nhập từ https://luongquangdao8386-ops.github.io/may-nen-khi/dist/may-nen-khi-3d.js). Tệp cần Three.js dạng ES module ≥ 0.160 khai báo `"three"` trong importmap. Cách dùng: `import { taoMayNenKhi } from './may-nen-khi-3d.js'; const mnk = taoMayNenKhi({ phamVi: 'goi-may', tyLe: 0.1 }); scene.add(mnk.nhom);` rồi mỗi khung gọi `mnk.capNhat(dt, { chay, coTai, quat })`. Vị trí đặt nhãn số liệu: `mnk.viTriNhan('apSuatXa' | 'binhTach' | 'dauNen' | 'ket' | 'mucNuoc' | 'dongCo' | 'tuDien')`. Báo lỗi: `mnk.toSang('Đầu nén (cụm 02)')`, bỏ bằng `mnk.toSang(ten, null)`. Mặt cắt: `mnk.matCat(true)` (cần `renderer.localClippingEnabled = true`). Đơn vị mét, gói máy khoảng 2,7 × 1,6 m. Hãy ghép mô hình này vào trang theo dõi vận hành của tôi và nối các nhãn với số liệu đọc từ DR302.
