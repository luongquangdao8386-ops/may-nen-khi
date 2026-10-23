# Mã Three.js dựng máy nén trục vít đơn phun nước và trạm khí nén

Thư viện mô hình 3D của máy nén khí trục vít đơn (một trục vít, hai bánh sao), không dầu trong buồng nén, dùng nước để bôi trơn, làm kín và giải nhiệt; giải nhiệt nước bằng két gió có quạt. Gồm 18 cụm riêng và một **trạm hoàn chỉnh** ghép từ các cụm đó. Mọi chi tiết là hình học 3D thật: xoay, phóng to, cắt vỏ, tách cụm, chạy cơ cấu, chỉnh tham số và xuất GLB.

Bản 3.0 thêm mô hình `station` (trạm hoàn chỉnh) và nâng chi tiết các cụm còn lại (két, khung – tủ điện – vỏ bao che, van, lọc, cụm làm mềm, thiết bị ngoài) lên cùng mức với bốn cụm đã nâng ở bản 2.0. ID của 18 cụm giữ nguyên.

## 1. Mở nhanh

1. Giải nén toàn bộ gói vào một thư mục (hoặc tải repo về).
2. Nhấp đúp **MO-NGAY.html**, mở bằng Chrome hoặc Edge trên máy tính có WebGL 2.
3. Trình xem mở sẵn **00 — Trạm hoàn chỉnh** (dựng khoảng 10 giây, có thông báo chờ). Chọn cụm khác ở cột trái để xem riêng.

MO-NGAY.html (khoảng 8 MB) chứa sẵn Three.js, thư viện CSG, mã mô hình, giao diện và mười ảnh tham chiếu; không tải gì từ mạng, không cần API key. Sau khi sửa mã nguồn, chạy lại lệnh dựng ở phần 10 để cập nhật tệp này.

## 2. Chạy bản nguồn để sửa mã

Cần Python 3, không cần cài thêm gói.

- Windows: nhấp đúp **CHAY-WINDOWS.bat**.
- macOS/Linux: mở Terminal trong thư mục, chạy `python3 run.py`.

Chương trình mở `http://127.0.0.1:8000` (hoặc cổng trống tiếp theo đến 8010). Mở **index.html** qua địa chỉ này để dùng giao diện đầy đủ, **vi-du-toi-gian.html** để xem ví dụ gọi thư viện bằng ít dòng mã. Mở index.html trực tiếp bằng `file://` có thể bị trình duyệt chặn mô-đun.

## 3. Cách thao tác

| Thao tác | Kết quả |
| --- | --- |
| Kéo chuột trái / cuộn / kéo chuột phải | Xoay / thu phóng / dịch khung nhìn |
| Bấm tên hoặc bấm vào chi tiết | Làm nổi bật, xem mô tả; nhóm có nhãn **MINH HỌA** là kết cấu không có bản vẽ. Trong trạm, mỗi cụm là một nhóm cha, chi tiết của cụm thụt lề bên dưới |
| Biểu tượng mắt trong danh sách | Ẩn/hiện nhóm chi tiết, ví dụ ẩn két nóc để nhìn từ trên xuống |
| Lắp hoàn chỉnh | Trả về vị trí lắp |
| Mặt cắt vỏ | Cụm riêng: cắt thật vỏ đúc, nắp, thân bình bằng CSG, mặt cắt tô màu cam. Trạm: cắt bỏ góc trên – trước của gói máy bằng mặt phẳng cắt để nhìn vào trong (nhanh, không tô mặt cắt) |
| Tách cụm / thanh Tách cụm | Cụm riêng: dịch chi tiết theo hướng tháo lắp. Trạm: nâng két nóc, mở cửa tủ điện và tấm vỏ bao che |
| Chạy cơ cấu | Quay trục vít và hai bánh sao đúng tỷ số, quay động cơ (trong trạm quay cùng trục vít), quay quạt; chạy van |
| Cổng nối | Hiện dấu cổng khí (xanh dương), nước (xanh ngọc), cơ khí (cam), điện (tím). Trạm chỉ hiện các đầu nối ra ngoài trạm |
| Thông số có thể chỉnh | Trạm (vỏ bao che, chiều gió, thiết bị ngoài), cụm 01–02 (trục vít), 05 (chiều gió), 15 (vỏ bao che) |
| Đảo chiều gió | Đổi chiều hạt gió và chiều quay quạt (cụm 05 và trạm) |
| Bản vẽ gốc | Xem ảnh tham chiếu ứng với mô hình |
| Xuất mô hình GLB | Tải GLB với tham số đang dùng, kèm các nút “Cổng: …” |
| Chụp ảnh góc nhìn | Tải PNG góc nhìn hiện tại |

