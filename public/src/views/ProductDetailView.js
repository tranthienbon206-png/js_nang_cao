import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

/* Tên hiển thị đẹp cho các khóa thông số trong db.json */
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
  display: 'Màn hình',
  os: 'Hệ điều hành',
  socket: 'Socket',
  cores: 'Số nhân',
  threads: 'Số luồng',
  baseClock: 'Xung nhịp cơ bản',
  boostClock: 'Xung nhịp tối đa',
  maxTurbo: 'Xung nhịp tối đa',
  tdp: 'TDP',
  memoryType: 'Loại RAM hỗ trợ',
  memorySlots: 'Số khe RAM',
  chipset: 'Chipset',
  formFactor: 'Kích thước chuẩn',
  wireless: 'Không dây',
  vram: 'Bộ nhớ VGA',
  interface: 'Chuẩn giao tiếp',
  recommendedPsu: 'Nguồn đề xuất',
  rayTracing: 'Ray Tracing',
  capacity: 'Dung lượng',
  type: 'Loại',
  speed: 'Tốc độ',
  kit: 'Bộ kit',
  latency: 'Độ trễ',
  readSpeed: 'Tốc độ đọc',
  technology: 'Công nghệ',
  wattage: 'Công suất',
  efficiency: 'Hiệu suất',
  modular: 'Dạng dây cáp',
  size: 'Kích thước',
  resolution: 'Độ phân giải',
  refreshRate: 'Tần số quét',
  panel: 'Tấm nền',
  sync: 'Đồng bộ',
  connection: 'Kết nối',
  layout: 'Bố cục',
  lighting: 'Đèn nền',
  spillResistance: 'Chống nước',
  compatibility: 'Tương thích',
  warranty: 'Bảo hành',
};
const specLabel = (key) => SPEC_LABELS[String(key).trim()] || SPEC_LABELS[String(key).trim().toLowerCase()] || key;

// Giá trị thông số có thể là chuỗi, số hoặc boolean
const specValue = (v) => (typeof v === 'boolean' ? (v ? 'Có' : 'Không') : String(v ?? ''));

const PC_CATEGORY_ID = 1; // chỉ PC Gaming mới hiện khối quà tặng

