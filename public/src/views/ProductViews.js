import BaseView from './BaseView.js';
import { formatPrice, escapeHtml, debounce } from '../utils/helpers.js';

export default class ProductViews extends BaseView {
  // Khung trang: Banner + Toolbar bộ lọc + Vùng danh sách sản phẩm
  renderLayout(categories) {
    this.setHTML(`
      <style>
        .pc-home-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 24px 16px 60px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          background-color: #f8fafc;
        }

        /* Banner chào mừng phong cách cửa hàng máy tính cao cấp */
        .pc-hero-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0284c7 100%);
          border-radius: 16px;
          padding: 28px 32px;
          color: #ffffff;
          margin-bottom: 28px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .pc-hero-text h1 {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }

        .pc-hero-text p {
          font-size: 14px;
          margin: 0;
          color: #dbeafe;
          max-width: 600px;
          line-height: 1.5;
        }

        .pc-hero-perks {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pc-hero-perk-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Tiêu đề & thanh công cụ Toolbar */
        .pc-header-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .pc-header-row h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pc-header-row h2::before {
          content: "";
          width: 5px;
          height: 22px;
          background: #2563eb;
          border-radius: 3px;
          display: inline-block;
        }

        .pc-product-count-tag {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        /* Thanh Toolbar bộ lọc hiện đại màu Trắng - Xanh */
        .toolbar {
          background: #ffffff;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }

        .pc-search-box {
          flex: 2;
          min-width: 240px;
          position: relative;
        }

        /* Giữ nguyên input id="keyword" */
        #keyword {
          width: 100%;
          height: 44px;
          padding: 0 16px;
          font-size: 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          background: #f8fafc;
          color: #0f172a;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        #keyword:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        /* Giữ nguyên select id="category" và id="sort" */
        .pc-select-wrap {
          flex: 1;
          min-width: 170px;
          position: relative;
        }

        #category, #sort {
          width: 100%;
          height: 44px;
          padding: 0 36px 0 14px;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          background-color: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        #category:focus, #sort:focus {
          border-color: #2563eb;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        /* Vùng danh sách sản phẩm Grid */
        #product-list.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }

        @media (min-width: 1100px) {
          #product-list.grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Thẻ sản phẩm Card */
        .card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.04);
          position: relative;
        }

        .card:hover {
          transform: translateY(-5px);
          border-color: #93c5fd;
          box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04);
        }

        /* Khung ảnh sản phẩm */
        .card-img-wrap {
          position: relative;
          background: #f1f5f9;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .card:hover .card-img-wrap img {
          transform: scale(1.06);
        }

        .card-badge-discount {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 5px;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
          z-index: 2;
        }

        .card-badge-warranty {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: 5px;
          z-index: 2;
        }

        /* Phần thân card-body */
        .card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }

        .card-stock-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #16a34a;
        }

        .card-title-link {
          text-decoration: none;
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
          transition: color 0.15s;
        }

        .card-title-link:hover {
          color: #2563eb;
        }

        /* Huy hiệu tóm tắt linh kiện (CPU, VGA) */
        .card-specs-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .card-spec-tag {
          font-size: 11px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #dbeafe;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Quà tặng vắn tắt */
        .card-gift-pill {
          font-size: 11px;
          color: #d97706;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Giá tiền & nút mua */
        .card-bottom-row {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-price-group {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .price {
          font-size: 18px;
          font-weight: 900;
          color: #1d4ed8;
          letter-spacing: -0.3px;
        }

        .price-old {
          font-size: 13px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        /* Nút Thêm vào giỏ giữ nguyên class="btn" và data-add */
        .btn {
          width: 100%;
          height: 40px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
          transition: all 0.2s ease;
        }

        .btn:hover {
          background: #1d4ed8;
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .btn:active {
          transform: translateY(0);
        }

        /* Trạng thái trống Empty state */
        .pc-empty-box {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px dashed #cbd5e1;
          color: #64748b;
        }

        .pc-empty-box h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px;
        }
      </style>

      <div class="pc-home-container">
        <!-- Banner chào mừng phong cách cửa hàng máy tính -->
        <div class="pc-hero-banner">
          <div class="pc-hero-text">
            <h1>HỆ THỐNG MÁY TÍNH &amp; GAMING PC CHÍNH HÃNG</h1>
            <p>Trải nghiệm dàn PC hiệu năng đỉnh cao, linh kiện chuẩn chính hãng, bảo hành tận nơi 36 tháng, giao nhanh 2 giờ miễn phí toàn quốc.</p>
          </div>
          <div class="pc-hero-perks">
            <div class="pc-hero-perk-item">Bảo hành 36 tháng</div>
            <div class="pc-hero-perk-item">Giao hỏa tốc 2H</div>
            <div class="pc-hero-perk-item">Quà tặng 2.500.000₫</div>
            <div class="pc-hero-perk-item">Trả góp 0% lãi suất</div>
          </div>
        </div>

        <!-- Tiêu đề và tổng quan -->
        <div class="pc-header-row">
          <h2>Sản phẩm cấu hình máy tính</h2>
          <span class="pc-product-count-tag">Tông màu Trắng &amp; Xanh Dương chuẩn công nghệ</span>
        </div>

        <!-- Thanh công cụ Toolbar: giữ nguyên các ID keyword, category, sort -->
        <div class="toolbar">
          <div class="pc-search-box">
            <input id="keyword" placeholder="Tìm theo tên máy, CPU (i9, Ryzen...), VGA (RTX 4090, 4070...)...">
          </div>

          <div class="pc-select-wrap">
            <select id="category">
              <option value="">Tất cả danh mục PC</option>
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

        <!-- Vùng danh sách sản phẩm grid -->
        <div id="product-list" class="grid"></div>
      </div>
    `);
  }