## 4. Trạm hoàn chỉnh (`station`)

Trạm ghép 16 cụm (trục vít và hai bánh sao nằm trong đầu nén). Đơn vị quy ước của trạm: **1 đơn vị ≈ 100 mm**, ước lượng từ tỷ lệ ảnh H1; gói máy dài 19, sâu 12,5, cao tới mặt lắp két 11, két cao khoảng 2,9. Các cụm đầu nén, động cơ, van, lọc, két, khung, thiết bị ngoài đã dựng ở tỷ lệ này; riêng bình tách phóng 1,45 lần để gần tỷ lệ H1 và để mặt bích đỉnh khớp mặt bích van áp suất tối thiểu.

### Bố trí trong gói máy (theo H1)

| Vị trí | Cụm |
| --- | --- |
| Phía sau, bên trái | Đầu nén, tâm trục cao 3,95; động cơ ghép thẳng vào chuông nối (động cơ quay 180° để mặt bích quay về đầu nén); van hút trên cửa hút, cơ cấu chấp hành quay ra sau; van một chiều dưới cửa xả |
| Dưới đầu nén – động cơ | Giá máy: hai thanh thép C trên sáu giá chống rung cao su, thanh ngang, bốn khối đệm nâng chân động cơ, ghế đỡ có bu lông cấy và đai ốc chỉnh dưới chân trước đầu nén (H4, H6: support seat) |
| Trên động cơ | Lọc khí, đỡ bằng dầm bắt vào cột giữa sau; ống mềm gân cao su xuống van hút, hai đầu có măng sông và đai siết |
| Phía trước đầu nén | Bình tách đứng trên khay đáy; van áp suất tối thiểu trên đỉnh; đồng hồ, van an toàn, công tắc mức, kính mức của bình |
| Góc trước bên trái, dưới két | Lọc nước nhỏ (H9) treo trên tay treo bắt vào dầm đỉnh trái; van ngắt nước điện từ ngay dưới đầu lọc |
| Trên đầu nén | Bộ chia nước trên giá bắt vào vỏ đầu nén |
| Phía trước bên phải | Tủ điện; bảng điều khiển và nút dừng khẩn cấp trên mặt trước hộp két |
| Trên khay, trước động cơ | Bộ phun (H1: ejector) |
| Trên khung | Két nóc hai quạt; lưới nóc, quạt dưới két |

Ngoài gói máy: cụm nước bù – làm mềm (H7) đứng cạnh hông trái, gần cổng nước bôi trơn vào/ra ở hông bệ. Bên phải: bình tích áp → máy sấy lạnh → máy sấy hấp phụ (mẫu tổng quát), cùng phễu thu nước ngưng. Dưới cùng là nền bê tông minh họa.

### Tuyến khí

Lọc khí → ống mềm hút → van hút → đầu nén → van một chiều → **ống chính** đi xuống, ngang dưới giá máy, lên cửa vào bình tách (đoạn chữ U giảm ứng suất nhiệt, mặt bích giữa đoạn đứng như H4) → bình tách → van áp suất tối thiểu → **ống khí ra** đi trên động cơ, có cột đỡ, qua mặt bích xuyên vách hông phải phía sau tủ điện → van bi → bình tích áp → máy sấy lạnh → đi thấp vòng trước máy sấy lạnh → máy sấy hấp phụ → van bi → mặt bích ra mạng khí nén.

Nhánh khí điều khiển: ống đồng nhỏ trích sau van áp suất tối thiểu tới van điện từ nạp tải trên van hút (H7: load solenoid valve). Điểm trích là giả định.

### Vòng nước bôi trơn (H5, H6)

Cổ nước ra của bình tách (có van chặn) → ống nước nóng dọc vách trái, có cột đỡ → cổ vào két (cổ sau, hướng xuống) → két → cổ ra (cổ trước) → lọc nước nhỏ → van ngắt nước điện từ (H6: đóng ngay khi dừng động cơ) → ống mềm → bộ chia → bốn ống đồng nhỏ tới cửa phun nước và ba điểm bôi trơn ổ của đầu nén. Vị trí ba điểm bôi trơn ổ là giả định (H6 chỉ ghi bộ chia chia nước tới các bộ phận của đầu nén). **Không có bơm**: nước được đẩy bằng áp suất trong bình tách.

