// Gói tích hợp: đưa mô hình máy nén khí trục vít đơn (gói máy hoặc cả trạm) vào một cảnh Three.js khác,
// ví dụ trang theo dõi vận hành. Trang dùng chỉ cần gọi taoMayNenKhi(), thêm `nhom` vào cảnh và gọi capNhat() mỗi khung hình.
// Thư viện dựng ở đơn vị quy ước 1 ≈ 100 mm; mặc định nhân 0,1 để ra mét.
import { THREE } from './geometry.js';
import { CATALOG, buildModel, setExplosion, updateMotion, setSection } from './models.js';

export { THREE, CATALOG, buildModel, setExplosion, updateMotion, setSection };

// Đối tượng quay → nhóm trạng thái điều khiển nó.
const NHOM_QUAY = { 'Trục vít chính': 'may', 'Bánh sao A': 'may', 'Bánh sao B': 'may', 'Trục động cơ': 'may', 'Cánh quạt A': 'quat', 'Cánh quạt B': 'quat', 'Cánh quạt dàn ngưng': 'maySay' };
// Điểm gợi ý để gắn nhãn số liệu: tên chi tiết và vị trí tương đối trong khối bao của nó (0…1 theo x, y, z).
const DIEM_NHAN = {
  dauNen: ['Đầu nén (cụm 02)', [0.5, 1, 0.5], 'Đầu nén: nhiệt độ khí xả, giờ chạy'],
  dongCo: ['Động cơ (cụm 03)', [1, 0.75, 0.5], 'Động cơ: dòng điện, công suất'],
  binhTach: ['Bình tách khí–nước (cụm 04)', [0.5, 0.62, 1], 'Bình tách: áp suất trong bình'],
  apSuatXa: ['Van áp suất tối thiểu (cụm 11)', [0.5, 1, 0.5], 'Áp suất khí ra'],
  mucNuoc: ['Kính mức nước', [0.5, 0.15, 1], 'Mức nước bình tách'],
  ket: ['Két nóc hai quạt (cụm 05)', [0.5, 1, 0.5], 'Két: nhiệt độ nước vào/ra, quạt'],
  locKhi: ['Lọc khí đầu hút (cụm 06)', [0.5, 1, 0.5], 'Lọc khí: chênh áp'],
  locNuoc: ['Lọc nước nhỏ (cụm 07)', [0.5, 0, 0.5], 'Lọc nước: chênh áp'],
  tuDien: ['Tủ điện', [0.5, 1, 1], 'Tủ điện: trạng thái, lỗi'],
  lamMem: ['Cụm nước bù – làm mềm (cụm 09)', [0.5, 1, 0.5], 'Nước bù: áp lực cấp'],
  binhTichAp: ['Bình tích áp (cụm 16)', [0.5, 1, 0.5], 'Bình tích áp: áp suất'],
  maySayLanh: ['Máy sấy lạnh (cụm 17)', [0.5, 1, 0.5], 'Máy sấy lạnh: điểm sương'],
  maySayHapPhu: ['Máy sấy hấp phụ hai tháp (cụm 18)', [0.5, 1, 0.5], 'Máy sấy hấp phụ: tháp đang làm việc'],
};
// Chi tiết nằm kín trong vỏ: ẩn khi xem bình thường để giảm số lần vẽ, hiện lại khi bật mặt cắt.
const BEN_TRONG = /^(Trục vít chính|Bánh sao [AB]$|Stato|Roto|Ổ bi hai đầu|Cơ cấu tách bên trong|Thiết bị trong tủ|Hệ lạnh bên trong|Hạt hút ẩm|Ống phân phối và nhựa|Lõi từ và màng|Piston, lò xo|Đế van|Đĩa bướm|Vòi phun trong vỏ|Cặp ổ bi|Ổ đũa trụ|Ổ đỡ|Phớt trục|Que dò mức|Lõi lọc)/;

/**
 * Dựng máy nén khí để ghép vào cảnh khác.
 * @param {object} tuyChon
 *  phamVi: 'goi-may' (mặc định: gói máy, cụm làm mềm nước) | 'tram' (thêm bình tích áp, máy sấy lạnh, máy sấy hấp phụ)
 *  voBaoChe: false (khung hở như H1) | true (có vỏ bao che như H9)
 *  chieuGio: 'len' | 'xuong' (chiều gió qua két, giả định)
 *  tyLe: 0.1 (ra mét). nen: false (bỏ tấm nền bê tông minh họa). anBenTrong: true (ẩn chi tiết kín trong vỏ cho nhẹ)
 */
