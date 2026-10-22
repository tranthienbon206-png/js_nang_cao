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
            <a href="#/" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
              <i class="bi bi-house-door me-2"></i>Về trang chủ
            </a>
          </div>
        </div>`;
      return;
    }

    box.innerHTML = products.map((p) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
          <a href="#/product/${p.id}" class="overflow-hidden d-block position-relative">
            <img src="${p.image}" alt="${escapeHtml(p.name)}" class="card-img-top" loading="lazy">
            <span class="position-absolute top-0 start-0 m-2 badge bg-primary bg-opacity-75">Danh mục</span>
          </a>
          <div class="card-body d-flex flex-column">
            <h2 class="h6 card-title product-title mb-2">
              <a href="#/product/${p.id}" class="text-dark text-decoration-none">${escapeHtml(p.name)}</a>
            </h2>
            <div class="price mb-3">${formatPrice(p.price)}</div>
            <div class="mt-auto d-flex gap-2">
              <a href="#/product/${p.id}" class="btn btn-outline-primary btn-sm w-100">
                <i class="bi bi-eye me-1"></i>Chi tiết
              </a>
            </div>
          </div>
        </div>
      </div>`).join('');
  }

  bindSort(handler) {
    this.$('#cat-sort').addEventListener('change', (e) => handler(e.target.value));
  }
}