### Nước bù và xả (H7)

Nước cấp từ mạng (≥ 0,2 MPa) đi từ sàn lên qua van chặn, đồng hồ → lọc Y → bình làm mềm → van điện từ nước bù song song van tay → cổng nước bôi trơn vào ở hông bệ → ống trong bệ, xuyên khay → cửa nước bù của bình tách.

Xả: van xả tay ở đáy bình tách → **van điện từ xả nước** (H7: drain solenoid valve; dùng lại hình cụm 13) → ống trong bệ → cổng nước bôi trơn ra → ống mềm xuống phễu thu. H7 không cho biết van điện từ xả nối song song hay nối tiếp với van tay; trạm nối tiếp và ghi rõ là chưa xác nhận. Nước rửa ngược của bình làm mềm cũng xả vào phễu thu.

### Điện

Máng cáp treo dưới két dẫn cáp van điện từ nạp tải, van ngắt nước, công tắc mức và van nước bù (từ ngoài gói) vào hông tủ điện. Cáp van xả đi sát khay vào hông tủ. Hai cáp động cơ đi từ đáy tủ vào trong bệ, xuyên khay lên hộp đấu điện; cáp quạt két vào nóc tủ; cáp nguồn chính vào đáy tủ qua vách bệ. Đường đi cáp là minh họa.

### Thông số của trạm

| Khóa | Giá trị | Ý nghĩa |
| --- | --- | --- |
| `enclosure` | `'mo'` (mặc định) / `'dong'` | Khung hở như H1 / có vỏ bao che như H9 (lỗ ống khí ra ở tấm hông phải phía sau) |
| `airflow` | `'len'` (mặc định) / `'xuong'` | Chiều gió qua két (giả định, xem phần 11) |
| `external` | `'co'` (mặc định) / `'khong'` | Có hay không chuỗi bình tích áp – máy sấy lạnh – máy sấy hấp phụ |

```js
const st = buildModel('station', { enclosure: 'dong', airflow: 'len', external: 'co' });
st.info.modules  // danh sách cụm đã ghép và tỷ lệ
st.info.links    // 29 mối nối: từ cổng nào tới cổng nào, bằng ống gì; ghép trực tiếp có khe hở 0
```

Trạm có các cổng ra ngoài: khí nén khô ra mạng, nước cấp vào trạm, thoát nước sàn, cáp nguồn vào tủ điện.

### Những gì chưa có hoặc là giả định

- Lọc nước tổ hợp (H10) **không** ghép vào trạm: H10 là phương án tham khảo riêng, không mặc định nối tiếp với lọc H9.
- Không có bộ trao đổi nhiệt dạng tấm (thuộc phương án giải nhiệt nước ở H6), không có bơm, không có RO.
- Bộ phun (ejector) đặt đúng chỗ H1 ghi nhưng H1 không cho thấy đường nối, nên chỉ dựng thân và hai đầu nối bịt.
- Vị trí cụm, cao độ, đường đi ống và cáp, kết cấu giá máy, giá treo, giá đỡ, máng cáp, bu lông neo, nền là ước lượng hoặc minh họa (57 nhóm có nhãn minh họa trong trạm, gồm cả nhóm minh họa của các cụm con).
- Thiết bị ngoài là mẫu tổng quát, không theo model cụ thể; không có sơ đồ van của nhà sản xuất.

## 5. Danh sách 18 cụm và ID

