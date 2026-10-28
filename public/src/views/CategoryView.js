import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

export default class CategoryView extends BaseView {
  render(category, products) {
    this.setHTML(`
      <!-- Phần tiêu đề danh mục và bộ lọc sắp xếp chuyên nghiệp -->
      <div class="admin-panel-toolbar mb-4 rounded-3 bg-white shadow-sm p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="admin-filter-select" style="min-width: 200px;">
          <select id="cat-sort" class="form-select shadow-sm">
            <option value="">Sắp xếp theo</option>
            <option value="asc">Giá: Thấp đến cao</option>
            <option value="desc">Giá: Cao đến thấp</option>
            <option value="name">Tên sản phẩm: A → Z</option>
          </select>
        </div>
      </div>

      <!-- Vùng hiển thị lưới sản phẩm -->
      <div id="cat-products" class="row g-4 mb-5"></div>
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span id="cat-count" class="text-muted small">${products.length} sản phẩm</span>
        </div>
        <select id="cat-sort" class="form-select w-auto shadow-sm">
          <option value="">Sắp xếp</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
          <option value="name">Tên A → Z</option>
        </select>
      </div>

      <div id="cat-products" class="row g-4"></div>
    `);

    this.renderProducts(products);
  }

  renderProducts(products) {
    const box = this.$('#cat-products');

    if (!products.length) {
      box.innerHTML = `
        <div class="col-12">
          <div class="admin-empty-state bg-white rounded-3 shadow-sm text-center py-5 px-3">
            <i class="bi bi-inbox display-4 d-block mb-3 text-muted opacity-50"></i>
            <h5 class="fw-bold text-dark mb-2">Chưa có sản phẩm nào</h5>
            <p class="text-muted mb-4 small">Hiện tại danh mục này chưa có sản phẩm nào được cập nhật. Bạn vui lòng quay lại sau nhé!</p>
          <div class="bg-white rounded-3 shadow-sm text-center py-5">
            <i class="bi bi-inbox display-4 d-block mb-2 text-muted"></i>
            <p class="text-muted mb-3">Chưa có sản phẩm nào trong danh mục này.</p>
            <a href="#/" class="btn btn-primary btn-sm">Về trang chủ</a>
          </div>
        </div>`;
      return;
    }

    box.innerHTML = products.map((p) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
          <a href="#/product/${p.id}" class="overflow-hidden d-block">
            <img src="${p.image}" alt="${escapeHtml(p.name)}"
                 class="card-img-top" loading="lazy">
          </a>
          <div class="card-body d-flex flex-column">
            <div class="mt-auto d-flex gap-2">
            </div>
            <div class="fw-bold text-danger fs-5 mb-3">${formatPrice(p.price)}</div>
            <a href="#/product/${p.id}" class="btn btn-primary btn-sm mt-auto">
              <i class="bi bi-eye me-1"></i>Xem chi tiết
            </a>
          </div>
        </div>
      </div>`).join('');
  }

  bindSort(handler) {
    this.$('#cat-sort').addEventListener('change', (e) => handler(e.target.value));
  }
}