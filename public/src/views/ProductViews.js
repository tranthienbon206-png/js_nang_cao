import BaseView from './BaseView.js';
import { formatPrice, escapeHtml, debounce } from '../utils/helpers.js';

// Thứ tự ưu tiên khi chọn thông số hiển thị dạng chip (key trong db.json là chữ thường)
const SPEC_KEYS = [
  'cpu', 'gpu', 'chipset', 'ram', 'vram', 'storage', 'socket', 'capacity', 'type',
  'speed', 'wattage', 'efficiency', 'size', 'resolution', 'refreshRate', 'connection', 'lighting',
];

// Lấy tối đa 3 thông số dạng chữ/số, cắt gọn có dấu ...
const getSpecChips = (specs, max = 3) => {
  if (!specs) return [];
  return SPEC_KEYS
    .map(k => specs[k])
    .filter(v => typeof v === 'string' || typeof v === 'number')
    .slice(0, max)
    .map(v => {
      const s = String(v);
      return s.length > 28 ? s.slice(0, 27) + '…' : s;
    });
};

const PC_CATEGORY_ID = 1; // chỉ PC Gaming mới hiện quà tặng

export default class ProductViews extends BaseView {
  // Khung trang: Banner + Toolbar bộ lọc + Vùng danh sách sản phẩm
  renderLayout(categories) {
    this.setHTML(`
      <div class="pc-home-container">
        <div class="pc-hero-banner">
          <div class="pc-hero-text">
            <h1>HỆ THỐNG MÁY TÍNH &amp; GAMING PC CHÍNH HÃNG</h1>
            <p>Trải nghiệm dàn PC hiệu năng đỉnh cao, linh kiện chuẩn chính hãng, bảo hành tận nơi, giao nhanh 2 giờ.</p>
          </div>
          <div class="pc-hero-perks">
            <div class="pc-hero-perk-item">Bảo hành chính hãng</div>
            <div class="pc-hero-perk-item">Giao hỏa tốc 2H</div>
            <div class="pc-hero-perk-item">Quà tặng khi mua PC</div>
            <div class="pc-hero-perk-item">Trả góp 0% lãi suất</div>
          </div>
        </div>

        <div class="pc-header-row">
          <h2>Tất cả sản phẩm</h2>
          <span id="product-count" class="pc-product-count-tag"></span>
        </div>

        <div class="toolbar">
          <div class="pc-search-box">
            <input id="keyword" placeholder="Tìm theo tên máy, CPU (i5, Ryzen...), VGA (RTX 4060...)...">
          </div>

          <div class="pc-select-wrap">
            <select id="category">
              <option value="">Tất cả danh mục</option>
              ${categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>

          <div class="pc-select-wrap">
            <select id="sort">
              <option value="">Sắp xếp giá &amp; tên</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
            </select>
          </div>
        </div>

        <div id="product-list" class="grid"></div>
      </div>
    `);
  }

  renderProducts(products) {
    const list = this.$('#product-list');
    if (!list) return;

    const count = this.$('#product-count');
    if (count) count.textContent = `${products?.length || 0} sản phẩm`;

    if (!products || !products.length) {
      list.innerHTML = `
        <div class="pc-empty-box">
          <h3>Không có sản phẩm nào phù hợp</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc danh mục.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = products.map(p => {
      // Chỉ hiện giảm giá khi db có originalPrice thật
      const hasDiscount = Number(p.originalPrice) > Number(p.price);
      const discountPercent = hasDiscount
        ? Math.round((1 - p.price / p.originalPrice) * 100)
        : 0;

      const chips = getSpecChips(p.specs);
      const soldOut = Number(p.stock) <= 0;
      const stockText = soldOut ? 'Hết hàng' : `Còn ${p.stock} sản phẩm`;

      return `
        <div class="card">
          <div class="card-img-wrap">
            <a href="#/product/${p.id}">
              <img src="${escapeHtml(p.image || '')}" alt="${escapeHtml(p.name)}" loading="lazy"
                   onerror="this.style.display='none'">
            </a>
            ${discountPercent > 0 ? `<span class="card-badge-discount">GIẢM ${discountPercent}%</span>` : ''}
            ${p.warrantyMonths ? `<span class="card-badge-warranty">BH ${p.warrantyMonths}T</span>` : ''}
          </div>

          <div class="card-body">
            <div class="card-stock-status ${soldOut ? 'out' : ''}">${stockText}</div>

            <a class="card-title-link" href="#/product/${p.id}">
              <strong>${escapeHtml(p.name)}</strong>
            </a>

            ${chips.length ? `
              <div class="card-specs-tags">
                ${chips.map(c => `<span class="card-spec-tag">${escapeHtml(c)}</span>`).join('')}
              </div>` : ''}

            ${p.categoryId === PC_CATEGORY_ID
          ? '<div class="card-gift-pill">Tặng phím cơ + lót chuột RGB</div>'
          : ''}

            <div class="card-bottom-row">
              <div class="card-price-group">
                <span class="price">${formatPrice(p.price)}</span>
                ${hasDiscount ? `<span class="price-old">${formatPrice(p.originalPrice)}</span>` : ''}
              </div>

              <button class="btn" data-add="${p.id}" ${soldOut ? 'disabled' : ''}>
                ${soldOut ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Controller truyền handler vào, View chỉ gọi lại khi có sự kiện
  bindFilter(handler) {
    const emit = () => handler({
      keyword: this.$('#keyword')?.value.trim() || '',
      categoryId: this.$('#category')?.value || '',
      sort: this.$('#sort')?.value || '',
    });
    this.$('#keyword')?.addEventListener('input', debounce(emit));
    this.$('#category')?.addEventListener('change', emit);
    this.$('#sort')?.addEventListener('change', emit);
  }

  // Event delegation: 1 listener cho mọi nút "Thêm vào giỏ"
  bindAddToCart(handler) {
    this.$('#product-list')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (btn && !btn.disabled) handler(Number(btn.dataset.add));
    });
  }
}