| ID | Cụm | Chi tiết đáng chú ý |
| --- | --- | --- |
| `rotor` | Một trục vít, hai bánh sao | Rãnh sinh theo động học từ răng bánh sao; bậc trục, vai trục, ngõng phớt/ổ, rãnh then hở đầu và then, ren xoắn thật và đai ốc khóa, vòng giữ chữ C; đĩa răng (chân răng bo, đỉnh cung tròn, mép vát), giá đỡ, moay-ơ, vòng kẹp, trục đỡ |
| `airend` | Đầu nén | Vỏ đúc rỗng dựng bằng CSG: khoang trục vít, hai khoang bánh sao, khoang hút, bậc lắp ổ/phớt, cửa hút trên, cửa xả dưới, gân; nắp hông có gioăng, nắp ổ bánh sao, nắp đầu xả có gân và chân đỡ, nắp ổ gân, chuông nối động cơ có cửa sổ; ổ lăn, phớt, vòi phun nước; ba đầu nối nước bôi trơn ổ (minh họa) |
| `motor` | Động cơ và khớp nối | Thân gang có gân, nắp đầu mặt bích khớp chuông nối, nắp đầu sau có gân, bốn chân đế có lỗ neo, hộp đấu điện rỗng có nắp và cầu đấu, đầu cáp, bu lông vòng, biển tên, nắp quạt lưới nan, quạt làm mát, stato/roto/ổ bi minh họa, khớp nối vấu hai nửa + đệm sao, nắp che hai nửa (bỏ khi ghép với chuông nối) |
| `separator` | Bình tách khí–nước (trong máy) | Vỏ rỗng hai đáy elip 2:1, cổ nối hàn xuyên vỏ, chân và giằng, tai cẩu, mặt bích, van an toàn, đồng hồ, công tắc mức, kính mức có van góc và thước, van xả đáy, cổ nước ra két có van chặn, cửa nước bù; vách hướng dòng, vách ngăn, lưới tách giọt, tấm chống xoáy (minh họa) |
| `cooler` | Két nóc và hai quạt | Vỏ tôn hai tầng bắt vít, lõi ống – lá 241 lá và 84 ống, hai hộp góp (hộp trái có vách ngăn, két hai lượt), hai cổ nước hướng xuống có mặt bích, lưới nóc ô vuông; hai quạt hướng trục 6 cánh cong có vành hướng gió, động cơ treo, giá và lưới bảo vệ; cáp quạt; chiều gió là tham số |
| `air-filter` | Lọc khí hút (H8) | Vỏ có cổ ra và cửa vào tiếp tuyến có lưới, đai ôm, chân bắt; nắp gân, gioăng, đai ốc tai; lõi giấy 120 nếp có nắp cao su và ống lưới; đai ốc giữ lõi; trục ren |
| `water-filter` | Lọc nước nhỏ (H9) | Đầu lọc cố định, đai giữ cốc (keeper), cốc tháo xuống, lõi 72 nếp, trục ren và đế giữ lõi, nút xả đáy |
| `combined-filter` | Lọc nước tổ hợp (H10) | Thùng trên ba chân, van xả đáy, nắp chỏm 16 bu lông, bộ giữ lõi, lõi lọc sâu, đệm mềm, đĩa ép và đai ốc |
| `softener` | Nước bù và làm mềm (H7) | Bình làm mềm, ống phân phối và hạt nhựa (minh họa), đầu điều khiển, lọc Y đầu vào, van điện từ nước bù song song van tay, ống xả rửa ngược |
| `inlet` | Van hút | Thân, mặt bích vuông khớp cửa hút, cổ hút có vành ống mềm, đĩa bướm và trục (minh họa), xy lanh điều khiển, van điện từ nạp tải (H7) |
| `minimum` | Van áp suất tối thiểu | Thân, mặt bích vào khớp cổ khí ra bình tách, cửa ra bên hông, nắp lò xo có vít chỉnh, piston – lò xo – đế van (minh họa), đồng hồ đường ra |
| `check` | Van một chiều | Thân, mặt bích vuông khớp cửa xả, cửa ra tròn, đế van, đĩa nấm và lò xo (minh họa), nút xả |
| `water-valve` | Van ngắt nước (H6) | Thân đồng hai cửa ren, cuộn điện từ có đầu nối DIN, lõi từ và màng van (minh họa) |
| `distributor` | Bộ chia nước | Khối chia một vào bốn ra, ren nối |
| `chassis` | Khung, tủ điện, vỏ bao che | Bệ thép chữ U có rãnh xe nâng, dầm ngang, khay hứng nước có lỗ xả, cổng nước bôi trơn vào/ra ở hông bệ; cột góc, dầm đỉnh, ke; tủ điện có cửa, lá gió, thiết bị bên trong (minh họa); bảng điều khiển, nút dừng khẩn cấp; tùy chọn vỏ bao che có cửa, lá gió, lỗ ống khí ra |
| `receiver` | Bình tích áp khí nén (bên ngoài) | Vỏ rỗng, ba chân, tai cẩu, cổ vào thấp và ra cao có mặt bích, cửa thăm, van an toàn, đồng hồ có ống xi phông, xả đáy tay và tự động, biển tên |
| `dryer` | Máy sấy lạnh | Tủ có các tấm tháo được, lá gió, bảng điều khiển; bên trong (minh họa): máy nén môi chất, dàn ngưng và quạt, khối trao đổi nhiệt khí–khí và bay hơi, bộ tách nước và xả tự động, ống môi chất, phin lọc, van tiết lưu, van nhánh nóng |
| `desiccant` | Máy sấy hấp phụ hai tháp | Khung đế, hai tháp, hạt hút ẩm và lưới (minh họa), cụm van vào và van xả tái sinh, van một chiều, ống ra và đường tái sinh, bộ giảm thanh, bộ điều khiển |