  // Render danh sách sản phẩm: giữ nguyên class="card", href="#/product/:id", class="price", button[data-add]
  renderProducts(products) {
    const list = this.$('#product-list');
    if (!list) return;

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
      const originalPrice = p.originalPrice || (p.price ? Math.round(p.price * 1.12) : null);
      const discountPercent = originalPrice && originalPrice > p.price
        ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
        : 0;

      // Trích xuất vắn tắt 2 thông số tiêu biểu (CPU, VGA) để hiển thị chip tag
      const cpuMatch = p.description ? p.description.match(/CPU[:\s]*([^\r\n•]+)/i) : null;
      const vgaMatch = p.description ? p.description.match(/VGA[:\s]*([^\r\n•]+)/i) : null;

      const cpuText = p.specs?.['CPU (Vi xử lý)'] || p.specs?.['CPU'] || (cpuMatch ? cpuMatch[1].trim() : null);
      const vgaText = p.specs?.['VGA (Card đồ họa)'] || p.specs?.['VGA'] || (vgaMatch ? vgaMatch[1].trim() : null);

      return `
        <div class="card">
          <div class="card-img-wrap">
            <a href="#/product/${p.id}">
              <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
            </a>
            ${discountPercent > 0 ? `<span class="card-badge-discount">GIẢM ${discountPercent}%</span>` : ''}
            <span class="card-badge-warranty">BH 36T</span>
          </div>

          <div class="card-body">
            <div class="card-stock-status">Sẵn hàng giao 2H</div>

            <a class="card-title-link" href="#/product/${p.id}">
              <strong>${escapeHtml(p.name)}</strong>
            </a>

            <!-- Chip tóm tắt cấu hình CPU, VGA nếu có -->
            ${(cpuText || vgaText) ? `
              <div class="card-specs-tags">
                ${cpuText ? `<span class="card-spec-tag">${escapeHtml(cpuText.slice(0, 24))}</span>` : ''}
                ${vgaText ? `<span class="card-spec-tag">${escapeHtml(vgaText.slice(0, 24))}</span>` : ''}
              </div>
            ` : ''}

            <div class="card-gift-pill">Tặng phím cơ + lót chuột RGB</div>

            <div class="card-bottom-row">
              <div class="card-price-group">
                <span class="price">${formatPrice(p.price)}</span>
                ${originalPrice && originalPrice > p.price ? `
                  <span class="price-old">${formatPrice(originalPrice)}</span>
                ` : ''}
              </div>

              <!-- Giữ nguyên button class="btn" và data-add="${p.id}" -->
              <button class="btn" data-add="${p.id}">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Controller truyền handler vào, View chỉ gọi lại khi có sự kiện (Giữ nguyên 100%)
  bindFilter(handler) {
    const emit = () => handler({
      keyword: this.$('#keyword')?.value.trim() || '',
      categoryId: this.$('#category')?.value || '',
      sort: this.$('#sort')?.value || '',
    });
    const keywordInput = this.$('#keyword');
    if (keywordInput) keywordInput.addEventListener('input', debounce(emit));
    const catSelect = this.$('#category');
    if (catSelect) catSelect.addEventListener('change', emit);
    const sortSelect = this.$('#sort');
    if (sortSelect) sortSelect.addEventListener('change', emit);
  }

  // Event delegation: 1 listener cho mọi nút "Thêm vào giỏ" (Giữ nguyên 100%)
  bindAddToCart(handler) {
    const productList = this.$('#product-list');
    if (productList) {
      productList.addEventListener('click', e => {
        // Hỗ trợ cả trường hợp click trúng thẻ con/icon bên trong nút
        const btn = e.target.closest('[data-add]');
        if (btn) {
          const id = btn.dataset.add;
          if (id) handler(Number(id));
        }
      });
    }
  }
}