export function taoMayNenKhi({ phamVi = 'goi-may', voBaoChe = false, chieuGio = 'len', tyLe = 0.1, nen = false, anBenTrong = true } = {}) {
  const model = buildModel('station', { enclosure: voBaoChe ? 'dong' : 'mo', airflow: chieuGio === 'xuong' ? 'xuong' : 'len', external: phamVi === 'tram' ? 'co' : 'khong' });
  const nhom = new THREE.Group();
  nhom.name = 'Máy nén khí trục vít đơn';
  nhom.add(model.root);
  nhom.scale.setScalar(tyLe);
  const tim = (ten) => model.parts.find((p) => p.name === ten) ?? model.parts.find((p) => p.name.startsWith(ten)) ?? null;
  const tamNen = tim('Nền trạm');
  if (tamNen && !nen) tamNen.visible = false;
  const benTrong = model.parts.filter((p) => BEN_TRONG.test(p.name));
  const hienBenTrong = (hien) => { for (const p of benTrong) p.visible = hien; };
  hienBenTrong(!anBenTrong);
  if (model.flow) model.flow.object.visible = false;
  nhom.updateMatrixWorld(true);

  // Điểm gắn nhãn, lưu theo tọa độ của `nhom` để vẫn đúng khi trang dời hoặc xoay nhóm.
  const diemNhan = {};
  const nghich = new THREE.Matrix4().copy(nhom.matrixWorld).invert();
  for (const [khoa, [ten, [u, v, w], moTa]] of Object.entries(DIEM_NHAN)) {
    const o = tim(ten);
    if (!o) continue;
    const vis = o.visible; o.visible = true;
    const b = new THREE.Box3().setFromObject(o);
    o.visible = vis;
    if (b.isEmpty()) continue;
    const p = new THREE.Vector3(b.min.x + (b.max.x - b.min.x) * u, b.min.y + (b.max.y - b.min.y) * v, b.min.z + (b.max.z - b.min.z) * w).applyMatrix4(nghich);
    diemNhan[khoa] = { ten, moTa, viTri: p };
  }

  // Trạng thái chuyển động
  const pha = { may: 0, quat: 0, maySay: 0 };
  const mo = new Map(); // độ mở 0…1 của van, đĩa, piston
  const cumCua = (o) => { for (let p = o; p; p = p.parent) if (p.userData.module) return p.name; return ''; };
  const dongCo = model.motions.map((a) => ({ a, nhom: NHOM_QUAY[a.object.name] ?? null, cum: cumCua(a.object) }));
  const daToSang = new Map();

  return {
    nhom,
    model,
    diemNhan,
    /** Vị trí (tọa độ thế giới) của điểm gắn nhãn, ví dụ viTriNhan('apSuatXa'). */
    viTriNhan(khoa, ra = new THREE.Vector3()) {
      const d = diemNhan[khoa];
      if (!d) return null;
      nhom.updateMatrixWorld(true);
      return ra.copy(d.viTri).applyMatrix4(nhom.matrixWorld);
    },
    /**
     * Gọi mỗi khung hình. dt: giây. tt: trạng thái đọc được từ máy, ví dụ
     * { chay: true, coTai: true, quat: true, nuoc: true, xaNuoc: false, maySay: true, tocDo: 1, hatGio: false }.
     * Bỏ trống quat, nuoc, maySay thì lấy theo `chay`.
     */
    capNhat(dt, tt = {}) {
      const chay = !!tt.chay, coTai = chay && tt.coTai !== false, tocDo = tt.tocDo ?? 1;
      const bat = { may: chay, quat: tt.quat ?? chay, maySay: tt.maySay ?? chay };
      for (const k of Object.keys(pha)) if (bat[k]) pha[k] += dt * tocDo;
      const k = Math.min(1, dt * 5);
      for (const { a, nhom: n, cum } of dongCo) {
        if (n) { a.object.rotation[a.axis] = a.initial + pha[n] * a.ratio; continue; }
        const dich = a.object.name === 'Lõi từ và màng van (minh họa)' ? (cum.startsWith('Van điện từ xả') ? !!tt.xaNuoc : (tt.nuoc ?? chay)) : coTai;
        const u = (mo.get(a) ?? 0) + ((dich ? 1 : 0) - (mo.get(a) ?? 0)) * k;
        mo.set(a, u);
        if (a.update) a.update(u * Math.PI / 0.8); // đĩa van hút: 0 đóng, 1 mở hết
        else a.object.position[a.axis] = a.origin + u * a.ratio;
      }
      if (model.flow) { model.flow.object.visible = !!tt.hatGio && bat.quat; if (model.flow.object.visible) model.flow.update(pha.quat); }
    },
    /** Tìm chi tiết hoặc cụm theo tên (đúng hoặc bắt đầu bằng), ví dụ chiTiet('Bình tách'). */
    chiTiet: tim,
    /** Danh sách chi tiết chọn được: tên, mô tả, có phải cấu tạo minh họa không. */
    danhSachChiTiet: () => model.parts.map((p) => ({ ten: p.name, moTa: p.userData.description ?? '', minhHoa: !!p.userData.minhHoa })),
    /** Tô sáng một chi tiết (báo lỗi, đang chọn). Gọi lại với mau = null để bỏ. */
    toSang(ten, mau = '#e53935', cuongDo = 0.6) {
      const o = typeof ten === 'string' ? tim(ten) : ten;
      if (!o) return false;
      o.traverse((m) => {
        if (!m.isMesh || m.userData.portMarker || m.parent?.userData.portMarker) return;
        if (mau === null) { if (daToSang.has(m)) { m.material = daToSang.get(m); daToSang.delete(m); } return; }
        if (!daToSang.has(m)) daToSang.set(m, m.material);
        const goc = daToSang.get(m), doi = (x) => { const c = x.clone(); c.emissive = new THREE.Color(mau); c.emissiveIntensity = cuongDo; return c; };
        m.material = Array.isArray(goc) ? goc.map(doi) : doi(goc);
      });
      return true;
    },
    /** Mặt cắt: bỏ góc trên – trước của gói máy để nhìn vào trong (cần renderer.localClippingEnabled = true). */
    matCat(bat) {
      hienBenTrong(bat || !anBenTrong);
      nhom.updateMatrixWorld(true);
      // mặt phẳng dựng trong hệ tọa độ của mô hình rồi chuyển sang thế giới, nên vẫn đúng khi nhóm bị dời, xoay, đổi tỷ lệ
      const s = model.section, mp = [];
      if (bat) for (let i = 0; i < 3; i++) {
        const n = new THREE.Vector3();
        if (Number.isFinite(s.min[i])) { n.setComponent(i, -1); mp.push(new THREE.Plane(n.clone(), s.min[i]).applyMatrix4(model.root.matrixWorld)); }
        if (Number.isFinite(s.max[i])) { n.set(0, 0, 0).setComponent(i, 1); mp.push(new THREE.Plane(n.clone(), -s.max[i]).applyMatrix4(model.root.matrixWorld)); }
      }
      const vatLieu = new Set();
      model.root.traverse((o) => { if (o.isMesh && !o.parent?.userData.portMarker) for (const m of [o.material].flat()) vatLieu.add(m); });
      for (const m of daToSang.values()) for (const x of [m].flat()) vatLieu.add(x);
      for (const m of vatLieu) { m.clippingPlanes = mp; m.clipIntersection = true; m.clipShadows = true; m.needsUpdate = true; }
      return mp;
    },
    /** Tách cụm 0…1: nâng két nóc, mở cửa tủ và tấm vỏ. */
    tachCum: (gt) => setExplosion(model, gt),
    /** Cổng nối ra ngoài trạm (khí nén ra, nước cấp, thoát nước, cáp nguồn) theo tọa độ thế giới. */
    cong() {
      nhom.updateMatrixWorld(true);
      return model.ports.map((p) => ({ ten: p.userData.port.name, loai: p.userData.port.kind, viTri: p.getWorldPosition(new THREE.Vector3()), huong: new THREE.Vector3(0, 0, 1).applyQuaternion(p.getWorldQuaternion(new THREE.Quaternion())) }));
    },
    /** Gỡ khỏi cảnh và giải phóng bộ nhớ. */
    huy() {
      nhom.removeFromParent();
      const geo = new Set();
      nhom.traverse((o) => { if (o.geometry) geo.add(o.geometry); });
      for (const g of geo) g.dispose();
    },
  };
}