## 6. Trục vít và bánh sao: mô hình động học

Cơ cấu theo H2/H3: **một trục vít** nằm theo trục X, **hai bánh sao** nằm trên mặt phẳng ngang chứa trục vít, tâm cách trục vít khoảng A ở hai phía (Z = ±A), trục quay song song Y, tức vuông góc với trục vít. Hai bánh sao ở cùng vị trí dọc trục, quay ngược chiều nhau; tốc độ mỗi bánh sao bằng z1/z2 tốc độ trục vít. Không có cơ cấu hai trục vít song song.

Rãnh trục vít không vẽ tay mà **sinh từ chuyển động của răng bánh sao**: răng được coi là dải phẳng mỏng, cạnh thẳng (rộng dần về chân), nằm trong mặt phẳng chứa trục vít; khi trục vít quay góc θ thì bánh sao quay (z1/z2)·θ. Mặt cắt rãnh trên mỗi mặt phẳng kinh tuyến chính là phần răng nằm trong trụ vít ở thời điểm kinh tuyến đó đi qua mặt phẳng bánh sao. Lưới thân vít ghép 720 mặt cắt như vậy, nên rãnh có chiều sâu, bề rộng, mép vát và đoạn thoát rãnh liên tục; răng hai bánh sao luôn nằm trong rãnh khi chạy cơ cấu. Phép thử tự động lấy mẫu hàng chục nghìn điểm trên răng và giá đỡ ở nhiều góc quay, với nhiều bộ tham số, và xác nhận không điểm nào cắt vào thân vít.

Giới hạn: đây là **mô hình động học lý tưởng**, chưa phải biên dạng bao chế tạo. Chưa tính chiều dày thật và vát cạnh hiệu chỉnh của răng, khe hở chế tạo (khe hở trong mô hình được phóng đại để nhìn thấy), biến dạng, giãn nở nhiệt, đường bao kín khí, cửa xả hình học. Rãnh thoát ra mặt trụ ở cả hai đầu thân vít để hình học khép kín; máy thật thường để rãnh hở ở đầu hút.

Tham số (bảng **Thông số** trong trình xem, hoặc `buildModel('rotor', {...})`; cụm `airend` dùng chung và tự co giãn vỏ theo; trạm dùng giá trị mặc định):

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

Trong mô hình động học, **góc xoắn không phải tham số độc lập**: nó là hệ quả của z1/z2, R1, R2 và h. Trình xem hiện giá trị dẫn xuất dưới tên cụm, ví dụ “A = 1,33 · L = 1,51 · 6/11 · quấn ≈ 225°”. Muốn đổi độ xoắn, đổi tỷ số rãnh/răng hoặc chiều sâu rãnh. Tham số không hợp lệ (ví dụ rãnh sâu hơn 0,7·R2, số rãnh ≥ số răng) bị từ chối kèm lý do và mô hình trở về mặc định.

## 7. Sửa mã vẽ ở đâu?

