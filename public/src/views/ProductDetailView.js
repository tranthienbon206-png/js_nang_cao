import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

/* Tên hiển thị đẹp cho các khóa thông số (cpu to CPU (Vi xử lý), ...) */
const SPEC_LABELS = {
  cpu: 'CPU (Vi xử lý)',
  gpu: 'VGA (Card đồ họa)',
  vga: 'VGA (Card đồ họa)',
  mainboard: 'Mainboard (Bo mạch chủ)',
  mobo: 'Mainboard (Bo mạch chủ)',
  ram: 'RAM (Bộ nhớ)',
  storage: 'Ổ cứng',
  ssd: 'Ổ cứng SSD',
  hdd: 'Ổ cứng HDD',
  psu: 'Nguồn (PSU)',
  case: 'Vỏ case',
  cooler: 'Tản nhiệt',
  monitor: 'Màn hình',
};
const specLabel = (key) => SPEC_LABELS[String(key).trim().toLowerCase()] || key;

export default class ProductDetailView extends BaseView {
  render(p, categoryName = '') {
    // Tự động tính toán giá gốc và % giảm giá
    const originalPrice = p.originalPrice || (p.price ? Math.round(p.price * 1.12) : null);
    const discountPercent = originalPrice && originalPrice > p.price
      ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
      : 0;

    // Danh sách ảnh phụ: ưu tiên p.gallery nếu có, nếu không dùng ảnh chính
    const galleryImages = Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : [p.image];

    // Trích xuất thông số kỹ thuật từ p.specs hoặc tự động phân tích từ p.description
    const specs = p.specs || this._extractSpecs(p.description);
    const specEntries = Object.entries(specs);

    this.setHTML(`
      <style>
        /* ===== Reset cục bộ: chặn CSS toàn trang (.detail, .btn, .price, input, img...) làm vỡ layout ===== */
        .pc-detail-container,
        .pc-detail-container *,
        .pc-detail-container *::before,
        .pc-detail-container *::after { box-sizing: border-box; }

        .pc-detail-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 24px 60px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
        }

        .pc-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 20px;
          color: #64748b;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 4px;
        }

        .pc-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .pc-back-btn:hover { background-color: #dbeafe; color: #1d4ed8; }

        .pc-crumb-name {
          display: inline-block;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: bottom;
          color: #94a3b8;
        }

        /* Thẻ chính: ép display:block để không bị rule .detail của trang kéo thành lưới 2 cột */
        .pc-detail-container .pc-detail-card {
          display: block;
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          padding: 28px;
        }

        .pc-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 36px;
          width: 100%;
        }

        @media (min-width: 900px) {
          .pc-grid-layout { grid-template-columns: minmax(0, 460px) minmax(0, 1fr); }
        }

        /* --- Cột trái --- */
        .pc-media-column { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

        .pc-main-image-wrap {
          position: relative;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 1 / 1;
        }

        .pc-detail-container .pc-main-image-wrap img {
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pc-main-image-wrap:hover img { transform: scale(1.05); }

        .pc-badge-discount {
          position: absolute; top: 14px; left: 14px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff; font-weight: 800; font-size: 12px;
          padding: 4px 10px; border-radius: 6px;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }
        .pc-badge-hot {
          position: absolute; top: 14px; right: 14px;
          background: #2563eb; color: #fff; font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 6px;
        }

        .pc-thumbnails { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
        .pc-thumb-item {
          width: 72px; height: 72px; flex: 0 0 72px;
          border-radius: 10px; border: 2px solid #e2e8f0;
          cursor: pointer; overflow: hidden; background: #fff; transition: all 0.2s;
        }
        .pc-thumb-item.active, .pc-thumb-item:hover {
          border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .pc-detail-container .pc-thumb-item img { display: block; width: 100%; height: 100%; object-fit: cover; }

        .pc-trust-box {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 4px;
          padding-top: 16px;
          border-top: 1px dashed #cbd5e1;
        }
        .pc-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #334155; background: #f8fafc;
          padding: 8px 12px; border-radius: 8px; border: 1px solid #f1f5f9; min-width: 0;
        }
        .pc-trust-item small { display: block; font-size: 11px; color: #64748b; }

        /* --- Cột phải --- */
        .pc-info-column { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

        .pc-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .pc-category-tag {
          background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700;
          padding: 4px 10px; border-radius: 20px; border: 1px solid #dbeafe; text-transform: uppercase;
        }
        .pc-status-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #16a34a; }
        .pc-sku { font-size: 12px; color: #94a3b8; }

        .pc-title { font-size: 24px; font-weight: 800; line-height: 1.35; color: #0f172a; margin: 0; }

        .pc-rating-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; color: #64748b; }
        .pc-price-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%);
          border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px;
          display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px;
        }
        .pc-detail-container .pc-price-current {
          font-size: 32px; font-weight: 900; color: #1d4ed8; letter-spacing: -0.5px; line-height: 1.1;
        }
        .pc-price-old { font-size: 16px; color: #94a3b8; text-decoration: line-through; }
        .pc-price-vat { width: 100%; font-size: 12px; color: #0369a1; font-weight: 500; }

        .pc-quick-specs { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; }
        .pc-quick-specs h4 {
          margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #1e3a8a; font-weight: 700;
        }
        .pc-spec-chips {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
        }
        .pc-spec-chip {
          display: flex; align-items: baseline; gap: 6px; min-width: 0;
          font-size: 12.5px; color: #334155; background: #f8fafc;
          padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;
        }
        .pc-spec-chip strong { color: #1d4ed8; white-space: nowrap; flex: none; }
        .pc-spec-chip span { min-width: 0; overflow-wrap: anywhere; }

        .pc-promo-box { background: #fff; border: 1px solid #bfdbfe; border-radius: 12px; overflow: hidden; }
        .pc-promo-header {
          background: #2563eb; color: #fff; padding: 10px 16px;
          font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
        }
        .pc-promo-list {
          padding: 12px 16px; margin: 0; list-style: none; font-size: 13px; color: #334155;
          display: flex; flex-direction: column; gap: 8px;
        }
        .pc-promo-list li { line-height: 1.45; }

        .pc-action-section { display: flex; flex-direction: column; gap: 14px; padding-top: 6px; }
        .pc-qty-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
        .pc-qty-label { font-size: 14px; font-weight: 700; color: #334155; }
        .pc-qty-selector {
          display: inline-flex; align-items: center; border: 1px solid #cbd5e1;
          border-radius: 8px; overflow: hidden; background: #fff;
        }
        .pc-qty-btn {
          width: auto; height: 40px; background: #f8fafc; border: none; color: #334155;
          font-size: 12px; font-weight: 600; cursor: pointer; padding: 0 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .pc-qty-btn:hover { background: #e2e8f0; color: #2563eb; }

        /* Giữ id="qty"; ép kích thước để input không bị bóp bởi CSS toàn trang */
        .pc-detail-container .pc-qty-input {
          width: 56px; min-width: 56px; max-width: 56px; height: 40px; margin: 0; padding: 0;
          border: none; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-radius: 0;
          text-align: center; font-size: 15px; font-weight: 700; color: #0f172a;
          background: #fff; outline: none; box-shadow: none; -moz-appearance: textfield;
        }
        .pc-qty-input::-webkit-outer-spin-button,
        .pc-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

        .pc-buttons-group { display: flex; flex-wrap: wrap; gap: 12px; }

        /* Giữ class="btn" và id="btn-add"; tăng specificity để thắng .btn toàn trang */
        .pc-detail-container .pc-btn-add {
          flex: 1 1 190px; height: 48px; padding: 0 20px;
          background: #2563eb; color: #fff; font-size: 15px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); transition: all 0.2s ease;
        }
        .pc-detail-container .pc-btn-add:hover {
          background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
        }

        /* --- Bảng thông số & mô tả (nằm full chiều ngang bên dưới) --- */
        .pc-tabs-section { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 28px; width: 100%; }
        .pc-section-heading {
          font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .pc-section-heading::before { content: ""; width: 4px; height: 18px; background: #2563eb; border-radius: 2px; }

        .pc-specs-table {
          width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;
          border: 1px solid #e2e8f0;
        }
        .pc-specs-table tr:nth-child(even) { background: #f8fafc; }
        .pc-specs-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .pc-specs-table td.spec-name { width: 30%; font-weight: 600; color: #1e3a8a; background: #f1f5f9; }
        .pc-specs-table td.spec-value { color: #334155; }

        .pc-description-content {
          color: #475569; font-size: 14px; line-height: 1.7; white-space: pre-line;
          background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;
        }

        @media (max-width: 560px) {
          .pc-detail-container { padding: 14px 10px 40px; }
          .pc-detail-container .pc-detail-card { padding: 16px; }
          .pc-title { font-size: 20px; }
          .pc-detail-container .pc-price-current { font-size: 26px; }
          .pc-specs-table td.spec-name { width: 38%; }
        }
      </style>

      <div class="pc-detail-container">
        <div class="pc-breadcrumbs">
          <a href="#/" class="pc-back-btn">Quay lại</a>
          <span>/</span>
          <span>Sản phẩm</span>
          ${categoryName ? `<span>/</span><span style="color:#2563eb; font-weight:600;">${escapeHtml(categoryName)}</span>` : ''}
          <span>/</span>
          <span class="pc-crumb-name">${escapeHtml(p.name)}</span>
        </div>

        <!-- Lưu ý: KHÔNG dùng class "detail" ở đây vì CSS toàn trang của bạn biến nó thành lưới 2 cột -->
        <div class="pc-detail-card">
          <div class="pc-grid-layout">

            <!-- Cột trái -->
            <div class="pc-media-column">
              <div class="pc-main-image-wrap">
                <img id="main-product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
                ${discountPercent > 0 ? `<div class="pc-badge-discount">GIẢM ${discountPercent}%</div>` : ''}
                <div class="pc-badge-hot">CHÍNH HÃNG 100%</div>
              </div>

              ${galleryImages.length > 1 ? `
                <div class="pc-thumbnails">
                  ${galleryImages.map((imgUrl, idx) => `
                    <div class="pc-thumb-item ${idx === 0 ? 'active' : ''}" data-src="${escapeHtml(imgUrl)}">
                      <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(p.name)} - góc ${idx + 1}">
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="pc-trust-box">
                <div class="pc-trust-item"><div><strong>Bảo hành 36T</strong><small>Đổi mới 30 ngày</small></div></div>
                <div class="pc-trust-item"><div><strong>Giao nhanh 2H</strong><small>Miễn phí nội thành</small></div></div>
                <div class="pc-trust-item"><div><strong>Kỹ thuật hỗ trợ</strong><small>Cài Game/OS Free</small></div></div>
                <div class="pc-trust-item"><div><strong>Trả góp 0%</strong><small>Xét duyệt siêu tốc</small></div></div>
              </div>
            </div>

            <!-- Cột phải -->
            <div class="pc-info-column">
              <div class="pc-meta-row">
                ${categoryName ? `<span class="pc-category-tag">${escapeHtml(categoryName)}</span>` : ''}
                <span class="pc-status-tag">Còn hàng (Sẵn sàng giao)</span>
                <span class="pc-sku">Mã SP: PC-${escapeHtml(p.id || 'PRO')}</span>
              </div>

              <h2 class="pc-title">${escapeHtml(p.name)}</h2>

              <div class="pc-rating-bar">
                <span style="font-weight:600; color:#334155;">4.9</span>
                <span>(128 đánh giá)</span>
                <span>Đã bán 350+ dàn máy</span>
              </div>

              <div class="pc-price-card">
                <span class="pc-price-current price">${formatPrice(p.price)}</span>
                ${originalPrice && originalPrice > p.price ? `<span class="pc-price-old">${formatPrice(originalPrice)}</span>` : ''}
                <div class="pc-price-vat">Đã bao gồm thuế VAT 10% • Miễn phí vận chuyển toàn quốc</div>
              </div>

              ${specEntries.length > 0 ? `
                <div class="pc-quick-specs">
                  <h4>Cấu hình nổi bật</h4>
                  <div class="pc-spec-chips">
                    ${specEntries.slice(0, 6).map(([key, val]) => `
                      <div class="pc-spec-chip">
                        <strong>${escapeHtml(specLabel(key))}:</strong>
                        <span>${escapeHtml(val)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="pc-action-section">
                <div class="pc-qty-row">
                  <span class="pc-qty-label">Số lượng:</span>
                  <div class="pc-qty-selector">
                    <button type="button" class="pc-qty-btn" id="btn-qty-minus" aria-label="Giảm số lượng">Giảm</button>
                    <input id="qty" class="pc-qty-input" type="number" min="1" value="1" inputmode="numeric" aria-label="Số lượng">
                    <button type="button" class="pc-qty-btn" id="btn-qty-plus" aria-label="Tăng số lượng">Tăng</button>
                  </div>
                  <span style="font-size:12px; color:#64748b;">(Kho còn hơn 15 bộ sẵn linh kiện)</span>
                </div>

                <div class="pc-buttons-group">
                  <button class="btn pc-btn-add" id="btn-add" type="button">Thêm vào giỏ</button>
                </div>
              </div>

              <div class="pc-promo-box">
                <div class="pc-promo-header">QUÀ TẶNG &amp; ƯU ĐÃI ĐỘC QUYỀN</div>
                <ul class="pc-promo-list">
                  <li>Tặng Bàn phím cơ &amp; Pad chuột Gaming khổ lớn chuyên dụng</li>
                  <li>Tặng Gói bảo trì định kỳ, vệ sinh máy &amp; tra keo tản nhiệt trọn đời</li>
                  <li>Giảm thêm 300.000 ₫ khi mua kèm Màn hình Gaming từ 144Hz trở lên</li>
                  <li>Hỗ trợ cân màu màn hình đồ họa chuyên sâu &amp; tối ưu hóa Windows 11</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Bảng cấu hình chi tiết & mô tả: nằm ngoài lưới, luôn full chiều ngang -->
          <div class="pc-tabs-section">
            ${specEntries.length > 0 ? `
              <h3 class="pc-section-heading">Bảng thông số linh kiện chi tiết</h3>
              <table class="pc-specs-table">
                <tbody>
                  ${specEntries.map(([label, val]) => `
                    <tr>
                      <td class="spec-name">${escapeHtml(specLabel(label))}</td>
                      <td class="spec-value">${escapeHtml(val)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            <h3 class="pc-section-heading">Mô tả chi tiết sản phẩm</h3>
            <div class="pc-description-content">${escapeHtml(p.description || '')}</div>
          </div>
        </div>
      </div>
    `);

    this._attachInteractiveHandlers();
  }

  /** Giữ nguyên signature bindAddToCart(handler) để tương thích với Controller */
  bindAddToCart(handler) {
    const readQty = () => Math.max(1, Math.floor(Number(this.$('#qty')?.value)) || 1);

    this.$('#btn-add')?.addEventListener('click', () => handler(readQty()));
  }

  _attachInteractiveHandlers() {
    const qtyInput = this.$('#qty');
    const readQty = () => Math.max(1, Math.floor(Number(qtyInput?.value)) || 1);

    this.$('#btn-qty-minus')?.addEventListener('click', () => { qtyInput.value = Math.max(1, readQty() - 1); });
    this.$('#btn-qty-plus')?.addEventListener('click', () => { qtyInput.value = readQty() + 1; });
    qtyInput?.addEventListener('change', () => { qtyInput.value = readQty(); });

    // Đổi ảnh chính khi bấm thumbnail (chỉ tìm trong vùng của view này)
    const root = this.$('.pc-detail-container');
    const mainImg = this.$('#main-product-img');
    const thumbs = root ? [...root.querySelectorAll('.pc-thumb-item')] : [];
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-src');
        if (!src || !mainImg) return;
        mainImg.src = src;
        thumbs.forEach(t => t.classList.toggle('active', t === thumb));
      });
    });
  }

  /** Tự trích xuất thông số "Khóa: Giá trị" từ mô tả nếu không có p.specs */
  _extractSpecs(description = '') {
    const specs = {};
    if (!description) return specs;
    for (const rawLine of description.split(/\r?\n/)) {
      const line = rawLine.replace(/^[\s•\-\*]+/, '').trim();
      const i = line.indexOf(':');
      if (i > 0) {
        const key = line.slice(0, i).trim();
        const val = line.slice(i + 1).trim();
        if (key && val && key.length < 30) specs[key] = val;
      }
    }
    return specs;
  }
}