export default class ProductDetailView extends BaseView {
  render(p, categoryName = '') {
    // Chỉ hiện giảm giá khi db có originalPrice thật
    const hasDiscount = Number(p.originalPrice) > Number(p.price);
    const discountPercent = hasDiscount
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;

    // Ảnh phụ: db.json dùng "images" (mảng); hỗ trợ thêm "gallery"
    const list = [p.images, p.gallery].find(a => Array.isArray(a) && a.length);
    const galleryImages = list || [p.image];

    // Thông số: ưu tiên p.specs, không có thì phân tích từ mô tả
    const specs = p.specs || this._extractSpecs(p.description);
    const specEntries = Object.entries(specs);

    const stock = Number(p.stock);
    const soldOut = !(stock > 0);
    this.maxQty = soldOut ? 1 : stock;

    const showRating = Number(p.reviewCount) > 0;

    this.setHTML(`

      <div class="pc-detail-container">
        <div class="pc-breadcrumbs">
          <a href="#/" class="pc-back-btn">Quay lại</a>
          <span>/</span>
          <span>Sản phẩm</span>
          ${categoryName ? `<span>/</span><span class="pc-crumb-cat">${escapeHtml(categoryName)}</span>` : ''}
          <span>/</span>
          <span class="pc-crumb-name">${escapeHtml(p.name)}</span>
        </div>

        <!-- Không dùng class "detail" vì CSS toàn trang biến nó thành lưới 2 cột -->
        <div class="pc-detail-card">
          <div class="pc-grid-layout">

            <!-- Cột trái -->
            <div class="pc-media-column">
              <div class="pc-main-image-wrap">
                <img id="main-product-img" src="${escapeHtml(galleryImages[0] || '')}" alt="${escapeHtml(p.name)}"
                     onerror="this.style.display='none'">
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
                ${p.warrantyMonths ? `<div class="pc-trust-item"><div><strong>Bảo hành ${p.warrantyMonths} tháng</strong><small>Chính hãng</small></div></div>` : ''}
                <div class="pc-trust-item"><div><strong>Giao nhanh 2H</strong><small>Nội thành</small></div></div>
                <div class="pc-trust-item"><div><strong>Đổi trả 30 ngày</strong><small>Lỗi phần cứng 1 đổi 1</small></div></div>
                <div class="pc-trust-item"><div><strong>Trả góp 0%</strong><small>Xét duyệt nhanh</small></div></div>
              </div>
            </div>

            <!-- Cột phải -->
            <div class="pc-info-column">
              <div class="pc-meta-row">
                ${categoryName ? `<span class="pc-category-tag">${escapeHtml(categoryName)}</span>` : ''}
                ${p.brand ? `<span class="pc-category-tag pc-brand-tag">${escapeHtml(p.brand)}</span>` : ''}
                <span class="pc-status-tag ${soldOut ? 'out' : ''}">${soldOut ? 'Hết hàng' : 'Còn hàng (Sẵn sàng giao)'}</span>
                ${p.sku ? `<span class="pc-sku">Mã SP: ${escapeHtml(p.sku)}</span>` : ''}
              </div>

              <h2 class="pc-title">${escapeHtml(p.name)}</h2>

              ${(showRating || Number(p.sold) > 0) ? `
                <div class="pc-rating-bar">
                  ${showRating ? `<span class="pc-rating-score">★ ${Number(p.rating).toFixed(1)}</span><span>(${p.reviewCount} đánh giá)</span>` : ''}
                  ${Number(p.sold) > 0 ? `<span>Đã bán ${p.sold}</span>` : ''}
                </div>` : ''}

              <div class="pc-price-card">
                <span class="pc-price-current price">${formatPrice(p.price)}</span>
                ${hasDiscount ? `<span class="pc-price-old">${formatPrice(p.originalPrice)}</span>` : ''}
                <div class="pc-price-vat">Đã bao gồm thuế VAT</div>
              </div>

              ${specEntries.length > 0 ? `
                <div class="pc-quick-specs">
                  <h4>Cấu hình nổi bật</h4>
                  <div class="pc-spec-chips">
                    ${specEntries.slice(0, 6).map(([key, val]) => `
                      <div class="pc-spec-chip">
                        <strong>${escapeHtml(specLabel(key))}:</strong>
                        <span>${escapeHtml(specValue(val))}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="pc-action-section">
                <div class="pc-qty-row">
                  <span class="pc-qty-label">Số lượng:</span>
                  <div class="pc-qty-selector">
                    <button type="button" class="pc-qty-btn" id="btn-qty-minus" aria-label="Giảm số lượng" ${soldOut ? 'disabled' : ''}>-</button>
                    <input id="qty" class="pc-qty-input" type="number" min="1" max="${this.maxQty}" value="1" inputmode="numeric" aria-label="Số lượng" ${soldOut ? 'disabled' : ''}>
                    <button type="button" class="pc-qty-btn" id="btn-qty-plus" aria-label="Tăng số lượng" ${soldOut ? 'disabled' : ''}>+</button>
                  </div>
                  <span class="pc-qty-note">${soldOut ? 'Tạm hết hàng' : `(Còn ${stock} sản phẩm)`}</span>
                </div>

                <div class="pc-buttons-group">
                  <button class="btn pc-btn-add" id="btn-add" type="button" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Hết hàng' : 'Thêm vào giỏ'}</button>
                </div>
              </div>

              ${p.categoryId === PC_CATEGORY_ID ? `
                <div class="pc-promo-box">
                  <div class="pc-promo-header">QUÀ TẶNG &amp; ƯU ĐÃI</div>
                  <ul class="pc-promo-list">
                    <li>Tặng bàn phím cơ và lót chuột RGB</li>
                    <li>Lắp ráp, kiểm thử và cài đặt Windows miễn phí</li>
                    <li>Vệ sinh máy và tra keo tản nhiệt định kỳ</li>
                  </ul>
                </div>` : ''}
            </div>
          </div>

          <!-- Bảng cấu hình chi tiết & mô tả -->
          <div class="pc-tabs-section">
            ${specEntries.length > 0 ? `
              <h3 class="pc-section-heading">Bảng thông số chi tiết</h3>
              <table class="pc-specs-table">
                <tbody>
                  ${specEntries.map(([label, val]) => `
                    <tr>
                      <td class="spec-name">${escapeHtml(specLabel(label))}</td>
                      <td class="spec-value">${escapeHtml(specValue(val))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            <h3 class="pc-section-heading">Mô tả sản phẩm</h3>
            <div class="pc-description-content">${escapeHtml(p.description || '')}</div>
          </div>
        </div>
      </div>
    `);

    this._attachInteractiveHandlers();
  }

  /** Giữ nguyên signature bindAddToCart(handler): handler nhận số lượng */
  bindAddToCart(handler) {
    this.$('#btn-add')?.addEventListener('click', () => handler(this._readQty()));
  }

  _readQty() {
    const n = Math.floor(Number(this.$('#qty')?.value)) || 1;
    return Math.min(this.maxQty || 1, Math.max(1, n));
  }

  _attachInteractiveHandlers() {
    const qtyInput = this.$('#qty');

    this.$('#btn-qty-minus')?.addEventListener('click', () => { qtyInput.value = Math.max(1, this._readQty() - 1); });
    this.$('#btn-qty-plus')?.addEventListener('click', () => { qtyInput.value = Math.min(this.maxQty, this._readQty() + 1); });
    qtyInput?.addEventListener('change', () => { qtyInput.value = this._readQty(); });

    // Đổi ảnh chính khi bấm thumbnail
    const root = this.$('.pc-detail-container');
    const mainImg = this.$('#main-product-img');
    const thumbs = root ? [...root.querySelectorAll('.pc-thumb-item')] : [];
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-src');
        if (!src || !mainImg) return;
        mainImg.src = src;
        mainImg.style.display = '';
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