| Tệp | Nội dung |
| --- | --- |
| `geometry.js` | Vật liệu; khối tròn xoay `revolveGeometry`; ren xoắn `threadGeometry`; lò xo `springGeometry`; ống gân `hoseGeometry`; ống uốn `pipe`; trục có rãnh then, then; ổ lăn, phớt môi, vòng giữ, đai ốc khóa; CSG `csgGeometry` (có bộ nhớ đệm theo khóa) và cắt mặt cắt `sectionGeometry`; cổng nối `port`; mô hình động học trục vít |
| `models.js` | Danh mục, tham số chỉnh được, mã lắp từng cụm, **mã ghép trạm** (`station`, các hàm `place`, `mateTo`, `portOf`, `run`, `hose`, `cableRun`, `avMount`, `pipeStand`), cổng nối, hướng tách cụm, hoạt ảnh; `setSection`, `showPorts`, `setAirflow` |
| `viewer.js` | Camera, ánh sáng và bóng đổ theo cỡ mô hình, thông báo chờ khi dựng lâu, chọn chi tiết, mặt cắt, bảng tham số, cổng nối, xuất GLB |
| `index.html`, `style.css` | Giao diện |
| `vendor/` | Three.js 0.180.0, OrbitControls, GLTFExporter; three-mesh-bvh 0.9.7 và three-bvh-csg 0.0.18 (đường dẫn nhập đã đổi sang tệp cục bộ) |
| `tests/models.test.mjs` | 15 phép thử tự động (phần 10) |
| `export-models.mjs` | Xuất GLB và `manifest.json` (có cổng nối; trạm có thêm danh sách cụm và mối nối) |
| `build-standalone.py` | Gói MO-NGAY.html |

Mỗi cụm là một hàm trong models.js. Kích thước trong cụm `rotor`/`airend` tính theo R1, R2, A và chiều dài thân vít. Kích thước gói máy là hằng `PKG` (bệ, khung, lỗ ống khí ra), kích thước giá máy và tỷ lệ bình tách trong trạm là hằng `ST`. Vị trí trong trạm đều tính từ cổng của cụm: đổi kích thước một cụm thì ống nối vẫn bám đúng cổng.

## 8. Đưa vào dự án Three.js

### Cách A: dựng bằng mã

Sao chép `geometry.js`, `models.js` và thư mục `vendor/` (cần cả hai tệp three-bvh) vào dự án; dùng cùng một bản Three.js 0.180.0.

```js
import { THREE } from './geometry.js';
import { buildModel, setExplosion, updateMotion, setSection, showPorts, setAirflow } from './models.js';

const model = buildModel('airend', { grooves: 6, gateTeeth: 11, grooveDepth: 0.33 });
scene.add(model.root);
setExplosion(model, 0.5);          // 0…1
setSection(model, true);           // cắt vỏ; cần renderer.localClippingEnabled = true
showPorts(model, true);            // hiện dấu cổng nối
updateMotion(model, elapsedSeconds); // gọi trong vòng lặp vẽ

const station = buildModel('station', { enclosure: 'mo' }); // khoảng 10 giây
setAirflow(station, 'xuong');      // đảo chiều gió
```

Trường của mô hình: `parts` (nhóm có tên, `userData.minhHoa` đánh dấu cấu tạo minh họa), `solids` (vỏ cắt bằng CSG), `covers` (vỏ mỏng dùng mặt phẳng cắt), `explodables`, `motions`, `ports`, `info` (`kin` là kết quả động học, `summary` là dòng tóm tắt; trạm có thêm `modules` và `links`).

### Cách B: nạp GLB

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
new GLTFLoader().load('/models/station.glb', gltf => scene.add(gltf.scene));
```

GLB chứa hình học, nhóm có tên, vật liệu ở trạng thái lắp, cùng các nút rỗng “Cổng: …” (hướng nối là trục +Z cục bộ của nút; thông tin ở `extras.port`) và cờ `extras.minhHoa`. Hoạt ảnh, mặt cắt, tách cụm và hạt gió không ghi vào GLB. `station.glb` khoảng 32 MB, khoảng 1,3 triệu tam giác.

## 9. Cổng nối

Mỗi cụm có danh sách cổng (`model.ports`, nút “Cổng: …” trong GLB, mục `ports` trong `models-glb/manifest.json` với tọa độ và hướng theo hệ của cụm). Loại cổng: `khi`, `nuoc`, `co-khi`, `dien`. Ví dụ:

| Cụm | Cổng | Vị trí (x, y, z) | Hướng |
| --- | --- | --- | --- |
| `airend` | Cửa hút khí (lắp van hút) | (0,41; 1,20; 0) | +Y |
| `airend` | Cửa xả khí–nước (tới van một chiều) | (−0,45; −1,20; 0) | −Y |
| `airend` | Mặt bích nối động cơ | (3,35; 0; 0) | +X |
| `motor` | Mặt bích nối chuông đầu nén | (1,84; 0; 0) | +X |
| `separator` | Vào hỗn hợp khí–nước | (−1,13; 3,30; 0,30) | −X |
| `separator` | Khí ra (tới van áp suất tối thiểu) | (0; 4,26; 0) | +Y |
| `cooler` | Nước nóng vào két / nước đã làm mát ra | (−8,75; −0,23; ∓3,05) | −Y |

Ghép hai cụm: đặt cổng của hai cụm trùng vị trí và ngược hướng (hàm `mateTo` trong models.js). Trong trạm, bốn mặt ghép trực tiếp (động cơ – chuông nối, van hút, van một chiều, van áp suất tối thiểu) được phép thử xác nhận khe hở bằng 0; các mối nối còn lại đi bằng ống có hai đầu đặt đúng tại cổng.

## 10. Kiểm tra và xuất lại

Cần Node.js 18 trở lên; thư viện đã đóng kèm, không cần `npm install`.

```bash
node --test tests/models.test.mjs        # 15 phép thử (dưới một phút)
node export-models.mjs                    # xuất lại 18 cụm + trạm thành GLB và manifest.json
node export-models.mjs station --tham-so '{"enclosure":"dong"}' --ra ./ket-qua   # xuất riêng với tham số
python3 build-standalone.py               # dựng lại MO-NGAY.html
```

Phép thử gồm: 19 mô hình có hình học hữu hạn, chỉ số hợp lệ; đúng một trục vít và hai bánh sao trục vuông góc, đúng tỷ số; răng và giá đỡ bánh sao không cắt vào thân vít khi quay với bốn bộ tham số; biên dạng rãnh không chồng lấn, tham số sai bị từ chối; vỏ đầu nén và bình tách rỗng, mặt cắt CSG có mặt cắt riêng; động cơ có khớp nối, nắp che, nắp quạt tháo được, mặt bích khớp với đầu nén; két có hai quạt dưới lõi, đảo chiều gió đổi chiều hạt và quạt; mọi mô hình có cổng nối, dấu cổng không lọt vào GLB; không có bơm, không có RO; tách cụm trả đúng vị trí; pháp tuyến hướng ra ngoài. Riêng trạm: đủ 16 cụm, không ghép lọc H10, một trục vít và hai bánh sao, bình tách trong gói và bình tích áp ngoài gói là hai bình khác nhau, bốn mặt ghép trực tiếp khe hở 0, vòng nước và tuyến khí nối đúng cổng, két nằm trên bình tách, không có bộ trao đổi nhiệt dạng tấm, trục động cơ quay cùng trục vít, mặt cắt bằng mặt phẳng được gỡ khi chuyển mô hình.

Trong môi trường tạo gói đã chạy đủ các phép thử trên, xuất GLB, mở index.html bằng Chromium không giao diện (WebGL phần mềm) để chụp ảnh trạm ở chế độ lắp, mặt cắt, tách cụm, có vỏ bao che. Thời gian dựng: trạm khoảng 8–10 giây, `airend` khoảng 2–3 giây (CSG).

## 11. Căn cứ theo bản vẽ, giả định và giới hạn

| Ảnh | Cách sử dụng |
| --- | --- |
| H1 | Bố trí tổng thể trạm: két gió trên nóc, quạt dưới két, lọc nước góc trái trên, đầu nén bên trái, van hút và bộ chia trên đầu nén, lọc khí trên động cơ, bình tách phía trước, tủ điện bên phải, bệ có cổng nước bôi trơn vào/ra, bộ phun; ống khí ra, ống mềm hút |
| H2 | Mặt cắt đầu nén: bánh sao nằm ngang trong khoang bên, ổ đỡ trên dưới trục bánh sao, đầu trục vít có ren, cửa phun nước và cửa hút |
| H3 | **Một trục vít và hai bánh sao trên trục vuông góc**, đầu trục có rãnh then và đầu có ren |
| H4 | Hình ngoài đầu nén; van hút phía trên, van một chiều phía dưới; ghế đỡ; ống chính chữ U có mặt bích; bình tách và van áp suất tối thiểu |
| H5 | Két gió hai quạt dưới két; vòng nước bình tách → két → lọc nước → bộ chia → đầu nén |
| H6 | Van ngắt nước, bộ chia, lọc nước, ống chính; phần trao đổi nhiệt dạng tấm thuộc **phương án giải nhiệt nước**, không đưa vào trạm két gió |
| H7 | Nước cấp ≥ 0,2 MPa, lọc Y, làm mềm, van điện từ nước bù và van tay, van điện từ xả và van xả tay, công tắc mức, van điện từ nạp tải; **không diễn giải thành RO** |
| H8 | Thứ tự tháo lọc khí |
| H9 | Lọc nước nhỏ; vỏ bao che có cửa, lá gió |
| H10 | Lọc nước tổ hợp, **cụm tham khảo riêng**, không mặc định nối tiếp với lọc H9 và không ghép vào trạm |

Giả định và giới hạn chính:

- **Chiều gió**: H1/H5 không có mũi tên. Mặc định gió đi từ dưới lên qua két là giả định; đổi bằng tham số `airflow` hoặc nút Đảo chiều gió. Cần xác nhận theo tài liệu máy.
- **Bình tách** (trong máy) và **bình tích áp** (bên ngoài) là hai cụm riêng.
- Không thêm bơm nước hay thiết bị không có trong ảnh. Van bi chặn, đồng hồ đường nước cấp, phễu thu, cột đỡ ống, máng cáp là phụ kiện lắp đặt thông thường, gắn nhãn minh họa.
- **Cấu tạo minh họa** (gắn nhãn trong trình xem và cờ `minhHoa` trong GLB): giá đỡ bánh sao, loại và cỡ ổ lăn, phớt, đai ốc khóa, vòng giữ, vòi phun nước trong vỏ, đầu nối nước bôi trơn ổ, stato/roto/ổ bi động cơ, khớp nối vấu, cầu đấu dây, nội thất bình tách, bên trong các van, thiết bị trong tủ điện, hệ lạnh của máy sấy lạnh, hạt hút ẩm và van của máy sấy hấp phụ, hạt nhựa làm mềm; trong trạm: giá máy, giá đỡ, giá treo, đường đi cáp, ống khí điều khiển, ống chia nước, bộ phun, bu lông neo, nền.
- Kích thước được ước lượng từ ảnh không ghi kích thước; độ dày thành được phóng đại vừa đủ để nhìn thấy. Màu là màu minh họa.
- Bình tích áp, máy sấy lạnh, máy sấy hấp phụ là mẫu tổng quát vì bộ ảnh chưa có bản vẽ riêng.

Muốn chính xác theo máy thật cần kích thước, số rãnh/răng xác nhận, bản vẽ mặt cắt hoặc tệp STEP/IGES/DXF, sơ đồ đường ống và điện của nhà sản xuất. Mô hình phục vụ xem cấu tạo và phát triển mô phỏng; không dùng để gia công, tính bền hay chọn áp suất làm việc.

## Lịch sử

- **3.0**: trạm hoàn chỉnh `station` ghép 16 cụm với ống, ống mềm, mặt bích, van bi, giá máy chống rung, ghế đỡ, giá đỡ, máng cáp và cáp, nước bù – xả theo H7, chuỗi khí nén ngoài; tham số vỏ bao che, chiều gió, thiết bị ngoài; mặt cắt bằng mặt phẳng cho trạm. Nâng chi tiết két, khung – tủ điện – vỏ bao che, van hút, van áp suất tối thiểu, van một chiều, van ngắt nước, bộ chia, lọc khí, lọc nước, lọc tổ hợp, cụm làm mềm, bình tích áp, máy sấy lạnh, máy sấy hấp phụ; các cụm này dựng ở tỷ lệ trạm. Trình xem mở sẵn trạm, có thông báo chờ, bóng đổ theo cỡ mô hình.
- **2.0**: rãnh trục vít sinh theo động học và kiểm tra không va chạm; vỏ đầu nén rỗng dựng bằng CSG; động cơ, khớp nối, bình tách chi tiết; mặt cắt CSG; tham số chỉnh trong trình xem; cổng nối cho 18 cụm; chiều gió đảo được; nhãn minh họa.
- **1.0**: 18 cụm, trình xem, xuất GLB, bản một tệp.

## Giấy phép

Mã ứng dụng: LICENSE-APP.txt. Three.js và addon: vendor/LICENSE.txt. three-mesh-bvh, three-bvh-csg: vendor/LICENSE-three-bvh.txt (MIT). Các ảnh trong `references/` là ảnh người dùng cung cấp để đối chiếu, không thuộc giấy phép MIT của mã.
